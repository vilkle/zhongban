import { GameData } from "./GameData";
import { FillColor, HexToColorString } from "./CustomTypes";

/**网格数据 */
export class DataGrid{

    private _gridType : number = 1;
    /**网格类型，1正方形，2等边三角形 */
    public get gridType() : number {
        return this._gridType;
    }
    public set gridType(v : number) {
        this._gridType = v;
    }
    
    private _index : number = -1;
    /**在数组中的索引 */
    public get index() : number {
        return this._index;
    }
    public set index(v : number) {
        this._index = v;
    }
    
    private _isSelect : boolean = false;
    /**是否选中 */
    public get isSelect() : boolean {
        return this._isSelect;
    }
    public set isSelect(v : boolean) {
        this._isSelect = v;
        if(!v){
            this.content = ''
        }
    }

    private _content : string = '';
    /**格子内的内容 */
    public get content() : string {
        return this._content;
    }
    public set content(v : string) {
        this._content = v;
    }
    


    //----------------无需存档-----------------------
    
    private _isHover : boolean = false;
    /**是否光标悬停 */
    public get isHover() : boolean {
        return this._isHover;
    }
    public set isHover(v : boolean) {
        this._isHover = v;
    }
    
    private row:number = null
    private col:number = null

    /**获取所在行 */
    public getRow(){
        if(this.row == null){
            if(this.gridType == 1){
                this.row = Math.ceil((this.index + 1) / GameData.getInstance().ConfigRect.MaxCol)
            }else if(this.gridType == 2){
                //每一行的三角形互相镶嵌
                //判断三角形行列时把三角形以中心为准抽象为一个点
                this.row = Math.ceil((this.index + 1) / (GameData.getInstance().ConfigTriangle.MaxCol * 2))
            }
        }
        return this.row
    }

    /**获取所在列 */
    public getCol(){
        if(this.col == null){
            if(this.gridType == 1){
                this.col = (this.index + 1)%GameData.getInstance().ConfigRect.MaxCol
                if(this.col == 0){
                    this.col = GameData.getInstance().ConfigRect.MaxCol
                }
            }else if(this.gridType == 2){
                this.col = (this.index + 1)%(GameData.getInstance().ConfigTriangle.MaxCol * 2)
                if(this.col == 0){
                    this.col = GameData.getInstance().ConfigTriangle.MaxCol * 2
                }
            }
        }
        return this.col
    }

    /**正方形格子范围 */
    public localRect:cc.Rect = null

    /**三角形顶点坐标数组 */
    public localVertexs:cc.Vec2[] = null

    /**是否是倒三角形 */
    public isDirectionT(){
        return this.getCol() % 2 != 0
    }

    private centerPosition:cc.Vec2 = null

    /**获取格子中心位置坐标 */
    public getCenterPosition(){
        if(this.centerPosition == null){
            if(this.gridType == 1){
                let pos = cc.v2()
                pos.x = this.localRect.x + this.localRect.width * 0.5
                pos.y = this.localRect.y + this.localRect.height * 0.5
                this.centerPosition = pos
            }else if(this.gridType == 2){
                let pos = cc.v2()
                pos.x = (this.localVertexs[0].x + this.localVertexs[1].x + this.localVertexs[2].x)/3
                pos.y = (this.localVertexs[0].y + this.localVertexs[1].y + this.localVertexs[2].y)/3
                this.centerPosition = pos
            }
        }
        return this.centerPosition
    }

    /**最后一次点击时间戳ms */
    public lastClickTime:number = 0

    /**三角形转换为矩形 */
    public convertTriangleToRect(out?:cc.Rect){
        if(!out){
            out = cc.rect()
        }   
        let xList = this.localVertexs.map((pos, i, arr)=>{
            return pos.x
        })
        let yList = this.localVertexs.map((pos, i, arr)=>{
            return pos.y
        })

        xList.sort()
        yList.sort()

        out.x = xList[0]
        out.y = yList[0]
        out.width = xList[xList.length - 1] - out.x
        out.height = yList[yList.length - 1] - out.y

        return out
    }

    private _fillColor : FillColor = FillColor.Null;
    /**填充颜色类型 */
    public get fillColor() : FillColor {
        return this._fillColor;
    }
    public set fillColor(v : FillColor) {
        this._fillColor = v;
        this.color = null
    }

    /**上次被填充的颜色，为了表现填充时颜色被逐渐遮挡的动画 */
    public lastFillColor:cc.Color = null
    
    private color:cc.Color = null
    /**获取当前填充颜色 */
    public getColor(){
        if(this.color == null){
            this.color = new cc.Color().fromHEX(HexToColorString(this.fillColor))
        }
        return this.color
    }

    /**json格式的对象，兼容旧版数据结构 */
    public toGraphUnit(){
        return {
            /**顶点坐标 */
            points: this.getPoints(),
            /**文字 */
            text: this.content,
            /**二维数组中的位置索引 */
            pos: {
                i: this.getRow() - 1,
                j: this.getCol() - 1
            },
            /**颜色 */
            color: this.fillColor
        }
    }

    /**仅用于学生端绘制传参，
     * 只需要传递pos，color
     */
    public static createByGraphUnit(unit:any){
        let data = new DataGrid()
        data.gridType = GameData.getInstance().gridType
        data.content = unit.text
        data.row = unit.pos.i + 1
        data.col = unit.pos.j + 1
        data.fillColor = parseInt(parseInt(unit.color.toString(), 10).toString(16), 16)
        return data
    }

    /**计算范围 */
    public caculateRange(side:number, gap:number, topLeft:cc.Vec2, offset:cc.Vec2){
        if(this.gridType == 1){
            if(this.localRect == null){
                //从未计算过方格范围时
                let row = this.getRow()
                let col = this.getCol()
                
                let centerX = (col - 1)*gap + col*side - 0.5*side
                let centerY = -((row - 1)*gap + row*side - 0.5*side)
    
                //从左上角开始排列
                centerX += topLeft.x
                centerY += topLeft.y
    
                //位置居中
                centerX += offset.x
                centerY += offset.y
    
                let leftBottomX = centerX - side * 0.5
                let leftBottomY = centerY - side * 0.5
    
                this.localRect = cc.rect(leftBottomX, leftBottomY, side, side)
            }
        }else{
            if(this.localVertexs == null){
                //从未计算过三角形范围时
                let row = this.getRow()
                let col = this.getCol()
    
                let h = side * Math.sin(cc.misc.degreesToRadians(60))
    
                let centerX = col * side * 0.5 + (col - 1)*gap
                //行错位
                if(row % 2 == 0){
                    centerX += side*0.5 + gap
                }
                //中心到底边的距离
                let a = side * 0.5 * Math.tan(cc.misc.degreesToRadians(30))
                //顶点到中心的距离
                let b = h - a
                let tmpY
                if(this.isDirectionT()){
                    tmpY = (row - 1) * (h + gap) + a
                }else{
                    tmpY = (row - 1) * (h + gap) + b
                }
                let centerY = -tmpY
    
                //从左上角开始排列
                centerX += topLeft.x
                centerY += topLeft.y
    
                //位置居中
                centerX += offset.x
                centerY += offset.y
    
                this.localVertexs = []
                if(this.isDirectionT()){
                    let p1 = cc.v2(centerX - side * 0.5, centerY + a)
                    let p2 = cc.v2(centerX + side * 0.5, centerY + a)
                    let p3 = cc.v2(centerX, centerY - b)
                    this.localVertexs.push(p1)
                    this.localVertexs.push(p2)
                    this.localVertexs.push(p3)
                }else{
                    let p1 = cc.v2(centerX - side * 0.5, centerY - a)
                    let p2 = cc.v2(centerX, centerY + b)
                    let p3 = cc.v2(centerX + side * 0.5, centerY - a)
                    this.localVertexs.push(p1)
                    this.localVertexs.push(p2)
                    this.localVertexs.push(p3)
                }
            }
        }
    }

    /**获取顶点坐标Ojbect数组 */
    private getPoints(){
        let points:Array<object> = []
        if(this.gridType == 1){
            if(this.localRect){
                points.push({
                    x: parseInt(this.localRect.x.toFixed(2)),
                    y: parseInt(this.localRect.y.toFixed(2))
                })
                points.push({
                    x: parseInt(this.localRect.x.toFixed(2)),
                    y: parseInt((this.localRect.y + this.localRect.height).toFixed(2))
                })
                points.push({
                    x: parseInt((this.localRect.x + this.localRect.width).toFixed(2)),
                    y: parseInt((this.localRect.y + this.localRect.height).toFixed(2))
                })
                points.push({
                    x: parseInt((this.localRect.x + this.localRect.width).toFixed(2)),
                    y: parseInt(this.localRect.y.toFixed(2))
                })
            }
        }else{
            if(this.localVertexs){
                this.localVertexs.forEach((v2, i, arr)=>{
                    points.push({
                        x: parseInt(v2.x.toFixed(2)),
                        y: parseInt(v2.y.toFixed(2))
                    })
                })
            }
        }

        return points
    }

    public getCopy(){
        let copy = new DataGrid()
        copy.gridType = this.gridType
        copy.index = this.index
        copy.isSelect = this.isSelect
        copy.content = this.content
        
        return copy
    }

    /**入场缩放动画进度 0~1 */
    public scaleProgress:number = 1

    private rateVertexs:Array<cc.Vec2> = null

    /**获取大小与当前三角形之比为rate的三角形数组 */
    public getRateTriangle(rate:number){
        if(this.rateVertexs == null){
            this.rateVertexs = []
            for(let i = 1; i <= 3; i++){
                this.rateVertexs.push(cc.v2())
            }
        }
        let centerPos = this.getCenterPosition()
        let vertexs = this.localVertexs
        this.rateVertexs[0] = vertexs[0].sub(centerPos).mul(rate).add(centerPos)
        this.rateVertexs[1] = vertexs[1].sub(centerPos).mul(rate).add(centerPos)
        this.rateVertexs[2] = vertexs[2].sub(centerPos).mul(rate).add(centerPos)
        return this.rateVertexs
    }
}