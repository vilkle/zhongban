import { BaseUI } from "../BaseUI";
import { UIManager } from "../../Manager/UIManager";
import GamePanel from "./GamePanel";
import SubmissionPanel from "./SubmissionPanel";
import { OverTips } from "../Item/OverTips";
import { GameData } from "../../Data/GameData";
import { UIHelp } from "../../Utils/UIHelp";
import ErrorPanel from "./ErrorPanel";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UploadAndReturnPanel extends BaseUI {

    protected static className = "UploadAndReturnPanel";

    start() {

    }

    onFanHui() {
        UIManager.getInstance().closeUI(ErrorPanel)
        UIManager.getInstance().closeUI(OverTips)
        UIManager.getInstance().closeUI(GamePanel);
        UIManager.getInstance().closeUI(UploadAndReturnPanel);
    }

    onTiJiao() {
        if(GameData.getInstance().isPassAllLevel){
            UIManager.getInstance().showUI(SubmissionPanel);
        }else{
            UIHelp.showTip('请通关之后进行保存')
        }
    }
}
