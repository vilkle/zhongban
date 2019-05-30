import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";

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
    private mouse : cc.Node = null;
    @property(sp.Skeleton)
    private miya : cc.Node = null;
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


    onLoad() {
        // var candy = this.box1.getChildByName('1');
        // var pos = this.box1.convertToNodeSpaceAR(this.point.getPosition());
        // cc.log('-----------------',pos);
        // candy.runAction(cc.jumpTo(2, cc.v2(1350, -65)));
        
        this.addListener();
        for(let i = 1; i <= 10; i++) {
            var pos1 = this.box1.getChildByName(i.toString()).getPosition();
            this.pos1Arr[i - 1] = pos1;
            var pos2 = this.box1.getChildByName(i.toString()).getPosition();
            this.pos2Arr[i - 1] = pos2;
            var pos3 = this.box1.getChildByName(i.toString()).getPosition();
            this.pos3Arr[i - 1] = pos3;
        }
        cc.log(this.pos1Arr);
        this.round1();
    }

    start() {
    }

    onDestroy() {

    }

    onShow() {
    }

    setPanel() {

    }

    round1() {
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
        this.enableClick = true;
    }

    round2() {
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
        this.enableClick = true;
    }

    round3() {
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
        this.enableClick = true;
    }

    round4() {
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
        this.enableClick = true;
    }

    addListener() {
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
                this.enableClick = false;
                for(let i = 1; i <= 5; i++) {
                    this.box1.getChildByName(i.toString()).runAction(cc.sequence(cc.callFunc(function(){
                        if(i == 5) {
                            this.mouse.setAnimation(0, 'idle2', false);
                            this.mouse.setCompleteListener(
                                trackEntry => { 
                                    if(trackEntry.animation.name == 'idle2') {
                                        this.mouse.setAnimation(0, 'idle1', true);
                                    }
                                }
                            );
                        }
                    }.bind(this)),cc.moveTo(0.3, cc.v2(579, 353)), cc.fadeOut(0.1),cc.callFunc(function(){
                        if(i == 5) {
                            this.success();
                        }
                    }.bind(this))));
                }
                return true;
            }else {
                return false;
            }
        }else if(roundNum == 2) {
            if(boxNum == 3) {
                this.enableClick = false;
                for(let i = 1; i <= 6; i++) {
                    this.box3.getChildByName(i.toString()).runAction(cc.sequence(cc.callFunc(function(){
                        if(i == 6) {
                            this.mouse.setAnimation(0, 'idle2', false);
                            this.mouse.setCompleteListener(
                                trackEntry => { 
                                    if(trackEntry.animation.name == 'idle2') {
                                        this.mouse.setAnimation(0, 'idle1', true);
                                    }
                                }
                            );
                        }
                    }.bind(this)), cc.moveTo(0.3, cc.v2(-576, 340)),cc.fadeOut(0.1),cc.callFunc(function(){
                        if(i == 6) {
                            this.success();
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
                this.enableClick = false;
                for(let i = 1; i <= 7; i++) {
                    this.box2.getChildByName(i.toString()).runAction(cc.sequence(cc.callFunc(function(){
                        if(i == 7) {
                            this.mouse.setAnimation(0, 'idle2', false);
                            this.mouse.setCompleteListener(
                                trackEntry => { 
                                    if(trackEntry.animation.name == 'idle2') {
                                        this.mouse.setAnimation(0, 'idle1', true);
                                    }
                                }
                            );
                        }
                    }.bind(this)), cc.moveTo(0.3, cc.v2(6, 345)),cc.fadeOut(0.1),cc.callFunc(function(){
                        if(i == 7) {
                            this.success();
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
                this.enableClick = false;
                for(let i = 1; i <= 8; i++) {
                    this.box1.getChildByName(i.toString()).runAction(cc.sequence(cc.callFunc(function(){
                        if(i == 8) {
                            this.mouse.setAnimation(0, 'idle2', false);
                            this.mouse.setCompleteListener(
                                trackEntry => { 
                                    if(trackEntry.animation.name == 'idle2') {
                                        this.mouse.setAnimation(0, 'idle1', true);
                                    }
                                }
                            );
                        }
                    }.bind(this)),cc.moveTo(0.3, cc.v2(579, 353)), cc.fadeOut(0.1),cc.callFunc(function(){
                        if(i == 8) {
                            this.success();
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

    success() {
        this.checkpointIndex ++;
        if(this.checkpointIndex == 2) {
            setTimeout(function(){
                this.round2();
            }.bind(this), 2000);
        }else if(this.checkpointIndex == 3) {
            setTimeout(function(){
                this.round3();
            }.bind(this), 2000);
        }else if(this.checkpointIndex == 4) {
            setTimeout(function(){
                this.round4();
            }.bind(this), 2000);
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
