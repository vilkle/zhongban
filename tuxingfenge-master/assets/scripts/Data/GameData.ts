import { DataGrid } from "./DataGrid";
import { Tools } from "../UIComm/Tools";
import { ConstValue } from "./ConstValue";

/**游戏数据类 */
export class GameData {
    private static instance: GameData;
    static getInstance() {
        if (this.instance == null) {
            this.instance = new GameData();
        }
        return this.instance;
    }

    /**是否已通关 */
    public isPassAllLevel:boolean = false
    /**是否已开始答题，0未开始  1已开始 */
    public isStartAnswered:number = 0

    /**正方形方格固定设置 */
    public ConfigRect = {
        MaxRow: 12,
        MaxCol: 16,
        /**格子边长 */
        Side: 68        
    }

    /**三角形方格固定设置 */
    public ConfigTriangle = {
        MaxRow: 12,
        MaxCol: 15,
        /**格子边长 */
        Side: 80       
    }

    //------------------------存档
    /**网格类型, 1正方形 2等边三角形  */
    public gridType:number = 1
    /**拆分图形数 */
    public graphCount:number = 0
    /**图形所含块数 */
    public gridCount:number = 0
    /**题目规则, 1拆分图形都一致  2拆分图形都不一致  3拆封图形和文字都一致 */
    public ruleType:number = 1
    /**格子数据 */
    public dataList:DataGrid[] = []


    //-----------------判定计算

    public isGraphValid(){
        return this.isGraphLengthValid() && this.isGraphShapeValid()
    }

    public getSelectList(){
        return this.dataList.filter((data, i, arr)=>{
            return data.isSelect
        })
    }

    private isGraphLengthValid(){
        return this.getSelectList().length == this.graphCount * this.gridCount
    }

    public getContainedText(){
        return this.dataList.filter((data, i, arr)=>{
            return data.content.length > 0
        }).map((data, i, arr)=>{
            return data.content
        })
    }

    private isGraphShapeValid(){
        return this.ruleType == 3 || !this.getContainedText().length
    }


    /**转换本地数据格式为存档数据格式, courseware_content  */
    public createCourseware_content(){
        return {
            //拆分图形数
            groupNum: this.graphCount,
            //图形所含块数
            groupSize: this.gridCount,
            //网格类型
            problemType: this.gridType == 1 ? 'square' : 'triangle',
            //规则类型
            problemRule: this.ruleType,
            //选中的格子
            graph: this.convertDataListToGraph(this.dataList),
            //key
            CoursewareKey: ConstValue.CoursewareKey,
        }
    }

    /**根据存档数据还原本地数据 */
    public revertDataByCourseware_content(data:any){
        this.graphCount = data.groupNum
        this.gridCount = data.groupSize
        this.gridType = data.problemType == 'square' ? 1 : 2
        this.ruleType = data.problemRule
        this.dataList = this.convertGraphToDataList(data.graph)
    }

    public convertDataListToGraph(dataList:DataGrid[]){
        let graph = []
        for(let i = 0; i < dataList.length; i++){
            let data = dataList[i]
            if(data.isSelect){
                graph.push(data.toGraphUnit())
            }
        }
        return graph
    }

    public convertGraphToDataList(graph:Array<any>){
        let dataList:DataGrid[] = []

        let map = {}
        graph.forEach((obj, i, arr)=>{
            if(!map[obj.pos.i]) map[obj.pos.i] = {};
            map[obj.pos.i][obj.pos.j] = obj.text ? obj.text : '';
        })

        let totalCount = this.gridType == 1 ? this.ConfigRect.MaxRow * this.ConfigRect.MaxCol :
        this.ConfigTriangle.MaxRow * this.ConfigTriangle.MaxCol

        for(let i = 1; i <= totalCount; i++){
            let data = new DataGrid()
            data.gridType = this.gridType
            data.index = dataList.length
            dataList.push(data)

            let mi = data.getRow() - 1
            let mj = data.getCol() - 1
            if(map[mi] && !Tools.isNullOrUndefined(map[mi][mj])){
                data.isSelect = true
                data.content = map[mi][mj]
            }
        }

        return dataList
    }
}