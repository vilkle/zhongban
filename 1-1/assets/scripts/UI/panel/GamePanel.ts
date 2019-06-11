import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import {UIHelp} from "../../Utils/UIHelp";
import {AudioManager} from "../../Manager/AudioManager"
import {ConstValue} from "../../Data/ConstValue"
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "../panel/UploadAndReturnPanel"
import DataReporting from "../../Data/DataReporting";
import { Tools } from "../../UIComm/Tools";

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
    @property(sp.Skeleton)
    private mouse : sp.Skeleton = null;
    @property(cc.Node)
    private kaoxiangNode : cc.Node = null;
    @property(cc.Node)
    private guoNode : cc.Node = null;
    @property(cc.Node)
    private mouseBoundingBox : cc.Node = null;
    private oriPosArr : Array<cc.Vec2> = Array<cc.Vec2>();
    private audioArr : Array<number> = Array<number>();
    private checkpointIndex : number = 0;
    private checkpointNum : number = 5;
    private isTouch : boolean = false;
    private answerNum : number = 0;
    private audioEnable : boolean = false;
    private timeoutIndex : number = 0;
    private fiveAlready: boolean = false;
    private touchEnd : boolean = true;
    private isOver : number = 0;
    private eventvalue = {
        isResult: 1,
        isLevel: 1,
        levelData: [

        ],
        result: 4
    }

    onLoad() {
        if(ConstValue.IS_TEACHER) {
            UIManager.getInstance().openUI(UploadAndReturnPanel);
        }
        AudioManager.getInstance().playBGM('bgm_kitchen');
        AudioManager.getInstance().playSound('我们来做点吃的吧', false, 1, (id)=>{this.audioArr.push(id) }, (id)=>{
            this.audioArr.filter(item => item !== id); 
            this.audioEnable = true;
            AudioManager.getInstance().playSound('能做几个爆米花', false, 1, (id)=>{ this.audioArr.push(id) }, (id)=>{ this.audioArr.filter(item => item !== id); this.audioEnable = true;});
        });
        this.round1(5);
        this.mouseBoundingBox.on(cc.Node.EventType.TOUCH_START, function(e){
            if(this.mouseBoundingBox.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                this.isTouch = true;
                this.mouse.setAnimation(0, 'talk', false);
                if(!this.audioEnable) {
                    return;
                }
                if(this.checkpointIndex == 1) {
                    this.stopAll();
                    AudioManager.getInstance().playSound('能做几个爆米花',false,1,(id)=>{this.audioArr.push(id)}, function(id){this.audioArr.filter(item =>item !== id); this.audioEnable = true;}.bind(this));
                }else if(this.checkpointIndex == 2) {
                    this.stopAll();
                    AudioManager.getInstance().playSound('能做几个煎鸡蛋',false,1,function(id){this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item =>item !== id); this.audioEnable = true;}.bind(this));
                }else if(this.checkpointIndex == 3) {
                    this.stopAll();
                    AudioManager.getInstance().playSound('能做几个烤面包',false,1,function(id){this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item =>item !== id); this.audioEnable = true;}.bind(this));
                }else if(this.checkpointIndex == 4) {
                    this.stopAll();
                    AudioManager.getInstance().playSound('能做几个爆米花',false,1,function(id){this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item =>item !== id); this.audioEnable = true;}.bind(this));
                }else if(this.checkpointIndex == 5) {
                    this.stopAll();
                    AudioManager.getInstance().playSound('能做几个煎鸡蛋',false,1,function(id){this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item =>item !== id); this.audioEnable = true;}.bind(this));
                }
            }
        }.bind(this));
    }

    stopAll() {
        this.audioEnable = false;
        for(let i = 0; i < this.audioArr.length; i++) {
            AudioManager.getInstance().stopAudio(this.audioArr[i]);
        }
        this.audioArr = [];
    }

    start() {
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        for(let i = 0; i < 5; i++) {
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
        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: this.isOver });
    }

    onDestroy() {
        clearTimeout(this.timeoutIndex);
    }

    onShow() {
    }

    setPanel() {

    }

    round1(num : number) {
        this.fiveAlready = false;
        this.answerNum = 0;
        clearTimeout(this.timeoutIndex);    
        this.checkpointIndex ++;
        this.guoNode.runAction(cc.moveBy(1.33, cc.v2(-1600, 0)));
        for(let i = 1; i <= 9; i++) {
            var bgItem : cc.Node = this.itemNode.getChildByName(i.toString());
            if(i <= num) {
                bgItem.active = true;
                bgItem.getComponent(cc.Sprite).spriteFrame = this.corn;
                bgItem.setScale(0);
                bgItem.runAction(cc.scaleTo(0.2,1,1));
                this.removeListener(bgItem);
                this.addListener(bgItem, i, num, this.guoNode, this.popcorn);
            }else { 
                bgItem.active = false;
            }
        }
        for(let i = 1; i <= 9; i++) {
            var guoItem = this.guoNode.getChildByName(i.toString());
            guoItem.active = false;
        }
    }

    round2(num : number) {
        this.fiveAlready = false;
        this.stopAll();
        clearTimeout(this.timeoutIndex);
        AudioManager.getInstance().playSound('能做几个煎鸡蛋',false,1,function(id){this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item =>item !== id); this.audioEnable = true;}.bind(this));
        this.answerNum = 0;
        this.checkpointIndex ++;
        for(let i = 1; i <= 9; i++) {
            var bgItem : cc.Node = this.itemNode.getChildByName(i.toString());
            if(i <= num) {
                bgItem.active = true;
                bgItem.setScale(0);
                bgItem.runAction(cc.scaleTo(0.2,1,1));
                bgItem.getComponent(cc.Sprite).spriteFrame = this.egg;
                this.removeListener(bgItem);
                this.addListener(bgItem, i, num, this.guoNode, this.omelette);
            }else { 
                bgItem.active = false;
            }
        }
        for(let i = 1; i <= 9; i++) {
            var guoItem = this.guoNode.getChildByName(i.toString());
            guoItem.active = false;
        }
    }

    round3(num : number) {
        this.fiveAlready = false;
        this.answerNum = 0;
        clearTimeout(this.timeoutIndex);
        this.checkpointIndex ++;
        var seq = cc.sequence(cc.moveBy(1.33,cc.v2(1600, 0)), cc.callFunc(function(){
            this.guoNode.setPosition(cc.v2(1797, -215));
            this.kaoxiangNode.runAction(cc.sequence(cc.moveBy(1.33, cc.v2(-1600, 0)), cc.callFunc(function(){
                this.stopAll();
                AudioManager.getInstance().playSound('能做几个烤面包',false,1,function(id){this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item =>item !== id); this.audioEnable = true;}.bind(this));
            }.bind(this))));

        }.bind(this)));
        this.guoNode.runAction(seq);
       
        for(let i = 1; i <= 9; i++) {
            var bgItem : cc.Node = this.itemNode.getChildByName(i.toString());
            if(i <= num) {
                bgItem.active = true;
                bgItem.setScale(0);
                bgItem.runAction(cc.scaleTo(0.2,1,1));
                bgItem.getComponent(cc.Sprite).spriteFrame = this.bread;
                this.removeListener(bgItem);
                this.addListener(bgItem, i, num, this.kaoxiangNode, this.toast);
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
        this.fiveAlready = false;
        this.answerNum = 0;
        clearTimeout(this.timeoutIndex);
        this.checkpointIndex ++;
        var seq = cc.sequence(cc.moveBy(1.33,cc.v2(1600, 0)), cc.callFunc(function(){
            this.guoNode.runAction(cc.sequence(cc.moveBy(1.33, cc.v2(-1600, 0)), cc.callFunc(function(){
                this.stopAll();
                AudioManager.getInstance().playSound('能做几个爆米花',false,1,function(id){this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item =>item !== id); this.audioEnable = true;}.bind(this));
            }.bind(this))));

        }.bind(this)));
        this.kaoxiangNode.runAction(seq);
        for(let i = 1; i <= 9; i++) {
            var bgItem : cc.Node = this.itemNode.getChildByName(i.toString());
            if(i <= num) {
                bgItem.active = true;
                bgItem.setScale(0);
                bgItem.runAction(cc.scaleTo(0.2,1,1));
                bgItem.getComponent(cc.Sprite).spriteFrame = this.corn;
                this.removeListener(bgItem);
                this.addListener(bgItem, i, num, this.guoNode, this.popcorn);
            }else { 
                bgItem.active = false;
            }
        }
        for(let i = 1; i <= 9; i++) {
            var guoItem = this.guoNode.getChildByName(i.toString());
            guoItem.active = false;
        }
    }

    round5(num : number) {
        this.fiveAlready = false;
        this.stopAll();
        clearTimeout(this.timeoutIndex);
        AudioManager.getInstance().playSound('能做几个煎鸡蛋',false,1,function(id){this.audioArr.push(id)}.bind(this), function(id){this.audioArr.filter(item =>item !== id); this.audioEnable = true;}.bind(this));
        this.answerNum = 0;
        this.checkpointIndex ++;
        for(let i = 1; i <= 9; i++) {
            var bgItem : cc.Node = this.itemNode.getChildByName(i.toString());
            if(i <= num) {
                bgItem.active = true;
                bgItem.setScale(0);
                bgItem.runAction(cc.scaleTo(0.2,1,1));
                bgItem.getComponent(cc.Sprite).spriteFrame = this.egg;
                this.removeListener(bgItem);
                this.addListener(bgItem, i, num, this.guoNode, this.omelette);
            }else { 
                bgItem.active = false;
            }
        }
        for(let i = 1; i <= 9; i++) {
            var guoItem = this.guoNode.getChildByName(i.toString());
            guoItem.active = false;
        }
    }

    success() {
        clearTimeout(this.timeoutIndex);
        this.isTouch = false;
        // UIHelp.showOverTips(1,"闯关成功！",true,function(){
            
        // });
        if(this.checkpointIndex == 1) {
            this.stopAll();
            AudioManager.getInstance().playSound('“五个爆米花_');
            this.eventvalue.levelData[0].subject = '';
            this.eventvalue.levelData[0].answer = '';
            this.eventvalue.levelData[0].result = 1;
            this.eventvalue.result = 2;
            this.isOver = 2;
            setTimeout(function(){
                this.round2(6);
            }.bind(this), 2000);
        }else if(this.checkpointIndex == 2) {
            this.stopAll();
            AudioManager.getInstance().playSound('六个煎鸡蛋_');
            this.eventvalue.levelData[1].subject = '';
            this.eventvalue.levelData[1].answer = '';
            this.eventvalue.levelData[1].result = 1;
            this.eventvalue.result = 2;
            this.isOver = 2;
            setTimeout(function(){
                this.round3(7);
            }.bind(this), 2000);
        }else if(this.checkpointIndex == 3) {
            this.stopAll();
            AudioManager.getInstance().playSound('七个烤面包_');
            this.eventvalue.levelData[2].subject = '';
            this.eventvalue.levelData[2].answer = '';
            this.eventvalue.levelData[2].result = 1;
            this.eventvalue.result = 2;
            this.isOver = 2;
            setTimeout(function(){
                this.round4(8);
            }.bind(this), 2000);
        }else if(this.checkpointIndex == 4) {
            this.stopAll();
            AudioManager.getInstance().playSound('“八个爆米花_');
            this.eventvalue.levelData[3].subject = '';
            this.eventvalue.levelData[3].answer = '';
            this.eventvalue.levelData[3].result = 1;
            this.eventvalue.result = 2;
            this.isOver = 2;
            setTimeout(function(){
                this.round5(9);
            }.bind(this), 2000);
        }else if(this.checkpointIndex == 5) {
            this.stopAll();
            AudioManager.getInstance().playSound('九个煎鸡蛋_');
            this.eventvalue.levelData[4].subject = '';
            this.eventvalue.levelData[4].answer = '';
            this.eventvalue.levelData[4].result = 1;
            this.eventvalue.result = 1;
            this.isOver = 1;
            DataReporting.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify(this.eventvalue)
            });
            setTimeout(function(){
                this.gameEnd();
            }.bind(this), 2000);
        }
    }

    gameEnd() {  
        UIHelp.showOverTips(2,'闯关成功，棒棒的', function(){
            this.stopAll();
            AudioManager.getInstance().playSound('闯关成功，棒棒的');
        }.bind(this), function(){}.bind(this));
    }
    removeListener(item : cc.Node) {
        item.off(cc.Node.EventType.TOUCH_START);
        item.off(cc.Node.EventType.TOUCH_MOVE);
        item.off(cc.Node.EventType.TOUCH_END);
        item.off(cc.Node.EventType.TOUCH_CANCEL);
    }
    addListener(item : cc.Node, IndexNum : number, totalNum : number, dirNode : cc.Node, dirFrame : cc.SpriteFrame) {
        item.on(cc.Node.EventType.TOUCH_START, function(e){
            if(!this.fiveAlready&&IndexNum > 5) {
                return;
            }
            clearTimeout(this.timeoutIndex);
            this.timeoutIndex = setTimeout(function(){
                    AudioManager.getInstance().playSound('记得数全哦',false,1,(id)=>{this.audioArr.push(id)}, function(id){this.audioArr.filter(item =>item !== id); this.audioEnable = true;}.bind(this));
            }.bind(this), 3000);
            this.isTouch = true;
            if(!this.touchEnd) {
                return;
            }
            this.touchEnd = false;
            AudioManager.getInstance().playSound('sfx_catch');
            for(let i = 1; i <= totalNum; i++) {
                let pos = this.itemNode.getChildByName(i.toString()).getPosition();
                this.oriPosArr[i - 1] = pos;
            }
        }.bind(this));
        item.on(cc.Node.EventType.TOUCH_MOVE, function(e){
            if(IndexNum <= 5) {
                for(let i = 1; i <= 5; i++) {
                    let node = this.itemNode.getChildByName(i.toString());
                    let delta = e.touch.getDelta();
                    let x = node.x;
                    let y = node.y;
                 
                    node.setPosition(cc.v2(x+delta.x, y+delta.y));
                  
                }
            }else {
                if(!this.fiveAlready) {
                    return;
                }
                let node = this.itemNode.getChildByName(IndexNum.toString());
                let delta = e.touch.getDelta();
                let x = node.x;
                let y = node.y;
                node.setPosition(cc.v2(x+delta.x, y+delta.y));
            }  
        }.bind(this));
        item.on(cc.Node.EventType.TOUCH_END, function(e){
            this.touchEnd = true;
            if(dirNode.getChildByName('boundingbox').getBoundingBox().contains(dirNode.convertToNodeSpaceAR(e.currentTouch._point))) {
                if(IndexNum <= 5) {
                    this.fiveAlready = true;
                    for(let i = 1; i <= 5; i++) {
                        let dirnode = dirNode.getChildByName(i.toString());
                        dirnode.getComponent(cc.Sprite).spriteFrame = item.getComponent(cc.Sprite).spriteFrame;
                        dirnode.active = true;
                        let node = this.itemNode.getChildByName(i.toString());
                        node.setPosition(this.oriPosArr[i - 1]);
                        node.active = false;
                        this.answerNum ++;
                    }
                    if(this.answerNum == totalNum) {
                        for(let i = 1; i <= totalNum; i++) {
                            let itemNode = dirNode.getChildByName(i.toString());
                            if(this.checkpointIndex != 3) {
                                AudioManager.getInstance().playSound('sfx_fry');
                            }else {
                                AudioManager.getInstance().playSound('sfx_bake');
                            }
                            itemNode.runAction(cc.sequence(cc.delayTime(1), cc.scaleTo(0.133, 0, 0), cc.callFunc(function(){
                                itemNode.getComponent(cc.Sprite).spriteFrame = dirFrame;
                               
                            }.bind(this)), cc.scaleTo(0.3, 1.3, 1.3), cc.callFunc(function() {
                                if(this.checkpointIndex != 3) {
                                    AudioManager.getInstance().playSound('sfx_fried');
                                }else {
                                    AudioManager.getInstance().playSound('sfx_baked');
                                }
                            }.bind(this)), cc.scaleTo(0.433, 1, 1)));
                        }
                        this.success();
                    }
                }else {
                    if(!this.fiveAlready) {
                        return;
                    }
                    this.answerNum++;
                    let dirnode = dirNode.getChildByName(IndexNum.toString());
                    dirnode.getComponent(cc.Sprite).spriteFrame = item.getComponent(cc.Sprite).spriteFrame;
                    dirnode.active = true;
                    let node = this.itemNode.getChildByName(IndexNum.toString());
                    node.setPosition(this.oriPosArr[IndexNum - 1]);
                    node.active = false;
                    if(this.answerNum == totalNum) {
                        for(let i = 1; i <= totalNum; i++) {
                            if(i == totalNum) {
                                if(this.checkpointIndex != 3) {
                                    AudioManager.getInstance().playSound('sfx_fry');
                                }else {
                                    AudioManager.getInstance().playSound('sfx_bake');
                                }
                            }
                            let itemNode = dirNode.getChildByName(i.toString());
                            itemNode.runAction(cc.sequence(cc.delayTime(1), cc.scaleTo(0.133, 0, 0), cc.callFunc(function(){
                                itemNode.getComponent(cc.Sprite).spriteFrame = dirFrame;
                               
                            }.bind(this)), cc.scaleTo(0.3, 1.3, 1.3),  cc.callFunc(function(){
                                if(i == totalNum) {
                                    if(this.checkpointIndex != 3) {
                                        AudioManager.getInstance().playSound('sfx_fried');
                                    }else {
                                        AudioManager.getInstance().playSound('sfx_baked');
                                    }
                                }
                            }.bind(this)),cc.scaleTo(0.433, 1, 1)));
                        }
                        this.success();
                    }
                }   
            }else {
                
                if(IndexNum <= 5) {
                    for(let i = 1; i <= 5; i++) {
                        let node = this.itemNode.getChildByName(i.toString());
                        node.setPosition(this.oriPosArr[i - 1]);
                    }
                }else {
                    let node = this.itemNode.getChildByName(IndexNum.toString());
                        node.setPosition(this.oriPosArr[IndexNum - 1]);
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
