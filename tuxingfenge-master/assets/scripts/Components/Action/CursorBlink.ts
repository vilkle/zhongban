// Author: kouyaqi
// Email: kouyaqi@100tal.com


const {ccclass, property} = cc._decorator;

/**
 *  光标闪烁
 */
@ccclass
export default class CursorBlink extends cc.Component {


    onEnable(){
        let seq = cc.sequence(cc.delayTime(0.5), cc.fadeOut(0.1), cc.delayTime(0.5), cc.fadeIn(0.1))
        this.node.runAction(cc.repeatForever(seq))
    }

    onDisable(){
        this.node.stopAllActions()
    }

}
