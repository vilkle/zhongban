import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import {ConstValue} from "../../Data/ConstValue"
import { DaAnData } from "../../Data/DaAnData";
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "./UploadAndReturnPanel";
import { UIHelp } from "../../Utils/UIHelp";
import { AudioManager } from "../../Manager/AudioManager";
import { OverTips } from "../Item/OverTips";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {
    @property(cc.Node)
    private bg: cc.Node = null
    @property(cc.Node)
    private bg1: cc.Node = null
    @property(cc.Node)
    private bg2: cc.Node = null
    @property(cc.Node)
    private title: cc.Node = null
    @property(cc.Node)
    private checkpoint: cc.Node = null
    @property(cc.Node)
    private a: cc.Node = null
    @property(cc.Node)
    private b: cc.Node = null
    @property(cc.Node)
    private c: cc.Node = null
    @property(cc.SpriteFrame)
    private title1: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private title2: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private title3: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private title4: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private title5: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private title6: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private R1: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private R2: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private R3: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private R4: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private R5: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private R6: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private kaola: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private eyu: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private ciwei: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private houzi: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private wugui: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private yanshu: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private meihualu: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private tuzi: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private huanxiong: cc.SpriteFrame = null
    @property(cc.Node)
    private shou: cc.Node = null
    private shouOver: boolean = false
    private touchEnable: boolean = false
    private timeoutIdArr: number[] = []
    private touchTarget: any = null
    private levelNum: number = 0
    private isOver: number = 4
    private eventvalue = {
        isResult: 1,
        isLevel: 1,
        levelData: [
           
        ],
        result: 4
    }

    protected static className = "GamePanel";

    onLoad() {
        if(ConstValue.IS_TEACHER) {
            DaAnData.getInstance().submitEnable = true
            UIManager.getInstance().openUI(UploadAndReturnPanel, null, 212)
        }else {
            this.getNet()
        }
        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, null);
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isOver != 1) {
                this.isOver = 2;
                this.eventvalue.result = 2;
                this.eventvalue.levelData[this.levelNum].result = 2
            }
        })
        this.title.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(!this.touchEnable) {
                return
            }
            this.shou.opacity = 0
            this.playSound(this.getSoundStr(this.levelNum))
            this.title.scale = 0.9
            this.title.stopAllActions();
        })
        this.title.on(cc.Node.EventType.TOUCH_END, (e)=>{
            if(!this.touchEnable) {
                return
            }
            this.title.scale = 1
        })
        this.title.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
            if(!this.touchEnable) {
                return
            }
            this.title.scale = 1
        })

        this.addData(6)
        this.eventvalue.levelData[0].answer = 'A'
        this.eventvalue.levelData[1].answer = 'B'
        this.eventvalue.levelData[2].answer = 'C'
        this.eventvalue.levelData[3].answer = 'B'
        this.eventvalue.levelData[4].answer = 'C'
        this.eventvalue.levelData[5].answer = 'A'
       
    }

    getSoundStr(levelNum: number) {
        let str: string = ''
        switch(levelNum) {
            case 0:
                str = '2'
                break
            case 1:
                str = '3'
                break
            case 2:
                str = '4'
                break
            case 3:
                str = '5'
                break
            case 4:
                str = '6'
                break
            case 5:
                str = '7'
                break
            default:
                break
        }
        return str
    }

    playSound(str: string, func?: Function) {
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound(str, false, 1, null, func)
    }

    start() {
        this.playSound('1', ()=>{this.round1()})
        this.addListenerOnOption([this.a, this.b, this.c])
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        
    }

    hint() {
        let id = setTimeout(() => {
            this.shouOver = false
            this.shou.opacity = 255
            this.shou.scale = 0
            let scaleto1 = cc.scaleTo(0.5, 1)
            let func1 = cc.callFunc(()=>{
                let down = cc.scaleTo(0.2, 0.9)
                let up = cc.scaleTo(0.1, 1)
                let speed = up.easing(cc.easeIn(0.3))
                let func = cc.callFunc(()=>{
                    console.log("---------play sound")
                    this.playSound(this.getSoundStr(this.levelNum))
                    let scaleto2 = cc.scaleTo(0.4, 0)
                    let func2 = cc.callFunc(()=>{
                        this.shou.opacity = 0
                        this.touchEnable = true
                        this.openOption()
                    })
                    let seq2 = cc.sequence(cc.delayTime(2.5),scaleto2, func2)
                    this.shou.runAction(seq2) 
                })
                let seq = cc.sequence(cc.delayTime(0.5), down, speed, func)
                this.title.runAction(seq)
                let track = this.shou.getComponent(sp.Skeleton).setAnimation(1, 'click', false)
              
              
            })
            let seq1 = cc.sequence(scaleto1,  func1)
            this.shou.runAction(seq1)
            
            let index = this.timeoutIdArr.indexOf(id)
            this.timeoutIdArr.splice(index, 1)
        }, 500);
        this.timeoutIdArr.push(id)
        
    }

    openOption() {
        this.a.active = true
        this.b.active = true
        this.c.active = true
        this.a.opacity = 0
        this.b.opacity = 0
        this.c.opacity = 0
        this.a.stopAllActions()
        this.b.stopAllActions()
        this.c.stopAllActions()
        this.a.runAction(cc.fadeIn(0.5))
        this.b.runAction(cc.fadeIn(0.5))
        this.c.runAction(cc.fadeIn(0.5))
    }

    closeOption() {
        this.a.active = false
        this.b.active = false
        this.c.active = false
    }

    round1() {
        this.bg1.active = true
        this.bg1.getChildByName('round1').active = true
        this.bg1.getChildByName('round2').active = false
        this.bg1.getChildByName('round3').active = false
        this.bg2.active = false
        let id = setTimeout(() => {
            let anim = this.bg1.getChildByName('round1').getChildByName('men').getComponent(cc.Animation)
            anim.play('door')
            anim.on('finished',  ()=>{this.hint()},    this)
            clearTimeout(id)
            let index = this.timeoutIdArr.indexOf(id)
            this.timeoutIdArr.splice(index, 1)
        }, 500);
        this.timeoutIdArr.push(id)
        this.title.getComponent(cc.Sprite).spriteFrame = this.title1
        this.checkpoint.getChildByName('num').getComponent(cc.Sprite).spriteFrame = this.R1  
        this.resetOption(this.huanxiong, this.tuzi, this.wugui)
    }

    round2() {
        this.bg1.active = true
        this.bg1.getChildByName('round1').active = false
        this.bg1.getChildByName('round2').active = true
        this.bg1.getChildByName('round3').active = false
        this.bg2.active = false
        let id = setTimeout(() => {
            let anim = this.bg1.getChildByName('round2').getChildByName('men').getComponent(cc.Animation)
            anim.play('door')
            anim.on('finished',  ()=>{this.hint()},    this)
            clearTimeout(id)
            let index = this.timeoutIdArr.indexOf(id)
            this.timeoutIdArr.splice(index, 1)
        }, 500);
        this.timeoutIdArr.push(id)
        this.title.getComponent(cc.Sprite).spriteFrame = this.title2
        this.checkpoint.getChildByName('num').getComponent(cc.Sprite).spriteFrame = this.R2
        this.resetOption(this.kaola, this.eyu, this.ciwei)
    }

    round3() {
        this.bg1.active = true
        this.bg1.getChildByName('round1').active = false
        this.bg1.getChildByName('round2').active = false
        this.bg1.getChildByName('round3').active = true
        this.bg2.active = false
        let id = setTimeout(() => {
            let anim = this.bg1.getChildByName('round3').getChildByName('men').getComponent(cc.Animation)
            anim.play('door')
            anim.on('finished',  ()=>{this.hint()},    this)
            clearTimeout(id)
            let index = this.timeoutIdArr.indexOf(id)
            this.timeoutIdArr.splice(index, 1)
        }, 500);
        this.timeoutIdArr.push(id)
        this.title.getComponent(cc.Sprite).spriteFrame = this.title3
        this.checkpoint.getChildByName('num').getComponent(cc.Sprite).spriteFrame = this.R3      
        this.resetOption(this.houzi, this.wugui, this.yanshu)
    }

    round4() {
        this.bg2.active = true
        this.bg2.getChildByName('round1').active = true
        this.bg2.getChildByName('round2').active = false
        this.bg2.getChildByName('round3').active = false
        this.bg1.active = false
        let id = setTimeout(() => {
            let anim = this.bg2.getChildByName('round1').getChildByName('curtain').getComponent(cc.Animation)
            anim.play('curtain')
            anim.on('finished',  ()=>{this.hint()},    this)
            clearTimeout(id)
            let index = this.timeoutIdArr.indexOf(id)
            this.timeoutIdArr.splice(index, 1)
        }, 500);
        this.timeoutIdArr.push(id)
        this.title.getComponent(cc.Sprite).spriteFrame = this.title4
        this.checkpoint.getChildByName('num').getComponent(cc.Sprite).spriteFrame = this.R4
        this.resetOption(this.meihualu, this.eyu, this.tuzi)
    }

    round5() {
        this.bg2.active = true
        this.bg2.getChildByName('round1').active = false
        this.bg2.getChildByName('round2').active = true
        this.bg2.getChildByName('round3').active = false
        this.bg1.active = false
        let id = setTimeout(() => {
            let anim = this.bg2.getChildByName('round2').getChildByName('curtain').getComponent(cc.Animation)
            anim.play('curtain')
            anim.on('finished',  ()=>{this.hint()},    this)
            clearTimeout(id)
            let index = this.timeoutIdArr.indexOf(id)
            this.timeoutIdArr.splice(index, 1)
        }, 500);
        this.timeoutIdArr.push(id)
        this.title.getComponent(cc.Sprite).spriteFrame = this.title5
        this.checkpoint.getChildByName('num').getComponent(cc.Sprite).spriteFrame = this.R5
        this.resetOption(this.tuzi, this.kaola, this.huanxiong)
    }
   
    round6() {
        this.bg2.active = true
        this.bg2.getChildByName('round1').active = false
        this.bg2.getChildByName('round2').active = false
        this.bg2.getChildByName('round3').active = true
        this.bg1.active = false
        let id = setTimeout(() => {
            let anim = this.bg2.getChildByName('round3').getChildByName('curtain').getComponent(cc.Animation)
            anim.play('curtain')
            anim.on('finished',  ()=>{this.hint()},    this)
            clearTimeout(id)
            let index = this.timeoutIdArr.indexOf(id)
            this.timeoutIdArr.splice(index, 1)
        }, 500);
        this.timeoutIdArr.push(id)
        this.title.getComponent(cc.Sprite).spriteFrame = this.title6
        this.checkpoint.getChildByName('num').getComponent(cc.Sprite).spriteFrame = this.R6
        this.resetOption(this.yanshu, this.kaola, this.meihualu)
    }

    resetOption(frame1: cc.SpriteFrame, frame2: cc.SpriteFrame, frame3: cc.SpriteFrame) {
        this.a.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = frame1
        this.a.getChildByName('box').active = false
        this.a.getChildByName('wrong').active = false
        this.b.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = frame2
        this.b.getChildByName('box').active = false
        this.b.getChildByName('wrong').active = false
        this.c.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = frame3
        this.c.getChildByName('box').active = false
        this.c.getChildByName('wrong').active = false
    }

    nextRound() {
       switch(this.levelNum){
            case 0:
                this.round1()
                break
            case 1:
                this.round2()
                break
            case 2:
                this.round3()
                break
            case 3:
                this.round4()
                break
            case 4:
                this.round5()
                break
            case 5:
                this.round6()
                break
            default:
                break
       }
       
    }

    success() {
        UIHelp.showOverTip(2, '你真棒，等等还没做完的同学吧。', '', null, null, '闯关成功')
    }

    addListenerOnTitle() {

    }

    addListenerOnOption(OptionArr: cc.Node[]) {
        for(let i = 0; i < OptionArr.length; ++i) {
            let node = OptionArr[i]
            node.on(cc.Node.EventType.TOUCH_START, (e)=>{
                if(this.touchTarget || !this.touchEnable) {
                    return
                }
                if(node.getChildByName('wrong').active) {
                    return
                }
                this.touchTarget = e.target
                for(let j = 0; j < OptionArr.length; ++j) {
                    let activity = OptionArr[j].getChildByName('box').active
                    if(j == i) {
                        if(activity) {
                            OptionArr[j].getChildByName('box').active = false
                        }else {
                            OptionArr[j].getChildByName('box').active = true
                        }
                    }else {
                        OptionArr[j].getChildByName('box').active = false
                    }
                }
                let select: string = ''
                if(i == 0) {
                    select = 'A'
                }else if(i == 1) {
                    select = 'B'
                }else if(i == 2) {
                    select = 'C'
                }
                this.isOver = 2
                this.eventvalue.result = 2
                this.eventvalue.levelData[this.levelNum].result = 2
                this.eventvalue.levelData[this.levelNum].subject = select
                if(select == this.eventvalue.levelData[this.levelNum].answer) {
                    this.eventvalue.levelData[this.levelNum].result = 1
                    this.touchEnable = false
                    if(this.levelNum < 5) {
                        this.levelNum++
                        UIHelp.showOverTip(1, '答对了', '下一关', ()=>{this.nextRound(); this.closeOption()}, null, '')
                    }else {
                        this.isOver = 1
                        this.eventvalue.result = 1
                        DataReporting.isRepeatReport = false
                        DataReporting.getInstance().dispatchEvent('addLog', {
                            eventType: 'clickSubmit',
                            eventValue: JSON.stringify(this.eventvalue)
                        })
                        this.success()        
                    }
                }else {
                    AudioManager.getInstance().playSound('sfx_tone2')
                    OptionArr[i].getChildByName('wrong').active = true
                }
                console.log(this.eventvalue)
            })
            node.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
                if(e.target != this.touchTarget) {
                    return
                }

            })
            node.on(cc.Node.EventType.TOUCH_END, (e)=>{
                if(e.target != this.touchTarget) {
                    return
                }
                this.touchTarget = null
            })
            node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                if(e.target != this.touchTarget) {
                    return
                }
                this.touchTarget = null
            })
        }
    }

    addData(len: number) {
        for(let i = 0; i < len; ++i) {
            this.eventvalue.levelData.push({
                answer: null,
                subject: null,
                result: 4
            })
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
        for(let i = 0; i < this.timeoutIdArr.length; ++i) {
            clearTimeout(this.timeoutIdArr[i])
        }
        this.timeoutIdArr = []
    }

    onShow() {
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
                    
                }
            } else {
                
            }
        }.bind(this), null);
    }
}
