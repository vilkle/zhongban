import { ListenerManager } from "../../Manager/ListenerManager";
import { AudioManager } from "../../Manager/AudioManager"

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
                AudioManager.getInstance().playSound('dianji', false)
                this.ellipse.active = true
            }
        })
    }

    // update (dt) {}
}
