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
    private touchTarget: any = null
    private levelNum: number = 0
    private isOver: number = 4
    private eventvalue = {
        isResult: 1,
        isLevel: 0,
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
        this.addData(6)
        this.eventvalue.levelData[0].answer = 'A'
        this.eventvalue.levelData[1].answer = 'B'
        this.eventvalue.levelData[2].answer = 'C'
        this.eventvalue.levelData[3].answer = 'B'
        this.eventvalue.levelData[4].answer = 'C'
        this.eventvalue.levelData[5].answer = 'A'
       
    }

    playSound(str: string) {
      
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound(str, false)
    }

    start() {
        this.round1()
        this.addListenerOnOption([this.a, this.b, this.c])
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        
    }

    round1() {
        this.title.getComponent(cc.Sprite).spriteFrame = this.title1
        this.checkpoint.getChildByName('num').getComponent(cc.Sprite).spriteFrame = this.R1
        this.bg1.active = true
        this.bg1.getChildByName('round1').active = true
        this.bg1.getChildByName('round2').active = false
        this.bg1.getChildByName('round3').active = false
        this.bg2.active = false
        this.resetOption(this.huanxiong, this.tuzi, this.wugui)
    }

    round2() {
        this.title.getComponent(cc.Sprite).spriteFrame = this.title2
        this.checkpoint.getChildByName('num').getComponent(cc.Sprite).spriteFrame = this.R2
        this.bg1.active = true
        this.bg1.getChildByName('round1').active = false
        this.bg1.getChildByName('round2').active = true
        this.bg1.getChildByName('round3').active = false
        this.bg2.active = false
        this.resetOption(this.kaola, this.eyu, this.ciwei)
    }

    round3() {
        this.title.getComponent(cc.Sprite).spriteFrame = this.title3
        this.checkpoint.getChildByName('num').getComponent(cc.Sprite).spriteFrame = this.R3
        this.bg1.active = true
        this.bg1.getChildByName('round1').active = false
        this.bg1.getChildByName('round2').active = false
        this.bg1.getChildByName('round3').active = true
        this.bg2.active = false
        this.resetOption(this.houzi, this.wugui, this.yanshu)
    }

    round4() {
        this.title.getComponent(cc.Sprite).spriteFrame = this.title4
        this.checkpoint.getChildByName('num').getComponent(cc.Sprite).spriteFrame = this.R4
        this.bg2.active = true
        this.bg2.getChildByName('round1').active = true
        this.bg2.getChildByName('round2').active = false
        this.bg2.getChildByName('round3').active = false
        this.bg1.active = false
        this.resetOption(this.meihualu, this.eyu, this.tuzi)
    }

    round5() {
        this.title.getComponent(cc.Sprite).spriteFrame = this.title5
        this.checkpoint.getChildByName('num').getComponent(cc.Sprite).spriteFrame = this.R5
        this.bg2.active = true
        this.bg2.getChildByName('round1').active = false
        this.bg2.getChildByName('round2').active = true
        this.bg2.getChildByName('round3').active = false
        this.bg1.active = false
        this.resetOption(this.tuzi, this.kaola, this.huanxiong)
    }
   
    round6() {
        this.title.getComponent(cc.Sprite).spriteFrame = this.title6
        this.checkpoint.getChildByName('num').getComponent(cc.Sprite).spriteFrame = this.R6
        this.bg2.active = true
        this.bg2.getChildByName('round1').active = false
        this.bg2.getChildByName('round2').active = false
        this.bg2.getChildByName('round3').active = true
        this.bg1.active = false
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
            default:
                break
       }
       
    }

    addListenerOnOption(OptionArr: cc.Node[]) {
        for(let i = 0; i < OptionArr.length; ++i) {
            let node = OptionArr[i]
            node.on(cc.Node.EventType.TOUCH_START, (e)=>{
                if(this.touchTarget) {
                    return
                }
                if(node.getChildByName('wrong').active) {
                    return
                }
                this.touchTarget = e.target
                for(let j = 0; j < OptionArr.length; ++j) {
                    let activity = OptionArr[j].getChildByName('box').active
                    if(activity) {
                        activity = false
                    }else {
                        activity = true
                    }
                    
                }
                

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
