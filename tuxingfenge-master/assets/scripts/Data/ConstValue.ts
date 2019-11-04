export class ConstValue {
    public static readonly IS_EDITIONS = false;//是否为发布版本，用于数据上报 及 log输出控制
    public static readonly IS_TEACHER = true;//是否为教师端版本
    public static readonly CONFIG_FILE_DIR = "config/";
    public static readonly PREFAB_UI_DIR = "prefab/ui/panel/";
    public static readonly AUDIO_DIR = "audio/";
    public static readonly CoursewareKey = "grX3kQwFGU3WDsx1M8rUdp1V";//每个课件唯一的key 24位随机字符串 可用随机密码生成器来生成。
    /**课件名称 */
    public static readonly COURSEWARE_NAME = "TuXingFenGe";
    /**是否有答案 */
    public static readonly IsAnswer = true;
    /**是否有关卡 */
    public static readonly IsLevel = false;
}