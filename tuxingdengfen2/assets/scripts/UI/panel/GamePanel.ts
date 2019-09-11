import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import { UIHelp } from "../../Utils/UIHelp";
import { AudioManager } from "../../Manager/AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {
    @property(cc.Node)
    private bg: cc.Node = null
    @property (cc.Node)
    private touchNode: cc.Node = null
    @property (cc.Node)
    private roundNode1: cc.Node = null
    @property (cc.Node)
    private roundNode2: cc.Node = null
    @property (cc.Node)
    private roundNode3: cc.Node = null
    @property (cc.Node)
    private optionNode: cc.Node = null
    @property (cc.Sprite)
    private titleNode: cc.Sprite = null
    @property (cc.SpriteFrame)
    private titleFrame1: cc.SpriteFrame = null
    @property (cc.SpriteFrame)
    private titleFrame2: cc.SpriteFrame = null
    @property (cc.SpriteFrame)
    private titleFrame3: cc.SpriteFrame = null
    private optionArr: cc.Node[] = []
    private answerArr: any[] = [4, 9, [8, 4]]
    private checkpoint: number = 1
    private roundNode: cc.Node = null
    private touchTarget: any = null
    private answer1: number = null
    private answer2: number = null
    private isOver : number = 0;
    private eventvalue = {
        isResult: 1,
        isLevel: 1,
        levelData: [

        ],
        result: 4
    }

    protected static className = "GamePanel";
    start() {
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        for(let i = 0; i < 3; ++i) {
            this.eventvalue.levelData.push({
                subject: 'null',
                answer: this.answerArr[i],
                result: 4
            })
        }
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isOver != 1) {
                this.isOver = 2;
                this.eventvalue.result = 2;
                this.eventvalue.levelData[this.checkpoint - 1].result = 2;
            }
        });
        this.optionArr = []
        for(let i = 0; i < this.optionNode.children.length; ++i) {
            this.optionArr[i] = this.optionNode.children[i]
        }
        this.round1()
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

    round1() {
        this.roundNode1.active = true
        this.roundNode2.active = false
        this.roundNode3.active = false
        this.roundNode = this.roundNode1
        this.titleNode.spriteFrame = this.titleFrame1
        this.answer1 = null
        this.answer2 = null
        this.removeListenerOnOption(this.optionArr)
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('二等分题目', false, 1, null, ()=>{
            this.addListenerOnOption(this.optionArr)
        })
    }

    round2() {
        this.roundNode1.active = false
        this.roundNode2.active = true
        this.roundNode3.active = false
        this.roundNode = this.roundNode2
        this.titleNode.spriteFrame = this.titleFrame2
        this.answer1 = null
        this.answer2 = null
        this.removeListenerOnOption(this.optionArr)
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('三等分题目', false, 1, null, ()=>{
            this.addListenerOnOption(this.optionArr)
        })
    }

    round3() {
        this.roundNode1.active = false
        this.roundNode2.active = false
        this.roundNode3.active = true
        this.roundNode = this.roundNode3
        this.titleNode.spriteFrame = this.titleFrame3
        this.answer1 = null
        this.answer2 = null
        this.eventvalue.levelData[2].subject = [null, null]
        this.removeListenerOnOption(this.optionArr)
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('四等分题目', false, 1, null, ()=>{
            this.addListenerOnOption(this.optionArr)
        })
    }

    nextCheckPoint() {
        this.checkpoint++
        switch(this.checkpoint) {
            case 1:
                this.round1()
                break
            case 2:
                this.round2()
                break
            case 3:
                this.round3()
                break
            default:
                break
        }
    

    }

    removeListenerOnOption(optionArr: cc.Node[]) {
        for(let i = 0; i < optionArr.length; ++i) {
            let node = this.optionArr[i]
            node.active = true
            node.opacity = 255
            node.off(cc.Node.EventType.TOUCH_START)
            node.off(cc.Node.EventType.TOUCH_MOVE)
            node.off(cc.Node.EventType.TOUCH_END)
            node.off(cc.Node.EventType.TOUCH_CANCEL)
        }
    }

    addListenerOnOption(optionArr: cc.Node[]) {
        for(let i = 0; i < this.optionArr.length; ++i) {
            let node = this.optionArr[i]
            node.on(cc.Node.EventType.TOUCH_START, (e)=> {
                if(this.touchTarget || e.target.opacity == 0) {
                    return
                }
                AudioManager.getInstance().playSound('dianji')
                this.touchTarget = e.target 
                this.touchNode.active = true
                e.target.opacity = 0
                this.touchNode.getComponent(cc.Sprite).spriteFrame = e.target.getComponent(cc.Sprite).spriteFrame
                let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                this.touchNode.setPosition(pos)
                this.isOver = 2
                this.eventvalue.result = 2
                this.eventvalue.levelData[this.checkpoint-1].result = 2
            })
            node.on(cc.Node.EventType.TOUCH_MOVE, (e)=> {
                if(this.touchTarget != e.target) {
                    return
                }
                let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                this.touchNode.setPosition(pos)
            })
            node.on(cc.Node.EventType.TOUCH_END, (e)=> {
                if(this.touchTarget != e.target) {
                    return
                }
                this.touchTarget = null
                e.target.opacity = 255
                this.touchNode.active = false
            })
            node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=> {
                if(this.touchTarget != e.target) {
                    return
                }
                let answerNode1 = this.roundNode.getChildByName('answerNode1')
                let answerNode2 = this.roundNode.getChildByName('answerNode2')
                let overNum = 0
                if(answerNode1) {
                    let bounding = answerNode1.getChildByName('bounding')
                    let sprite = answerNode1.getChildByName('sprite')
                    if(bounding.getBoundingBox().contains(answerNode1.convertToNodeSpaceAR(e.currentTouch._point))) {
                        if(this.isRight(this.checkpoint, i+3, 1)){
                            sprite.getComponent(cc.Sprite).spriteFrame = this.touchNode.getComponent(cc.Sprite).spriteFrame
                            this.touchNode.active = false
                            this.touchTarget = null
                            return
                        }else {
                            AudioManager.getInstance().playSound('wrong')
                            this.touchTarget = null
                            e.target.opacity = 255
                            this.touchNode.active = false
                        }
                        overNum++
                    }
                }
                if(answerNode2) {
                    let bounding = answerNode2.getChildByName('bounding')
                    let sprite = answerNode2.getChildByName('sprite')
                    if(bounding.getBoundingBox().contains(answerNode2.convertToNodeSpaceAR(e.currentTouch._point))) {
                        if(this.isRight(this.checkpoint, i+3, 2)){
                            sprite.getComponent(cc.Sprite).spriteFrame = this.touchNode.getComponent(cc.Sprite).spriteFrame
                            this.touchNode.active = false
                            this.touchTarget = null
                            return
                        }else {
                            AudioManager.getInstance().playSound('wrong')
                            this.touchTarget = null
                            e.target.opacity = 255
                            this.touchNode.active = false
                        }
                        overNum++
                    }
                }
                if(overNum == 0) {
                    AudioManager.getInstance().playSound('wrong')
                    this.touchTarget = null
                    e.target.opacity = 255
                    this.touchNode.active = false
                }
            })
        }
    }

    isRight(checkpoint: number, answerNum: number, optionNum?: number): boolean {
        if(checkpoint == 1) {
            if(answerNum == 4) {
                this.answer1 =  4
                this.eventvalue.levelData[checkpoint-1].result = 1
                this.eventvalue.levelData[checkpoint-1].subject = 4
                AudioManager.getInstance().playSound('right', false, 1, null, ()=>{
                    this.nextCheckPoint()
                })
                return true
            }else {
                return false
            }
        }else if(checkpoint == 2) {
            if(answerNum == 9) {
                this.answer1 = 9
                this.eventvalue.levelData[checkpoint-1].result = 1
                this.eventvalue.levelData[checkpoint-1].subject = 9
                AudioManager.getInstance().playSound('right', false, 1, null, ()=>{
                    this.nextCheckPoint()
                })
                return true
            }else {
                return false
            }
        }else if(checkpoint == 3) {
            if(answerNum == 8 && optionNum == 1) {
                this.answer1 = 8
                this.eventvalue.levelData[checkpoint-1].subject[0] = 8
                if(this.answer1 && this.answer2) {
                    this.eventvalue.levelData[checkpoint-1].result = 1
                    this.isOver = 1
                    this.eventvalue.result = 1
                    DataReporting.getInstance().dispatchEvent('addLog', {
                        eventType: 'clickSubmit',
                        eventValue: JSON.stringify(this.eventvalue)
                    });
                    console.log(this.eventvalue)
                    AudioManager.getInstance().playSound('right', false, 1, null, ()=>{
                        UIHelp.showOverTip(2, '闯关成功！', null, '闯关成功')
                    })  
                }else {
                    AudioManager.getInstance().playSound('right')
                }
                return true
            }else if(answerNum == 4 && optionNum == 2) {
                this.answer2 = 4
                this.eventvalue.levelData[checkpoint-1].subject[1] = 4
                if(this.answer1 && this.answer2) {
                    this.eventvalue.levelData[checkpoint-1].result = 1
                    this.isOver = 1
                    this.eventvalue.result = 1
                    DataReporting.getInstance().dispatchEvent('addLog', {
                        eventType: 'clickSubmit',
                        eventValue: JSON.stringify(this.eventvalue)
                    });
                    console.log(this.eventvalue)
                    AudioManager.getInstance().playSound('right', false, 1, null, ()=>{
                        UIHelp.showOverTip(2, '闯关成功！', null, '闯关成功')
                    })  
                }else {
                    AudioManager.getInstance().playSound('right')
                }
                return true
            }else {
                return false
            }
        }
    }

    onDestroy() {

    }

    onShow() {
    }

    setPanel() {
        
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
