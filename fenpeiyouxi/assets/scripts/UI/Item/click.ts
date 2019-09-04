import { ListenerManager } from "../../Manager/ListenerManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

   @property(cc.Node)
   private ellipse: cc.Node = null
   @property(cc.Node)
   private clickNode: cc.Node = null
    

    start () {
        this.clickNode.on(cc.Node.EventType.TOUCH_START, (e)=>{
            if(!this.ellipse.active) {
                this.ellipse.active = true
            }else {
                this.ellipse.active = false
            }
        })
    }

    // update (dt) {}
}
