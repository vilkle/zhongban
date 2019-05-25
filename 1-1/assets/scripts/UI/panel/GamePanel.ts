import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import {UIHelp} from "../../Utils/UIHelp";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";
    @property(cc.SpriteFrame)
    private popcorn : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private omelette : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private egg : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private bread : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private toast : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private corn : cc.SpriteFrame = null;
    @property(cc.Node)
    private itemNode : cc.Node = null;
    @property(cc.Node)
    private kaoxiangNode : cc.Node = null;
    @property(cc.Node)
    private guoNode : cc.Node = null;
    private oriPosArr : Array<cc.Vec2> = Array<cc.Vec2>();
    private checkpointIndex : number = 0;
    private checkpointNum : number = 5;
    private isTouch : boolean = false;
    onLoad() {
        this.round1(5);
    }

    start() {
    }

    onDestroy() {

    }

    onShow() {
    }

    setPanel() {

    }

    round1(num : number) {
        setTimeout(function(){
            if(this.isTouch == false) {
                cc.log('---------------3s');
            } 
        }.bind(this), 3000);
        this.checkpointIndex ++;
        this.guoNode.active = true;
        this.kaoxiangNode.active = false;
        for(let i = 1; i <= 9; i++) {
            var bgItem : cc.Node = this.itemNode.getChildByName(i.toString());
            if(i <= num) {
                bgItem.active = true;
                bgItem.getComponent(cc.Sprite).spriteFrame = this.corn;
                this.removeListener(bgItem);
                this.addListener(bgItem, num, this.guoNode, this.popcorn);
            }else { 
                bgItem.active = false;
            }
        }
        for(let i = 1; i <= 6; i++) {
            var guoItem = this.guoNode.getChildByName(i.toString());
            guoItem.active = false;
        }
    }

    round2(num : number) {
        setTimeout(function(){
            if(this.isTouch == false) {
                cc.log('---------------3s');
            } 
        }.bind(this), 3000);
        this.checkpointIndex ++;
        this.guoNode.active = true;
        this.kaoxiangNode.active = false;
        for(let i = 1; i <= 9; i++) {
            var bgItem : cc.Node = this.itemNode.getChildByName(i.toString());
            if(i <= num) {
                bgItem.active = true;
                bgItem.getComponent(cc.Sprite).spriteFrame = this.egg;
                this.removeListener(bgItem);
                this.addListener(bgItem, num, this.guoNode, this.omelette);
            }else { 
                bgItem.active = false;
            }
        }
        for(let i = 1; i <= 6; i++) {
            var guoItem = this.guoNode.getChildByName(i.toString());
            guoItem.active = false;
        }
    }

    round3(num : number) {
        setTimeout(function(){
            if(this.isTouch == false) {
                cc.log('---------------3s');
            } 
        }.bind(this), 3000);
        this.checkpointIndex ++;
        this.guoNode.active = false;
        this.kaoxiangNode.active = true;
        for(let i = 1; i <= 9; i++) {
            var bgItem : cc.Node = this.itemNode.getChildByName(i.toString());
            if(i <= num) {
                bgItem.active = true;
                bgItem.getComponent(cc.Sprite).spriteFrame = this.bread;
                this.removeListener(bgItem);
                this.addListener(bgItem, num, this.kaoxiangNode, this.toast);
            }else { 
                bgItem.active = false;
            }
        }
        for(let i = 1; i <= 9; i++) {
            var guoItem = this.kaoxiangNode.getChildByName(i.toString());
            guoItem.active = false;
        }
    }

    round4(num : number) {
        setTimeout(function(){
            if(this.isTouch == false) {
                cc.log('---------------3s');
            } 
        }.bind(this), 3000);
        this.checkpointIndex ++;
        this.guoNode.active = false;
        this.kaoxiangNode.active = true;
        for(let i = 1; i <= 9; i++) {
            var bgItem : cc.Node = this.itemNode.getChildByName(i.toString());
            if(i <= num) {
                bgItem.active = true;
                bgItem.getComponent(cc.Sprite).spriteFrame = this.bread;
                this.removeListener(bgItem);
                this.addListener(bgItem, num, this.kaoxiangNode, this.toast);
            }else { 
                bgItem.active = false;
            }
        }
        for(let i = 1; i <= 9; i++) {
            var guoItem = this.kaoxiangNode.getChildByName(i.toString());
            guoItem.active = false;
        }
    }

    round5(num : number) {
        setTimeout(function(){
            if(this.isTouch == false) {
                cc.log('---------------3s');
            } 
        }.bind(this), 3000);
        this.checkpointIndex ++;
        this.guoNode.active = false;
        this.kaoxiangNode.active = true;
        for(let i = 1; i <= 9; i++) {
            var bgItem : cc.Node = this.itemNode.getChildByName(i.toString());
            if(i <= num) {
                bgItem.active = true;
                bgItem.getComponent(cc.Sprite).spriteFrame = this.bread;
                this.removeListener(bgItem);
                this.addListener(bgItem, num, this.kaoxiangNode, this.toast);
            }else { 
                bgItem.active = false;
            }
        }
        for(let i = 1; i <= 9; i++) {
            var guoItem = this.kaoxiangNode.getChildByName(i.toString());
            guoItem.active = false;
        }
    }

    success() {
        this.isTouch = false;
        // UIHelp.showOverTips(1,"闯关成功！",true,function(){
            
        // });
        if(this.checkpointIndex == 1) {
            setTimeout(function(){
                this.round2(6);
            }.bind(this), 2000);
        }else if(this.checkpointIndex == 2) {
            setTimeout(function(){
                this.round3(7);
            }.bind(this), 2000);
        }else if(this.checkpointIndex == 3) {
            setTimeout(function(){
                this.round4(8);
            }.bind(this), 2000);
        }else if(this.checkpointIndex == 4) {
            setTimeout(function(){
                this.round5(9);
            }.bind(this), 2000);
        }else if(this.checkpointIndex == 5) {
            setTimeout(function(){
                this.gameEnd();
            }.bind(this), 2000);
        }
    }

    gameEnd() {

    }
    removeListener(item : cc.Node) {
        item.off(cc.Node.EventType.TOUCH_START);
        item.off(cc.Node.EventType.TOUCH_MOVE);
        item.off(cc.Node.EventType.TOUCH_END);
        item.off(cc.Node.EventType.TOUCH_CANCEL);
    }
    addListener(item : cc.Node, totalNum : number, dirNode : cc.Node, dirFrame : cc.SpriteFrame) {
        item.on(cc.Node.EventType.TOUCH_START, function(e){
            this.isTouch = true;
            for(let i = 1; i <= totalNum; i++) {
                let pos = this.itemNode.getChildByName(i.toString()).getPosition();
                this.oriPosArr[i - 1] = pos;
            }
        }.bind(this));
        item.on(cc.Node.EventType.TOUCH_MOVE, function(e){
            for(let i = 1; i <= totalNum; i++) {
                let node = this.itemNode.getChildByName(i.toString());
                let delta = e.touch.getDelta();
                let x = node.x;
                let y = node.y;
                node.setPosition(cc.v2(x+delta.x, y+delta.y));
            }
        }.bind(this));
        item.on(cc.Node.EventType.TOUCH_END, function(e){
            if(dirNode.getChildByName('boundingbox').getBoundingBox().contains(dirNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                for(let i = 1; i <= totalNum; i++) {
                    let dirnode = dirNode.getChildByName(i.toString());
                    dirnode.getComponent(cc.Sprite).spriteFrame = dirFrame;
                    dirnode.active = true;
                    let node = this.itemNode.getChildByName(i.toString());
                    node.setPosition(this.oriPosArr[i - 1]);
                    node.active = false
                }
                this.success();
            }else {
                for(let i = 1; i <= totalNum; i++) {
                    let node = this.itemNode.getChildByName(i.toString());
                    node.setPosition(this.oriPosArr[i - 1]);
                }
            }
            
        }.bind(this));
        item.on(cc.Node.EventType.TOUCH_CANCEL, function(e){

        }.bind(this));
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
