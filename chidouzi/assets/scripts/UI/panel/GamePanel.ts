import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import { UIHelp } from "../../Utils/UIHelp";
import { AudioManager } from "../../Manager/AudioManager";
import { ConstValue } from "../../Data/ConstValue";
import { UIManager } from "../../Manager/UIManager";
import UploadAndReturnPanel from "./UploadAndReturnPanel";
import { DaAnData } from "../../Data/DaAnData";

const { ccclass, property } = cc._decorator;

class Chain {
    public bean: cc.Node = null
    public bone: any = null
    public direction: boolean = true //true is right, false is left
}

@ccclass
export default class GamePanel extends BaseUI {

    @property (cc.Node)
    private bg:cc.Node = null;
 
    @property(cc.Node)
    private title: cc.Node = null
    @property(sp.Skeleton)
    private actor: sp.Skeleton = null
    @property(cc.Node)
    private a: cc.Node = null
    @property(cc.Node)
    private b: cc.Node = null
    @property(cc.Node)
    private c: cc.Node = null
    @property(cc.Prefab)
    private beanPrefab: cc.Prefab = null
    @property(cc.SpriteFrame)
    private greenBean: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private yellowBean: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private redBean: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private number2: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private wrong2: cc.SpriteFrame = null 
    @property(cc.SpriteFrame)
    private number3: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private wrong3: cc.SpriteFrame = null 
    @property(cc.SpriteFrame)
    private number4: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private wrong4: cc.SpriteFrame = null 
    @property(cc.SpriteFrame)
    private number5: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private wrong5: cc.SpriteFrame = null 
    @property(cc.SpriteFrame)
    private number6: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private wrong6: cc.SpriteFrame = null 
    @property(cc.SpriteFrame)
    private number7: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private wrong7: cc.SpriteFrame = null 
    private bodyPos: cc.Vec2 = null
    private armRPos: cc.Vec2 = null
    private armLPos: cc.Vec2 = null
    private handRPos: cc.Vec2 = null
    private handLPos: cc.Vec2 = null
    private plateRPos: cc.Vec2 = null
    private plateLPos: cc.Vec2 = null
    private rightPos: cc.Vec2 = null
    private leftPos: cc.Vec2 = null
    private rootPos: cc.Vec2 = null
    private chainArr: Chain[] = []
    private beanArr: cc.Node[] = []
    private numberArr: number[] = [3, 4, 5, 4, 6, 6]
    private answerArr: number[] = []
    private levelNum: number = 0
    private isOver : number = 0;
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
        }
        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, null);
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            // if(this.isOver != 1) {
            //     this.isOver = 2;
            //     this.eventvalue.result = 2;
            //     this.eventvalue.levelData[0].result = 2
            // }
        })
        this.title.on(cc.Node.EventType.TOUCH_START, (e)=>{
           
            //AudioManager.getInstance().stopAll()
            //AudioManager.getInstance().playSound('title', false, 1, null, ()=>{
               
            })
        })
        this.rootPos = this.actor.node.position
        this.bodyPos = cc.v2(this.actor.findBone('body_01').x, this.actor.findBone('body_01').y) 
        this.armLPos = cc.v2(this.actor.findBone('arm_l_01').x, this.actor.findBone('arm_l_01').y) 
        this.armRPos = cc.v2(this.actor.findBone('arm_r_01').x, this.actor.findBone('arm_r_01').y)
        this.handLPos = cc.v2(this.actor.findBone('hand_l_01').x, this.actor.findBone('hand_l_01').y)  
        this.handRPos = cc.v2(this.actor.findBone('hand_r_01').x, this.actor.findBone('hand_r_01').y)
        this.plateLPos = cc.v2(this.actor.findBone('plate_01').x, this.actor.findBone('plate_01').y)
        this.plateRPos = cc.v2(this.actor.findBone('plate_02').x, this.actor.findBone('plate_02').y)
        this.rightPos = this.rootPos.add(this.bodyPos).add(this.armRPos).add(this.handRPos).add(this.plateRPos)
        this.leftPos = this.rootPos.add(this.bodyPos).add(this.armLPos).add(this.handLPos).add(this.plateLPos)
    }

    start() {
        // let id = setTimeout(() => {
        //     AudioManager.getInstance().stopAll()
        //     AudioManager.getInstance().playSound('title', false, 1, null, ()=>{
        //     })
        //     clearTimeout(id)
        // }, 500);
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        this.round1()
    }

    round1() {
        for(let i = 0; i < 3; ++i) {
            let node = cc.instantiate(this.beanPrefab)
            node.getComponent(cc.Sprite).spriteFrame = this.greenBean
            this.node.addChild(node)
            this.beanArr[i] = node
        }
        let chain1 = new Chain()
        let chain2 = new Chain()
        let chain3 = new Chain()

         chain1.bone = this.actor.findBone('bean_l_01_01')
         chain1.bean = this.beanArr[0]
         chain1.direction = false
        chain2.bone = this.actor.findBone('bean_r_02_01')
        chain2.bean = this.beanArr[1]
        chain2.direction = true
        chain3.bone = this.actor.findBone('bean_r_02_02')
        console.log(this.actor.findBone('bean_r_02_02'))
        console.log(cc.v2(this.actor.findBone('bean_r_02_02').worldX, this.actor.findBone('bean_r_02_02').worldY))
        console.log(cc.v2(this.actor.findBone('bean_r_02_02').x, this.actor.findBone('bean_r_02_02').y))
        chain3.bean = this.beanArr[2]
        chain3.direction = true
        this.chainArr.push(chain1)
        this.chainArr.push(chain2)
        this.chainArr.push(chain3)
        for(let i = 0; i < this.chainArr.length; ++i) {
            this.chainArr[i].bean.position = cc.v2(this.chainArr[i].bone.worldX, this.chainArr[i].bone.worldY)
            //console.log(cc.v2(this.chainArr[i].bone.worldX, this.chainArr[i].bone.worldY))
            // if(this.chainArr[i].direction) {
            //     this.chainArr[i].bean.position = cc.v2(this.chainArr[i].bone.x, this.chainArr[i].bone.y).add(this.rightPos)
            // }else {
            //     this.chainArr[i].bean.position = cc.v2(this.chainArr[i].bone.x, this.chainArr[i].bone.y).add(this.leftPos)
            // }   
        }

        this.a.getComponent(cc.Sprite).spriteFrame = this.number3
        this.a.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong3
        this.b.getComponent(cc.Sprite).spriteFrame = this.number4;
        this.b.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong4
        this.c.getComponent(cc.Sprite).spriteFrame = this.number5
        this.c.getChildByName('wrong').getComponent(cc.Sprite).spriteFrame = this.wrong5

    }

    updatePos() {
        if(this.chainArr.length == 0) {
            return
        }
        for(let i = 0; i < this.chainArr.length; ++i) {
            this.chainArr[i].bean.position = this.chainArr[i].bone.position
        }
    }

    addData(len: number) {
        for(let i = 0; i < len; ++i) {
            this.eventvalue.levelData.push({
                answer: true,
                subject: false,
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
