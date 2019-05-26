import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {

    protected static className = "GamePanel";
    @property(cc.Sprite)
    private round1 : cc.Sprite = null;
    @property(cc.Sprite)
    private round2 : cc.Sprite = null;
    @property(cc.Mask)
    private mask : cc.Mask = null;
    @property(cc.Node)
    private bg : cc.Node = null;
    _textureIdMapRenderTexture = {}
    isBreak : boolean = false

    start() {
        this.addListenerOnRound1();
    }

    addListenerOnRound1() {
        this.round1.node.on(cc.Node.EventType.TOUCH_START, function(e) {

        }.bind(this));
        this.bg.on(cc.Node.EventType.TOUCH_MOVE, function(e) {

            let posInNode = this.round1.node.convertToNodeSpaceAR(e.currentTouch._point);
            let spriteFrame = this.round1.spriteFrame;
            let rect = spriteFrame.getRect();
            let offset = spriteFrame.getOffset();
            // cc.log(rect, offset);
            // cc.log(posInNode);
            if ((posInNode.x < offset.x - rect.width / 2) || (posInNode.y < offset.y - rect.height / 2)
            || (posInNode.x > (offset.x + rect.width / 2)) || (posInNode.y > (offset.y + rect.height / 2))) {
            return false
        } else {
            let posInRect = cc.v2(posInNode.x - offset.x + rect.width / 2, posInNode.y - offset.y + rect.height / 2)
            // cc.log(type + "--", "posInRect",  posInRect)
            // cc.log(type + "--", "isRotated", spriteFrame.isRotated())

            let tex = spriteFrame.getTexture()
            var rt = this._textureIdMapRenderTexture[tex.getId()]
            if (!rt) {
                rt = new cc.RenderTexture()
                rt.initWithSize(tex.width, tex.height)
                rt.drawTextureAt(tex, 0, 0)
                this._textureIdMapRenderTexture[tex.getId()] = rt
            }

            // data就是这个texture的rgba值数组
            let data
            if (spriteFrame.isRotated())
            {
                data = rt.readPixels(null, rect.x + posInRect.y, rect.y + posInRect.x, 1, 1)
                // cc.log(type + "--", "data", data, rect.x + posInRect.y, rect.y + posInRect.x)
            }
            else{
                data = rt.readPixels(null, rect.x + posInRect.x, rect.y + rect.height - posInRect.y, 1, 1)
                // cc.log(type + "--", "data", data, rect.x + posInRect.x, rect.y + rect.height - posInRect.y)
            }
            cc.log(data);
            //if ((data[0] <= 0 && data[1] <= 0 && data[2] <= 0) || data[3] <= 0) {
            if (data[3] <= 0) {
               this.isBreak = true;
               this.mask._graphics.clear();
            }
            else {
                if(!this.isBreak) {
                    this.commonFunc(e);
                }
            }
        }


        }.bind(this));
        this.bg.on(cc.Node.EventType.TOUCH_END, function(e) {
            this.isBreak = false;
        }.bind(this));
        this.round1.node.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {

        }.bind(this));

    }

    commonFunc (event){
        var point = event.touch.getLocation();
        point = this.node.convertToNodeSpaceAR(point);
        this._addCircle(point);
    }

    _addCircle(point) {
        var graphics = this.mask._graphics;
        console.log("xxxx:",graphics)
        var color = cc.color(0, 0, 0, 255);
        //graphics.rect(point.x,point.y,200,200)
        graphics.ellipse(point.x,point.y,60, 60)
        graphics.lineWidth = 2
        graphics.fillColor = color
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
