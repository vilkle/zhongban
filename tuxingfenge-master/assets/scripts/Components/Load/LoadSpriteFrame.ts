

const {ccclass, property} = cc._decorator;

/**
 * 为当前节点Sprite组件加载并设置SpriteFrame
 */
@ccclass
export default class LoadSpriteFrame extends cc.Component {

    public async load(imgPath:string){
        return new Promise((resolve, reject)=>{
            cc.loader.loadRes(imgPath, cc.SpriteFrame, (err, res)=>{
                if(err){
                    reject(err)
                    return
                }
                this.node.getComponent(cc.Sprite).spriteFrame = res
                resolve()
            })
        })
    }

}
