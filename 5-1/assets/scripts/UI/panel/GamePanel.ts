import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import {UIHelp} from "../../Utils/UIHelp";

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
    private bearSpine : cc.Node = null;
    @property(sp.Skeleton)
    private milkSpine : cc.Node = null; 
    @property(cc.Node)
    private bubble : cc.Node = null;
    @property(cc.Node)
    private mask : cc.Node = null;
    private enableSelect : boolean = false;
    private answerArr : Array<cc.Node> = new Array<cc.Node>();
    private checkpointIndex : number = 0;
    onLoad() {
        this.initAnswerArr();
        this.mask.on(cc.Node.EventType.TOUCH_START, function(e){
            e.stopPropagation();
        });
    }

    start() {
        this.round1();
        this.addListenerOnBubble();
    }

    onDestroy() {

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
        this.plateNode1.runAction(cc.sequence( cc.moveBy(0.6, cc.v2(0, 800)), cc.callFunc(function(){
            //this.round2();
            this.mask.active = false;
        }.bind(this))));


    }

    round2() {
        this.checkpointIndex = 2;
        this.mask.active = true;
        this.ovenNode.runAction(cc.sequence(cc.moveBy(0.3, cc.v2(0, 210)),cc.callFunc(function(){
            this.plateNode1.runAction(cc.sequence(cc.moveBy(0.6, cc.v2(0, 970)),cc.callFunc(function(){
                this.ovenNode.runAction(cc.sequence(cc.moveBy(0.3, cc.v2(0, -210)), cc.callFunc(function(){
                    this.plateNode2.runAction(cc.sequence( cc.moveBy(0.6, cc.v2(0, 800)), cc.callFunc(function(){
                        this.boardNode.getChildByName('pic3').active = true;
                        this.boardNode.getChildByName('answer3').active = true;
                        this.reset();
                        //this.round3();
                        this.mask.active = false;
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
            this.plateNode2.runAction(cc.sequence(cc.moveBy(0.6, cc.v2(0, 970)),cc.callFunc(function(){
                this.ovenNode.runAction(cc.sequence(cc.moveBy(0.3, cc.v2(0, -210)), cc.callFunc(function(){
                    this.plateNode3.runAction(cc.sequence( cc.moveBy(0.6, cc.v2(0, 800)), cc.callFunc(function(){
                        this.boardNode.getChildByName('pic3').active = true;
                        this.boardNode.getChildByName('answer3').active = true;
                        this.reset();
                        this.mask = false;
                        cc.log('action over');
                    }.bind(this))));
                }.bind(this))));
            }.bind(this))));
        }.bind(this))));
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
                    this.boardNode.getChildByName('answer1').getChildByName('answer').getComponent(cc.Sprite).spriteFrame = this.bubble.getComponent(cc.Sprite).spriteFrame;
                    this.boardNode.getChildByName('answer1').getChildByName('answer').opacity = 255;
                    this.boardNode.getChildByName('answer1').getChildByName('none').opacity = 0;
                    this.bubble.opacity = 0;
                }else if(this.boardNode.getChildByName('answer2').getChildByName('none').getBoundingBox().contains(point2)) {
                    this.boardNode.getChildByName('answer2').getChildByName('answer').getComponent(cc.Sprite).spriteFrame = this.bubble.getComponent(cc.Sprite).spriteFrame;
                    this.boardNode.getChildByName('answer2').getChildByName('answer').opacity = 255;
                    this.boardNode.getChildByName('answer2').getChildByName('none').opacity = 0;
                    this.bubble.opacity = 0;
                }else if(this.boardNode.getChildByName('answer3').getChildByName('none').getBoundingBox().contains(point3)) {
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
                    return true;
                }else {
                    return false;
                }
            }else {
                return false;
            }
        }else if(this.checkpointIndex ==2) {
            if(this.boardNode.getChildByName('answer1').getChildByName('answer').getComponent(cc.Sprite).spriteFrame == this.answerNode.getChildByName('3').getComponent(cc.Sprite).spriteFrame&&this.boardNode.getChildByName('answer1').getChildByName('answer').opacity == 255) {
                if(this.boardNode.getChildByName('answer2').getChildByName('answer').getComponent(cc.Sprite).spriteFrame == this.answerNode.getChildByName('3').getComponent(cc.Sprite).spriteFrame&&this.boardNode.getChildByName('answer2').getChildByName('answer').opacity == 255) {
                    if(this.boardNode.getChildByName('answer3').getChildByName('answer').getComponent(cc.Sprite).spriteFrame == this.answerNode.getChildByName('5').getComponent(cc.Sprite).spriteFrame&&this.boardNode.getChildByName('answer3').getChildByName('answer').opacity == 255) {
                        return true;
                    }else {
                        return false;
                    }
                }else {
                    return false;
                }
            }else {
                return false;
            }
        }else if(this.checkpointIndex == 3) {
            if(this.boardNode.getChildByName('answer1').getChildByName('answer').getComponent(cc.Sprite).spriteFrame == this.answerNode.getChildByName('3').getComponent(cc.Sprite).spriteFrame&&this.boardNode.getChildByName('answer1').getChildByName('answer').opacity == 255) {
                if(this.boardNode.getChildByName('answer2').getChildByName('answer').getComponent(cc.Sprite).spriteFrame == this.answerNode.getChildByName('2').getComponent(cc.Sprite).spriteFrame&&this.boardNode.getChildByName('answer2').getChildByName('answer').opacity == 255) {
                    if(this.boardNode.getChildByName('answer3').getChildByName('answer').getComponent(cc.Sprite).spriteFrame == this.answerNode.getChildByName('7').getComponent(cc.Sprite).spriteFrame&&this.boardNode.getChildByName('answer3').getChildByName('answer').opacity == 255) {
                        return true;
                    }else {
                        return false;
                    }
                }else {
                    return false;
                }
            }else {
                return false;
            }
        }
    }

    submit() {
        if(this.isRight()) {
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
        }
    }

    success() {
        this.mask.active = true;
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
