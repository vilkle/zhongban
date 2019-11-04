import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import SubmissionPanel from "./SubmissionPanel";
import { NetWork } from "../../Http/NetWork";
import { UIHelp } from "../../Utils/UIHelp";
import { DaAnData } from "../../Data/DaAnData";
import GamePanel from "./GamePanel";
import {ListenerManager} from "../../Manager/ListenerManager";
import {ListenerType} from "../../Data/ListenerType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TeacherPanel extends BaseUI {
    protected static className = "TeacherPanel";
    @property(cc.Prefab)
    private itemPrefab: cc.Prefab = null
    @property([cc.Toggle])
    private toggleContainer: cc.Toggle[] = []
    @property(cc.Node)
    private gridNode: cc.Node = null 
    @property(cc.Node)
    private node1: cc.Node = null
    @property(cc.Node)
    private node2: cc.Node = null
    @property(cc.Node)
    private materialNode: cc.Node = null
    @property(cc.Node)
    private pointNode: cc.Node = null
    @property(cc.Node)
    private layout: cc.Node = null
    @property(cc.Label)
    private label: cc.Label = null
    private graphics: cc.Graphics = null
    private type: number = 0;
    private itemArr: number[] = []
    private itemNodeArr: cc.Node[] = []
    private touchTarget: any = null

    // onLoad () {}

    start() {                                   
        this.type = 3
        this.getNet();
    }

    setPanel() {//设置教师端界面
        switch(this.type) {
            case 1:
                this.toggleContainer[0].isChecked = true
                this.setNode(4)
                break
            case 2:
                this.toggleContainer[1].isChecked = true
                this.setNode(5)
                break
            case 3:
                this.toggleContainer[2].isChecked = true
                this.setNode(6)
                break
            default:
                console.error('there is a erro on toggle setting.')
                break
        }
    }

    setNode(num: number) {
        this.node1.removeAllChildren()
        let lenth = num * 105 + (num + 1) * 3 + num - 1
        this.node1.width = lenth
        let black = this.node2.getChildByName('item')
        let white = black.getChildByName('bg')
        black.width = lenth + 6
        black.height = lenth + 6
        white.width = lenth
        white.height = lenth
        white.x = 3
        white.y = -3
        this.gridNode.height = lenth
        for(let i = 0; i < num * num; ++i) {
            let node = cc.instantiate(this.itemPrefab)
            this.node1.addChild(node)
            this.itemNodeArr[i] = node
            this.addListenerOnItem(node)
        }
    }

    addListenerOnItem(item: cc.Node) {
        item.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.touchTarget) {
                return
            }
            this.touchTarget = e.target

        })
        item.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
            
            if(item.getBoundingBox().contains(this.node1.convertToNodeSpaceAR(e.currentTouch._point))) {
                item.getChildByName('wb').color = cc.Color.GRAY
            }else {
                item.getChildByName('wb').color = cc.Color.WHITE
            }
        })
        item.on(cc.Node.EventType.TOUCH_END, (e)=>{
            if(e.target != this.touchTarget) {
                return
            }
            this.touchTarget = null
        })
        item.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
            if(e.target != this.touchTarget) {
                return
            }
            this.touchTarget = null
        })
    }

    drawOneRect(){
       
       
        let lineWidth = 2
        this.graphics.fillColor = cc.Color.GREEN
        this.graphics.lineWidth = lineWidth
        this.graphics.strokeColor = cc.Color.BLACK

        this.graphics.fillRect(0, 0, 105, 105)
        this.graphics.stroke()
    }

    onToggleContainer(toggle) {
        var index = this.toggleContainer.indexOf(toggle);
        switch(index) {
            case 0:
                this.type = 1;
                this.setNode(4)
                break
            case 1:
                this.type = 2;
                this.setNode(5)
                break
            case 2:
                this.type = 3;
                this.setNode(6)
                break
        }
    }

    pointOn(str: string) {
        this.pointNode.active = true
        this.layout.on(cc.Node.EventType.TOUCH_START, null)
        this.label.string = str
    }

    pointOff() {
        this.layout.off(cc.Node.EventType.TOUCH_START, null)
        this.pointNode.active = false
    }

    //上传课件按钮
    onBtnSaveClicked() {
        
        DaAnData.getInstance().type = this.type
        DaAnData.getInstance().itemArr = [...this.itemArr]
     
        UIManager.getInstance().showUI(GamePanel, () => {
            ListenerManager.getInstance().trigger(ListenerType.OnEditStateSwitching, {state: 1}); 
        });
    
    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_TITLE + "?title_id=" + NetWork.title_id, "GET", "application/json;charset=utf-8", function (err, response) {
            console.log("消息返回" + response);
            if (!err) {
                let res = response;
                if (Array.isArray(res.data)) {
                    this.setPanel();
                    return;
                }
                let content = JSON.parse(res.data.courseware_content);
                NetWork.courseware_id = res.data.courseware_id;
                if (NetWork.empty) {//如果URL里面带了empty参数 并且为true  就立刻清除数据
                    this.ClearNet();
                } else {
                    if (content != null) {
                        if(content.type) {
                            this.type = content.type
                        }else {
                            console.error('网络请求数据type为空。')
                        }
                        if(content.itemArr) {
                            this.itemArr = content.itemArr
                        }else {
                            console.error('网络请求数据itemArr为空。')
                        }  
                        this.setPanel();
                    } else {
                        this.setPanel();
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
}
