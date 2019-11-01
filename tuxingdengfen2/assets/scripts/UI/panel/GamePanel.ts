import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import { UIHelp } from "../../Utils/UIHelp";
import { AudioManager } from "../../Manager/AudioManager";
import { indexOf } from "../../collections/arrays";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {
    @property(cc.Node)
    private bg: cc.Node = null
    @property (cc.Node)
    private touchNode: cc.Node = null
    @property (cc.Node)
    private roundNode1: cc.Node = null
    @property (cc.Node)
    private roundNode2: cc.Node = null
    @property (cc.Node)
    private roundNode3: cc.Node = null
    @property (cc.Node)
    private optionNode: cc.Node = null
    @property (cc.Sprite)
    private titleNode: cc.Sprite = null
    @property (cc.SpriteFrame)
    private titleFrame1: cc.SpriteFrame = null
    @property (cc.SpriteFrame)
    private titleFrame2: cc.SpriteFrame = null
    @property (cc.SpriteFrame)
    private titleFrame3: cc.SpriteFrame = null
    private touchEnable: boolean = false
    private titleEnable:boolean = false
    private optionArr: cc.Node[] = []
    private answerArr: any[] = [4, 9, [8, 4]]
    private itemArr1: cc.Node[] = []
    private itemArr2: cc.Node[] = []
    private itemArr: any[] = []
    private nodeArr: cc.Node[] = []
    private numArr: number[] = []
    private checkpoint: number = 1
    private roundNode: cc.Node = null
    private touchTarget: any = null
    private answer1: number = null
    private answer2: number = null
    private isOver : number = 0
    private boundNode1: cc.Node = null
    private boundNode2: cc.Node = null
    private boundNode3: cc.Node = null
    private boundNode4: cc.Node = null
    private eventvalue = {
        isResult: 1,
        isLevel: 1,
        levelData: [

        ],
        result: 4
    }

    protected static className = "GamePanel";
    onLoad() {
        cc.loader.loadRes('prefab/ui/panel/OverTips', cc.Prefab, null); 
    }
    start() {
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        for(let i = 0; i < 3; ++i) {
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
        this.titleNode.node.on(cc.Node.EventType.TOUCH_START, ()=>{
           console.log(this.titleEnable)
            if(this.titleEnable) { 
                this.titleNode.node.scale = 0.9
                this.playTitle(this.checkpoint)
            }  
        })
        this.titleNode.node.on(cc.Node.EventType.TOUCH_END , ()=>{
            this.titleNode.node.scale = 1
        })
         this.titleNode.node.on(cc.Node.EventType.TOUCH_CANCEL, ()=>{
            this.titleNode.node.scale = 1
        })
        this.optionArr = []
        for(let i = 0; i < this.optionNode.children.length; ++i) {
            this.optionArr[i] = this.optionNode.children[i]
        }
        this.itemArr[0] = this.itemArr1
        this.itemArr[1] = this.itemArr2
        this.round1()
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

    addListenerOnItem() {
        let index = null
        for(let i = 0; i < this.nodeArr.length; ++i) {
            let node = this.nodeArr[i]
            node.on(cc.Node.EventType.TOUCH_START, (e)=> {
                if(!this.touchEnable) {
                    return
                }
                if(this.touchTarget) {
                    return
                }
                AudioManager.getInstance().playSound('dianji')
                this.touchNode.active = true
                this.touchTarget = e.target 
                this.touchNode.getComponent(cc.Sprite).spriteFrame = e.target.getComponent(cc.Sprite).spriteFrame
                index = this.nodeArr.indexOf(node)
                let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                this.touchNode.setPosition(pos) 
            })
            node.on(cc.Node.EventType.TOUCH_MOVE, (e)=> {
                if(this.touchTarget != e.target) {
                    return
                }
                let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                this.touchNode.setPosition(pos)
            })
            node.on(cc.Node.EventType.TOUCH_END, (e)=> {
                if(this.touchTarget != e.target) {
                    return
                }
                this.touchNode.active = false
                this.touchTarget = null
            })
            node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=> {
                if(this.touchTarget != e.target) {
                    return
                }
                if(this.checkpoint == 1) {
                    let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                    let area = this.round1JudgeArea(pos)
                    this.postItem(area, 1)
                }else if(this.checkpoint == 2) {
                    let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                    let area = this.round2JudgeArea(pos)
                    this.postItem(area, 1)
                }else if(this.checkpoint == 3) {
                    let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                    let area = this.round3JudgeArea(pos)
                    this.postItem(area, index + 2)
                }
                this.touchNode.active = false
                this.touchTarget = null
            })
        }
    }

    addListener() {
        for(let i = 0; i < this.itemArr.length; ++ i) {
            for(let j = 0; j < this.itemArr[i].length; ++j) {
                let node = this.itemArr[i][j]
                node.on(cc.Node.EventType.TOUCH_START, (e)=> {
                    if(!this.touchEnable) {
                        return
                    }
                    if(this.touchTarget || e.target.opacity == 0) {
                        return
                    }
                    AudioManager.getInstance().playSound('dianji')
                    this.touchTarget = e.target
                    e.target.opacity = 0
                    this.touchNode.active = true
                    this.touchNode.getComponent(cc.Sprite).spriteFrame = e.target.getComponent(cc.Sprite).spriteFrame
                    this.touchNode.zIndex = 100
                    let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                    this.touchNode.setPosition(pos) 
                })
                node.on(cc.Node.EventType.TOUCH_MOVE, (e)=> {
                    if(this.touchTarget != e.target) {
                        return
                    }
                    let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                    this.touchNode.setPosition(pos)
                })
                node.on(cc.Node.EventType.TOUCH_END, (e)=> {
                    if(this.touchTarget != e.target) {
                        return
                    }   
                    e.target.opacity = 255
                    this.touchNode.active = false
                    this.touchTarget = null
                })
                node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=> {
                    if(this.touchTarget != e.target) {
                        return
                    }
                    let postEnable: boolean = false
                    let area: number = 0
                    if(this.checkpoint == 1) {
                        let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                        area = this.round1JudgeArea(pos)
                        postEnable = this.postItem(area, 1)
                    }else if(this.checkpoint == 2) {
                        let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                        area = this.round2JudgeArea(pos)
                        postEnable = this.postItem(area, 1)
                    }else if(this.checkpoint == 3) {
                        let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                        area = this.round3JudgeArea(pos)
                        postEnable = this.postItem(area, i + 2)
                    }
                    if(!postEnable && area != 0) {
                        e.target.opacity = 255
                    }
                    this.touchNode.active = false
                    this.touchTarget = null
                })
            }
        }
    }

    removeItems() {
        // for(let i in this.itemArr1) {
        //     this.itemArr1[i].destroy()
        // }
        // for(let i in this.itemArr2) {
        //     this.itemArr2[i].destroy()
        // }
        // this.itemArr1 = []
        // this.itemArr2 = []
        // this.itemArr[0] = this.itemArr1
        // this.itemArr[1] = this.itemArr2
    }

    playTitle(checkpoint: number) {
        AudioManager.getInstance().stopAll()
        switch(checkpoint){
            case 1:     
                AudioManager.getInstance().playSound('二等分题目')
                break
            case 2:
                AudioManager.getInstance().playSound('三等分题目')
                break
            case 3:
                AudioManager.getInstance().playSound('四等分题目')
                break
        }
    }

    round1() {
        this.roundNode1.active = true
        this.roundNode2.active = false
        this.roundNode3.active = false
        this.numArr = []
        this.numArr[0] = 4
        this.nodeArr = []
        this.nodeArr[0] = this.roundNode1.getChildByName('answerNode1').getChildByName('sucai')
        this.roundNode = this.roundNode1
        this.boundNode1 = this.roundNode1.getChildByName('boundNode1')
        this.boundNode2 = this.roundNode1.getChildByName('boundNode2')
        this.itemArr = []
        this.itemArr1 = []
        for(let it of this.boundNode1.children) {
            this.itemArr1.push(it)
        }
        for(let it of this.boundNode2.children) {
            this.itemArr1.push(it)
        }
        this.itemArr[0] = this.itemArr1
        this.titleNode.spriteFrame = this.titleFrame1
        this.answer1 = null
        this.answer2 = null
        this.removeListenerOnOption(this.optionArr)
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('二等分题目', false, 1, null, ()=>{
            this.titleEnable = true
            this.touchEnable = true
            this.addListener()
            this.addListenerOnItem()
            this.addListenerOnOption(this.optionArr)
        })
    }

    round2() {
        this.roundNode1.active = false
        this.roundNode2.active = true
        this.roundNode3.active = false
        this.numArr = []
        this.numArr[0] = 9
        this.nodeArr = []
        this.nodeArr[0] = this.roundNode2.getChildByName('answerNode1').getChildByName('sucai')
        this.roundNode = this.roundNode2
        this.boundNode1 = this.roundNode2.getChildByName('boundNode1')
        this.boundNode2 = this.roundNode2.getChildByName('boundNode2')
        this.boundNode3 = this.roundNode2.getChildByName('boundNode3')
        this.itemArr = []
        this.itemArr1 = []
        for(let it of this.boundNode1.children) {
            this.itemArr1.push(it)
        }
        for(let it of this.boundNode2.children) {
            this.itemArr1.push(it)
        }
        for(let it of this.boundNode3.children) {
            this.itemArr1.push(it)
        }
        this.itemArr[0] = this.itemArr1
        this.titleNode.spriteFrame = this.titleFrame2
        this.answer1 = null
        this.answer2 = null
        this.removeListenerOnOption(this.optionArr)
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('三等分题目', false, 1, null, ()=>{
            this.titleEnable = true
            this.touchEnable = true
            this.addListener()
            this.addListenerOnItem()
            this.addListenerOnOption(this.optionArr)
        })
    }

    round3() {
        this.roundNode1.active = false
        this.roundNode2.active = false
        this.roundNode3.active = true
        this.numArr = []
        this.numArr[0] = 8
        this.numArr[1] = 4
        this.nodeArr = []
        this.nodeArr[0] = this.roundNode3.getChildByName('answerNode1').getChildByName('sucai')
        this.nodeArr[1] = this.roundNode3.getChildByName('answerNode2').getChildByName('sucai')
        this.roundNode = this.roundNode3
        this.boundNode1 = this.roundNode3.getChildByName('boundNode1')
        this.boundNode2 = this.roundNode3.getChildByName('boundNode2')
        this.boundNode3 = this.roundNode3.getChildByName('boundNode3')
        this.boundNode4 = this.roundNode3.getChildByName('boundNode4')
        this.itemArr = []
        this.itemArr1 = []
        this.itemArr2 = []
        for(let it of this.boundNode1.children) {
            if(this.boundNode1.children.indexOf(it) == 2) {
                this.itemArr2.push(it)
            }else {
                this.itemArr1.push(it)
            } 
        }
        for(let it of this.boundNode2.children) {
            if(this.boundNode2.children.indexOf(it) == 2) {
                this.itemArr2.push(it)
            }else {
                this.itemArr1.push(it)
            } 
        }
        for(let it of this.boundNode3.children) {
            if(this.boundNode3.children.indexOf(it) == 2) {
                this.itemArr2.push(it)
            }else {
                this.itemArr1.push(it)
            } 
        }
        for(let it of this.boundNode4.children) {
            if(this.boundNode4.children.indexOf(it) == 2) {
                this.itemArr2.push(it)
            }else {
                this.itemArr1.push(it)
            } 
        }
        this.itemArr[0] = this.itemArr1
        this.itemArr[1] = this.itemArr2
        this.titleNode.spriteFrame = this.titleFrame3
        this.answer1 = null
        this.answer2 = null
        this.eventvalue.levelData[2].subject = [null, null]
        this.removeListenerOnOption(this.optionArr)
        AudioManager.getInstance().stopAll()
        AudioManager.getInstance().playSound('四等分题目', false, 1, null, ()=>{
            this.titleEnable = true
            this.touchEnable = true
            this.addListener()
            this.addListenerOnItem()
            this.addListenerOnOption(this.optionArr)
        })
    }

    nextCheckPoint() {
        this.removeItems()
        this.checkpoint++
        switch(this.checkpoint) {
            case 1:
                this.round1()
                break
            case 2:
                this.round2()
                break
            case 3:
                this.round3()
                break
            default:
                break
        }
    }

    postItem(area: number, type: number): boolean {
        if(area == 1) {
            return this.activeItem(this.boundNode1, type)
        }else if(area == 2) {
            return this.activeItem(this.boundNode2, type)
        }else if(area == 3) {
            return this.activeItem(this.boundNode3, type)
        }else if(area == 4) {
            return this.activeItem(this.boundNode4, type)
        }
    }

    activeItem(parent: cc.Node, type: number) : boolean {
        for(let it of parent.children) {
            if(type == 1) {
                if(it.opacity == 0) {
                    it.opacity = 255
                    return true 
                }
            }else if(type == 2) {
                if(parent.children.indexOf(it) != 2) {
                    if(it.opacity == 0) {
                        it.opacity = 255
                        return true 
                    }
                }
            }else if(type == 3) {
                if(parent.children.indexOf(it) == 2) {
                    if(it.opacity == 0) {
                        it.opacity = 255
                        return true
                    }
                }
            }
        }
        return false
    }

    round1JudgeArea(point: cc.Vec2): number {
        let x = point.x
        let y = point.y
        if(x > -10 && x < 295) {
            if(y > -255 && y < 275 - (x + 10) * (535 / 305)) {
                return 2
            }
        }else if(x < -20 && x > -335) {
            if(y > -255 && y < 275 + (x + 20) * (530 / 315)) {
                return 1
            }
        }
        return 0
    }

    round2JudgeArea(point: cc.Vec2): number {
        let x = point.x
        let y = point.y
        let len = Math.sqrt(Math.pow(x+20, 2) + Math.pow(y, 2))
        if(x > -20) {
            if(y > (x + 20) * (-140 / 240)) {
                if(len < 280) {
                    return 1
                }
            }else {
                if(len < 280) {
                    return 2
                }
            }
        }else if(x < -20) {
            if(y > (x + 20) * (-140 / - 240)) {
                if(len < 280) {
                    return 3
                }
            }else {
                if(len < 280) {
                    return 2
                }
            }
        }
        return 0
    }

    round3JudgeArea(point: cc.Vec2) {
        let x = point.x
        let y = point.y
        if(x > -20 && x < 250) {
            if(y > x+20) {
                if(y < 270) {
                    return 1
                }
            }else if(y < x+20 && y > - (x + 20)) {
                return 2
            }else if(y < - (x + 20)) {
                if(y > -270) {
                    return 3
                }
            }
        }else if(x < -20 && x > -290) {
            if(y > -(x + 20)) {
                if(y < 270) {
                    return 1
                }
            }else if(y < -(x + 20) && y > x + 20){
                return 4
            }else if(y < x + 20) {
                if(y > -270) {
                    return 3
                }
            }
        }
        return 0
    }

    removeListenerOnOption(optionArr: cc.Node[]) {
        for(let i = 0; i < optionArr.length; ++i) {
            let node = this.optionArr[i]
            node.active = true
            node.opacity = 255
            node.off(cc.Node.EventType.TOUCH_START)
            node.off(cc.Node.EventType.TOUCH_MOVE)
            node.off(cc.Node.EventType.TOUCH_END)
            node.off(cc.Node.EventType.TOUCH_CANCEL)
        }
    }

    addListenerOnOption(optionArr: cc.Node[]) {
        for(let i = 0; i < this.optionArr.length; ++i) {
            let node = this.optionArr[i]
            node.on(cc.Node.EventType.TOUCH_START, (e)=> {
                if(!this.touchEnable) {
                    return
                }
                if(this.touchTarget || e.target.opacity == 0) {
                    return
                }
                AudioManager.getInstance().playSound('dianji')
                this.touchTarget = e.target 
                this.touchNode.active = true
                this.touchNode.zIndex = 100
                e.target.opacity = 0
                this.touchNode.getComponent(cc.Sprite).spriteFrame = e.target.getComponent(cc.Sprite).spriteFrame
                let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                this.touchNode.setPosition(pos)
                this.isOver = 2
                this.eventvalue.result = 2
                this.eventvalue.levelData[this.checkpoint-1].result = 2
            })
            node.on(cc.Node.EventType.TOUCH_MOVE, (e)=> {
                if(this.touchTarget != e.target) {
                    return
                }
                let pos = this.node.convertToNodeSpaceAR(e.currentTouch._point)
                this.touchNode.setPosition(pos)
            })
            node.on(cc.Node.EventType.TOUCH_END, (e)=> {
                if(this.touchTarget != e.target) {
                    return
                }
                this.touchTarget = null
                e.target.opacity = 255
                this.touchNode.active = false
            })
            node.on(cc.Node.EventType.TOUCH_CANCEL, (e)=> {
                if(this.touchTarget != e.target) {
                    return
                }
                let answerNode1 = this.roundNode.getChildByName('answerNode1')
                let answerNode2 = this.roundNode.getChildByName('answerNode2')
                let overNum = 0
                if(answerNode1) {
                    let bounding = answerNode1.getChildByName('bounding')
                    let sprite = answerNode1.getChildByName('sprite')
                    if(bounding.getBoundingBox().contains(answerNode1.convertToNodeSpaceAR(e.currentTouch._point))) {
                        if(this.isRight(this.checkpoint, i+3, 1)){
                            sprite.getComponent(cc.Sprite).spriteFrame = this.touchNode.getComponent(cc.Sprite).spriteFrame
                            this.touchNode.active = false
                            this.touchTarget = null
                            return
                        }else {
                            AudioManager.getInstance().stopAll()
                            AudioManager.getInstance().playSound('wrong')
                            let timeoutId = setTimeout(() => {
                                if(answerNode1.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame==null) {
                                    AudioManager.getInstance().playSound('再试试')
                                }
                                clearTimeout(timeoutId)
                            }, 500);
                            this.touchTarget = null
                            e.target.opacity = 255
                            this.touchNode.active = false
                        }
                        overNum++
                    }
                }
                if(answerNode2) {
                    let bounding = answerNode2.getChildByName('bounding')
                    let sprite = answerNode2.getChildByName('sprite')
                    if(bounding.getBoundingBox().contains(answerNode2.convertToNodeSpaceAR(e.currentTouch._point))) {
                        if(this.isRight(this.checkpoint, i+3, 2)){
                            sprite.getComponent(cc.Sprite).spriteFrame = this.touchNode.getComponent(cc.Sprite).spriteFrame
                            this.touchNode.active = false
                            this.touchTarget = null
                            return
                        }else {
                            AudioManager.getInstance().stopAll()
                            AudioManager.getInstance().playSound('wrong')
                            let timeoutId = setTimeout(() => {
                                if(answerNode2.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame==null) {
                                    AudioManager.getInstance().playSound('再试试')
                                }
                                clearTimeout(timeoutId)
                            }, 500);
                            this.touchTarget = null
                            e.target.opacity = 255
                            this.touchNode.active = false
                        }
                        overNum++
                    }
                }
                if(overNum == 0) {
                    AudioManager.getInstance().playSound('wrong')
                    this.touchTarget = null
                    e.target.opacity = 255
                    this.touchNode.active = false
                }
            })
        }
    }

    isRight(checkpoint: number, answerNum: number, optionNum?: number): boolean {
        if(checkpoint == 1) {
            if(answerNum == 4) {
                this.titleEnable = false
                this.touchEnable = false
                this.answer1 =  4
                this.eventvalue.levelData[checkpoint-1].result = 1
                this.eventvalue.levelData[checkpoint-1].subject = 4
                AudioManager.getInstance().stopAll()
                AudioManager.getInstance().playSound('right')
                let timeoutId = setTimeout(() => {
                    AudioManager.getInstance().playSound('你真棒', false, 1, null, ()=>{
                        this.nextCheckPoint()
                    })  
                    clearTimeout(timeoutId)
                }, 500);
                return true
            }else {
                return false
            }
        }else if(checkpoint == 2) {
            if(answerNum == 9) {
                this.titleEnable = false
                this.touchEnable = false
                this.answer1 = 9
                this.eventvalue.levelData[checkpoint-1].result = 1
                this.eventvalue.levelData[checkpoint-1].subject = 9      
                AudioManager.getInstance().stopAll()
                AudioManager.getInstance().playSound('right')
                let timeoutId = setTimeout(() => {
                    AudioManager.getInstance().playSound('你真棒', false, 1, null, ()=>{
                        this.nextCheckPoint()
                    })  
                    clearTimeout(timeoutId)
                }, 500);
                return true
            }else {
                return false
            }
        }else if(checkpoint == 3) {
            if(answerNum == 8 && optionNum == 1) {
                this.answer1 = 8
                this.eventvalue.levelData[checkpoint-1].subject[0] = 8
                if(this.answer1 && this.answer2) {
                    this.eventvalue.levelData[checkpoint-1].result = 1
                    this.isOver = 1
                    this.eventvalue.result = 1
                    DataReporting.getInstance().dispatchEvent('addLog', {
                        eventType: 'clickSubmit',
                        eventValue: JSON.stringify(this.eventvalue)
                    });
                    console.log(this.eventvalue)
                    this.titleEnable = false
                    this.touchEnable = false
                    AudioManager.getInstance().stopAll()
                    AudioManager.getInstance().playSound('right')
                    let timeoutId = setTimeout(() => {
                        AudioManager.getInstance().playSound('你真棒', false, 1, null, ()=>{
                            UIHelp.showOverTip(2, '闯关成功，棒棒哒～', null, '闯关成功')
                        })  
                        clearTimeout(timeoutId)
                    }, 500);
                }else {
                    AudioManager.getInstance().stopAll()
                    AudioManager.getInstance().playSound('right')
                    let timeoutId = setTimeout(() => {
                        AudioManager.getInstance().playSound('你真棒')  
                        clearTimeout(timeoutId)
                    }, 500);
                }
                return true
            }else if(answerNum == 4 && optionNum == 2) {
                this.answer2 = 4
                this.eventvalue.levelData[checkpoint-1].subject[1] = 4
                if(this.answer1 && this.answer2) {
                    this.eventvalue.levelData[checkpoint-1].result = 1
                    this.isOver = 1
                    this.eventvalue.result = 1
                    DataReporting.getInstance().dispatchEvent('addLog', {
                        eventType: 'clickSubmit',
                        eventValue: JSON.stringify(this.eventvalue)
                    });
                    console.log(this.eventvalue)
                    this.titleEnable = false
                    this.touchEnable = false
                    AudioManager.getInstance().stopAll()
                    AudioManager.getInstance().playSound('right')
                    let timeoutId = setTimeout(() => {
                        AudioManager.getInstance().playSound('你真棒', false, 1, null, ()=>{
                            UIHelp.showOverTip(2, '闯关成功，棒棒哒～', null, '闯关成功')
                        })  
                        clearTimeout(timeoutId)
                    }, 500);
                }else {
                    AudioManager.getInstance().stopAll()
                    AudioManager.getInstance().playSound('right')
                    let timeoutId = setTimeout(() => {
                        AudioManager.getInstance().playSound('你真棒')  
                        clearTimeout(timeoutId)
                    }, 500);
                }
                return true
            }else {
                return false
            }
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
