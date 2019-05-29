import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {
    @property(sp.Skeleton)
    private miya : sp.Skeleton = null;
    @property(sp.Skeleton)
    private leaf : sp.Skeleton = null;
    @property(sp.Skeleton)
    private piaochong : sp.Skeleton = null;
    @property(cc.Sprite)
    private a : cc.Sprite = null;
    @property(cc.Sprite)
    private b : cc.Sprite = null;
    @property(cc.Sprite)
    private c : cc.Sprite = null;


    protected static className = "GamePanel";

    onLoad() {

    }

    start() {
        this.miya.setAnimation(0, 'in', false);

    }

    round1() {

    }

    round2() {
        this.piaochong.setSkin('3_1');
        this.piaochong.setAnimation(0, 'in_left', false);
        this.a
    }

    round3() {
        this.piaochong.setSkin('2_3');
        this.piaochong.setAnimation(0, 'in_left', false);
    }

    round4() {
        this.piaochong.setSkin('2_4');
        this.piaochong.setAnimation(0, 'in_left', false);
    }

    round5() {
        this.piaochong.setSkin('4_3');
        this.piaochong.setAnimation(0, 'in_left', false);
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
