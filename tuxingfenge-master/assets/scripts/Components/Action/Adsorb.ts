/**
 * Author: kouyaqi
 * Email: kouyaqi@100tal.com
 */

const {ccclass, property} = cc._decorator;

/**吸附动效 */
@ccclass
export default class Adsorb extends cc.Component {

    public initStyle1(){
        this.node.scale = 0.8
        this.node.opacity = 0
    }
    /**缩放，淡入 */
    public async playStyle1(){
        return new Promise((resolve, reject)=>{
            let seq = cc.sequence(
                cc.spawn(cc.scaleTo(0.166, 1.2), cc.fadeIn(0.166)),
                cc.scaleTo(0.234, 0.9),
                cc.scaleTo(0.233, 1),
                cc.callFunc(resolve)
            )
            this.node.runAction(seq)
        })
    }
}
