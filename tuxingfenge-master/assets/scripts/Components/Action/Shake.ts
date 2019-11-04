/**
 * Author: kouyaqi
 * Email: kouyaqi@100tal.com
 */

const {ccclass, property} = cc._decorator;

/**抖动动效 */
@ccclass
export default class Shake extends cc.Component {

    public initStyle1(){
        this.node.rotation = 0
    }
    /**旋转摆动 */
    public async playStyle1(){
        return new Promise((resolve, reject)=>{
            let seq = cc.sequence(
                cc.delayTime(0.3),
                cc.rotateTo(0.033, 10),
                cc.rotateTo(0.033, -10),
                cc.rotateTo(0.033, 10),
                cc.rotateTo(0.033, -10),
                cc.rotateTo(0.033, 10),
                cc.rotateTo(0.033, -10),
                cc.rotateTo(0.033, 10),
                cc.rotateTo(0.033, -10),
                cc.rotateTo(0.033, 10),
                cc.rotateTo(0.033, -10),
                cc.rotateTo(0.033, 10),
                cc.rotateTo(0.016, 0),
                cc.callFunc(resolve)
            )
            this.node.runAction(seq)
        })
    }
}
