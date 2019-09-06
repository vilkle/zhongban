import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";
import { AudioManager } from "../../Manager/AudioManager";
import { UIHelp } from "../../Utils/UIHelp";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    @property (cc.Node)
    private bg: cc.Node = null;
    @property(cc.Sprite)
    private title: cc.Sprite = null
    @property(cc.Node)
    private roundNode: cc.Node = null
    @property(cc.Node)
    private round1Node: cc.Node = null
    @property(cc.Node)
    private round2Node: cc.Node = null
    @property(cc.Node)
    private round3Node: cc.Node = null
    @property(cc.Node)
    private round4Node: cc.Node = null
    @property(cc.SpriteFrame)
    private title1: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private title2: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private title3: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    private title4: cc.SpriteFrame = null
    private checkpoint: number = null
    private optionArr: cc.Node[] = []
    protected static className = "GamePanel";
    start() {
        DataReporting.getInstance().addEvent('end_game', this.onEndGame.bind(this));
        this.checkpoint = 1
        this.round(this.checkpoint)
    }

    onEndGame() {
        //如果已经上报过数据 则不再上报数据
        if (DataReporting.isRepeatReport) {
            DataReporting.getInstance().dispatchEvent('addLog', {
                eventType: 'clickSubmit',
                eventValue: JSON.stringify({})
            });
            DataReporting.isRepeatReport = false;
        }
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: 0 });
    }

    onDestroy() {

    }

    nextCheckPoint() {
        if(this.checkpoint < 4) {
            this.checkpoint++
            let timeoutIndex = setTimeout(() => {
                this.round(this.checkpoint)
                clearTimeout(timeoutIndex)
            }, 2000);
            
        }else {
            let timeoutIndex = setTimeout(() => {
                UIHelp.showOverTip(2,'闯关成功！', null, '闯关成功')
                clearTimeout(timeoutIndex)
            }, 2000);
        }
    }

    addListenerOnOption(optionArr: cc.Node[]) {
        for(let i = 0; i < optionArr.length; ++i) {
            let node = optionArr[i].getChildByName('frame')
            node.on(cc.Node.EventType.TOUCH_START, (e)=>{
                AudioManager.getInstance().playSound('click', false)
            })
            node.on(cc.Node.EventType.TOUCH_END, (e)=>{
                AudioManager.getInstance().stopAll()
                AudioManager.getInstance().playSound(this.getAudioName(this.checkpoint, i+1), false, 1,null, ()=>{})
                this.face(this.optionArr[i])
            })
        }
    }
    
    face(optionNode: cc.Node) {
        let node = optionNode.getChildByName('face')
        node.active = true
        let faceSkele = node.getComponent(sp.Skeleton)
        faceSkele.setAnimation(0, 'animation', false)
        faceSkele.setCompleteListener(trackEntry => {
            if(trackEntry.animation.name == 'animation') {
                console.log('--animation complete--')
                
            }
        })
        if(this.isRight()) {
            this.nextCheckPoint()
        }
    }

    isRight(): boolean {
        let rightArr:number[] = []
        let active1: boolean = false
        let active2: boolean = false
        let active3: boolean = false
        if(this.checkpoint == 1) {
            rightArr = [1,2,4]
        }else if(this.checkpoint == 2) {
            rightArr = [2,3,4]
        }else if(this.checkpoint == 3) {
            rightArr = [1,3,4]

        }else if(this.checkpoint == 4) {
            rightArr = [1,2,4]
        }else {
            return false
        }
        console.log(this.optionArr, rightArr)
        active1 = this.optionArr[rightArr[0]-1].getChildByName('face').active
        active2 = this.optionArr[rightArr[1]-1].getChildByName('face').active
        active3 = this.optionArr[rightArr[2]-1].getChildByName('face').active
        if(active1 && active2 && active3) {
            return true
        }else {
            return false
        }
    }

    getAudioName(checkpoint:number, optionIndex:number): string {
        let audioName: string = null
        if(checkpoint == 1) {
            if(optionIndex == 1||optionIndex == 2||optionIndex ==4) {
                audioName = '二等分'
            }else {
                audioName = '不是二等分'
            }
        }else if(checkpoint == 2) {
            if(optionIndex == 2||optionIndex == 3||optionIndex ==4) {
                audioName = '啦啦啦三等分'
            }else {
                audioName = '嗯嗯嗯'
            }
        }else if(checkpoint == 3) {
            if(optionIndex == 1||optionIndex == 3||optionIndex ==4) {
                audioName = '哈哈四等分'
            }else {
                audioName = '不是我'
            }
        }else if(checkpoint == 4) {
            if(optionIndex == 1||optionIndex == 2||optionIndex ==4) {
                audioName = 'yeah六等分'
            }else {
                audioName = '不对不对'
            }
        }
        return audioName
    }

    round(index: number) {
        for(let i = 0; i < this.roundNode.children.length; ++i) {
            this.roundNode.children[i].active = false
        }
        let node: cc.Node = null
        switch(index) {
            case 1:
                node = this.round1Node
                this.round1Node.active = true
                this.title.spriteFrame = this.title1
                break
            case 2:
                node = this.round2Node
                this.round2Node.active = true
                this.title.spriteFrame = this.title2
                break
            case 3:
                node = this.round3Node
                this.round3Node.active = true
                this.title.spriteFrame = this.title3
                break
            case 4: 
                node = this.round4Node
                this.round4Node.active = true
                this.title.spriteFrame = this.title4
                break
            default:
                console.error(`get wrong round index, the index of inputs is ${index}.`)
                break
        }
        for(let i = 0; i < this.optionArr.length; ++i) {
            let faceNode = this.optionArr[i].getChildByName('frame')
            faceNode.off(cc.Node.EventType.TOUCH_START)
            faceNode.off(cc.Node.EventType.TOUCH_END)
        }
        this.optionArr = []
        if(node) {
            for(let i = 0; i < node.children.length; ++i) {
                this.optionArr[i] = node.children[i]
            }
        }
        this.addListenerOnOption(this.optionArr)
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
