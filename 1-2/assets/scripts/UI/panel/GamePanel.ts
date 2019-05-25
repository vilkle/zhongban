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
    private checkpointIndex = 1;
    private checkpointNum = 4;

    onLoad() {
        var candy = this.box1.getChildByName('1');
        var pos = this.box1.convertToNodeSpaceAR(this.point.getPosition());
        cc.log('-----------------',pos);
        candy.runAction(cc.jumpTo(2, cc.v2(1350, -65)));
        this.round1();
        this.addListener();
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
        }
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
        }
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
        }
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
        }
    }

    addListener() {
        this.bg.on(cc.Node.EventType.TOUCH_END, function(e){
            cc.log(this.box1.getBoundingBox());
            cc.log(this.node.convertToNodeSpaceAR(e.currentTouch._point));
            if(this.box1.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))){
                this.isRight(1, this.checkpointNum);
                cc.log('-----------------1');
            }else if(this.box2.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                this.isRight(2, this.checkpointNum);
                cc.log('-----------------2');
            }else if(this.box3.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                this.isRight(3, this.checkpointNum);
                cc.log('-----------------3');
            }
        }.bind(this));
    }

    isRight(boxNum : number, roundNum : number):boolean {
        if(roundNum == 1) {
            if(boxNum == 1) {
                this.success();
                return true;
            }else {
                return false;
            }
        }else if(roundNum == 2) {
            if(boxNum == 3) {
                this.success();
                return true;
            }else {
                return false;
            }
        }
        else if(roundNum == 3) {
            if(boxNum == 2) {
                this.success();
                return true;
            }else {
                return false;
            }
        }
        else if(roundNum == 4) {
            if(boxNum == 1) {
                this.success();
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
