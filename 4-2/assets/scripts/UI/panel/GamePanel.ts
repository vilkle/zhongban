import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {
    @property(cc.Node)
    private amazeBg : cc.Node = null;
    @property(cc.Mask)
    private mask : cc.Mask = null;

    protected static className = "GamePanel";

    onLoad() {
        this.addListenerOnAmazeBg();
    }

    start() {
    }

    addListenerOnAmazeBg() {
        this.amazeBg.on(cc.Node.EventType.TOUCH_START, function(e){
            var point = e.touch.getLocation();
            point = this.amazeBg.convertToNodeSpaceAR(point);
            this._addCircle(point);

        }.bind(this));
        this.amazeBg.on(cc.Node.EventType.TOUCH_MOVE, function(e){
            var point = e.touch.getLocation();
            point = this.amazeBg.convertToNodeSpaceAR(point);
            this._addCircle(point);
        }.bind(this));
        this.amazeBg.on(cc.Node.EventType.TOUCH_END, function(e){}.bind(this));
        this.amazeBg.on(cc.Node.EventType.TOUCH_CANCEL, function(e){}.bind(this));

    }

    _addCircle(point : cc.Vec2) {
        var graphics = this.mask._graphics;
        console.log("xxxx:",graphics)
        var color = cc.color(0, 0, 0, 255);
        graphics.rect(point.x,point.y,50,30)
        graphics.lineWidth = 2
        graphics.fillColor = color
        //graphics.strokeColor = color
        graphics.fill()
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
