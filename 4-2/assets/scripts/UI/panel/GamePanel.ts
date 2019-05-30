import { BaseUI } from "../BaseUI";
import { NetWork } from "../../Http/NetWork";
import { LoadingUI } from "./LoadingUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePanel extends BaseUI {
    @property(cc.Node)
    private amazeBg : cc.Node = null;
    @property(cc.Mask)
    private mask : cc.Mask = null;
    @property(cc.Node)
    private point : cc.Node = null;
    private roadArr : Array<number> = [4,4,4,1,1,2,3,2,2,2,1,1,1,4,4,3,4,4,4,1,1,1,4,3,4,4,1,1,2,1,2,2,2,2,1,4,4,1];
    private direction : number = 0;
    private long : number = 0;
    protected static className = "GamePanel";

    onLoad() {
        this.addListenerOnAmazeBg();
    }

    start() { 
    }

    addListenerOnAmazeBg() {
        this.point.on(cc.Node.EventType.TOUCH_START, function(e){
            var point = e.touch.getLocation();
            point = this.amazeBg.convertToNodeSpaceAR(point);
           
            //this._addCircle(point);

        }.bind(this));
        this.point.on(cc.Node.EventType.TOUCH_MOVE, function(e){
            
            var point = this.amazeBg.convertToNodeSpaceAR(e.touch.getLocation());
            var previousePoint =this.amazeBg.convertToNodeSpaceAR(e.touch.getPreviousLocation());
            if(Math.abs(point.x - previousePoint.x)>Math.abs(point.y - previousePoint.y)) {
                if(point.x > previousePoint.x) {
                    this.direction = 3;
                }else {
                    this.direction = 1;
                }
            }else {
                if(point.y > previousePoint.y) {
                    this.direction = 2;
                }else {
                    this.direction = 4;
                }
            }
            cc.log(point, previousePoint, this.long, this.direction);
            var pointMask = cc.v2(0 , 0);
            var num = Math.floor(this.long / 75)
            cc.log('-------------',num);
            if(this.direction == this.roadArr[num]) {
                if(this.direction == 1) {
                    pointMask = cc.v2(point.x, this.point.y);
                   
                    this.long += Math.abs(point.x - this.point.x);
                    this.point.setPosition(pointMask);
                    this._addCircle(pointMask);
                }else if(this.direction == 2) {
                    pointMask = cc.v2(point.x, this.point.y);
                    
                    this.long += Math.abs(point.x - this.point.x);
                    this.point.setPosition(pointMask);
                    this._addCircle(pointMask);
                }else if(this.direction == 3) {
                    pointMask = cc.v2(this.point.x, point.y);
                    
                    this.long += Math.abs(point.y - this.point.y);
                    this.point.setPosition(pointMask);
                    this._addCircle(pointMask);
                }else if(this.direction == 4) {
                    pointMask = cc.v2(this.point.x, point.y);
                   
                    this.long += Math.abs(point.y - this.point.y);
                    this.point.setPosition(pointMask);
                    this._addCircle(pointMask);
                }
            }
            // cc.log(this.direction);
            // this._addCircle(point);
           
        }.bind(this));
        this.point.on(cc.Node.EventType.TOUCH_END, function(e){}.bind(this));
        this.point.on(cc.Node.EventType.TOUCH_CANCEL, function(e){}.bind(this));

    }

    _addCircle(point : cc.Vec2) {
        var graphics = this.mask._graphics;
        console.log("xxxx:",graphics)
        var color = cc.color(0, 0, 0, 255);
        graphics.rect(point.x,point.y,75,75)
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
