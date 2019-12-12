import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import {ConstValue} from "../../Data/ConstValue"
import { DaAnData } from "../../Data/DaAnData";
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "./UploadAndReturnPanel";
import { UIHelp } from "../../Utils/UIHelp";
import { AudioManager } from "../../Manager/AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    @property(cc.Node)
    private bg: cc.Node = null
    @property(cc.Node)
    private labaBoundingBox: cc.Node = null
    @property(sp.Skeleton)
    private laba: sp.Skeleton = null
    @property(cc.Node)
    private chooseNode: cc.Node = null
    @property(cc.Node)
    private hand: cc.Node = null 
    @property(cc.Node)
    private passerbyA: cc.Node = null
    @property(cc.Node)
    private passerbyB: cc.Node = null
    @property(cc.Node)
    private passerbyC: cc.Node = null
    @property(cc.Node)
    private touchNode: cc.Node = null
    @property(cc.Node)
    private customer1: cc.Node = null
    @property(cc.Node)
    private customer2: cc.Node = null
    @property(cc.Node)
    private customer3: cc.Node = null
    private touchTarget: any = null
    private passerbyArr: cc.Node[] = []
    private isOver: number = 0
    private checkpointNum: number = 0
    private timeOutId: number = null
    private touchMove: boolean = false
    private eventvalue = {
        isResult: 1,
        isLevel: 0,
        levelData: [
            {
                subject: [null, null, null],
                answer: ['A', 'C', 'B'],
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
            this.initGame()
        }else {
            this.getNet()
        }
        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, null);
      
    }

    initGame() {
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isOver != 1) {
                this.isOver = 2;
                this.eventvalue.result = 2;
                this.eventvalue.levelData[0].result = 2
            }
        })
        this.timeOutId = setTimeout(() => {
            this.laba.addAnimation(0, 'speak', true)
            AudioManager.getInstance().playSound('title', false, 1, null, ()=>{
                this.laba.setAnimation(0, 'null', true)
            })
            clearTimeout(this.timeOutId)
            this.timeOutId = null
        }, 500);
        this.labaBoundingBox.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.timeOutId) {
                clearTimeout(this.timeOutId)
            }
            this.laba.setAnimation(0, 'click', false)
            this.laba.addAnimation(0, 'speak', true)
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('title', false, 1, null, ()=>{
                this.laba.setAnimation(0, 'null', true)
            })
        })
        this.passerbyArr[0] = this.passerbyA
        this.passerbyArr[1] = this.passerbyB
        this.passerbyArr[2] = this.passerbyC
        this.addListenerOnPasserby()
    }

    playSound(str: string) {
        if(this.timeOutId) {
            clearTimeout(this.timeOutId)
        }
        this.laba.setAnimation(0, 'null', true)
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound(str, false)
    }

    start() {
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
    }

    addData() {
        // for(let i = 0; i < this.checkpointNum; i++) {
        //     this.eventvalue.levelData.push({
        //         answer: null,
        //         subject: null,
        //         result: 4
        //     })
        // }
    }

    addListenerOnPasserby() {
        for(let i = 0; i < this.passerbyArr.length; ++i) {
            let node = this.passerbyArr[i]
            node.on(cc.Node.EventType.TOUCH_START, (e)=>{
                if(this.touchTarget || e.target.opacity == 0) {
                    return
                }
                this.playSound('sfx_select1')
                this.touchTarget = e.target
                this.touchNode.active = true
                this.touchNode.getComponent(sp.Skeleton).skeletonData = e.target.getComponent(sp.Skeleton).skeletonData
                let spine = this.touchNode.getComponent(sp.Skeleton)
                if(i == 0) {
                    spine.setAnimation(0, 'a1', true)
                }else if(i == 1) {
                    spine.setAnimation(0, 'b1', true)
                }else if(i == 2) {  
                    spine.setAnimation(0, 'c1', true)
                }
                e.target.opacity = 0
                let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                //pos = cc.v2(pos.x, pos.y - e.target.height / 2)
                pos = node.getPosition()
                this.touchNode.setPosition(pos)
            })
            node.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
                if(this.touchTarget != e.target) {
                    return
                }
                // let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                // pos = pos = cc.v2(pos.x, pos.y - this.touchNode.height / 2)
                let deltaPos = e.getDelta()
                let lastPos = this.touchNode.getPosition()
                let pos = cc.v2(lastPos.x + deltaPos.x, lastPos.y + deltaPos.y)
                this.touchMove = true
                this.touchNode.setPosition(pos)
                let chooseArr = this.chooseNode.children
                let chooseIndex: number = null
                for(let n = 0; n < chooseArr.length; ++n) {
                    if(chooseArr[n].getBoundingBox().contains(this.chooseNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                        chooseArr[n].getChildByName('box').active = true
                        chooseIndex = n
                    }
                    if(n == chooseArr.length - 1) {
                        for(let j = 0; j < chooseArr.length; ++j) {
                            if(j != chooseIndex) {
                                chooseArr[j].getChildByName('box').active = false
                            }
                        }
                    }
                }

            })
            node.on(cc.Node.EventType.TOUCH_END, (e)=>{
                if(this.touchTarget != e.target) {
                    return
                }
                console.log(e.getDelta().x, e.getDelta().y)
                if(!this.touchMove) {
                    if(i == 0) {
                        this.playSound('我和C分别进了两家相邻的店')
                    }else if(i == 1) {
                        this.playSound('我也和C分别进了两家相邻的店')
                    }else if(i == 2) {
                        this.playSound('A不吃火锅')
                    }
                }
                this.touchMove = false
                this.touchNode.active = false
                this.touchTarget = null
                e.target.opacity = 255
                let chooseArr = this.chooseNode.children
                for(let j = 0; j < chooseArr.length; ++j) {
                    chooseArr[j].getChildByName('box').active = false
                }

            })
            node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                if(this.touchTarget != e.target) {
                    return
                }
                this.touchMove = false
                let index: string = ''
                if(i == 0) {
                    index = 'A'
                }else if(i== 1) {
                    index = 'B'
                }else if(i == 2) {
                    index = 'C'
                }
                let right: boolean = false
                let chooseArr = this.chooseNode.children
                for(let i = 0; i < chooseArr.length; ++i) {
                    if(chooseArr[i].getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                        if(i == 0 && !this.customer1.active && index == 'A') {  
                            this.playSound('sfx_tone1')
                            this.playSound('被你发现了')  
                            this.customer1.active = true
                            this.customer1.getComponent(sp.Skeleton).skeletonData = this.touchNode.getComponent(sp.Skeleton).skeletonData
                            this.customer1.getComponent(sp.Skeleton).setAnimation(0, 'a1', true)
                            this.eventvalue.levelData[0].subject[i] = index
                            right = true
                        }else if(i == 1 && !this.customer2.active && index == 'C') {
                            this.playSound('sfx_tone1')
                            this.playSound('被你发现了')  
                            this.customer2.active = true
                            this.customer2.getComponent(sp.Skeleton).skeletonData = this.touchNode.getComponent(sp.Skeleton).skeletonData
                            this.customer2.getComponent(sp.Skeleton).setAnimation(0, 'c1', true)
                            this.eventvalue.levelData[0].subject[i] = index
                            right = true
                        }else if(i == 2 && !this.customer3.active && index == 'B') {
                            this.playSound('sfx_tone1')
                            this.playSound('被你发现了')  
                            this.customer3.active = true
                            this.customer3.getComponent(sp.Skeleton).skeletonData = this.touchNode.getComponent(sp.Skeleton).skeletonData
                            this.customer3.getComponent(sp.Skeleton).setAnimation(0, 'b1', true)
                            this.eventvalue.levelData[0].subject[i] = index
                            right = true
                        }else {
                            this.playSound('sfx_tone2')
                            this.playSound('我不在这')
                            right = false
                        }
                    }
                }
                if(!right) {
                    e.target.opacity = 255
                }
                this.touchNode.active = false
                this.touchTarget = null
                this.eventvalue.result = 2
                this.eventvalue.levelData[0].result = 2
                this.isOver = 2
                if(this.isSuccess()) {
                    this.eventvalue.result = 1
                    this.eventvalue.levelData[0].result = 1
                    this.isOver = 1
                    DataReporting.getInstance().dispatchEvent('addLog', {
                        eventType: 'clickSubmit',
                        eventValue: JSON.stringify(this.eventvalue)
                    })
                    this.customer1.getComponent(sp.Skeleton).setAnimation(0, 'a2', false)
                    this.customer2.getComponent(sp.Skeleton).setAnimation(0, 'c2', false)
                    this.customer3.getComponent(sp.Skeleton).setAnimation(0, 'b2', false)
                    this.customer3.getComponent(sp.Skeleton).setCompleteListener(trackEntry=>{
                        if(trackEntry.animation.name == 'b2') {
                            UIHelp.showOverTip(2, '你真棒，等等还没做完的同学吧。',null, '挑战成功')
                        }
                    })  
                }
                for(let j = 0; j < chooseArr.length; ++j) {
                    chooseArr[j].getChildByName('box').active = false
                }
            })


        }
    }

    isSuccess(): boolean {
        let answer = this.eventvalue.levelData[0].answer
        let subject = this.eventvalue.levelData[0].subject
        let rightNum = 0
        for(let i = 0; i < subject.length; ++i) {
            if(subject[i] == answer[i]) {
                rightNum++
            }
        }   
        if(rightNum == answer.length) {
            return true
        }else {
            return false
        }
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
        if(this.timeOutId) {
            clearTimeout(this.timeOutId)
        }
    }

    onShow() {
    }

    getNet() {
        NetWork.getInstance().httpRequest(NetWork.GET_QUESTION + "?courseware_id=" + NetWork.courseware_id, "GET", "application/json;charset=utf-8", function (err, response) {
            if (!err) {
                let response_data = response;
                this.initGame()
                if (Array.isArray(response_data.data)) {
                    return;
                }
                let content = JSON.parse(response_data.data.courseware_content);
                if (content != null) {
                    
                }
            } else {
                
            }
        }.bind(this), null);
    }
}
