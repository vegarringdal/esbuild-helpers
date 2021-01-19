export const C_Reset = '\x1b[0m';
export const C_Bright = '\x1b[1m';
export const C_Dim = '\x1b[2m';
export const C_Underline = '\x1b[4m';
export const C_Blink = '\x1b[5m';
export const C_Reverse = '\x1b[7m';
export const C_Hidden = '\x1b[8m';
export const C_NewLine = '\n';

export const C_Black = '\x1b[30m';
export const C_Red = '\x1b[31m';
export const C_Green = '\x1b[32m';
export const C_Yellow = '\x1b[33m';
export const C_Blue = '\x1b[34m';
export const C_Magenta = '\x1b[35m';
export const C_Cyan = '\x1b[36m';
export const C_Gray = '\x1b[90m';
export const C_White = '\x1b[37m';

export const C_BgBlack = '\x1b[40m';
export const C_BgRed = '\x1b[41m';
export const C_BgGreen = '\x1b[42m';
export const C_BgYellow = '\x1b[43m';
export const C_BgBlue = '\x1b[44m';
export const C_BgMagenta = '\x1b[45m';
export const C_BgCyan = '\x1b[46m';
export const C_BgWhite = '\x1b[47m';

export class Logger {
    public static info = (...args: any[]) => {
        console.log(...args);
    };
}
