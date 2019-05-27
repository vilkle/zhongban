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
    @property(cc.Mask)
    private mask1 : cc.Mask = null;
    @property(cc.Node)
    private bg : cc.Node = null;
    @property(cc.Node)
    private start1 : cc.Node = null;
    @property(cc.Node)
    private start2 : cc.Node = null;
    @property(cc.Node)
    private end1 : cc.Node = null;
    @property(cc.Node)
    private end2 : cc.Node = null;
    @property(cc.Node)
    private yige : cc.Node = null;
    _textureIdMapRenderTexture = {}
    isBreak : boolean = true;
    isBreak1 : boolean = true;
    isOver : boolean = false;
    isOver1 : boolean = false;

    start() {
        this.addListenerOnRound1();
    }

    addListenerOnRound1() {
        this.bg.on(cc.Node.EventType.TOUCH_START, function(e) {
            if(this.start1.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                this.isBreak = false;
            }else if(this.start2.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                this.isBreak1 = false;
            }
        }.bind(this));
        this.bg.on(cc.Node.EventType.TOUCH_MOVE, function(e) {
            let posInBg = this.node.convertToNodeSpaceAR(e.currentTouch._point);
            //round1
            let posInNode = this.round1.node.convertToNodeSpaceAR(e.currentTouch._point);
            let spriteFrame = this.round1.spriteFrame;
            let rect = spriteFrame.getRect();
            let offset = spriteFrame.getOffset();
            if ((posInNode.x < offset.x - rect.width / 2) || (posInNode.y < offset.y - rect.height / 2)
            || (posInNode.x > (offset.x + rect.width / 2)) || (posInNode.y > (offset.y + rect.height / 2))) {
                //return false
            } else {
                let posInRect = cc.v2(posInNode.x - offset.x + rect.width / 2, posInNode.y - offset.y + rect.height / 2)

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
                }
                else{
                    data = rt.readPixels(null, rect.x + posInRect.x, rect.y + rect.height - posInRect.y, 1, 1)
                }
                if (data[3] <= 0 && this.isOver == false) {
                    if(!this.isBreak) {
                        this.isBreak = true;
                        this.yige.setPosition(cc.v2(95, -90));
                        cc.log('back1');
                        this.mask._graphics.clear();
                    }
                }
                else {
                    if(!this.isBreak) {
                        this.commonFunc(e, this.mask);
                        this.yige.setPosition(posInBg);
                        if(this.end1.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                            this.isOver = true;
                        }
                    }
                }
            }
            //round2
            let posInNode1 = this.round2.node.convertToNodeSpaceAR(e.currentTouch._point);
            let spriteFrame1 = this.round2.spriteFrame;
            let rect1 = spriteFrame1.getRect();
            let offset1 = spriteFrame1.getOffset();
           
            if ((posInNode1.x < offset1.x - rect1.width / 2) || (posInNode1.y < offset1.y - rect1.height / 2)
            || (posInNode1.x > (offset1.x + rect1.width / 2)) || (posInNode1.y > (offset1.y + rect1.height / 2))) {
                //return false
            } else {
                let posInRect1 = cc.v2(posInNode1.x - offset1.x + rect1.width / 2, posInNode1.y - offset1.y + rect1.height / 2)

                let tex = spriteFrame1.getTexture()
                var rt = this._textureIdMapRenderTexture[tex.getId()]
                if (!rt) {
                    rt = new cc.RenderTexture()
                    rt.initWithSize(tex.width, tex.height)
                    rt.drawTextureAt(tex, 0, 0)
                    this._textureIdMapRenderTexture[tex.getId()] = rt
                }

                let data
                if (spriteFrame1.isRotated())
                {
                    data = rt.readPixels(null, rect1.x + posInRect1.y, rect1.y + posInRect1.x, 1, 1)
                }
                else{
                    data = rt.readPixels(null, rect1.x + posInRect1.x, rect1.y + rect1.height - posInRect1.y, 1, 1)
                }
                if (data[3] <= 0 && this.isOver1 == false) {
                    if(!this.isBreak1) {
                        this.isBreak1 = true;
                        this.yige.setPosition(cc.v2(95, -90));
                        this.mask1._graphics.clear();
                        cc.log('back2');
                    }
                }
                else {
                    if(!this.isBreak1) {
                        this.commonFunc(e,this.mask1);
                        this.yige.setPosition(posInBg);
                        if(this.end2.getBoundingBox().contains(this.node.convertToNodeSpaceAR(e.currentTouch._point))) {
                            this.isOver1 = true;
                        }
                    }
            }
        }
        }.bind(this));

        this.bg.on(cc.Node.EventType.TOUCH_END, function(e) {
            if(!this.isOver&&this.isBreak) {
                this.isBreak = true;
                this.mask._graphics.clear();
                this.yige.setPosition(cc.v2(95, -90));
                cc.log('back3')
            }
            if(!this.isOver1&&this.isBreak1) {
                this.isBreak1 = true;
                this.mask1._graphics.clear();
                this.yige.setPosition(cc.v2(95, -90));
                cc.log('back4')
            }
        }.bind(this));
        this.round1.node.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {

        }.bind(this));

    }

    commonFunc (event, mask){
        var point = event.touch.getLocation();
        point = this.node.convertToNodeSpaceAR(point);
        var graphics = mask._graphics;
        console.log("xxxx:",graphics)
        var color = cc.color(0, 0, 0, 255);
        //graphics.rect(point.x,point.y,200,200)
        graphics.ellipse(point.x,point.y,70, 70)
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
