export class ListenerType {
    public static readonly Test = "Test";
    public static readonly GameStart = "GameStart";
    public static readonly UpdateMainUI = "UpdateMainUI";
    public static readonly LoopUpdate = "LoopUpdate";
    
    public static readonly OnEndOfInput = "OnEndOfInput";
    public static readonly OnDaAnShanChu = "OnDaAnShanChu";
    public static readonly OnDaAnZengJia = "OnDaAnZengJia";
    public static readonly OnEditStateSwitching = "OnEditStateSwitching";

    /**通过关卡 */
    public static readonly PassLevel = "PassLevel"
    /**做错 */
    public static readonly AnswerWrong = 'AnswerWrong'
}