import { ITypeCheckerOptions } from './interfaces';
import { getPath } from './getPath';
import { C_Blue, C_Gray, C_Reset, Logger } from './logger';

export function printSettings(options: ITypeCheckerOptions) {
    // configuration name
    Logger.info(`${C_Blue}Typechecker settings - name:`, C_Gray, options.name, C_Reset);

    // base path being used
    Logger.info(`${C_Blue}Typechecker settings - basepath:`, C_Gray, options.basePath, C_Reset);

    // get tsconfig path and options
    if (options.tsConfig) {
        let tsconf = getPath(options.tsConfig, options);
        Logger.info(`Typechecker settings - tsconfig:`, C_Gray, tsconf, C_Reset);
    } else {
        Logger.info(
            `${C_Blue}Typechecker settings - tsconfig:`,
            C_Gray,
            `undefined, using ts defaults/override if defined`,
            C_Reset
        );
    }
}
