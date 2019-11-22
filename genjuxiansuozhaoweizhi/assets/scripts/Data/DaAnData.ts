export class DaAnData {
    private static instance: DaAnData;
    public checkpointsNum = 0; //关卡数目
    public countsArr: number[] = []
    public goodsArr: number[] = [];
    public submitEnable = false;
   
    static getInstance() {
        if (this.instance == null) {
            this.instance = new DaAnData();
        }
        return this.instance;
    }
}