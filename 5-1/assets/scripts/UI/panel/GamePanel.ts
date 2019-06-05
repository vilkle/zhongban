import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import {UIHelp} from "../../Utils/UIHelp";
import {ConstValue} from "../../Data/ConstValue"
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "./UploadAndReturnPanel";
import {AudioManager} from "../../Manager/AudioManager"
import DataReporting from "../../Data/DataReporting";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";
    @property(cc.Node)
    private ovenNode : cc.Node = null;
    @property(cc.Node)
    private boardNode : cc.Node = null;
    @property(cc.Node)
    private plateNode1 : cc.Node = null;
    @property(cc.Node)
    private plateNode2 : cc.Node = null;
    @property(cc.Node)
    private plateNode3 : cc.Node = null;
    @property(cc.Node)
    private answerNode : cc.Node = null;
    @property(cc.Button)
    private submitButton : cc.Button = null;
    @property(sp.Skeleton)
    private bearSpine : sp.Skeleton = null;
    @property(sp.Skeleton)
    private milkSpine : sp.Skeleton = null; 
    @property(cc.Node)
    private bubble : cc.Node = null;
    @property(cc.Node)
    private mask : cc.Node = null;
    private enableSelect : boolean = false;
    private answerArr : Array<cc.Node> = new Array<cc.Node>();
    private placementArr : Array<cc.Node> = new Array<cc.Node>();
    private checkpointIndex : number = 0;
    private randomNum : number = 0;
    private intervalIndex = 0;
    private eventvalue = {
        isResult: 1,
        isLevel: 1,
        levelData: [

        ],
        result: 2
    }
    onLoad() {
        this.initAnswerArr();
        this.mask.on(cc.Node.EventType.TOUCH_START, function(e){
            e.stopPropagation();
        });
        this.intervalIndex = setInterval(function(){
            this.randomNum += 1;
            if(this.randomNum %4){
                this.milkSpine.addAnimation(0, 'idle0', false);
            }else {
                this.milkSpine.addAnimation(0, 'idle1', false);
            }
            if(this.randomNum %5) {
                this.bearSpine.addAnimation(0, 'idle1', false);
            }else {
                this.bearSpine.addAnimation(0, 'idle2', false);
            }
        }.bind(this), 1000);
        if(ConstValue.IS_TEACHER) {
            UIManager.getInstance().openUI(UploadAndReturnPanel);
        }
    }

    start() {
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        for(let i = 0; i < 3; i++) {
            this.eventvalue.levelData.push({
                subject: [],
                answer: [],
                result: 4
            });
        }   
        this.placementArr[0] = this.boardNode.getChildByName('answer1');
        this.placementArr[1] = this.boardNode.getChildByName('answer2');
        this.placementArr[2] = this.boardNode.getChildByName('answer3');
        this.eventvalue.levelData[0].answer = [3,2];
        this.eventvalue.levelData[1].answer = [3,3,5];
        this.eventvalue.levelData[2].answer = [3,2,7];
        this.round1();
        this.addListenerOnBubble();
        this.addListenerOnAnswer();
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

    onDestroy() {
        clearInterval(this.intervalIndex);
    }

    onShow() {
    }

    update() {
        let anser1 = this.boardNode.getChildByName('answer1').getChildByName('answer');
        let anser2 = this.boardNode.getChildByName('answer2').getChildByName('answer');
        let anser3 = this.boardNode.getChildByName('answer3').getChildByName('answer');
        if(this.checkpointIndex == 2||this.checkpointIndex == 3) {
            if(anser1.opacity&&anser2.opacity&&anser3.opacity) {
                if(this.submitButton.interactable == false) {
                    this.submitButton.interactable = true;
                }
            }else {
                if(this.submitButton.interactable == true) {
                    this.submitButton.interactable = false;
                } 
            }
        }
       
        if(this.checkpointIndex == 1) {
            if(anser1.opacity&&anser2.opacity) {
                if(this.submitButton.interactable == false) {
                    this.submitButton.interactable = true;
                }
            }else {
                if(this.submitButton.interactable == true) {
                    this.submitButton.interactable = false;
                }
            }
        }
     
    }

    initAnswerArr() {
        for(let i = 0; i < this.answerNode.children.length; i ++) {
            this.answerArr.push(this.answerNode.children[i]);
        }
        cc.log(this.answerArr);
    }

    reset() {
        this.boardNode.getChildByName('answer1').getChildByName('answer').getComponent(cc.Sprite).spriteFrame = null;
        this.boardNode.getChildByName('answer2').getChildByName('answer').getComponent(cc.Sprite).spriteFrame = null;
        this.boardNode.getChildByName('answer3').getChildByName('answer').getComponent(cc.Sprite).spriteFrame = null;
        this.boardNode.getChildByName('answer1').getChildByName('answer').opacity = 0;
        this.boardNode.getChildByName('answer2').getChildByName('answer').opacity = 0;
        this.boardNode.getChildByName('answer3').getChildByName('answer').opacity = 0;
        this.boardNode.getChildByName('answer1').getChildByName('none').opacity = 255;
        this.boardNode.getChildByName('answer2').getChildByName('none').opacity = 255;
        this.boardNode.getChildByName('answer3').getChildByName('none').opacity = 255;
    }


    round1() {
        this.mask.active = true;
        this.checkpointIndex = 1;
        this.boardNode.getChildByName('pic3').active = false;
        this.boardNode.getChildByName('answer3').active = false;
        AudioManager.getInstance().playSound('sfx_ccopn', false);
        this.plateNode1.runAction(cc.sequence( cc.moveBy(0.6, cc.v2(0, 800)), cc.callFunc(function(){
            //this.round2();
            this.enableSelect = true;
            this.mask.active = false;
        }.bind(this))));


    }

    round2() {
        this.checkpointIndex = 2;
        this.mask.active = true;
        this.ovenNode.runAction(cc.sequence(cc.moveBy(0.3, cc.v2(0, 210)),cc.callFunc(function(){
            AudioManager.getInstance().playSound('sfx_mcrwvopn', false);
            this.plateNode1.runAction(cc.sequence(cc.moveBy(0.6, cc.v2(0, 970)),cc.callFunc(function(){
                this.ovenNode.runAction(cc.sequence(cc.moveBy(0.3, cc.v2(0, -210)), cc.callFunc(function(){
                    AudioManager.getInstance().playSound('sfx_ccopn', false);
                    this.plateNode2.runAction(cc.sequence( cc.moveBy(0.6, cc.v2(0, 800)), cc.callFunc(function(){
                        this.boardNode.getChildByName('pic3').active = true;
                        this.boardNode.getChildByName('answer3').active = true;
                        this.reset();
                        //this.round3();
                        this.mask.active = false;
                        this.enableSelect = true;
                        cc.log('action over');
                    }.bind(this))));
                }.bind(this))));
            }.bind(this))));
        }.bind(this))));
    }

    round3() {
        this.mask.active = true;
        this.checkpointIndex = 3;
        this.ovenNode.runAction(cc.sequence(cc.moveBy(0.3, cc.v2(0, 210)),cc.callFunc(function(){
            AudioManager.getInstance().playSound('sfx_mcrwvopn', false);
            this.plateNode2.runAction(cc.sequence(cc.moveBy(0.6, cc.v2(0, 970)),cc.callFunc(function(){
                this.ovenNode.runAction(cc.sequence(cc.moveBy(0.3, cc.v2(0, -210)), cc.callFunc(function(){
                    AudioManager.getInstance().playSound('sfx_ccopn', false);
                    this.plateNode3.runAction(cc.sequence( cc.moveBy(0.6, cc.v2(0, 800)), cc.callFunc(function(){
                        this.boardNode.getChildByName('pic3').active = true;
                        this.boardNode.getChildByName('answer3').active = true;
                        this.reset();
                        this.mask.active = false;
                        this.enableSelect = true;
                        cc.log('action over');
                    }.bind(this))));
                }.bind(this))));
            }.bind(this))));
        }.bind(this))));
    }

    addListenerOnAnswer() { 
        for(let i = 0; i < this.placementArr.length; i++) {
            let answerNode = this.placementArr[i].getChildByName('answer');
            answerNode.on(cc.Node.EventType.TOUCH_START, (e)=>{
                this.bubble.opacity = 255;
                this.bubble.getComponent(cc.Sprite).spriteFrame = answerNode.getComponent(cc.Sprite).spriteFrame;
                this.bubble.setPosition(this.node.convertToNodeSpaceAR(e.currentTouch._point));
                answerNode.opacity = 0;
                answerNode.parent.getChildByName('none').opacity = 255;
            });
            answerNode.on(cc.Node.EventType.TOUCH_MOVE, (e)=>{
                var location = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                if(location.x > this.node.width /2 - this.bubble.width / 2) {
                    this.bubble.x = this.node.width /2 - this.bubble.width / 2;
                }else if(location.x < - this.node.width / 2 + this.bubble.width / 2){
                    this.bubble.x = - this.node.width / 2 + this.bubble.width / 2;
                }else {
                    this.bubble.x = location.x;
                }
                if(location.y >= this.node.height / 2 - this.bubble.height / 2) {
                    this.bubble.y = this.node.height / 2 - this.bubble.height / 2;
                }else if (location.y <= - this.node.height / 2 + this.bubble.height / 2){
                    this.bubble.y = - this.node.height / 2 + this.bubble.height / 2;
                }else {
                    this.bubble.y = location.y;
                }
            });
            answerNode.on(cc.Node.EventType.TOUCH_END, (e)=>{
                this.bubble.opacity = 0;
                answerNode.opacity = 255;
                answerNode.parent.getChildByName('none').opacity = 0;
            });
            answerNode.on(cc.Node.EventType.TOUCH_CANCEL, (e)=>{
                if(this.bubble.opacity == 0) {
                    return;
                }
                var point1 = this.boardNode.getChildByName('answer1').convertToNodeSpaceAR(e.currentTouch._point);
                var point2 = this.boardNode.getChildByName('answer2').convertToNodeSpaceAR(e.currentTouch._point);
                var point3 = this.boardNode.getChildByName('answer3').convertToNodeSpaceAR(e.currentTouch._point);
                if(this.boardNode.getChildByName('answer1').getChildByName('none').getBoundingBox().contains(point1)){
                    this.eventvalue.levelData[this.checkpointIndex-1].subject[0] = i + 1;
                    this.eventvalue.levelData[this.checkpointIndex-1].result = 2; 
                    this.boardNode.getChildByName('answer1').getChildByName('answer').getComponent(cc.Sprite).spriteFrame = this.bubble.getComponent(cc.Sprite).spriteFrame;
                    this.boardNode.getChildByName('answer1').getChildByName('answer').opacity = 255;
                    this.boardNode.getChildByName('answer1').getChildByName('none').opacity = 0;
                    this.bubble.opacity = 0;
                }else if(this.boardNode.getChildByName('answer2').getChildByName('none').getBoundingBox().contains(point2)) {
                    this.eventvalue.levelData[this.checkpointIndex-1].subject[1] = i + 1;
                    this.eventvalue.levelData[this.checkpointIndex-1].result = 2; 
                    this.boardNode.getChildByName('answer2').getChildByName('answer').getComponent(cc.Sprite).spriteFrame = this.bubble.getComponent(cc.Sprite).spriteFrame;
                    this.boardNode.getChildByName('answer2').getChildByName('answer').opacity = 255;
                    this.boardNode.getChildByName('answer2').getChildByName('none').opacity = 0;
                    this.bubble.opacity = 0;
                }else if(this.boardNode.getChildByName('answer3').getChildByName('none').getBoundingBox().contains(point3)) {
                    this.eventvalue.levelData[this.checkpointIndex-1].subject[2] = i + 1;
                    this.eventvalue.levelData[this.checkpointIndex-1].result = 2; 
                    this.boardNode.getChildByName('answer3').getChildByName('answer').getComponent(cc.Sprite).spriteFrame = this.bubble.getComponent(cc.Sprite).spriteFrame;
                    this.boardNode.getChildByName('answer3').getChildByName('answer').opacity = 255;
                    this.boardNode.getChildByName('answer3').getChildByName('none').opacity = 0;
                    this.bubble.opacity = 0;
                }else {
                    this.bubble.opacity = 0;
                    answerNode.opacity = 255;
                    answerNode.parent.getChildByName('none').opacity = 0;
                }
            });
        }
    }

    addListenerOnBubble() {
        for(let i = 0; i < this.answerArr.length; i++) {
            let bubble = this.answerArr[i];
            bubble.on(cc.Node.EventType.TOUCH_START, function(e){
                this.bubble.opacity = 255;
                this.bubble.getComponent(cc.Sprite).spriteFrame = bubble.getComponent(cc.Sprite).spriteFrame;
                this.bubble.setPosition(this.node.convertToNodeSpaceAR(e.currentTouch._point));
            }.bind(this));
            bubble.on(cc.Node.EventType.TOUCH_MOVE, function(e){
                var location = this.node.convertToNodeSpaceAR(e.currentTouch._point);
                if(location.x > this.node.width /2 - this.bubble.width / 2) {
                    this.bubble.x = this.node.width /2 - this.bubble.width / 2;
                }else if(location.x < - this.node.width / 2 + this.bubble.width / 2){
                    this.bubble.x = - this.node.width / 2 + this.bubble.width / 2;
                }else {
                    this.bubble.x = location.x;
                }
                if(location.y >= this.node.height / 2 - this.bubble.height / 2) {
                    this.bubble.y = this.node.height / 2 - this.bubble.height / 2;
                }else if (location.y <= - this.node.height / 2 + this.bubble.height / 2){
                    this.bubble.y = - this.node.height / 2 + this.bubble.height / 2;
                }else {
                    this.bubble.y = location.y;
                }
            }.bind(this));
            bubble.on(cc.Node.EventType.TOUCH_END, function(e){
                this.bubble.opacity = 0;
            }.bind(this));
            bubble.on(cc.Node.EventType.TOUCH_CANCEL, function(e){
                if(this.bubble.opacity == 0) {
                    return;
                }
                var point1 = this.boardNode.getChildByName('answer1').convertToNodeSpaceAR(e.currentTouch._point);
                var point2 = this.boardNode.getChildByName('answer2').convertToNodeSpaceAR(e.currentTouch._point);
                var point3 = this.boardNode.getChildByName('answer3').convertToNodeSpaceAR(e.currentTouch._point);
                if(this.boardNode.getChildByName('answer1').getChildByName('none').getBoundingBox().contains(point1)){
                    this.eventvalue.levelData[this.checkpointIndex-1].subject[0] = i + 1;
                    this.eventvalue.levelData[this.checkpointIndex-1].result = 2; 
                    this.boardNode.getChildByName('answer1').getChildByName('answer').getComponent(cc.Sprite).spriteFrame = this.bubble.getComponent(cc.Sprite).spriteFrame;
                    this.boardNode.getChildByName('answer1').getChildByName('answer').opacity = 255;
                    this.boardNode.getChildByName('answer1').getChildByName('none').opacity = 0;
                    this.bubble.opacity = 0;
                }else if(this.boardNode.getChildByName('answer2').getChildByName('none').getBoundingBox().contains(point2)) {
                    this.eventvalue.levelData[this.checkpointIndex-1].subject[1] = i + 1;
                    this.eventvalue.levelData[this.checkpointIndex-1].result = 2; 
                    this.boardNode.getChildByName('answer2').getChildByName('answer').getComponent(cc.Sprite).spriteFrame = this.bubble.getComponent(cc.Sprite).spriteFrame;
                    this.boardNode.getChildByName('answer2').getChildByName('answer').opacity = 255;
                    this.boardNode.getChildByName('answer2').getChildByName('none').opacity = 0;
                    this.bubble.opacity = 0;
                }else if(this.boardNode.getChildByName('answer3').getChildByName('none').getBoundingBox().contains(point3)) {
                    this.eventvalue.levelData[this.checkpointIndex-1].subject[2] = i + 1;
                    this.eventvalue.levelData[this.checkpointIndex-1].result = 2; 
                    this.boardNode.getChildByName('answer3').getChildByName('answer').getComponent(cc.Sprite).spriteFrame = this.bubble.getComponent(cc.Sprite).spriteFrame;
                    this.boardNode.getChildByName('answer3').getChildByName('answer').opacity = 255;
                    this.boardNode.getChildByName('answer3').getChildByName('none').opacity = 0;
                    this.bubble.opacity = 0;
                }else {
                    this.bubble.opacity = 0;
                }
            }.bind(this));
        } 
    }

    isRight():boolean {
        if(this.checkpointIndex == 1) {
            if(this.boardNode.getChildByName('answer1').getChildByName('answer').getComponent(cc.Sprite).spriteFrame == this.answerNode.getChildByName('3').getComponent(cc.Sprite).spriteFrame&&this.boardNode.getChildByName('answer1').getChildByName('answer').opacity == 255) {
                if(this.boardNode.getChildByName('answer2').getChildByName('answer').getComponent(cc.Sprite).spriteFrame == this.answerNode.getChildByName('2').getComponent(cc.Sprite).spriteFrame&&this.boardNode.getChildByName('answer2').getChildByName('answer').opacity == 255) {
                    this.plateNode1.getChildByName('right').active = true;
                    this.submitButton.interactable = false;
                    return true;
                }else {
                    AudioManager.getInstance().stopAll();
                    AudioManager.getInstance().playSound('阿欧', false);
                    return false;
                }
            }else {
                AudioManager.getInstance().stopAll();
                AudioManager.getInstance().playSound('阿欧', false);
                return false;
            }
        }else if(this.checkpointIndex ==2) {
            if(this.boardNode.getChildByName('answer1').getChildByName('answer').getComponent(cc.Sprite).spriteFrame == this.answerNode.getChildByName('3').getComponent(cc.Sprite).spriteFrame&&this.boardNode.getChildByName('answer1').getChildByName('answer').opacity == 255) {
                if(this.boardNode.getChildByName('answer2').getChildByName('answer').getComponent(cc.Sprite).spriteFrame == this.answerNode.getChildByName('3').getComponent(cc.Sprite).spriteFrame&&this.boardNode.getChildByName('answer2').getChildByName('answer').opacity == 255) {
                    if(this.boardNode.getChildByName('answer3').getChildByName('answer').getComponent(cc.Sprite).spriteFrame == this.answerNode.getChildByName('5').getComponent(cc.Sprite).spriteFrame&&this.boardNode.getChildByName('answer3').getChildByName('answer').opacity == 255) {
                        this.plateNode2.getChildByName('right').active = true;
                        this.submitButton.interactable = false;
                        return true;
                    }else {
                        AudioManager.getInstance().stopAll();
                        AudioManager.getInstance().playSound('阿欧', false);
                        return false;
                    }
                }else {
                    AudioManager.getInstance().stopAll();
                    AudioManager.getInstance().playSound('阿欧', false);
                    return false;
                }
            }else {
                AudioManager.getInstance().stopAll();
                AudioManager.getInstance().playSound('阿欧', false);
                return false;
            }
        }else if(this.checkpointIndex == 3) {
            if(this.boardNode.getChildByName('answer1').getChildByName('answer').getComponent(cc.Sprite).spriteFrame == this.answerNode.getChildByName('3').getComponent(cc.Sprite).spriteFrame&&this.boardNode.getChildByName('answer1').getChildByName('answer').opacity == 255) {
                if(this.boardNode.getChildByName('answer2').getChildByName('answer').getComponent(cc.Sprite).spriteFrame == this.answerNode.getChildByName('2').getComponent(cc.Sprite).spriteFrame&&this.boardNode.getChildByName('answer2').getChildByName('answer').opacity == 255) {
                    if(this.boardNode.getChildByName('answer3').getChildByName('answer').getComponent(cc.Sprite).spriteFrame == this.answerNode.getChildByName('7').getComponent(cc.Sprite).spriteFrame&&this.boardNode.getChildByName('answer3').getChildByName('answer').opacity == 255) {
                        this.plateNode3.getChildByName('right').active = true;
                        this.submitButton.interactable = false;
                        return true;
                    }else {
                        AudioManager.getInstance().stopAll();
                        AudioManager.getInstance().playSound('阿欧', false);
                        return false;
                    }
                }else {
                    AudioManager.getInstance().stopAll();
                    AudioManager.getInstance().playSound('阿欧', false);
                    return false;
                }
            }else {
                AudioManager.getInstance().stopAll();
                AudioManager.getInstance().playSound('阿欧', false);
                return false;
            }
        }
    }

    submit() {
        cc.log('------------');
        if(this.enableSelect) {
            if(this.isRight()) {
                this.enableSelect = false;
                if(this.checkpointIndex == 1){
                    setTimeout(() => {
                        this.round2();
                    }, 2000);
                }else if(this.checkpointIndex == 2) {
                    setTimeout(() => {
                        this.round3();
                    }, 2000);
                }else if(this.checkpointIndex == 3) {
                    this.success();
                }
            }else {
                this.enableSelect = true;
            }
        }
    }

    success() {
        UIHelp.showOverTips(2,'闯关成功，棒棒的', function(){
            AudioManager.getInstance().playSound('闯关成功，棒棒的');
        }.bind(this), function(){}.bind(this));
        this.mask.active = true;
        this.eventvalue.result = 1;
        DataReporting.getInstance().dispatchEvent('addLog', {
            eventType: 'clickSubmit',
            eventValue: JSON.stringify(this.eventvalue)
        });
        cc.log(this.eventvalue);
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
