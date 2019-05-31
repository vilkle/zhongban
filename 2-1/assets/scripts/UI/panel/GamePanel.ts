import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import { isString } from "../../collections/util";
import {AudioManager} from "../../Manager/AudioManager"
import {ConstValue} from "../../Data/ConstValue"
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "../panel/UploadAndReturnPanel"

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
    private answerArr : Array<cc.Sprite> = Array<cc.Sprite>();
    private checkpointNum : number = 0;
    private enableClick : boolean = false;
    private audioArr : Array<number> = Array<number>();

    protected static className = "GamePanel";

    onLoad() {
        if(ConstValue.IS_TEACHER) {
            UIManager.getInstance().openUI(UploadAndReturnPanel);
        }
        this.answerArr[0] = this.a;
        this.answerArr[1] = this.b;
        this.answerArr[2] = this.c;
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
        if (ConstValue.IS_EDITIONS) {
            courseware.page.sendToParent('clickSubmit', 2);
            courseware.page.sendToParent('addLog', { eventType: 'clickSubmit', eventValue: 2 });
        }
        AudioManager.getInstance().playSound('sfx_lbugopn', false);
        AudioManager.getInstance().playBGM('bgm_laydbug');
        this.round1();
    }

    round1() {
        this.checkpointNum = 1;
        this.piaochong.setSkin('1_2');
        this.piaochong.setAnimation(0, 'in_left', false);
        this.piaochong.setCompleteListener(trackEntry=>{
            if(trackEntry.animation.name == 'in_left') {
                this.enableClick = true;
                this.piaochong.setAnimation(0, 'stand_left', true);
                
                AudioManager.getInstance().playSound('point1', false, 1,function(id) {this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item=>item!==id);}.bind(this));
                for(let i = 0; i < this.answerArr.length; i++) {
                    this.answerArr[i].node.runAction(cc.fadeIn(0.2));
                }
            }
        });
        this.a.spriteFrame = this.two;
        this.b.spriteFrame = this.one;
        this.c.spriteFrame = this.three;
    }

    round2() {
        this.checkpointNum = 2;
        this.piaochong.setSkin('3_1');
        this.piaochong.setAnimation(0, 'in_left', false);
        this.piaochong.setCompleteListener(trackEntry=>{
            if(trackEntry.animation.name == 'in_left') {
                this.enableClick = true;
                this.piaochong.setAnimation(0, 'stand_left', true);
               
                AudioManager.getInstance().playSound('point2', false, 1,function(id) {this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item=>item!==id);}.bind(this));
                for(let i = 0; i < this.answerArr.length; i++) {
                    this.answerArr[i].node.runAction(cc.fadeIn(0.2));
                }
            }
        });
        this.c.spriteFrame = this.one;
        this.a.spriteFrame = this.two;
        this.b.spriteFrame = this.three;
    }

    round3() {
        this.checkpointNum = 3;
        this.piaochong.setSkin('2_3');
        this.piaochong.setAnimation(0, 'in_left', false);
        this.piaochong.setCompleteListener(trackEntry=>{
            if(trackEntry.animation.name == 'in_left') {
                this.enableClick = true;
                this.piaochong.setAnimation(0, 'stand_left', true);
                
                AudioManager.getInstance().playSound('point3', false, 1,function(id) {this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item=>item!==id);}.bind(this));
                for(let i = 0; i < this.answerArr.length; i++) {
                    this.answerArr[i].node.runAction(cc.fadeIn(0.2));
                }
            }
        });
        this.b.spriteFrame = this.three;
        this.a.spriteFrame = this.two;
        this.c.spriteFrame = this.four;
    }

    round4() {
        this.checkpointNum = 4;
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

    round5() {
        this.checkpointNum = 5;
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
           
            if(this.checkpointNum == 1) {
                this.stopAllSound();
                AudioManager.getInstance().playSound('point1', false, 1,function(id) {this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item=>item!==id);}.bind(this));
            }else if(this.checkpointNum == 2) {
                this.stopAllSound();
                AudioManager.getInstance().playSound('point2', false, 1,function(id) {this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item=>item!==id);}.bind(this));
            }else if(this.checkpointNum == 3) {
                this.stopAllSound();
                AudioManager.getInstance().playSound('point3', false, 1,function(id) {this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item=>item!==id);}.bind(this));
            }else if(this.checkpointNum == 4) {
                this.stopAllSound();
                AudioManager.getInstance().playSound('point4', false, 1,function(id) {this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item=>item!==id);}.bind(this));
            }else if(this.checkpointNum == 5) {
                this.stopAllSound();
                AudioManager.getInstance().playSound('point5', false, 1,function(id) {this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item=>item!==id);}.bind(this));
            }
            this.miya.setCompleteListener(trackEntry=>{
                if(trackEntry.animation.name == 'dianji') {
                    this.miya.setAnimation(0, 'stand', true);
                   
                }
            });
        }.bind(this));
        var startPos: cc.Vec2 = cc.v2(0, 0);
        for(let i = 0; i < this.answerArr.length; i++) {
            this.answerArr[i].node.on(cc.Node.EventType.TOUCH_START, function(e){
                if(!this.enableClick) {
                    return;
                }
                
                AudioManager.getInstance().playSound('sfx_selwing', false);
                startPos = this.answerArr[i].node.getPosition();
                this.answerArr[i].node.getChildByName('box').active = true;
                this.answerArr[i].node.zIndex = 100;
            }.bind(this));
            this.answerArr[i].node.on(cc.Node.EventType.TOUCH_MOVE, function(e){
                if(!this.enableClick) {
                    return;
                }
                var point = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                this.answerArr[i].node.setPosition(point);
            }.bind(this));
            this.answerArr[i].node.on(cc.Node.EventType.TOUCH_END, function(e){
                if(!this.enableClick) {
                    return;
                }
                if(this.boundingbox.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                    this.isRight(i+1);
                    cc.log('----------', i);
                }
                this.answerArr[i].node.setPosition(startPos);
                this.answerArr[i].node.getChildByName('box').active = false;
                this.answerArr[i].node.zIndex = 0;
            }.bind(this));
            this.answerArr[i].node.on(cc.Node.EventType.TOUCH_CANCEL, function(e){
                this.answerArr[i].node.setPosition(startPos);
                this.answerArr[i].node.getChildByName('box').active = false;
                this.answerArr[i].node.zIndex = 0;
            }.bind(this));
        }
    }

    isRight(index : number) {
        if(this.checkpointNum == 1) {
            if(index == 1) {
                this.success();
            }
        }else if(this.checkpointNum == 2) {
            if(index == 3) {
                this.success();
            }
        }else if(this.checkpointNum == 3) {
            if(index == 2) {
                this.success();
            }
        }else if(this.checkpointNum == 4) {
            if(index == 3) {
                this.success();
            }
        }else if(this.checkpointNum == 5) {
            if(index == 1) {
                this.success();
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
                this.round4();
            }else if(this.checkpointNum == 4) {
                this.round5();
            }else if(this.checkpointNum == 5) {
                this.gameEnd();
            }
        });
    }

    gameEnd() {
        if (ConstValue.IS_EDITIONS) {
            courseware.page.sendToParent('clickSubmit', 1);
            courseware.page.sendToParent('addLog', { eventType: 'clickSubmit', eventValue: 1 });
        }
        AudioManager.getInstance().stopBGM();
        cc.log('---------gameEnd');
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
