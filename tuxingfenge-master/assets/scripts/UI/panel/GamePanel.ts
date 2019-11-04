import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import { ConstValue } from "../../Data/ConstValue";
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "./UploadAndReturnPanel";
import { ListenerManager } from "../../Manager/ListenerManager";
import { ListenerType } from "../../Data/ListenerType";
import ErrorPanel from "./ErrorPanel";
import { GameData } from "../../Data/GameData";
import { Tools } from "../../UIComm/Tools";
import { AudioManager } from "../../Manager/AudioManager";
import { OverTips, DefalutTitle } from "../Item/OverTips";
import SubmissionPanel from "./SubmissionPanel";
import { FillColor, HexToColorString } from "../../Data/CustomTypes";
import { DataGrid } from "../../Data/DataGrid";
import { Utils } from "../../Utils/utils";

const { ccclass, property } = cc._decorator;

/**
 * 为便于对图案进行变换动画，
 * 每个图案均绘制在单独的动态创建的graphics接点上
 */
@ccclass
export default class GamePanel extends BaseUI {
    protected static className = "GamePanel";

    /**左侧图案的父节点 */
    @property(cc.Node)
    private leftGraphicsParent:cc.Node = null

    /**右侧图案的父节点 */
    @property(cc.Node)
    private rightGraphicsParent:cc.Node = null

    /**当前右侧正在绘制图案的绘图组件 */
    private rightGraphic:cc.Graphics = null
    /**当前右侧正在绘制图案的节点 */
    private rightGraphicNode:cc.Node = null

    @property(cc.Node)
    private leftNode:cc.Node = null

    @property(cc.Node)
    private rightNode:cc.Node = null

    @property(cc.Node)
    private bottomNode:cc.Node = null

    @property(cc.Node)
    private lightMaskNode:cc.Node = null

    @property(cc.Node)
    private penNode:cc.Node = null

    /**笔图片，与按钮颜色顺序对应 */
    @property([cc.SpriteFrame])
    private penPics:cc.SpriteFrame[] = []

    /**通用数据上报关卡数据 */
    private reportLevels: any[] = []

    /**左侧绘制数据 */
    private leftStrokeData = {
        /**历史答案，Array<graph>, graph为 DataGrid.toGraphUnit() 元素组成的数组 */
        answers: []
    }

    /**右侧答题区绘制数据 */
    private rightStrokeData = {
        /**当前题目，Array<DataGrid>, 初始值为 GameData.dataList 的副本 */
        question: []
    }

    /**当前选择的笔的颜色索引 0~5，与按钮颜色对应 */
    private mColorIndex: number = 0

    /**是否需要显示笔，pc上显示 */
    private needShowPen:boolean = true

    /**绘制边缘的颜色 */
    private strokeColor:cc.Color = null

    private mSelectColor:cc.Color = new cc.Color()

    /**右侧绘图区域左上角局部坐标 */
    private rightGraphicTopLeft:cc.Vec2 = null

    /**左侧绘图区域左上角局部坐标 */
    private leftGraphicTopLeft:cc.Vec2 = null

    /**格子边长,根据图案大小和范围限制计算得到 */
    private rightGridSide:number

    /**格子间隙 */
    private rightGridGap:number

    /**右侧图案的整体偏移，需要在题版上居中 */
    private rightOffset:cc.Vec2 = new cc.Vec2()

    /**右侧题版范围大小 */
    private rightRangeSize:cc.Size = null

    /**当前右侧图案旧版数据结构，为了使用旧版算法 */
    private graph:Array<any> = null

    /**存档数据，旧版格式*/
    private netData = null

    private bgListenerNode:cc.Node = null

    private symmetricDegrees = [];

    /**左侧列表当前子节点总长度 */
    private leftListTotalLength:number = 0

    /**右侧题目图案区域的范围大小，不会发生变化 */
    private rightQuestionGraphRange:cc.Size = new cc.Size(0)

    /**update回调队列 */
    private updateQueue:Array<Function> = []
    /**update回调队列元素的参数 */
    private updateQueueParams:Array<any> = []

    onLoad(){
        this.leftNode.setPosition(1213, 74.405)
        this.rightNode.setPosition(1611, 74.405)
        this.bottomNode.setPosition(-5.723, -583.6)
        
        let bottomBtnRoot = this.bottomNode.getChildByName('btns')
        bottomBtnRoot.getChildByName('resetBtn').setScale(0)
        bottomBtnRoot.getChildByName('submitBtn').setScale(0)
        let colorBtns = bottomBtnRoot.getChildByName('colorBtns').children
        colorBtns.forEach((node, i, arr)=>{
            node.setScale(0)
        })

        this.needShowPen = !cc.sys.isMobile

        this.strokeColor = cc.color().fromHEX('#a2a2a2')

    }

    start() {
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, { state: 1 });

        if (ConstValue.IS_TEACHER) {
            UIManager.getInstance().openUI(UploadAndReturnPanel, null, 2000);
            this.netData = GameData.getInstance().createCourseware_content()
            this.init()
        } else {
            this.getNet()
        }

        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, (err, res)=>{
            if(!err){
                console.log('OverTips预加载完成');
            }
        })
    }

    onEndGame() {
        this.dataReport()
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        let ev: number
        if (GameData.getInstance().isStartAnswered == 0) {
            ev = 0
        } else {
            if (GameData.getInstance().isPassAllLevel) {
                ev = 1
            } else {
                ev = 2
            }
        }
        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: ev });
    }

    private dataReport() {
        if (DataReporting.isRepeatReport) return

        let ev: number
        if (GameData.getInstance().isStartAnswered == 0) {
            ev = 4
        } else {
            if (GameData.getInstance().isPassAllLevel) {
                ev = 1
            } else {
                ev = 2
            }
        }

        DataReporting.getInstance().dispatchEvent('addLog', {
            eventType: 'clickSubmit',
            eventValue: JSON.stringify({
                //是否有正确答案
                isResult: ConstValue.IsAnswer ? 1 : 0,//1有 0没有
                //是否有关卡
                isLavel: ConstValue.IsLevel ? 1 : 0,//1有 0没有
                //关卡数据
                levelData: ConstValue.IsLevel ? this.reportLevels : [{
                    subject: '',
                    answer: '',
                    result: ev
                }],
                //是否所有题都做对, 1正确 2错误 3重复作答 4未作答 5已作答   
                result: ev
            })
        });
        DataReporting.isRepeatReport = true;
    }

    private getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                let response_data = response;
                if (Array.isArray(response_data.data)) {
                    return;
                }
                let content = JSON.parse(response_data.data.courseware_content);
                if (content != null) {
                    if (content.CoursewareKey == ConstValue.CoursewareKey) {
                        this.netData = content
                        GameData.getInstance().revertDataByCourseware_content(content)
                        console.log('数据还原成功');
                        this.init();
                    } else {
                        console.warn('拉错数据了');
                        UIManager.getInstance().showUI(ErrorPanel, null, () => {
                            let ep = UIManager.getInstance().getUI(ErrorPanel) as ErrorPanel
                            ep.setPanel('CoursewareKey错误')
                        })
                    }
                }
            } else {
                this.init();
            }
        }.bind(this), null);
    }

    private init() {   
        this.rightRangeSize = this.rightGraphicsParent.getContentSize()
        this.rightRangeSize.width -= 40
        this.rightRangeSize.height -= 40

        this.initLevelDatas()
        this.initRightStrokeData()
        this.initRightGraphics()
        this.initTopLeftPos()
        this.initGridSide()
        this.playEnterAnim()
        this.initEvent()
    }

    private initRightStrokeData(){
        this.rightStrokeData.question.splice(0, this.rightStrokeData.question.length)

        for(let i = 0; i < GameData.getInstance().dataList.length; i++){
            let data = GameData.getInstance().dataList[i]
            if(data.isSelect){
                this.rightStrokeData.question.push(data.getCopy())
            }
        }
    }

    /**创建一个绘图节点，大小与右侧画板大小相同 */
    private createOneGraphicsNode(){
        let node = new cc.Node('graphicNode')
        node.setContentSize(this.rightGraphicsParent.getContentSize())
        let graphics = node.addComponent(cc.Graphics)
        graphics.lineWidth = 2
        graphics.strokeColor = this.strokeColor
        return node
    }

    private initRightGraphics(){
        let node = this.createOneGraphicsNode()
        node.setParent(this.rightGraphicsParent)
        this.rightGraphicNode = node
        this.rightGraphic = node.getComponent(cc.Graphics)
    }

    private initTopLeftPos(){
        let x, y

        x = -this.rightRangeSize.width * 0.5
        y = this.rightRangeSize.height * 0.5
        this.rightGraphicTopLeft = cc.v2(x, y)
    }

    private initGridSide(){
        let size = this.rightRangeSize

        let minRow = Infinity, maxRow = -Infinity, minCol = Infinity, maxCol = -Infinity
        for(let i = 0; i < this.rightStrokeData.question.length; i++){
            let data = this.rightStrokeData.question[i]
            if(data.isSelect){
                minRow = Math.min(minRow, data.getRow())
                maxRow = Math.max(maxRow, data.getRow())
                if(data.gridType == 1){
                    minCol = Math.min(minCol, data.getCol())
                    maxCol = Math.max(maxCol, data.getCol())
                }else{
                    if(data.getRow()%2 == 0){
                        minCol = Math.min(minCol, data.getCol() + 1)
                        maxCol = Math.max(maxCol, data.getCol() + 1)
                    }else{
                        minCol = Math.min(minCol, data.getCol())
                        maxCol = Math.max(maxCol, data.getCol())
                    }
                }
            }
        }

        let rowCount = maxRow - minRow + 1
        let colCount = maxCol - minCol + 1

        //格子间隙与格子边长之比
        let rateOfGap = 0.1
        if(GameData.getInstance().gridType == 2){
            rateOfGap = 0.06
        }

        if(GameData.getInstance().gridType == 1){
            let widthSide = size.width / (colCount + (colCount - 1) * rateOfGap)
            let heightSide = size.height / (rowCount + (rowCount - 1) * rateOfGap)
            this.rightGridSide = Math.min(widthSide, heightSide)
            this.rightGridGap = this.rightGridSide * rateOfGap

            this.rightQuestionGraphRange.width = colCount*this.rightGridSide + (colCount-1)*this.rightGridGap
            this.rightQuestionGraphRange.height = rowCount*this.rightGridSide + (rowCount-1)*this.rightGridGap
        }else{
            let widthSide = size.width / (0.5*colCount + 0.5 + colCount*rateOfGap - rateOfGap)
            let heightSide = size.height / (Math.tan(cc.misc.degreesToRadians(60)) * 0.5 * rowCount + (rowCount - 1) * rateOfGap)
            this.rightGridSide = Math.min(widthSide, heightSide)
            this.rightGridGap = this.rightGridSide * rateOfGap

            this.rightQuestionGraphRange.width = colCount*0.5*this.rightGridSide + (colCount-1)*this.rightGridGap
            let h = this.getTriangleHeight(this.rightGridSide)
            this.rightQuestionGraphRange.height = rowCount*h + (rowCount-1)*h
        }

        //整体偏移
        let RangeCenter = cc.v2(size.width/2, -size.height/2)
        let mediumRow = (minRow + maxRow)/2, mediumCol = (minCol + maxCol)/2
        if(GameData.getInstance().gridType == 1){
            let graphCenter = new cc.Vec2()
            graphCenter.x = mediumCol*this.rightGridSide + (mediumCol-1)*this.rightGridGap - this.rightGridSide*0.5
            graphCenter.y = -(mediumRow*this.rightGridSide + (mediumRow-1)*this.rightGridGap - this.rightGridSide*0.5)

            this.rightOffset = RangeCenter.sub(graphCenter)
        }else{
            let minX, maxX, minY, maxY
            minX = minCol*0.5*this.rightGridSide + (minCol - 1)*this.rightGridGap
            maxX = maxCol*0.5*this.rightGridSide + (maxCol - 1)*this.rightGridGap

            let H = this.getTriangleHeight(this.rightGridSide)
            minY = (minRow - 0.5)*H + (minRow - 1)*this.rightGridGap
            maxY = (maxRow - 0.5)*H + (maxRow - 1)*this.rightGridGap

            let graphCenter = new cc.Vec2()
            graphCenter.x = (minX + maxX)/2
            graphCenter.y = -(minY + maxY)/2

            this.rightOffset = RangeCenter.sub(graphCenter)
        }
    }

    /**
     * 由正三角形的边长计算高
     * @param side 
     */
    private getTriangleHeight(side:number){
        return side * 0.5 * Math.tan(cc.misc.degreesToRadians(60))
    }

    private initLevelDatas(){
        if(ConstValue.IsLevel){
            let levelCount: number
            for(let i = 0; i < levelCount; i++){
                this.reportLevels.push({
                    subject: '',
                    answer: '',
                    result: 4
                })
            }
        }
    }

    private async playEnterAnim(){
        //上方面板出现
        await this.upRightEnter()

        //然后左侧面板出现
        await this.upLeftEnter()

        //然后底部按钮出现
        await this.bottomBgEnter()
        await this.bottomBtnEnter()

        //右侧题目出现
        await this.rightQuestionEnter().then(()=>{
            this.refreshPenColor()
            this.initEvent()
        })

        //上方历史答案出现
        if(NetWork.courseware_id && NetWork.user_id){
            this.upHistoryAnswerEnter().catch((reason)=>{
                console.log(reason, '不显示历史作答');
            })
        }
    }

    /**上方右侧面板出现 */
    private async upRightEnter(){
        return new Promise((resolve, reject)=>{
            let duration = 0.8
            let seq = cc.sequence(
                cc.moveTo(duration, 150.74, 74.405).easing(cc.easeBackOut()),
                cc.callFunc(resolve)
            )
            this.rightNode.runAction(seq)
        })
    }

    /**上方左侧面板出现 */
    private async upLeftEnter(){
        AudioManager.getInstance().playSound('sfx_moving')
        return new Promise((resolve, reject)=>{
            let duration = 0.5
            let seq = cc.sequence(
                cc.moveTo(duration, -676.6, 74.405).easing(cc.easeBackOut()),
                cc.callFunc(resolve)
            )
            this.leftNode.setPosition(-241.17, 74.405)
            this.leftNode.runAction(seq)
        })
    }

    /**底部面板出现 */
    private async bottomBgEnter(){
        AudioManager.getInstance().playSound('sfx_colrbd')
        return new Promise((resolve, reject)=>{
            let duration = 0.3
            let seq = cc.sequence(
                cc.moveTo(duration, -5.723, -397.038).easing(cc.easeOut(2)),
                cc.callFunc(resolve)
            )
            this.bottomNode.runAction(seq)
        })
    }

    /**底部按钮出现 */
    private async bottomBtnEnter(){
        AudioManager.getInstance().playSound('sfx_colorbutt')
        let colorBtnRoot = this.bottomNode.getChildByName('btns').getChildByName('colorBtns')
        for(let i = 1; i <= 6; i++){
            let node = colorBtnRoot.getChildByName(`color${i}`)
            await Tools.delayTime(0.04)
            this.enterOneBtn(node)
        }

        await this.enterOneBtn(this.bottomNode.getChildByName('btns').getChildByName('resetBtn'))
        await this.enterOneBtn(this.bottomNode.getChildByName('btns').getChildByName('submitBtn'))
    }

    private async enterOneBtn(node:cc.Node){
        return new Promise((resolve, reject)=>{
            let duration = 0.05
            let seq = cc.sequence(
                cc.scaleTo(duration, 1, 1).easing(cc.easeBackOut()),
                cc.callFunc(resolve)
            )
            node.runAction(seq)
        })
    }

    /**上方历史答案出现 */
    private async upHistoryAnswerEnter(){
        return new Promise((resolve, reject)=>{
            let url = NetWork.GET_USER_PROGRESS 
                        + "?courseware_id=" 
                        + NetWork.courseware_id
                        + "&user_id=" + NetWork.user_id
            NetWork.getInstance().httpRequest(url, "GET", "application/json;charset=utf-8", function (err, data) {
                if (!err) {
                    if (data.data && data.data.answer_content) {
                        let prevAnswer = JSON.parse(data.data.answer_content)
                        if(!prevAnswer.cocos_project){
                            reject('旧版课件答题记录数据')
                            return
                        }

                        if (prevAnswer && prevAnswer.answers && prevAnswer.answers.length) {
                            let { chapter_id, index, answers } = prevAnswer
                            if ((chapter_id != undefined && index != undefined) // 授课端演示不带这两个参数
                                && (NetWork.chapter_id == chapter_id && NetWork.index == index)) { // 若和之前是同一个直播讲
                                answers.forEach(answer => {
                                    this.saveAnswer(answer)
                                })
                                this.refreshLeftGraphics()
                                resolve()
                            }else{
                                reject('chapter_id, index 不匹配')
                            }
                        }else{
                            reject('no answers')
                        }
                    }else{
                        reject('no answer_content')
                    }
                } else {
                    reject(err)
                }
            }.bind(this), null);
        })
    }

    /**右侧题目出现 */
    private async rightQuestionEnter(){
        AudioManager.getInstance().playSound('sfx_drawin')
        return new Promise((resolve, reject)=>{
            this.refreshRightGraphics()
            this.rightGraphic.node.setScale(0)
            let seq = cc.sequence(
                cc.scaleTo(0.3, 1, 1),
                cc.callFunc(resolve)
            )
            this.rightGraphic.node.runAction(seq)
        })
    }

    /**获取当前选择的颜色 */
    private getSelectColor(){
        this.mSelectColor = this.mSelectColor.fromHEX(HexToColorString(this.getSelectColorType()))
        return this.mSelectColor
    }

    /**获取当前选择的颜色类型 */
    private getSelectColorType(){
        let fillColor
        switch (this.mColorIndex) {
            case 0:
                fillColor = FillColor.Orange
                break;
            case 1:
                fillColor = FillColor.Yellow
                break;
            case 2:
                fillColor = FillColor.Red
                break;
            case 3:
                fillColor = FillColor.Pink
                break;
            case 4:
                fillColor = FillColor.Green
                break;
            case 5:
                fillColor = FillColor.Purple
                break;
            default:
                break;
        }

        return fillColor
    }

    /**刷新笔的颜色外观 */
    private refreshPenColor(){
        if(!this.needShowPen) return

        let sprite = this.penNode.getChildByName('pic').getComponent(cc.Sprite)
        sprite.spriteFrame = this.penPics[this.mColorIndex]
    }

    /**从服务器存档数据恢复时图案刷新根据数据，
     * 作答正确时图案显示来自右侧截图,
     * 左侧列表中每个图案是一个单独的graphics节点
     */
    private refreshLeftGraphics(){
        
        let answers = this.leftStrokeData.answers
        if(GameData.getInstance().gridType == 1){
            //正方形
            for(let i = 0; i < answers.length; i++){
                //图案
                let answerGraph = Utils.flatenArray(answers[i]) 
                this.createLeftHistoryGraph(answerGraph)
            }
        }else{
            //三角形
            for(let i = 0; i < answers.length; i++){
                let answerGraph = Utils.flatenArray(answers[i]) 
                this.createLeftHistoryGraph(answerGraph)
            }
        }
    }

    /**answerGraph中是按照颜色分的数组，数组中为graphUnit */
    private createLeftHistoryGraph(answerGraph:Array<any>){
        console.log('绘制左侧历史图案');
        console.log(answerGraph)

        let graphicNode = this.createOneGraphicsNode()
        let graphics = graphicNode.getComponent(cc.Graphics)
        graphicNode.setParent(this.leftGraphicsParent)

        let dataList:DataGrid[] = []
        let minRow = Infinity, maxRow = -Infinity, minCol = Infinity, maxCol = -Infinity
        for(let i = 0; i < answerGraph.length; i++){
            let unitArr = answerGraph[i]
            for(let j = 0; j < unitArr.length; j++){
                let grid = unitArr[j]
                minRow = Math.min(minRow, grid.pos.i + 1)
                maxRow = Math.max(maxRow, grid.pos.i + 1)
                minCol = Math.min(minCol, grid.pos.j + 1)
                maxCol = Math.max(maxCol, grid.pos.j + 1)

                let data = DataGrid.createByGraphUnit(grid)
                dataList.push(data)
            }
        }

        let rowCount = maxRow - minRow + 1
        let colCount = maxCol - minCol + 1

        let graphSize:cc.Size = new cc.Size(0)
        if(GameData.getInstance().gridType == 1){
            graphSize.width = colCount*this.rightGridSide + (colCount-1)*this.rightGridGap
            graphSize.height = rowCount*this.rightGridSide + (rowCount-1)*this.rightGridGap
        }else{
            graphSize.width = colCount*0.5*this.rightGridSide + (colCount-1)*this.rightGridGap
            let h = this.getTriangleHeight(this.rightGridSide)
            graphSize.height = rowCount*h + (rowCount-1)*h
        }

        let targetScale:number
        let targetPos:cc.Vec2 = new cc.Vec2(0, 0)   //在列表中的局部位置
        let limitRange:cc.Size = this.leftGraphicsParent.getContentSize()

        targetScale = (limitRange.width - 40)/graphSize.width
        let scaleHeight = graphSize.height*targetScale
        targetPos.y = -(this.leftListTotalLength + scaleHeight/2)
        
        graphicNode.setPosition(targetPos)
        graphicNode.setScale(targetScale)

        this.leftListTotalLength += (scaleHeight + 30)
        this.leftGraphicsParent.setContentSize(limitRange.width, this.leftListTotalLength)

        //绘制
        for(let i = 0; i < dataList.length; i++){
            let data = dataList[i]
            if(GameData.getInstance().gridType == 1){
                this.drawRightOneRect(data, graphics)
            }else{
                this.drawRightOneTriangle(data, graphics)
            }
        }

        //文字
        this.refreshGridLabels(graphicNode, dataList)
    }

    private refreshRightGraphics(){
        let graphics = this.rightGraphic
        graphics.clear()

        if(GameData.getInstance().gridType == 1){
            this.refreshRectGrids()
        }else if(GameData.getInstance().gridType == 2){
            this.refreshTriangleGrids()
        }

        this.refreshGridLabels(this.rightGraphicNode, this.rightStrokeData.question)
    }

    private refreshRectGrids(){
        for(let i = 0; i < this.rightStrokeData.question.length; i++){
            this.drawRightOneRect(this.rightStrokeData.question[i], this.rightGraphic)
        }
    }

    private drawRightOneRect(data:DataGrid, graphics:cc.Graphics){
        data.caculateRange(this.rightGridSide, this.rightGridGap, this.rightGraphicTopLeft, this.rightOffset)

        //先绘制旧颜色
        if(data.scaleProgress < 1 && data.lastFillColor){
            graphics.strokeColor = data.lastFillColor
            graphics.fillColor = data.lastFillColor
            graphics.roundRect(data.localRect.x, data.localRect.y, data.localRect.width, data.localRect.height, this.rightGridGap)
            graphics.fill()
            graphics.stroke()
        }

        //绘制当前新的颜色
        if(data.fillColor == FillColor.Null){
            graphics.strokeColor = this.strokeColor
        }else{
            graphics.strokeColor = data.getColor()
            graphics.fillColor = data.getColor()
        }

        //根据动画进度计算范围大小
        let x = data.localRect.x + data.localRect.width*(1 - data.scaleProgress)*0.5
        let y = data.localRect.y + data.localRect.height*(1 - data.scaleProgress)*0.5
        let w = data.localRect.width * data.scaleProgress
        let h = data.localRect.height * data.scaleProgress
        graphics.roundRect(x, y, w, h, this.rightGridGap)

        if(data.fillColor != FillColor.Null){
            graphics.fill()
        }
        graphics.stroke()

        if(data.scaleProgress < 1){
            //有缩放动画过程
            data.scaleProgress += 0.1
            if(data.scaleProgress > 1){
                data.scaleProgress = 1
            }
            this.updateQueueParams.push({
                data,
                graphics
            })
            this.updateQueue.push(this.drawRightOneRect)
        }
    }

    update(dt){
        if(this.updateQueue.length == 0){
            return
        }

        let param = this.updateQueueParams.shift()
        this.updateQueue.shift().call(this, param.data, param.graphics)
    }

    private refreshTriangleGrids(){
        for(let i = 0; i < this.rightStrokeData.question.length; i++){
            this.drawRightOneTriangle(this.rightStrokeData.question[i], this.rightGraphic)
        }
    }

    private drawRightOneTriangle(data:DataGrid, graphics:cc.Graphics){
        data.caculateRange(this.rightGridSide, this.rightGridGap, this.rightGraphicTopLeft, this.rightOffset)

        //先绘制旧颜色
        if(data.scaleProgress < 1 && data.lastFillColor){
            graphics.strokeColor = data.lastFillColor
            graphics.fillColor = data.lastFillColor
            graphics.moveTo(data.localVertexs[0].x, data.localVertexs[0].y)
            graphics.lineTo(data.localVertexs[1].x, data.localVertexs[1].y)
            graphics.lineTo(data.localVertexs[2].x, data.localVertexs[2].y)
            graphics.close()
            graphics.fill()
            graphics.stroke()
        }

        //绘制当前新的颜色
        if(data.fillColor == FillColor.Null){
            graphics.strokeColor = this.strokeColor
        }else{
            graphics.strokeColor = data.getColor()
            graphics.fillColor = data.getColor()
        }

        //根据动画进度计算范围大小
        let rateVertexs = data.getRateTriangle(data.scaleProgress)
        graphics.moveTo(rateVertexs[0].x, rateVertexs[0].y)
        graphics.lineTo(rateVertexs[1].x, rateVertexs[1].y)
        graphics.lineTo(rateVertexs[2].x, rateVertexs[2].y)
        graphics.close()

        if(data.fillColor != FillColor.Null){
            graphics.fill()
        }
        graphics.stroke()

        if(data.scaleProgress < 1){
            //有缩放动画过程
            data.scaleProgress += 0.1
            if(data.scaleProgress > 1){
                data.scaleProgress = 1
            }
            this.updateQueueParams.push({
                data,
                graphics
            })
            this.updateQueue.push(this.drawRightOneTriangle)
        }
    }

    private refreshGridLabels(graphNode:cc.Node, dataList:Array<DataGrid>){
        graphNode.destroyAllChildren()
        for(let i = 0; i < dataList.length; i++){
            let data = dataList[i]
            
            if(data.content.length > 0){
                let node = new cc.Node('label')
                node.parent = graphNode
                data.caculateRange(this.rightGridSide, this.rightGridGap, this.rightGraphicTopLeft, this.rightOffset)
                node.setPosition(data.getCenterPosition())
                node.color = cc.Color.BLACK
                node.skewX = 7
                let lb = node.addComponent(cc.Label)
                lb.useSystemFont = true
                lb.fontSize = this.rightGridSide*0.5
                lb.lineHeight = lb.fontSize*1.2
                lb.string = data.content
            }
        }
    }

    private initEvent(){
        this.hideCursor(true)

        let listenerNode = this.node.getChildByName('touchListener')
        this.bgListenerNode = listenerNode
        listenerNode.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this)
        listenerNode.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this)
        listenerNode.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this)

        this.rightGraphicNode.on(cc.Node.EventType.TOUCH_END, this.onRightTouchEnd, this)
    }

    private onRightTouchEnd(evt){
        if(GameData.getInstance().isStartAnswered == 0){
            GameData.getInstance().isStartAnswered = 1
        }
        let location = evt.getLocation()
        let localPos:cc.Vec2 = this.rightGraphicNode.convertToNodeSpaceAR(location)

        //格子数据是否变化
        let changed:boolean = false

        if(GameData.getInstance().gridType == 1){
            //正方形
            for(let i = 0; i < this.rightStrokeData.question.length; i++){
                let data = this.rightStrokeData.question[i]
                if(data.localRect){
                    if(data.localRect.contains(localPos)){
                        if(data.fillColor != FillColor.Null){
                            data.lastFillColor = data.getColor()
                        }
                        data.fillColor = this.getSelectColorType()
                        data.scaleProgress = 0
                        changed = true
                        break
                    }
                }
            }
        }else{
            //三角形
            for(let i = 0; i < this.rightStrokeData.question.length; i++){
                let data = this.rightStrokeData.question[i]
                if(data.localVertexs){
                    if(cc.Intersection.pointInPolygon(localPos, data.localVertexs)){
                        if(data.fillColor != FillColor.Null){
                            data.lastFillColor = data.getColor()
                        }
                        data.fillColor = this.getSelectColorType()
                        data.scaleProgress = 0
                        changed = true
                        break
                    }
                }
            }
        }

        if(changed){
            AudioManager.getInstance().playSound('sfx_fill')
            this.refreshRightGraphics()
        }
    }

    private onMouseEnter(evt){
        this.hideCursor(true)
        this.onMouseMove(evt)
    }

    private onMouseMove(evt){
        let location = evt.getLocation()
        let localPos = this.node.convertToNodeSpaceAR(location)
        
        this.penNode.setPosition(localPos)
    }

    private onMouseLeave(evt){
        this.hideCursor(false)
    }

    private onClickColor(evt, param){
        //console.log(evt, param);
        if(GameData.getInstance().isStartAnswered == 0){
            GameData.getInstance().isStartAnswered = 1
        }
        AudioManager.getInstance().playSound('sfx_select')
        let colorIndex = parseInt(param) - 1
        this.mColorIndex = colorIndex
        this.refreshPenColor()
    }

    /**保存图案到左侧绘制数据 */
    private saveAnswer(answer) {
		let current = []
		current.push(answer)
		current = current.concat(this.getDuplicateAnswers(answer))
        this.leftStrokeData.answers.push(current)
        
        console.log('saveAnswer, answers:');
        console.log(this.leftStrokeData.answers);
    }
    
    private getDuplicateAnswers(answer) {
		let duplicates = []
		// 旋转答案，并将其boundingBox平移到原点
		this.symmetricDegrees.forEach(degree => {
			let bbox = Utils.getBoundingRect(Utils.rotateGraph(this.graph, degree))
			let rotatedAnswer = answer.map(graph => {
				let rotated = Utils.rotateGraph(graph, degree)
				return Utils.move(rotated, bbox.left, bbox.top)
			})
			duplicates.push(rotatedAnswer)
		})
		return duplicates
    }
    
    // 图形旋转多少度后能回复原
	private checkSymmetric() {
		const degrees = []
		const rotation = this.getRotationArgsByType(this.netData.problemType)
		// 不考虑转360度的情况
		let rotated = this.graph
		for (let i = 0; i < rotation.cnt - 1; ++i) {
			rotated = Utils.rotateGraph(rotated, rotation.degree)
			if (Utils.isGraphEqual(rotated, this.graph)) {
				degrees.push((i + 1) * rotation.degree)
			}
		}
		this.symmetricDegrees = degrees
    }
    
    private getRotationArgsByType(type) {
		let rotation = { degree: null, cnt: null}
		if (type == 'square') {
			rotation.degree = Math.PI / 2
			rotation.cnt = 4
		}
		if (type == 'triangle') {
			rotation.degree = Math.PI / 3
			rotation.cnt = 6
		}
		return rotation
	}

    private onClickReset(){
        if(GameData.getInstance().isStartAnswered == 0){
            GameData.getInstance().isStartAnswered = 1
        }
        AudioManager.getInstance().playSound('sfx_buttn')
        this.rightStrokeData.question.forEach((dt, i, arr)=>{
            if(dt.fillColor != FillColor.Null){
                dt.fillColor = FillColor.Null
            }
        })
        this.refreshRightGraphics()
    }

    private onClickSubmit(){
        this.graph = []
        this.rightStrokeData.question.forEach((dt, i, arr)=>{
            this.graph.push(dt.toGraphUnit())
        })

        this.checkSymmetric()

        // 按颜色对方块们进行分组: [[],...]
		const groups = this.divideGroupsByColor()
		if (this.isPartitionRight(groups)) {
			let index
			if ((index = this.isAnswerDuplicate(groups)) >= 0) {
                console.log(`与第${index + 1}个答案重复了`);
                this.showResult(false, '试试别的方法呀！')
			} else {
                console.log('您做对了');
                this.rightGraphicNode.off(cc.Node.EventType.TOUCH_END, this.onRightTouchEnd, this)
                GameData.getInstance().isPassAllLevel = true
                this.dataReport()
                
                this.saveAnswer(groups)
                if(NetWork.courseware_id && NetWork.user_id){
                    this.uploadAnswer()
                }

                let self = this
                this.playRightLightAnim(()=>{
                    self.showResult(true, '你真棒！还有别的方法吗？', ()=>{
                        self.rightMoveToLeft(()=>{
                            //新建右侧画板
                            self.initRightStrokeData()
                            self.initRightGraphics()
                            self.refreshRightGraphics()
                            self.rightGraphicNode.on(cc.Node.EventType.TOUCH_END, this.onRightTouchEnd, this)
                        })
                    })
                })
			}
		} else {
            this.showResult(false, '啊欧，再试试看！')
		}
    }

    private showResult(isRight:boolean, tip:string = '', cbk:Function = null){
        UIManager.getInstance().showUI(OverTips, null, ()=>{
            let ovt = UIManager.getInstance().getUI(OverTips) as OverTips
            ovt.init(isRight ? 1 : 0, tip, cbk)
        })
    }

    /**播放正确时背景点亮动效 */
    private playRightLightAnim(cbk:Function){
        AudioManager.getInstance().playSound('sfx_doen')
        let leftMaskNode = this.lightMaskNode.getChildByName('leftMask')
        let rightMaskNode = this.lightMaskNode.getChildByName('rightMask')
        
        let tweenLeft = new cc.Tween().target(leftMaskNode)
        tweenLeft.to(1, {width: 1147}, {progress: null, easing: null})
        tweenLeft.start()

        let tweenRight = new cc.Tween().target(rightMaskNode)
        tweenRight.delay(0.3)
        tweenRight.to(0.7, {width: 847}, {progress: null, easing: null})
        tweenRight.delay(0.1)
        tweenRight.call(tweenEnd)
        tweenRight.start()

        function tweenEnd() {
            leftMaskNode.width = 0
            rightMaskNode.width = 0
            cbk()
        }
    }

    /**右侧图案移动到答案区 */
    private rightMoveToLeft(cbk:Function){
        let targetScale:number
        let targetPos:cc.Vec2 = new cc.Vec2(0, 0)   //在列表中的局部位置
        let limitRange:cc.Size = this.leftGraphicsParent.getContentSize()

        targetScale = (limitRange.width - 40)/this.rightQuestionGraphRange.width
        let scaleHeight = this.rightQuestionGraphRange.height*targetScale
        targetPos.y = -(this.leftListTotalLength + scaleHeight/2)
        this.leftListTotalLength += (scaleHeight + 30)

        this.leftGraphicsParent.setContentSize(limitRange.width, this.leftListTotalLength)

        let scrollView = this.leftGraphicsParent.parent.parent.getComponent(cc.ScrollView)
        scrollView.scrollToBottom(0.05)
        
        let self = this
        setTimeout(() => {
            self.startMove(targetPos, targetScale)
            cbk()
        }, 100);
    }

    private startMove(targetPos, targetScale){
        let worldPos = this.leftGraphicsParent.convertToWorldSpaceAR(targetPos)
        let relatePos:cc.Vec2 = this.rightGraphicsParent.convertToNodeSpaceAR(worldPos)

        let moveAct = cc.moveBy(0.7, relatePos).easing(cc.easeIn(2))
        let scaleAct = cc.scaleTo(0.7, targetScale)

        let node = this.rightGraphicNode

        node.runAction(cc.sequence(
            cc.spawn(moveAct, scaleAct),
            cc.callFunc(onMoveEnd)
        ))

        let self = this
        function onMoveEnd() {
            node.setParent(self.leftGraphicsParent)
            node.setPosition(targetPos)
        }
    }

    /**上传答案 */
    private uploadAnswer () {
		// 上传到后台的答案JSON格式:
		// {
		// 	answers: 答案
		// 	chapter_id: 直播讲id 	
		// 	index: 直播讲次
		// }
        let answers = this.leftStrokeData.answers.map(answerArr => answerArr[0]) 
        console.log('uploadAnswers');
        console.log(answers);

        if(!ConstValue.IS_EDITIONS){
            return
        }

        let data = {
			answers: answers,
			chapter_id: NetWork.chapter_id,
            index: NetWork.index,
            //新增字段，用于和旧版课件数据做区分
            cocos_project: true
		}
        
        NetWork.getInstance().httpRequest(NetWork.SAVE_USER_PROGRESS, "POST", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                console.log("作答记录提交成功");
            }else{
                console.error(err);
            }
        }.bind(this), JSON.stringify({
            courseware_id: NetWork.courseware_id,
			user_id: NetWork.user_id,		
			answer_content: JSON.stringify(data)
        }));
	}

    // 相同的颜色放到一组，返回一个包含了所有组的二维数组
	private divideGroupsByColor() {
		const existColors = []
		const groups = []
		this.graph.forEach(unit => {
			let index = 0
			if ((index = existColors.indexOf(unit.color)) < 0) {
				existColors.push(unit.color)
				groups.push([])
				index = groups.length - 1
			}
			groups[index].push({
				points: unit.points,
				text: unit.text,
				pos: unit.pos,
				color: unit.color
			})
		})
		return groups
    }
    
    private isPartitionRight(groups) {
		return this.isGroupNumRight(groups)
			&& this.isAllColored()
			&& this.isEveryGroupSizeRight(groups)
			&& this.isProblemRuleRight(groups)
    }

    private isGroupNumRight(groups) {
		return groups.length == this.netData.groupNum
    }
    
    // 所有的方块是否有填色
	private isAllColored () {
		return this.graph.every(unit => unit.color)
    }
    
    private isEveryGroupSizeRight(groups) {
		return groups.reduce(
			(prev, cur) => prev && cur.length == this.netData.groupSize,
			true
		)
	}

	private isProblemRuleRight(groups) {
		if (this.netData.problemRule == 1 || this.netData.problemRule == 3) {
			return this.isEveryGraphEqual(groups)
		} else {
			return this.isEveryGraphNotEqual(groups)
		}
    }
    
    private isEveryGraphEqual(groups) {
		let rotateDegree = Math.PI / 2
		let rotateCnt = 4
		if (this.netData.problemType == 'triangle') {
			rotateDegree = Math.PI / 3
			rotateCnt = 6
		}
		const target = groups[0]
		const foldedTarget = Utils.foldGraph(target)
		return groups.slice(1).every(graph => {
			let equal = false
			let rotated = graph
			for (let i = 0; i < rotateCnt; ++i) {
				rotated = Utils.rotateGraph(rotated, rotateDegree)
				equal = Utils.isGraphEqual(target, rotated) || Utils.isGraphEqual(foldedTarget, rotated)
				if (equal) {
					break
				}
			}
			return equal
		})
	}

	private isEveryGraphNotEqual(groups) {
		let rotateDegree = Math.PI / 2
		let rotateCnt = 4
		if (this.netData.problemType == 'triangle') {
			rotateDegree = Math.PI / 3
			rotateCnt = 6
		}
		const target = groups[0]
		const foldedTarget = Utils.foldGraph(target)
		return groups.slice(1).every(graph => {
			let equal = false
			let rotated = graph
			for (let i = 0; i < rotateCnt; ++i) {
				rotated = Utils.rotateGraph(rotated, rotateDegree)
				equal = Utils.isGraphEqual(target, rotated) || Utils.isGraphEqual(foldedTarget, rotated)
				if (equal) {
					break
				}
			}
			return !equal
		})
	}
    
    // 若答案重复，返回answers数组的index，表示同第index个答案重复
	// 否则返回 -1
	private isAnswerDuplicate(answer) {
		const { answers } = this.leftStrokeData
		for (let i = 0; i < answers.length; ++i) {
			for (let j = 0; j < answers[i].length; ++j) {
				if (this.isDuplicate(answers[i][j], answer)) {
					return i
				}
			}
		}
		return -1
    }
    
    private isDuplicate(answer1, answer2) {
		// 对于answer1中的每一个分组，在answer2中都有一个与之完全重叠
		return answer1.every(graph1 => {
			return answer2.some(graph2 => Utils.isGraphOverlapped(graph1, graph2))
		})
	}

    private hideCursor(hide:boolean){
        if(!this.needShowPen) return

        document.querySelector('canvas').style.cursor = hide ? 'none' : 'auto'
    }

    onDestroy() {
        this.hideCursor(false)
        Tools.cancelAllTimeout()
        GameData.getInstance().isPassAllLevel = false
        GameData.getInstance().isStartAnswered = 0
        AudioManager.getInstance().stopAll()
        UIManager.getInstance().closeUI(SubmissionPanel)
        ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, { state: 0 });
    }
}
