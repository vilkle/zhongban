export class DaAnData {
    private static instance: DaAnData;
   
    public submitEnable = true;
   
    static getInstance() {
        if (this.instance == null) {
            this.instance = new DaAnData();
        }
        return this.instance;
    }
}