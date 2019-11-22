import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import { UIHelp } from "../../Utils/UIHelp";
import { AudioManager } from "../../Manager/AudioManager";
import { ConstValue } from "../../Data/ConstValue";
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "./UploadAndReturnPanel";
import { DaAnData } from "../../Data/DaAnData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    @property (cc.Node)
    private bg:cc.Node = null;
    @property([cc.Node])
    private nodeArr: cc.Node[] = []
    @property(cc.Node)
    private grid: cc.Node = null
    @property(cc.Node)
    private touchNode: cc.Node = null
    @property(sp.Skeleton)
    private dolphins: sp.Skeleton = null
    @property(sp.Skeleton)
    private boy: sp.Skeleton = null
    @property(sp.Skeleton)
    private shell: sp.Skeleton = null
    @property(cc.Node)
    private labaBoundingBox: cc.Node = null
    @property(sp.Skeleton)
    private laba: sp.Skeleton = null
    private answerArr: number[] = [1,2,3,6,1,2,6,6,1]
    private subjectArr: number[] = [6,6,6,6,6,6,6,6,6]
    private blingArr: number[] = []
    private touchEnable: boolean = true
    private touchTarget: any = null
    private overNum: number = 0
    private wrongNum: number = 0
    private isOver : number = 0;
    private eventvalue = {
        isResult: 1,
        isLevel: 0,
        levelData: [
            {
                subject: [6,6,6,6,6,6,6,6,6],
                answer: [1,2,3,6,1,2,6,6,1],
                result: 4
            }
        ],
        result: 4
    }

    protected static className = "GamePanel";

    onLoad() {
        if(ConstValue.IS_TEACHER) {
            DaAnData.getInstance().submitEnable = true
            UIManager.getInstance().openUI(UploadAndReturnPanel, null, 212)
        }
        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, null);
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isOver != 1) {
                this.isOver = 2;
                this.eventvalue.result = 2;
                this.eventvalue.levelData[0].result = 2
            }
        })
        this.labaBoundingBox.on(cc.Node.EventType.TOUCH_START, (e)=>{
            this.laba.setAnimation(0, 'click', false)
            this.laba.addAnimation(0, 'speak', true)
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('title', false, 1, null, ()=>{
                this.laba.setAnimation(0, 'null', true)
            })
        })
        for(let i = 0; i < this.nodeArr.length; ++i) {
            this.addListenerOnItem(this.nodeArr[i])
        }
    }

    start() {
        let id = setTimeout(() => {
            this.laba.addAnimation(0, 'speak', true)
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('title', false, 1, null, ()=>{
                this.laba.setAnimation(0, 'null', true)
            })
            clearTimeout(id)
        }, 500);
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
    }

    onEndGame() {
        //如果已经上报过数据 则不再上报数据
        if (DataReporting.isRepeatReport) {
            DataReporting.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify(this.eventvalue)
            });
            DataReporting.isRepeatReport = false;
        }
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: this.isOver });
    }

    onDestroy() {

    }

    onShow() {
    }

    setPanel() {
        
    }

    getIndex(spriteframe: cc.SpriteFrame): number {
        switch(spriteframe) {
            case this.nodeArr[0].getComponent(cc.Sprite).spriteFrame:
                return 1
                break
            case this.nodeArr[1].getComponent(cc.Sprite).spriteFrame:
                return 2
                break
            case this.nodeArr[2].getComponent(cc.Sprite).spriteFrame:
                return 3
                break
            default:
                console.error('error in getIndex')
                return 0
                break
        }
    }

    addListenerOnItem(node: cc.Node) {
        node.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.touchTarget||e.target.opacity==0||!this.touchEnable) {
                return
            }
            if(this.blingArr.length > 0) {
                this.wrongNum = 0
                for (const key in this.blingArr) {
                    let node = this.grid.children[this.blingArr[key]]
                    node.opacity = 0
                    node.stopAllActions()
                }
                this.blingArr = []
            }
            this.touchTarget = e.target
            this.touchNode.active = true
            this.touchNode.getComponent(cc.Sprite).spriteFrame = e.target.getComponent(cc.Sprite).spriteFrame
            var point = this.node.convertToNodeSpaceAR(e.currentTouch._point);
            this.touchNode.setPosition(point);
        })
        node.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
            if(this.touchTarget != e.target) {
                return
            }
            var point = this.node.convertToNodeSpaceAR(e.currentTouch._point)
            this.touchNode.setPosition(point)
            let gridArr = this.grid.children
            for(let i = 0; i < gridArr.length; ++i) {
                if(gridArr[i].getBoundingBox().contains(this.grid.convertToNodeSpaceAR(e.currentTouch._point))) {
                    if(gridArr[i].opacity == 0 || gridArr[i].opacity == 70) {
                        gridArr[i].opacity = 70
                        gridArr[i].getComponent(cc.Sprite).spriteFrame = e.target.getComponent(cc.Sprite).spriteFrame
                        for (const key in gridArr) {
                            if(parseInt(key) !== i) {
                                if(gridArr[key].opacity !== 255) {
                                    gridArr[key].opacity = 0
                                }
                            }
                        }
                    }
                }else {
                    this.overNum++
                }
                if(i == gridArr.length - 1) {
                    if(this.overNum == gridArr.length) {
                        for (const key in gridArr) {
                            if(gridArr[key].opacity !== 255) {
                                gridArr[key].opacity = 0
                            }
                        }
                    }
                    this.overNum = 0
                }
            }
        })
        node.on(cc.Node.EventType.TOUCH_END, (e)=>{
            if(this.touchTarget != e.target) {
                return
            }
            let gridArr = this.grid.children
            for (const key in gridArr) {
                if(gridArr[key].opacity !== 255) {
                    gridArr[key].opacity = 0
                }
            }
            this.touchNode.active = false
            this.touchTarget = null
        })
        node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
            if(this.touchTarget != e.target) {
                return
            }
            let gridArr = this.grid.children
            for(let i = 0; i < gridArr.length; ++i) {
                if(gridArr[i].getBoundingBox().contains(this.grid.convertToNodeSpaceAR(e.currentTouch._point))) {
                    if(gridArr[i].opacity == 0 || gridArr[i].opacity == 70) {
                        let index = this.getIndex(e.target.getComponent(cc.Sprite).spriteFrame)
                        gridArr[i].opacity = 255
                        gridArr[i].getComponent(cc.Sprite).spriteFrame = e.target.getComponent(cc.Sprite).spriteFrame
                        if(this.answerArr[i] == index) {
                            this.isOver = 2
                            this.eventvalue.result = 2
                            this.eventvalue.levelData[0].result = 2
                            this.subjectArr[i] = this.answerArr[i]
                            this.eventvalue.levelData[0].subject = [...this.subjectArr]
                            console.log(this.eventvalue)
                            this.wrongNum = 0
                            this.boy.setAnimation(0, 'right', false)
                            this.boy.addAnimation(0,'right_Loop',false)
                            this.boy.addAnimation(0, 'Loop2Idle', false)
                            this.boy.addAnimation(0, 'idle', true)
                            AudioManager.getInstance().stopAll()
                            this.laba.setAnimation(0, 'null', true)
                            AudioManager.getInstance().playSound('right',false)
                            let rightNum = 0
                            for (const key in gridArr) {
                                if(gridArr[key].opacity==255) {
                                    rightNum++
                                }
                            }
                            if(rightNum==6) {
                                this.isOver = 1
                                this.eventvalue.result = 1
                                this.eventvalue.levelData[0].result = 1
                                console.log(this.eventvalue)
                                DataReporting.getInstance().dispatchEvent('addLog', {
                                    eventType: 'clickSubmit',
                                    eventValue: JSON.stringify(this.eventvalue)
                                });
                                UIHelp.showOverTip(2, '你真棒，等等还没做完的同学吧.', null, '挑战成功')
                            }
                        }else {
                            this.shakingshaking(gridArr[i])
                            this.dolphins.setAnimation(0,'false',false)
                            this.dolphins.addAnimation(0, 'idle', true)
                            this.boy.setAnimation(0, 'false', false)
                            this.boy.addAnimation(0, 'idle', true)
                            this.wrongNum++
                            AudioManager.getInstance().stopAll()
                            this.laba.setAnimation(0, 'null', true)
                            if(this.wrongNum < 3) {
                                AudioManager.getInstance().playSound('wrong')
                                AudioManager.getInstance().playSound('我不在这')
                            }else {
                                AudioManager.getInstance().playSound('wrong')
                                AudioManager.getInstance().playSound('我不在这', false, 1, null, ()=>{
                                    AudioManager.getInstance().playSound('再仔细观察一下啊')
                                })
                            }
                        }
                    }
                }
            }
            for (const key in gridArr) {
                if(gridArr[key].opacity !== 255) {
                    gridArr[key].opacity = 0
                }
            }
            this.touchNode.active = false
            this.touchTarget = null
        })
    }

    shakingshaking(node: cc.Node) {
        node.opacity = 255
        this.touchEnable = false
        let left = cc.moveBy(0.05, cc.v2(-20,0))
        let right = cc.moveBy(0.05, cc.v2(20,0))
        let func = cc.callFunc(()=>{
            node.opacity = 0
            if(this.wrongNum < 3) {
                this.touchEnable = true
            }else {
                this.touchEnable = true
                this.blingbling()
            }
        })
        let seq = cc.sequence(left, right, left, right, left, right, left, right, func)
        node.runAction(seq)
    }

    blingbling() {
        this.blingArr = []
        let gridArr = this.grid.children
        let blingNum = 0
        for (const it of [0,1,2,4,5,8]) {
            if(gridArr[it].opacity == 0) {
                blingNum++
            }
        }
        for(let i in gridArr) {
            if([0,1,2,4,5,8].indexOf(parseInt(i)) != -1) {
                if(gridArr[i].opacity == 0) {
                    let node = gridArr[i]
                    this.blingArr.push(parseInt(i))
                    node.getComponent(cc.Sprite).spriteFrame = this.getSpriteFrame(parseInt(i))
                    let fadein = cc.fadeIn(0.3)
                    let fadeout = cc.fadeOut(0.3)
                    let func = cc.callFunc(()=>{
                        this.wrongNum = 0
                        node.opacity = 0
                        let num = 0
                        for (const it of [0,1,2,4,5,8]) {
                            if(gridArr[it].opacity == 0) {
                                num++
                            }
                        }
                        if(num == blingNum) {
                            //this.touchEnable = true
                            this.blingArr = []
                        }
                    })
                    let seq = cc.sequence(fadein, fadeout, fadein, fadeout, fadein, fadeout, func)
                    node.runAction(seq)
                }
            }
        }
       
    }

    getSpriteFrame(index: number): cc.SpriteFrame {
        if(index == 0 || index == 4 || index == 8) {
            return this.nodeArr[0].getComponent(cc.Sprite).spriteFrame
        }else if(index == 1 || index == 5) {
            return this.nodeArr[1].getComponent(cc.Sprite).spriteFrame
        }else if(index == 2) {
            return this.nodeArr[2].getComponent(cc.Sprite).spriteFrame
        }

    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                let response_data = response;
                if (Array.isArray(response_data.data)) {
                    return;
                }
                let content = JSON.parse(response_data.data.courseware_content);
                if (content != null) {
                    this.setPanel();
                }
            } else {
                this.setPanel();
            }
        }.bind(this), null);
    }
}
