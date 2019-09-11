import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import { UIHelp } from "../../Utils/UIHelp";
import { AudioManager } from "../../Manager/AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    @property (cc.Prefab)
    private horsePrefab:cc.Prefab = null
    @property (cc.Prefab)
    private sheepPrefab:cc.Prefab = null
    @property (cc.Prefab)
    private cookPrefab:cc.Prefab = null
    @property(cc.Prefab)
    private option3:cc.Prefab = null
    @property(cc.Prefab)
    private option4:cc.Prefab = null
    @property(cc.Prefab)
    private option5:cc.Prefab = null
    @property(cc.Prefab)
    private option6:cc.Prefab = null
    @property(cc.SpriteFrame)
    private horseLable: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private sheepLable: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private cookLable: cc.SpriteFrame = null
    @property(cc.Sprite)
    private title: cc.Sprite = null
    @property(cc.Node)
    private titleNode: cc.Node = null
    @property(cc.Node)
    private curtain: cc.Node = null
    @property(cc.Node)
    private garland: cc.Node = null
    @property(cc.Node)
    private bg: cc.Node = null
    private animalNum: number = null
    private answerNum: number = null
    private answerArr: number[] = [3,4,5,3,4,5]
    private animalNodeArr: cc.Node[] = []
    private optionNodeArr: cc.Node[] = []
    private optionArr: number[] = []
    private checkpoint: number = null
    private touchEnable: boolean = true
    private isRight: boolean = false
    private isOver : number = 0;
    private eventvalue = {
        isResult: 1,
        isLevel: 1,
        levelData: [

        ],
        result: 4
    }

    protected static className = "GamePanel";
    start() {
        for(let i = 0; i < 6; ++i) {
            this.eventvalue.levelData.push({
                subject: 'null',
                answer: this.answerArr[i],
                result: 4
            })
        }
        this.bg.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(this.isOver != 1) {
                this.isOver = 2;
                this.eventvalue.result = 2;
                this.eventvalue.levelData[this.checkpoint - 1].result = 2;
            }
        });
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        this.curtain.zIndex = 6
        this.garland.zIndex = 8
        this.titleNode.zIndex = 9
        this.question1()
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

    question1() {
        this.checkpoint = 1
        this.title.spriteFrame = this.cookLable
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('猜一猜幕后有几只鸡' , false)
        this.animalNum = 3
        this.optionArr = [3,4,5]
        this.addAnimal(this.animalNum, this.cookPrefab)
        this.addOption(this.optionArr)
    }
    question2() {
        this.checkpoint = 2
        this.title.spriteFrame = this.cookLable
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('猜一猜幕后有几只鸡' , false)
        this.animalNum = 4
        this.optionArr = [3,4,5]
        this.addAnimal(this.animalNum, this.cookPrefab)
        this.addOption(this.optionArr)
    }

    question3() {
        this.checkpoint = 3
        this.title.spriteFrame = this.cookLable
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('猜一猜幕后有几只鸡' , false)
        this.animalNum = 5
        this.optionArr = [3,4,5]
        this.addAnimal(this.animalNum, this.cookPrefab)
        this.addOption(this.optionArr)
    }

    question4() {
        this.checkpoint = 4
        this.title.spriteFrame = this.horseLable
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('猜一猜幕后有几匹马' , false)
        this.animalNum = 3
        this.optionArr = [3,4,5]
        this.addAnimal(this.animalNum, this.horsePrefab)
        this.addOption(this.optionArr)
    }

    question5() {
        this.checkpoint = 5
        this.title.spriteFrame = this.horseLable
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('猜一猜幕后有几匹马' , false)
        this.animalNum = 4
        this.optionArr = [3,4,5]
        this.addAnimal(this.animalNum, this.horsePrefab)
        this.addOption(this.optionArr)
    }

    question6() {
        this.checkpoint = 6
        this.title.spriteFrame = this.sheepLable
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('猜一猜幕后有几只羊' , false)
        this.animalNum = 5
        this.optionArr = [4,5,6]
        this.addAnimal(this.animalNum, this.sheepPrefab)
        this.addOption(this.optionArr)
    }

    addAnimal(num: number, animalPrefab: cc.Prefab) {
        for(let i = 0; i < this.animalNodeArr.length; ++i) {
            this.animalNodeArr[i].destroy()
        }
        this.animalNodeArr = []
        for(let i = 0; i < num; ++i) {
            let node = cc.instantiate(animalPrefab)
            let y = -160
            let x = - (num - 1) * 380 / 2 + i * 380 + 50
            node.setPosition(cc.v2(x, y))
            node.zIndex = 5
            this.node.addChild(node)
            this.animalNodeArr[i] = node
        }
    }

    addOption(optionArr: number[]) {
        this.removeListenerOnOption(this.optionNodeArr)
        for(let i = 0; i < this.optionNodeArr.length; ++i) {
            this.optionNodeArr[i].destroy()
        }
        this.optionNodeArr = []
        for(let i = 0; i < optionArr.length; ++i) {
            let node = cc.instantiate(this.getPrefab(optionArr[i]))
            let y = -350
            let x = - (optionArr.length - 1) * 300 / 2 + i * 300
            node.zIndex = 6
            node.setPosition(cc.v2(x, y))
            this.node.addChild(node)
            this.optionNodeArr[i] = node
        }
        this.addListenerOnOption(this.optionNodeArr)
    }

    addListenerOnOption(optionArr: cc.Node[]) {
        for(let i = 0; i < optionArr.length; ++i) {
            optionArr[i].on(cc.Node.EventType.TOUCH_START, (e)=>{
                this.touchEnable = this.countOver(this.animalNodeArr)
                if(!this.touchEnable) {
                    return
                }
                if(this.isRight) {
                    return
                }
                AudioManager.getInstance().playSound('dianji', false)
                this.eventvalue.levelData[this.checkpoint-1].subject = this.optionArr[i]
                this.eventvalue.result = 2
                this.isOver = 2
                this.eventvalue.levelData[this.checkpoint-1].result = 2
                if(e.target.getChildByName('click').active) {
                    e.target.getChildByName('click').active = false
                }else {
                    this.answerNum = this.optionArr[i]
                    e.target.getChildByName('click').active = true
                    for(let j = 0; j < optionArr.length; ++j) {
                        if(i != j) {
                            optionArr[j].getChildByName('click').active = false
                        }
                    }
                    this.isCorrect(this.checkpoint)
                }
            })
        }
    }

    removeListenerOnOption(optionArr: cc.Node[]){
        for(let i = 0; i < optionArr.length; ++i) {
            optionArr[i].off(cc.Node.EventType.TOUCH_START)
        }
    }

    countOver(animalArr: cc.Node[]): boolean {
        let countNum: number = 0
        for(let i = 0; i < animalArr.length; ++i) {
            if(animalArr[i].getChildByName('ellipse').active) {
                countNum++
            }
        }
        if(countNum == animalArr.length){
            return true
        }else {
            return false
        }
    }

    getPrefab(index: number) {
        switch(index) {
            case 3:
                return this.option3
                break
            case 4:
                return this.option4
                break
            case 5:
                return this.option5
                break
            case 6:
                return this.option6
                break
            default:
                console.error(`Failed access to ${index} option.`)
                break
        }
    }

    isCorrect(checkpoint:number) {
        if(this.answerNum == this.animalNum) {  
            this.isRight = true 
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('right3', false)
            this.eventvalue.levelData[this.checkpoint-1].result = 1
            this.touchEnable = false  
            let func = cc.callFunc(()=>{ 
                this.isRight = false
                switch(checkpoint) {
                    case 1:
                        this.question2()
                        break
                    case 2:
                            this.question3()
                        break
                    case 3:
                            this.question4()
                        break
                    case 4:
                            this.question5()
                        break
                    case 5:
                            this.question6()
                        break
                    case 6:
                        this.curtain.stopAllActions()
                        this.eventvalue.result = 1
                        this.isOver = 1
                        DataReporting.getInstance().dispatchEvent('addLog', {
                            eventType: 'clickSubmit',
                            eventValue: JSON.stringify(this.eventvalue)
                        });
                        UIHelp.showOverTip(2, '闯关成功！', null, '闯关成功')
                        break
                    default:
                        break
                }
            })
            let func0 = cc.callFunc(()=>{ 
                switch(checkpoint) {
                    case 1:
                        //AudioManager.getInstance().stopAll()
                        AudioManager.getInstance().playSound('咯咯咯', false)
                        break
                    case 2:
                        //AudioManager.getInstance().stopAll()
                        AudioManager.getInstance().playSound('咯咯咯', false)
                        break
                    case 3:
                        //AudioManager.getInstance().stopAll()
                        AudioManager.getInstance().playSound('咯咯咯', false)
                        break
                    case 4:
                        //AudioManager.getInstance().stopAll()
                        AudioManager.getInstance().playSound('咴儿咴儿', false)
                        break
                    case 5:
                        //AudioManager.getInstance().stopAll()
                        AudioManager.getInstance().playSound('咴儿咴儿', false)
                        break
                    case 6:
                        //AudioManager.getInstance().stopAll()
                        AudioManager.getInstance().playSound('咩咩咩', false)
                        break
                    default:
                        break
                }
            })
            let seq = cc.sequence(cc.moveBy(0.6, cc.v2(0, 450)), func0, cc.delayTime(2), cc.moveBy(0.8, cc.v2(0, -600)), cc.delayTime(0.2) , func, cc.moveBy(0.5, cc.v2(0, 150)))
            this.curtain.stopAllActions()
            this.curtain.runAction(seq)
        }else {
            AudioManager.getInstance().stopAll()
            AudioManager.getInstance().playSound('wrong3', false)
        }
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
