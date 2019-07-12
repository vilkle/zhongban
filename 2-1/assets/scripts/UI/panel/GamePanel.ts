import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import { isString } from "../../collections/util";
import {AudioManager} from "../../Manager/AudioManager"
import {ConstValue} from "../../Data/ConstValue"
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "../panel/UploadAndReturnPanel"
import DataReporting from "../../Data/DataReporting";
import {UIHelp} from "../../Utils/UIHelp";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {
    @property(sp.Skeleton)
    private miya : sp.Skeleton = null;
    @property(sp.Skeleton)
    private leaf : sp.Skeleton = null;
    @property(sp.Skeleton)
    private piaochong : sp.Skeleton = null;
    @property(cc.Sprite)
    private a : cc.Sprite = null;
    @property(cc.Sprite)
    private b : cc.Sprite = null;
    @property(cc.Sprite)
    private c : cc.Sprite = null;
    @property(cc.SpriteFrame)
    private one :cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private two :cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private three :cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private four :cc.SpriteFrame = null;
    @property(cc.Node)
    private boundingbox :cc.Node = null;
    @property(cc.Node)
    private bg :cc.Node = null;
    private answerArr : Array<cc.Sprite> = Array<cc.Sprite>();
    private startPosArr : Array<cc.Vec2> = Array<cc.Vec2>();
    private checkpointNum : number = 0;
    private enableClick : boolean = false;
    private audioArr : Array<number> = Array<number>();
    private miyaSound : boolean = false;
    private isOver : number = 0;
    private touchNum : number = 0;
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
            UIManager.getInstance().openUI(UploadAndReturnPanel);
        }
        this.answerArr[0] = this.a;
        this.answerArr[1] = this.b;
        this.answerArr[2] = this.c;
        this.startPosArr[0] = this.a.node.getPosition();
        this.startPosArr[1] = this.b.node.getPosition();
        this.startPosArr[2] = this.c.node.getPosition();
        this.addListenerOnAnswer();
        this.piaochong.node.zIndex = 1;
        this.miya.setAnimation(0, 'in', false);
        this.miya.setCompleteListener(trackEntry=>{
            if(trackEntry.animation.name == 'in') {
                this.miya.setAnimation(0, 'stand', true);
            }
        });
    }

    start() {
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isOver != 1) {
                this.isOver = 2;
                this.eventvalue.result = 2;
                this.eventvalue.levelData[this.checkpointNum -1].result = 2;
            }
        });

        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        for(let i = 0; i < 3; i++) {
            this.eventvalue.levelData.push({
                subject: 'null',
                answer: 'null',
                result: 4
            });
        }
        this.eventvalue.levelData[0].answer = 3;
        this.eventvalue.levelData[1].answer = 3;
        this.eventvalue.levelData[2].answer = 1;
      
        AudioManager.getInstance().playSound('sfx_lbugopn', false);
        AudioManager.getInstance().playBGM('bgm_laydbug');
        this.round1();
    }

    onEndGame() {
        //如果已经上报过数据 则不再上报数据
        if (DataReporting.isRepeatReport && this.eventvalue.result != 1) {
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
        this.checkpointNum = 1;
        this.piaochong.setSkin('3_1');
        this.piaochong.setAnimation(0, 'in_left', false);
        this.piaochong.setCompleteListener(trackEntry=>{
            if(trackEntry.animation.name == 'in_left') {
                this.enableClick = true;
                this.piaochong.setAnimation(0, 'stand_left', true);
                AudioManager.getInstance().playSound('point1', false,1, (id)=>{},(id)=>{AudioManager.getInstance().playSound('point2', false, 1,(id)=> {this.audioArr.push(id)}, (id)=>{this.audioArr.filter(item=>item!==id);});});
                for(let i = 0; i < this.answerArr.length; i++) {
                    this.answerArr[i].node.runAction(cc.fadeIn(0.2));
                }
            }
        });
        this.c.spriteFrame = this.one;
        this.a.spriteFrame = this.two;
        this.b.spriteFrame = this.three;
    }

    round2() {
        this.checkpointNum = 2;
        this.piaochong.setSkin('2_4');
        this.piaochong.setAnimation(0, 'in_left', false);
        this.piaochong.setCompleteListener(trackEntry=>{
            if(trackEntry.animation.name == 'in_left') {
                this.enableClick = true;
                this.piaochong.setAnimation(0, 'stand_left', true);
               
                AudioManager.getInstance().playSound('point4', false, 1,function(id) {this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item=>item!==id);}.bind(this));
                for(let i = 0; i < this.answerArr.length; i++) {
                    this.answerArr[i].node.runAction(cc.fadeIn(0.2));
                }
            }
        });
        this.c.spriteFrame = this.four;
        this.a.spriteFrame = this.three;
        this.b.spriteFrame = this.two;
    }

    round3() {
        this.checkpointNum = 3;
        this.piaochong.setSkin('4_3');
        this.piaochong.setAnimation(0, 'in_left', false);
        this.piaochong.setCompleteListener(trackEntry=>{
            if(trackEntry.animation.name == 'in_left') {
                this.enableClick = true;
                this.piaochong.setAnimation(0, 'stand_left', true);
                
                AudioManager.getInstance().playSound('point5', false, 1,function(id) {this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item=>item!==id);}.bind(this));
                for(let i = 0; i < this.answerArr.length; i++) {
                    this.answerArr[i].node.runAction(cc.fadeIn(0.2));
                }
            }
        });
        this.a.spriteFrame = this.three;
        this.b.spriteFrame = this.two;
        this.c.spriteFrame = this.four;
    }

    stopAllSound() {
        for(let i = 0; i < this.audioArr.length; i++) {
            AudioManager.getInstance().stopAudio(this.audioArr[i]);
        }
        this.audioArr = [];
    }

    addListenerOnAnswer() {
        this.miya.node.on(cc.Node.EventType.TOUCH_START, function(e){
            this.miya.setAnimation(0, 'dianji', false);
            this.miya.setCompleteListener(trackEntry=>{
                if(trackEntry.animation.name == 'dianji') {
                    this.miya.setAnimation(0, 'stand', true);
                   
                }
            });
            if(this.miyaSound) {
                return;
            }
            this.miyaSound = true;
            if(this.checkpointNum == 1) {
                this.stopAllSound();
                AudioManager.getInstance().playSound('point2', false, 1,function(id) {this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item=>item!==id);this.miyaSound=false;}.bind(this));
            }else if(this.checkpointNum == 2) {
                this.stopAllSound();
                AudioManager.getInstance().playSound('point4', false, 1,function(id) {this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item=>item!==id);this.miyaSound=false;}.bind(this));
            }else if(this.checkpointNum == 3) {
                this.stopAllSound();
                AudioManager.getInstance().playSound('point5', false, 1,function(id) {this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item=>item!==id);this.miyaSound=false;}.bind(this));
            }
        }.bind(this));
        for(let i = 0; i < this.answerArr.length; i++) {
            this.answerArr[i].node.on(cc.Node.EventType.TOUCH_START, function(e){
                if(this.isOver != 1) {
                    this.isOver = 2;
                    this.eventvalue.result = 2;
                    this.eventvalue.levelData[this.checkpointNum-1].result = 2
                }
                if(!this.enableClick) {
                    return;
                }
              
                if(this.touchNum > 0) {
                    return;
                }
                this.touchNum += 1;
                this.eventvalue.levelData[this.checkpointNum-1].subject = i+1;
                AudioManager.getInstance().playSound('sfx_selwing', false);
                this.answerArr[i].node.getChildByName('box').active = true;
                this.answerArr[i].node.zIndex = 100;
            }.bind(this));
            this.answerArr[i].node.on(cc.Node.EventType.TOUCH_MOVE, function(e){
                if(!this.enableClick) {
                    return;
                }
                if(this.touchNum != 1) {
                    return;
                }
                var point = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                this.answerArr[i].node.setPosition(point);
            }.bind(this));
            this.answerArr[i].node.on(cc.Node.EventType.TOUCH_END, function(e){
                if(!this.enableClick || this.touchNum == 0) {
                    return;
                }
                if(this.boundingbox.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                    this.isRight(i+1);
                }
                if(this.touchNum > 0) {
                    this.touchNum -= 1;
                    this.answerArr[i].node.setPosition(this.startPosArr[i]);
                    this.answerArr[i].node.getChildByName('box').active = false;
                    this.answerArr[i].node.zIndex = 0;
                    this.isTouching = false;
                }
            }.bind(this));
            this.answerArr[i].node.on(cc.Node.EventType.TOUCH_CANCEL, function(e){
                if(this.touchNum > 0) {
                    this.answerArr[i].node.setPosition(this.startPosArr[i]);
                    this.answerArr[i].node.getChildByName('box').active = false;
                    this.answerArr[i].node.zIndex = 0;
                    this.isTouching = false;
                    this.touchNum -= 1;
                }
                else {
                    return ;
                }
            }.bind(this));
        }
    }

    isRight(index : number) {
        if(this.checkpointNum == 1) {
            this.eventvalue.result = 2;
            this.isOver = 2;
            if(index == 3) {
                AudioManager.getInstance().playSound('谢谢你');
                this.success();
                this.eventvalue.levelData[0].result = 1;
            }else {
                //AudioManager.getInstance().stopAll();
                AudioManager.getInstance().playSound('point2');
                this.eventvalue.levelData[0].result = 2;
            }
        }else if(this.checkpointNum == 2) {
            if(index == 3) {
                AudioManager.getInstance().playSound('谢谢你');
                this.success();
                this.eventvalue.levelData[1].result = 1;
            }else {
                //AudioManager.getInstance().stopAll();
                AudioManager.getInstance().playSound('point4');
                this.eventvalue.levelData[1].result = 2;
            }
        }else if(this.checkpointNum == 3) {
            if(index == 1) {
                AudioManager.getInstance().playSound('谢谢你');
                this.success();
                this.eventvalue.levelData[2].result = 1;
            }else {
                //AudioManager.getInstance().stopAll();
                AudioManager.getInstance().playSound('point5');
                this.eventvalue.levelData[2].result = 2;
            }
        }
    }

    success() {
        this.enableClick = false;
        for(let i = 0; i < this.answerArr.length; i++) {
            this.answerArr[i].node.runAction(cc.fadeOut(0.2));
        }
        this.piaochong.setAnimation(0, 'fly', false);
        AudioManager.getInstance().playSound('sfx_bugfly', false);
        this.piaochong.setCompleteListener(trackEntry => {
            if(this.checkpointNum == 1) {
                this.round2();
            }else if(this.checkpointNum == 2) {
                this.round3();
            }else if(this.checkpointNum == 3) {
                this.gameEnd();
            }
        });
    }

    gameEnd() {
        this.isOver = 1;
        this.eventvalue.result = 1
        DataReporting.getInstance().dispatchEvent('addLog', {
            eventType: 'clickSubmit',
            eventValue: JSON.stringify(this.eventvalue)
        });
        AudioManager.getInstance().stopBGM();
        UIHelp.showOverTips(2,'闯关成功，棒棒的', function(){
            this.stopAllSound();
            AudioManager.getInstance().playSound('闯关成功，棒棒的');
        }.bind(this), function(){}.bind(this));
    }

    onDestroy() {
        cc.audioEngine.stopAll();
        cc.audioEngine.stopMusic();
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
