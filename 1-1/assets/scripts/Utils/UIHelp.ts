import { UIManager } from "../Manager/UIManager";
import { TipUI } from "../UI/panel/TipUI";
import { OverTips } from "../UI/Item/OverTips";

export class UIHelp {
    /**
     * 
     * @param message tips文字内容
     * @param type tips类型  0:内容tips   1:系统tips
     */
    public static showTip(message: string) {
        let tipUI = UIManager.getInstance().getUI(TipUI) as TipUI;
        if (!tipUI) {
            UIManager.getInstance().openUI(TipUI, 200, () => {
                UIHelp.showTip(message);
            });
        }
        else {
            tipUI.showTip(message);
        }
    }

    public static showOverTips(type:number,str:string,isClose:boolean,callback?:any)
    {
        let overTips = UIManager.getInstance().getUI(OverTips) as OverTips;
        if(!overTips)
        {
            UIManager.getInstance().openUI(OverTips, 200, ()=>{
                UIHelp.showOverTips(type,str,isClose,callback);
            });
        }
        else
        {
           overTips.init(type, str, isClose, callback);
        }
    }

}

