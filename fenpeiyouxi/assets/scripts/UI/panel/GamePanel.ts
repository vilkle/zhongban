import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import DataReporting from "../../Data/DataReporting";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    @property (cc.Prefab)
    private horsePrefab:cc.Prefab = null
    @property (cc.Prefab)
    private sheepPrefab:cc.Prefab = null;
    @property (cc.Prefab)
    private cookPrefab:cc.Prefab = null;
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

    private answerNum: number = null


    protected static className = "GamePanel";
    start() {
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
                eventValue: JSON.stringify({})
            });
            DataReporting.isRepeatReport = false;
        }
        //eventValue  0为未答题   1为答对了    2为答错了或未完成
        DataReporting.getInstance().dispatchEvent('end_finished', { eventType: 'activity', eventValue: 0 });
    }

    question1() {
        this.title.spriteFrame = this.cookLable
        this.answerNum = 4
        this.addAnimal(this.answerNum, this.horsePrefab)

    }

    addAnimal(num: number, animalPrefab: cc.Prefab) {
        for(let i = 0; i < num; ++i) {
            let node = cc.instantiate(animalPrefab)
            let y = -160
            let x = - (num - 1) * 400 / 2 + i * 400
            node.setPosition(cc.v2(x, y))
            node.zIndex = 5
            this.node.addChild(node)
        }
    }

    addOption(optionArr: number[]) {

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
