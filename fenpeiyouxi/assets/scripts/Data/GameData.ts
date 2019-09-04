import { LogWrap } from "../Utils/LogWrap";
/**游戏数据类 */
export class GameData {
    private static instance: GameData;
    public answer:number = null
    static getInstance() {
        if (this.instance == null) {
            this.instance = new GameData();
        }
        return this.instance;
    }
}