import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import SubmissionPanel from "./SubmissionPanel";
import { NetWork } from "../../Http/NetWork";
import { UIHelp } from "../../Utils/UIHelp";
import { ConstValue } from "../../Data/ConstValue";
import { GameData } from "../../Data/GameData";
import { DataGrid } from "../../Data/DataGrid";
import { Tools } from "../../UIComm/Tools";
import GamePanel from "./GamePanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TeacherPanel extends BaseUI {
    protected static className = "TeacherPanel";

    @property(cc.Node)
    private graphicsNode:cc.Node = null

    @property(cc.ToggleContainer)
    private gridTypeTc:cc.ToggleContainer = null

    @property(cc.EditBox)
    private graphCountEb:cc.EditBox = null

    @property(cc.EditBox)
    private gridCountEb:cc.EditBox = null

    @property(cc.ToggleContainer)
    private ruleTc:cc.ToggleContainer = null

    @property(cc.Node)
    private gridInput:cc.Node = null

    @property(cc.Node)
    private lableRoot:cc.Node = null

    @property(cc.Node)
    private deleteBtnNd:cc.Node = null

    private graphics:cc.Graphics = null

    /**当前正在进行文字编辑的格子 */
    private editingData:DataGrid = null

    /**网格类型改变监听开关 */
    private gridTypeListenChange:boolean = true

    /**临时变量，用来存储频繁创建的变量 */
    private tempVarible = {
        /**正方形 */
        rect: {
            /**中心坐标，相对于画布中心点 */
            center: cc.v2(),
            /**左下角坐标 */
            leftBottom: cc.v2(),
            /**绘制区域左上角相对于中心点的坐标 */
            topLeftPos: cc.v2(),
        },
        /**三角形 */
        triangle: {
            /**绘制区域左上角相对于中心点的坐标 */
            topLeftPos: cc.v2(),
            /**中心坐标，相对于画布中心点 */
            center: cc.v2(),
        },
        /**悬停格子时的颜色 */
        gridHoverColor: cc.color().fromHEX('#EE4419'),
        /**未悬停格子的颜色 */
        gridNormalColor: cc.Color.WHITE,
        /**选中格子线条颜色 */
        lineSelectColor: cc.Color.BLACK,
        /**未选中格子线条颜色 */
        lineNormalColor: cc.color().fromHEX('#DDDDDD'),
        
        /**未选中的格子 */
        normalGridList: [],
        /**已选中的格子 */
        selectGridList: [],

        /**拖拽矩形范围 */
        dragRect: {
            startPosition: null,
            currentPosition: null
        }
    }

    start() {
        /**
         * 2.1.2版本 Graphics 的bug，按照论坛做动态添加组件的处理
         *  https://forum.cocos.com/t/cocos-creator-2-1-2-graphics/82130/20
         */
        this.graphics = this.graphicsNode.addComponent(cc.Graphics)


        if(ConstValue.IS_EDITIONS){
            this.getNet();
        }else{
            this.init()
        }
    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_TITLE + "?title_id=" + NetWork.title_id, "GET", "application/json;charset=utf-8", function (err, response) {
            console.log("消息返回" + response);
            if (!err) {
                let res = response;
                if (Array.isArray(res.data)) {
                    this.init();
                    return;
                }
                let content = JSON.parse(res.data.courseware_content);
                NetWork.courseware_id = res.data.courseware_id;
                if (NetWork.empty) {//如果URL里面带了empty参数 并且为true  就立刻清除数据
                    this.ClearNet();
                } else {
                    if (content != null) {
                        if (content.CoursewareKey == ConstValue.CoursewareKey) {
                            GameData.getInstance().revertDataByCourseware_content(content)
                            console.log('数据还原成功');
                            this.init();
                        } else {
                            console.warn('拉错数据了');
                            this.init()
                        }
                    }
                }
            }
        }.bind(this), null);
    }


    //删除课件数据  一般为脏数据清理
    ClearNet() {
        let jsonData = { courseware_id: NetWork.courseware_id };
        NetWork.getInstance().httpRequest(NetWork.CLEAR, "POST", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                UIHelp.showTip("答案删除成功");
            }
        }.bind(this), JSON.stringify(jsonData));
    }

    init(){
        this.graphicsNode.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this)
        this.graphicsNode.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this)

        this.graphicsNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.graphicsNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.graphicsNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)

        this.graphicsNode.on(cc.Node.EventType.SIZE_CHANGED, this.onGraphicsNodeSizeChange, this)

        this.initQuestionInfo()
        this.initGrids()
    }

    private onGraphicsNodeSizeChange(){
        this.graphicsNode.parent.setContentSize(this.graphicsNode.getContentSize().width + 2, this.graphicsNode.getContentSize().height + 2)
        //this.graphicsNode.parent.getComponent(cc.Mask).enabled = false
    }

    private initQuestionInfo(){
        if(GameData.getInstance().gridType == 1){
            this.gridTypeTc.node.getChildByName('toggle1').getComponent(cc.Toggle)
            .isChecked = true
        }else if(GameData.getInstance().gridType == 2){
            this.gridTypeTc.node.getChildByName('toggle2').getComponent(cc.Toggle)
            .isChecked = true
        }

        if(GameData.getInstance().graphCount > 0){
            this.graphCountEb.string = GameData.getInstance().graphCount.toString()
        }

        if(GameData.getInstance().gridCount > 0){
            this.gridCountEb.string = GameData.getInstance().gridCount.toString()
        }

        if(GameData.getInstance().ruleType == 1){
            this.ruleTc.node.getChildByName('toggle1')
            .getComponent(cc.Toggle).isChecked = true
        }else if(GameData.getInstance().ruleType == 2){
            this.ruleTc.node.getChildByName('toggle2')
            .getComponent(cc.Toggle).isChecked = true
        }else if(GameData.getInstance().ruleType == 3){
            this.ruleTc.node.getChildByName('toggle3')
            .getComponent(cc.Toggle).isChecked = true
        }
    }

    private onGridTypeChanged(evt){
        if(!this.gridTypeListenChange) return

        let select:boolean = false
        for(let i = 0; i < GameData.getInstance().dataList.length; i++){
            if(GameData.getInstance().dataList[i].isSelect){
                select = true
                break
            }
        }

        let selectName = evt.node.name
        
        let self = this
        //改变生效
        function changeGridType() {
            if(selectName == 'toggle1'){
                GameData.getInstance().gridType = 1
            }else{
                GameData.getInstance().gridType = 2
            }
            GameData.getInstance().dataList.splice(0, GameData.getInstance().dataList.length)
            self.initGrids()
        }

        function revertToggle() {
            let children = self.gridTypeTc.node.children
            for(let i = 0; i < children.length; i++){
                let tg = children[i].getComponent(cc.Toggle)
                if(!tg.isChecked){
                    tg.isChecked = true
                    return
                }
            }
        }

        if(select){
            this.gridTypeListenChange = false
            revertToggle()

            UIHelp.AffirmTip(1, '当前网格上有图形，\n您确认改变网格类型吗？', (state)=>{
                if(state == 1){
                    revertToggle()
                    changeGridType()
                    self.gridTypeListenChange = true
                }else{
                    self.gridTypeListenChange = true
                }
            })
        }else{
            changeGridType()
        }
    }

    private onGraphCountEditEnd(evt){
        if(!/^[1-9][0-9]*$/.test(evt.string)){
            UIHelp.showTip('请输入正整数')
            return
        }
        
        let num = parseInt(evt.string)
        GameData.getInstance().graphCount = num
    }

    private onGridCountEditEnd(evt){
        if(!/^[1-9][0-9]*$/.test(evt.string)){
            UIHelp.showTip('请输入正整数')
            return
        }

        let num = parseInt(evt.string)
        GameData.getInstance().gridCount = num
    }

    private onRuleChanged(evt){
        if(evt.node.name == 'toggle1'){
            GameData.getInstance().ruleType = 1
        }else if(evt.node.name == 'toggle2'){
            GameData.getInstance().ruleType = 2
        }else if(evt.node.name == 'toggle3'){
            GameData.getInstance().ruleType = 3
        }
    }

    private initGrids(){
        console.log('initGrids');
        if(GameData.getInstance().gridType == 1){
            this.initRectGrids()
        }else if(GameData.getInstance().gridType == 2){
            this.initTriangleGrids()
        }

        this.drawAllGrids()
        this.refreshGridLabels()
    }

    private initRectGrids(){
        if(GameData.getInstance().dataList.length == 0){
            for(let row = 1; row <= GameData.getInstance().ConfigRect.MaxRow; row++){
                for(let col = 1; col <= GameData.getInstance().ConfigRect.MaxCol; col++){
                   let data = new DataGrid()
                   data.gridType = 1
                   data.index = GameData.getInstance().dataList.length
                   data.isSelect = false
                   GameData.getInstance().dataList.push(data)
                   //data.content = data.index.toString()
                }
            }
        }

        let side = GameData.getInstance().ConfigRect.Side
        let totalWidth = GameData.getInstance().ConfigRect.MaxCol * side
        let totalHeight = GameData.getInstance().ConfigRect.MaxRow * side

        this.graphicsNode.setContentSize(totalWidth, totalHeight)

        this.tempVarible.rect.topLeftPos.x = -totalWidth * 0.5
        this.tempVarible.rect.topLeftPos.y = totalHeight * 0.5
    }

    private initTriangleGrids(){
        if(GameData.getInstance().dataList.length == 0){
            for(let row = 1; row <= GameData.getInstance().ConfigTriangle.MaxRow; row++){
                for(let col = 1; col <= GameData.getInstance().ConfigTriangle.MaxCol * 2; col++){
                   let data = new DataGrid()
                   data.gridType = 2
                   data.index = GameData.getInstance().dataList.length
                   data.isSelect = false
                   GameData.getInstance().dataList.push(data)
                   //data.content = data.index.toString()
                }
            }
        }

        let side = GameData.getInstance().ConfigTriangle.Side
        let totalWidth = GameData.getInstance().ConfigTriangle.MaxCol * side
        let radian = cc.misc.degreesToRadians(60)
        let totalHeight = GameData.getInstance().ConfigTriangle.MaxRow * side * Math.sin(radian)

        this.graphicsNode.setContentSize(totalWidth - side, totalHeight)

        this.tempVarible.triangle.topLeftPos.x = -totalWidth * 0.5
        this.tempVarible.triangle.topLeftPos.y = totalHeight * 0.5
    }

    private drawAllGrids(){
        this.graphics.clear()

        if(GameData.getInstance().gridType == 1){
            this.refreshRectGrids()
        }else if(GameData.getInstance().gridType == 2){
            this.refreshTriangleGrids()
        }
    }

    /**格子排序
     * 未选中的放入 tempVarible.normalGridList 中
     * 已选中的放入 tempVarible.selectGridList 中
     */
    private sortGridList(){
        //清空
        this.tempVarible.normalGridList.splice(0, this.tempVarible.normalGridList.length)
        this.tempVarible.selectGridList.splice(0, this.tempVarible.selectGridList.length)

        for(let i = 0; i < GameData.getInstance().dataList.length; i++){
            let data = GameData.getInstance().dataList[i]
            if(data.isSelect){
                this.tempVarible.selectGridList.push(data)
            }else{
                this.tempVarible.normalGridList.push(data)
            }
        }
    }

    private refreshRectGrids(){
        if(GameData.getInstance().dataList.length == 0){
            return
        }
        
        this.sortGridList()

        //先绘制未选中的格子
        for(let i = 0; i < this.tempVarible.normalGridList.length; i++){
            let data = this.tempVarible.normalGridList[i]
            this.drawOneRect(data)
        }
        
        //再绘制选中的格子
        for(let i = 0; i < this.tempVarible.selectGridList.length; i++){
            let data = this.tempVarible.selectGridList[i]
            this.drawOneRect(data)
        }
    }

    private drawOneRect(data:DataGrid){
        if(data.localRect == null){
            //从未计算过方格范围时
            let row = data.getRow()
            let col = data.getCol()
            
            let side = GameData.getInstance().ConfigRect.Side
            this.tempVarible.rect.center.x = col * side - side * 0.5
            this.tempVarible.rect.center.y = -(row * side - side * 0.5)

            this.tempVarible.rect.center.add(this.tempVarible.rect.topLeftPos, this.tempVarible.rect.center)
            let center = this.tempVarible.rect.center

            this.tempVarible.rect.leftBottom.x = center.x - side * 0.5
            this.tempVarible.rect.leftBottom.y = center.y - side * 0.5

            data.localRect = cc.rect(this.tempVarible.rect.leftBottom.x, this.tempVarible.rect.leftBottom.y, side, side)
        }

        //绘制一个格子
        let lineWidth = 2
        this.graphics.fillColor = data.isHover ? this.tempVarible.gridHoverColor : this.tempVarible.gridNormalColor
        this.graphics.lineWidth = lineWidth
        this.graphics.strokeColor = data.isSelect ? this.tempVarible.lineSelectColor : this.tempVarible.lineNormalColor

        this.graphics.fillRect(data.localRect.x, data.localRect.y, data.localRect.width, data.localRect.height)
        this.graphics.stroke()
    }

    private refreshTriangleGrids(){
        if(GameData.getInstance().dataList.length == 0){
            return
        }
        
        this.sortGridList()

        //先绘制未选中的格子
        for(let i = 0; i < this.tempVarible.normalGridList.length; i++){
            let data = this.tempVarible.normalGridList[i]
            this.drawOneTriangle(data)
        }
        
        //再绘制选中的格子
        for(let i = 0; i < this.tempVarible.selectGridList.length; i++){
            let data = this.tempVarible.selectGridList[i]
            this.drawOneTriangle(data)
        }
    }

    private drawOneTriangle(data:DataGrid){
        if(data.localVertexs == null){
            //从未计算过三角形范围时
            let row = data.getRow()
            let col = data.getCol()

            let side = GameData.getInstance().ConfigTriangle.Side
            let h = side * Math.sin(cc.misc.degreesToRadians(60))
            this.tempVarible.triangle.center.x = col * side * 0.5
            //行错位
            if(row % 2 == 0){
                this.tempVarible.triangle.center.x += (side * 0.5)
            }
            //中心到底边的距离
            let a = side * 0.5 * Math.tan(cc.misc.degreesToRadians(30))
            //顶点到中心的距离
            let b = h - a
            let tmpY
            if(data.isDirectionT()){
                tmpY = (row - 1) * h + a
            }else{
                tmpY = (row - 1) * h + b
            }
            this.tempVarible.triangle.center.y = -tmpY

            let center = this.tempVarible.triangle.center
            center.add(this.tempVarible.triangle.topLeftPos, center)

            data.localVertexs = []
            if(data.isDirectionT()){
                let p1 = cc.v2(center.x - side * 0.5, center.y + a)
                let p2 = cc.v2(center.x + side * 0.5, center.y + a)
                let p3 = cc.v2(center.x, center.y - b)
                data.localVertexs.push(p1)
                data.localVertexs.push(p2)
                data.localVertexs.push(p3)
            }else{
                let p1 = cc.v2(center.x - side * 0.5, center.y - a)
                let p2 = cc.v2(center.x, center.y + b)
                let p3 = cc.v2(center.x + side * 0.5, center.y - a)
                data.localVertexs.push(p1)
                data.localVertexs.push(p2)
                data.localVertexs.push(p3)
            }
        }

        //绘制一个三角形
        let lineWidth = 2
        this.graphics.fillColor = data.isHover ? this.tempVarible.gridHoverColor : this.tempVarible.gridNormalColor
        this.graphics.lineWidth = lineWidth
        this.graphics.strokeColor = data.isSelect ? this.tempVarible.lineSelectColor : this.tempVarible.lineNormalColor

        this.graphics.moveTo(data.localVertexs[0].x, data.localVertexs[0].y)
        this.graphics.lineTo(data.localVertexs[1].x, data.localVertexs[1].y)
        this.graphics.lineTo(data.localVertexs[2].x, data.localVertexs[2].y)
        this.graphics.close()
        this.graphics.fill()
        this.graphics.stroke()
    }

    onMouseMove(evt){
        let location = evt.getLocation()
        let localPos = this.graphicsNode.convertToNodeSpaceAR(location)
        
        if(GameData.getInstance().gridType == 1){
            for(let i = 0; i < GameData.getInstance().dataList.length; i++){
                let data = GameData.getInstance().dataList[i]
                if(data.localRect){
                    if(data.localRect.contains(localPos)){
                        data.isHover = true
                    }else{
                        data.isHover = false
                    }
                }
            }
        }else{
            for(let i = 0; i < GameData.getInstance().dataList.length; i++){
                let data = GameData.getInstance().dataList[i]
                if(data.localVertexs){
                    if(cc.Intersection.pointInPolygon(localPos, data.localVertexs)){
                        data.isHover = true
                    }else{
                        data.isHover = false
                    }
                }
            }
        }

        this.drawAllGrids()
        this.drawDragRect()
    }

    onMouseLeave(){
        for(let i = 0; i < GameData.getInstance().dataList.length; i++){
            let data = GameData.getInstance().dataList[i]
            if(data.isHover){
                data.isHover = false
            }
        }
        this.drawAllGrids()
        this.drawDragRect()
        this.showCursor(false)
    }

    onTouchStart(evt){
        let location = evt.getLocation()
        let localPos = this.graphicsNode.convertToNodeSpaceAR(location)

        this.tempVarible.dragRect.startPosition = localPos

        this.showDeleteBtn(false)
    }

    onTouchMove(evt){
        let location = evt.getLocation()
        let localPos = this.graphicsNode.convertToNodeSpaceAR(location)

        this.tempVarible.dragRect.currentPosition = localPos
    }

    private drawDragRect(){
        if(this.tempVarible.dragRect.startPosition == null || this.tempVarible.dragRect.currentPosition == null){
            return
        }

        let leftTop = this.tempVarible.dragRect.startPosition
        let rightBottom = this.tempVarible.dragRect.currentPosition
        this.graphics.strokeColor = this.tempVarible.gridHoverColor
        this.graphics.rect(leftTop.x, rightBottom.y, rightBottom.x - leftTop.x, leftTop.y - rightBottom.y)
        this.graphics.stroke()
    }

    private showDeleteBtn(show:boolean, pos?:cc.Vec2){
        this.deleteBtnNd.active = show
        if(show && pos){
            this.deleteBtnNd.setPosition(pos)
        }
    }

    private onClickDelete(){
        this.showDeleteBtn(false)

        let leftTop = this.tempVarible.dragRect.startPosition
        let rightBottom = this.tempVarible.dragRect.currentPosition
        let dragRect = cc.rect(leftTop.x, rightBottom.y, rightBottom.x - leftTop.x, leftTop.y - rightBottom.y)

        let tmpRect = cc.rect()

        for(let i = 0; i < GameData.getInstance().dataList.length; i++){
            let data = GameData.getInstance().dataList[i]
            if(data.isSelect){
                if(data.gridType == 1){
                    if(dragRect.containsRect(data.localRect)){
                        data.isSelect = false
                    }
                }else if(data.gridType == 2){
                    data.convertTriangleToRect(tmpRect)
                    if(dragRect.containsRect(tmpRect)){
                        data.isSelect = false
                    }
                }
            }
        }

        this.drawAllGrids()

        this.tempVarible.dragRect.currentPosition = null
        this.drawDragRect()

        this.refreshGridLabels()
    }

    onTouchEnd(evt){
        let location = evt.getLocation()
        let localPos:cc.Vec2 = this.graphicsNode.convertToNodeSpaceAR(location)

        let touchStartPos:cc.Vec2 = this.tempVarible.dragRect.startPosition
        if(touchStartPos != null && !touchStartPos.fuzzyEquals(localPos, 0.1)){
            //发生拖拽操作时
            this.showDeleteBtn(true, this.tempVarible.dragRect.currentPosition)
            return
        }
        this.tempVarible.dragRect.currentPosition = null

        this.showCursor(false)
        this.editingData = null

        if(GameData.getInstance().gridType == 1){
            //正方形
            for(let i = 0; i < GameData.getInstance().dataList.length; i++){
                let data = GameData.getInstance().dataList[i]
                if(data.localRect){
                    if(data.localRect.contains(localPos)){
                        data.isSelect = !data.isSelect
                        //输入框
                        let nowTime = Tools.getNowTimeMS()
                        if(data.isSelect){
                            if(nowTime - data.lastClickTime <= 300){
                                //双击
                                this.showCursor(true, data.getCenterPosition())
                                this.editingData = data
                            }
                        }

                        data.lastClickTime = nowTime
                        break
                    }
                }
            }
        }else{
            //三角形
            for(let i = 0; i < GameData.getInstance().dataList.length; i++){
                let data = GameData.getInstance().dataList[i]
                if(data.localVertexs){
                    if(cc.Intersection.pointInPolygon(localPos, data.localVertexs)){
                        data.isSelect = !data.isSelect
                        //输入框
                        let nowTime = Tools.getNowTimeMS()
                        if(data.isSelect){
                            if(nowTime - data.lastClickTime <= 300){
                                //双击
                                this.showCursor(true, data.getCenterPosition())
                                this.editingData = data
                            }
                        }

                        data.lastClickTime = nowTime
                        break
                    }
                }
            }
        }

        this.drawAllGrids()
        this.refreshGridLabels()
    }

    /**
     * 显示输入光标
     * @param show 
     * @param pos 
     */
    private showCursor(show:boolean, pos?:cc.Vec2){
        this.gridInput.active = show
        if(show && pos){
            this.gridInput.setPosition(pos)
            this.gridInput.getComponent(cc.EditBox).string = ''
            this.gridInput.getComponent(cc.EditBox).focus()
        }
    }

    private onGridInputEnd(evt){
        //console.log(evt);
        if(this.editingData == null){
            return
        }

        this.editingData.content = evt.string
        this.refreshGridLabels()
    }

    private refreshGridLabels(){
        this.lableRoot.destroyAllChildren()
        for(let i = 0; i < GameData.getInstance().dataList.length; i++){
            let data = GameData.getInstance().dataList[i]
            
            if(data.content.length > 0){
                let node = new cc.Node('label')
                node.parent = this.lableRoot
                node.setPosition(data.getCenterPosition())
                node.color = cc.Color.BLACK
                let lb = node.addComponent(cc.Label)
                lb.useSystemFont = true
                lb.fontSize = 30
                lb.string = data.content
            }
        }
    }

    //上传课件按钮
    onBtnSaveClicked() {
        console.log(GameData.getInstance())

        if(GameData.getInstance().graphCount == 0){
            UIHelp.showTip('请输入拆分图形数')
            return
        }

        if(GameData.getInstance().gridCount == 0){
            UIHelp.showTip('请输入图形所含块数')
            return
        }

        if(!GameData.getInstance().isGraphValid()){
            UIHelp.showTip('您输入的图形与数据信息不符')
            return
        }

        UIManager.getInstance().showUI(GamePanel)
    }

}
