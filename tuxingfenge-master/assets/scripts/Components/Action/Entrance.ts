/**
 * Author: kouyaqi
 * Email: kouyaqi@100tal.com
 */

const {ccclass, property} = cc._decorator;

/**入场动效 */
@ccclass
export default class Entrance extends cc.Component {

    /**样式2的参数 */
    private dataStyle2:any = {
        offsetX: 60,
        offsetY: -60,
        targetPos: null
    }


    public initStyle1(){
        this.node.scale = 1.24
        this.node.opacity = 0
    }    
    /**缩放，淡入 */
    public async playStyle1(){
        return new Promise((resolve, reject)=>{
            let seq = cc.sequence(
                cc.scaleTo(0.166, 0.9),
                cc.spawn(cc.scaleTo(0.333, 1.05), cc.fadeIn(0.333)),
                cc.scaleTo(0.266, 1),
                cc.callFunc(resolve)
            )
            this.node.runAction(seq)
        })
    }


    public initStyle2(){
        let nowPos = this.node.getPosition()
        this.dataStyle2.targetPos = nowPos
        this.node.setPosition(nowPos.x - this.dataStyle2.offsetX, nowPos.y - this.dataStyle2.offsetY)
        this.node.opacity = 0
    }
    /**位移，淡入 */
    public async playStyle2(){
        return new Promise((resolve, reject)=>{
            let seq = cc.sequence(
                cc.spawn(cc.moveTo(0.5, this.dataStyle2.targetPos), cc.fadeIn(0.5)),
                cc.callFunc(resolve)
            )
            this.node.runAction(seq)
        })
    }
}
