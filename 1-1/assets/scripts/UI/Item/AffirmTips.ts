
import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";

const {ccclass, property} = cc._decorator;
@ccclass
export  class AffirmTips extends BaseUI {

    protected static className = "AffirmTips";
    
    @property(cc.Node)
    private NodeDes: cc.Node = null; //描述节点
    @property(cc.Label)
    private title: cc.Label= null;
    @property(cc.Label)
    private des: cc.Label= null;
    @property(cc.Button)
    private close: cc.Button= null;
    @property(cc.Button)
    private ok: cc.Button= null;
    @property(cc.Button)
    @property(sp.Skeleton)
    private sp_BgAnimator: sp.Skeleton= null; // 背景动画
    @property(sp.Skeleton)
    private sp_lightAnimator: sp.Skeleton= null; // 光动画

    private callbackClose = null;
    private callbackOk = null;
    private type:number;
    start () {

    }

    //type 成功 1 失败 2
    init(type: number, des: string, btnCloselDes?: string, btnOkDes?: string, callbackClose ?: any,callbackOk ?: any) {
        this.title.node.active = false;
        this.des.node.active = true;

        this.type = type;
        this.callbackClose = callbackClose;
        //console.log("到了初始化");
        //Tools.playSpine(this.sp_BgAnimator, "fault", false);
        this.des.string =des;
        this.callbackOk = callbackOk;
       

    }

    
    

    OnClickClose() {
       
        //console.log("关闭");
    }

     //通用动画
     TipsAnimatorScale(nodeObj:cc.Node){
        nodeObj.stopAllActions();
        var seq = cc.sequence(
            cc.delayTime(1),
            cc.scaleTo(0.2, 1, 1),
            );
           nodeObj.runAction(seq);
         // nodeObj.runAction(cc.scaleTo(0.2, 1, 1));
    }



    //ok 1 确认 0 取消
    OnClickOk(){
        console.log("确认");
        UIManager.getInstance().closeUI(AffirmTips);
        this.callback(1);
    }

    OnClickCancel(){
        console.log("取消");
        UIManager.getInstance().closeUI(AffirmTips);
        this.callback(0);
    }

    // update (dt) {}
}
