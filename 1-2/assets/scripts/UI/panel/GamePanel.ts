import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import {ConstValue} from "../../Data/ConstValue"
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "../panel/UploadAndReturnPanel"
import {AudioManager} from "../../Manager/AudioManager"
import { OverTips } from "../Item/OverTips";
import {UIHelp} from "../../Utils/UIHelp";
import DataReporting from "../../Data/DataReporting";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";
    @property(cc.Node)
    private box1 : cc.Node = null;
    @property(cc.Node)
    private box2 : cc.Node = null;
    @property(cc.Node)
    private box3 : cc.Node = null;
    @property(cc.Node)
    private bg : cc.Node = null;
    @property(cc.Node)
    private point : cc.Node = null;
    @property(sp.Skeleton)
    private mouse : sp.Skeleton = null;
    @property(sp.Skeleton)
    private miya : sp.Skeleton = null;
    @property(cc.SpriteFrame)
    private five : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private six : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private seven : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private eight : cc.SpriteFrame = null;
    private checkpointIndex = 1;
    private checkpointNum = 4;
    private enableClick : boolean = false;
    private pos1Arr : Array<cc.Vec2> = Array<cc.Vec2>();
    private pos2Arr : Array<cc.Vec2> = Array<cc.Vec2>();
    private pos3Arr : Array<cc.Vec2> = Array<cc.Vec2>();
    private answerArr : Array<number> = [1,3,2,1]; 
    private eventvalue = {
        isResult: 1,
        isLevel: 1,
        levelData: [

        ],
        result: 2
    }

    onLoad() {
        if(ConstValue.IS_TEACHER) {
            UIManager.getInstance().openUI(UploadAndReturnPanel);
        }
    }

    start() {
        this.gameStart();
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        for(let i = 0; i < 4; i++) {
            this.eventvalue.levelData.push({
                subject: null,
                answer: null,
                result: 4
            });
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
        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: 0 });
    }

    gameStart() {
        this.addListener();
        for(let i = 1; i <= 10; i++) {
            var pos1 = this.box1.getChildByName(i.toString()).getPosition();
            this.pos1Arr[i - 1] = pos1;
            var pos2 = this.box1.getChildByName(i.toString()).getPosition();
            this.pos2Arr[i - 1] = pos2;
            var pos3 = this.box1.getChildByName(i.toString()).getPosition();
            this.pos3Arr[i - 1] = pos3;
        } 
        this.round1();
        AudioManager.getInstance().playSound('sfx_olnmOpn', false);
    }

    onDestroy() {

    }

    onShow() {
    }

    setPanel() {

    }

    round1() {
        this.miya.setAnimation(0, 'jupaizi1', false);
        this.miya.setCompleteListener(trackEntry=>{
            if(trackEntry.animation.name == 'jupaizi1') {
                this.miya.setAnimation(0, 'idle1', true);
            }
        });
        for(let i = 1; i <= 10; i++) {
          
            if(i <= 5) {
                this.box1.getChildByName(i.toString()).active = true;
            }
            else {
                this.box1.getChildByName(i.toString()).active = false;
            }
            if(i <= 4) {
                this.box2.getChildByName(i.toString()).active = true;
            }else {
                this.box2.getChildByName(i.toString()).active = false;
            }
            if(i <= 6) {
                this.box3.getChildByName(i.toString()).active = true;
            }else {
                this.box3.getChildByName(i.toString()).active = false;
            }
            this.box1.getChildByName(i.toString()).setPosition(this.pos1Arr[i - 1]);
            this.box2.getChildByName(i.toString()).setPosition(this.pos2Arr[i - 1]);
            this.box3.getChildByName(i.toString()).setPosition(this.pos3Arr[i - 1]);
            this.box1.getChildByName(i.toString()).opacity = 255;
            this.box2.getChildByName(i.toString()).opacity = 255;
            this.box3.getChildByName(i.toString()).opacity = 255;
        }
        this.box1.runAction( cc.moveBy(0.3, cc.v2(-2000, 0)));
       this.box2.runAction(cc.moveBy(0.5, cc.v2(-2000, 0)));
       this.box3.runAction(cc.sequence(cc.moveBy(0.7, cc.v2(-2000, 0)),cc.callFunc(function(){ this.enableClick = true;}.bind(this))));
       
    }

    round2() {
        this.miya.setAnimation(0, 'jupaizi2', false);
        this.miya.setCompleteListener(trackEntry=>{
            if(trackEntry.animation.name == 'jupaizi2') {
                this.miya.setAnimation(0, 'idle2', true);
            }
        });
        for(let i = 1; i <= 10; i++) {
            if(i <= 5) {
                this.box1.getChildByName(i.toString()).active = true;
            }
            else {
                this.box1.getChildByName(i.toString()).active = false;
            }
            if(i <= 7) {
                this.box2.getChildByName(i.toString()).active = true;
            }else {
                this.box2.getChildByName(i.toString()).active = false;
            }
            if(i <= 6) {
                this.box3.getChildByName(i.toString()).active = true;
            }else {
                this.box3.getChildByName(i.toString()).active = false;
            }
            this.box1.getChildByName(i.toString()).setPosition(this.pos1Arr[i - 1]);
            this.box2.getChildByName(i.toString()).setPosition(this.pos2Arr[i - 1]);
            this.box3.getChildByName(i.toString()).setPosition(this.pos3Arr[i - 1]);
            this.box1.getChildByName(i.toString()).opacity = 255;
            this.box2.getChildByName(i.toString()).opacity = 255;
            this.box3.getChildByName(i.toString()).opacity = 255;
        }
        this.box1.runAction( cc.moveBy(0.3, cc.v2(-2000, 0)));
        this.box2.runAction(cc.moveBy(0.5, cc.v2(-2000, 0)));
        this.box3.runAction(cc.sequence(cc.moveBy(0.7, cc.v2(-2000, 0)),cc.callFunc(function(){this.enableClick = true;}.bind(this))));
    }

    round3() {
        this.miya.setAnimation(0, 'jupaizi3', false);
        this.miya.setCompleteListener(trackEntry=>{
            if(trackEntry.animation.name == 'jupaizi3') {
                this.miya.setAnimation(0, 'idle3', true);
            }
        });
        for(let i = 1; i <= 10; i++) {
            if(i <= 6) {
                this.box1.getChildByName(i.toString()).active = true;
            }
            else {
                this.box1.getChildByName(i.toString()).active = false;
            }
            if(i <= 7) {
                this.box2.getChildByName(i.toString()).active = true;
            }else {
                this.box2.getChildByName(i.toString()).active = false;
            }
            if(i <= 8) {
                this.box3.getChildByName(i.toString()).active = true;
            }else {
                this.box3.getChildByName(i.toString()).active = false;
            }
            this.box1.getChildByName(i.toString()).setPosition(this.pos1Arr[i - 1]);
            this.box2.getChildByName(i.toString()).setPosition(this.pos2Arr[i - 1]);
            this.box3.getChildByName(i.toString()).setPosition(this.pos3Arr[i - 1]);
            this.box1.getChildByName(i.toString()).opacity = 255;
            this.box2.getChildByName(i.toString()).opacity = 255;
            this.box3.getChildByName(i.toString()).opacity = 255;
        }
        this.box1.runAction( cc.moveBy(0.3, cc.v2(-2000, 0)));
        this.box2.runAction(cc.moveBy(0.5, cc.v2(-2000, 0)));
        this.box3.runAction(cc.sequence(cc.moveBy(0.7, cc.v2(-2000, 0)),cc.callFunc(function(){this.enableClick = true;}.bind(this))));
    }

    round4() {
        this.miya.setAnimation(0, 'jupaizi4', false);
        this.miya.setCompleteListener(trackEntry=>{
            if(trackEntry.animation.name == 'jupaizi4') {
                this.miya.setAnimation(0, 'idle4', true);
            }
        });
        for(let i = 1; i <= 10; i++) {
            if(i <= 8) {
                this.box1.getChildByName(i.toString()).active = true;
            }
            else {
                this.box1.getChildByName(i.toString()).active = false;
            }
            if(i <= 7) {
                this.box2.getChildByName(i.toString()).active = true;
            }else {
                this.box2.getChildByName(i.toString()).active = false;
            }
            if(i <= 9) {
                this.box3.getChildByName(i.toString()).active = true;
            }else {
                this.box3.getChildByName(i.toString()).active = false;
            }
            this.box1.getChildByName(i.toString()).setPosition(this.pos1Arr[i - 1]);
            this.box2.getChildByName(i.toString()).setPosition(this.pos2Arr[i - 1]);
            this.box3.getChildByName(i.toString()).setPosition(this.pos3Arr[i - 1]);
            this.box1.getChildByName(i.toString()).opacity = 255;
            this.box2.getChildByName(i.toString()).opacity = 255;
            this.box3.getChildByName(i.toString()).opacity = 255;
        }
        this.box1.runAction( cc.moveBy(0.3, cc.v2(-2000, 0)));
        this.box2.runAction(cc.moveBy(0.5, cc.v2(-2000, 0)));
        this.box3.runAction(cc.sequence(cc.moveBy(0.7, cc.v2(-2000, 0)),cc.callFunc(function(){this.enableClick = true;}.bind(this))));
    }

    addListener() {
        this.bg.on(cc.Node.EventType.TOUCH_START, function(e){
            if(!this.enableClick) {
                return;
            }
            if(this.box1.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))){
                this.eventvalue.levelData[this.checkpointIndex-1].answer = this.answerArr[this.checkpointIndex-1];
                this.eventvalue.levelData[this.checkpointIndex-1].subject = 1;
                this.eventvalue.levelData[this.checkpointIndex-1].result = 2;
               AudioManager.getInstance().stopAll();
               AudioManager.getInstance().playSound('sfx_touch', false);
               this.box1.runAction(cc.sequence(cc.scaleTo(0.1, 0.9), cc.scaleTo(0.1, 1)));
            }else if(this.box2.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                this.eventvalue.levelData[this.checkpointIndex-1].answer = this.answerArr[this.checkpointIndex-1];
                this.eventvalue.levelData[this.checkpointIndex-1].subject = 2;
                this.eventvalue.levelData[this.checkpointIndex-1].result = 2;
                AudioManager.getInstance().stopAll();
               AudioManager.getInstance().playSound('sfx_touch', false);
               this.box2.runAction(cc.sequence(cc.scaleTo(0.1, 0.9), cc.scaleTo(0.1, 1)));
            }else if(this.box3.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                this.eventvalue.levelData[this.checkpointIndex-1].answer = this.answerArr[this.checkpointIndex-1];
                this.eventvalue.levelData[this.checkpointIndex-1].subject = 3;
                this.eventvalue.levelData[this.checkpointIndex-1].result = 2;
                AudioManager.getInstance().stopAll();
               AudioManager.getInstance().playSound('sfx_touch', false);
               this.box3.runAction(cc.sequence(cc.scaleTo(0.1, 0.9), cc.scaleTo(0.1, 1)));
            }
        }.bind(this));
        this.bg.on(cc.Node.EventType.TOUCH_END, function(e){
            if(!this.enableClick) {
                return;
            }
            if(this.box1.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))){
                this.isRight(1, this.checkpointIndex);
            }else if(this.box2.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                this.isRight(2, this.checkpointIndex);
            }else if(this.box3.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                this.isRight(3, this.checkpointIndex);
            }
        }.bind(this));
    }

    isRight(boxNum : number, roundNum : number):boolean {
        if(roundNum == 1) {
            if(boxNum == 1) {
                this.eventvalue.levelData[this.checkpointIndex-1].result = 1;
                this.enableClick = false;
                for(let i = 1; i <= 5; i++) {
                    this.box1.getChildByName(i.toString()).runAction(cc.sequence(cc.callFunc(function(){
                        if(i == 5) {
                            AudioManager.getInstance().stopAll();
                            AudioManager.getInstance().playSound('sfx_blueeat', false);
                            this.mouse.setAnimation(0, 'idle2', false);
                            this.mouse.setCompleteListener(
                                trackEntry => { 
                                    if(trackEntry.animation.name == 'idle2') {
                                        this.mouse.setAnimation(0, 'idle1', true);
                                        this.success();
                                    }
                                }
                            );
                        }
                    }.bind(this)),cc.moveTo(0.3, cc.v2(579, 353)), cc.fadeOut(0.1),cc.callFunc(function(){
                        if(i == 5) {
                            //this.success();
                        }
                    }.bind(this))));
                }
                return true;
            }else {
                return false;
            }
        }else if(roundNum == 2) {
            if(boxNum == 3) {
                this.eventvalue.levelData[this.checkpointIndex-1].result = 1;
                this.enableClick = false;
                for(let i = 1; i <= 6; i++) {
                    this.box3.getChildByName(i.toString()).runAction(cc.sequence(cc.callFunc(function(){
                        if(i == 6) {
                            AudioManager.getInstance().stopAll();
                            AudioManager.getInstance().playSound('sfx_blueeat', false);
                            this.mouse.setAnimation(0, 'idle2', false);
                            this.mouse.setCompleteListener(
                                trackEntry => { 
                                    if(trackEntry.animation.name == 'idle2') {
                                        this.mouse.setAnimation(0, 'idle1', true);
                                        this.success();
                                    }
                                }
                            );
                        }
                    }.bind(this)), cc.moveTo(0.3, cc.v2(-576, 340)),cc.fadeOut(0.1),cc.callFunc(function(){
                        if(i == 6) {
                            //this.success();
                        }
                    }.bind(this))));
                }
                return true;
            }else {
                return false;
            }
        }
        else if(roundNum == 3) {
            if(boxNum == 2) {
                this.eventvalue.levelData[this.checkpointIndex-1].result = 1;
                this.enableClick = false;
                for(let i = 1; i <= 7; i++) {
                    this.box2.getChildByName(i.toString()).runAction(cc.sequence(cc.callFunc(function(){
                        if(i == 7) {
                            AudioManager.getInstance().stopAll();
                            AudioManager.getInstance().playSound('sfx_blueeat', false);
                            this.mouse.setAnimation(0, 'idle2', false);
                            this.mouse.setCompleteListener(
                                trackEntry => { 
                                    if(trackEntry.animation.name == 'idle2') {
                                        this.mouse.setAnimation(0, 'idle1', true);
                                        this.success();
                                    }
                                }
                            );
                        }
                    }.bind(this)), cc.moveTo(0.3, cc.v2(6, 345)),cc.fadeOut(0.1),cc.callFunc(function(){
                        if(i == 7) {
                            //this.success();
                        }
                    }.bind(this))));
                }
                return true;
            }else {
                return false;
            }
        }
        else if(roundNum == 4) {
            if(boxNum == 1) {
                this.eventvalue.levelData[this.checkpointIndex-1].result = 1;
                this.enableClick = false;
                for(let i = 1; i <= 8; i++) {
                    this.box1.getChildByName(i.toString()).runAction(cc.sequence(cc.callFunc(function(){
                        if(i == 8) {
                            AudioManager.getInstance().stopAll();
                            AudioManager.getInstance().playSound('sfx_blueeat', false);
                            this.mouse.setAnimation(0, 'idle2', false);
                            this.mouse.setCompleteListener(
                                trackEntry => { 
                                    if(trackEntry.animation.name == 'idle2') {
                                        this.mouse.setAnimation(0, 'idle1', true);
                                        this.gameEnd();
                                    }
                                }
                            );
                        }
                    }.bind(this)),cc.moveTo(0.3, cc.v2(579, 353)), cc.fadeOut(0.1),cc.callFunc(function(){
                        if(i == 8) {
                            //this.success();
                        }
                    }.bind(this))));
                }
                return true;
            }else {
                return false;
            }
        }else {
            return false;
        }
       
    }

    gameEnd() {
        UIHelp.showOverTips(2,'闯关成功，棒棒的', function(){
            AudioManager.getInstance().playSound('闯关成功，棒棒的');
        }.bind(this), function(){}.bind(this));
        this.eventvalue.result = 1;
        DataReporting.getInstance().dispatchEvent('addLog', {
            eventType: 'clickSubmit',
            eventValue: JSON.stringify(this.eventvalue)
        });
        cc.log(this.eventvalue);
    }

    success() {
        this.checkpointIndex ++;
       
        this.box1.runAction( cc.moveBy(0.3, cc.v2(-2000, 0)));
        this.box2.runAction(cc.moveBy(0.5, cc.v2(-2000, 0)));
        this.box3.runAction(cc.sequence(cc.moveBy(0.7, cc.v2(-2000, 0)),cc.callFunc(function(){
            this.box1.setPosition(cc.v2(1385, -157));
            this.box2.setPosition(cc.v2(1961, -158));
            this.box3.setPosition(cc.v2(2547, -155));
            if(this.checkpointIndex == 2) {
                this.round2();
                // setTimeout(function(){
                //     this.round2();
                // }.bind(this), 2000);
            }else if(this.checkpointIndex == 3) {
                this.round3();
                // setTimeout(function(){
                //     this.round3();
                // }.bind(this), 2000);
            }else if(this.checkpointIndex == 4) {
                this.round4();
                // setTimeout(function(){
                //     this.round4();
                // }.bind(this), 2000);
            }
        }.bind(this))));
       
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
