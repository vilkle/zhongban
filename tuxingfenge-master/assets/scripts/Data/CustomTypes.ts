
/**格子填充色 */
export enum FillColor{
    Null = null,
    Yellow = 0xefdb54,
    Pink = 0xff95c9,
    Red = 0xf87f6f,
    Green = 0x79ea5b,
    Purple = 0xb89af7,
    Orange = 0xffab4b
}

export function HexToColorString(value:number) {
    return '#' + value.toString(16)
}