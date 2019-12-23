export class DaAnData {
    private static instance: DaAnData;
    public types = 0;//水果1 蔬菜2 方向3
    public submitEnable = false;
   
    static getInstance() {
        if (this.instance == null) {
            this.instance = new DaAnData();
        }
        return this.instance;
    }
}