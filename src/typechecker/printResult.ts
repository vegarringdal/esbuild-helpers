import {
    END_LINE,
    ITypeCheckerOptions,
    TotalErrorsFound,
    TypeCheckError,
    ITSError,
    IResults
} from './interfaces';
import * as path from 'path';
import { processTsDiagnostics } from './processTsDiagnostics';
import {
    C_BgGreen,
    C_BgRed,
    C_Black,
    C_Blue,
    C_Bright,
    C_Cyan,
    C_Dim,
    C_Gray,
    C_Green,
    C_NewLine,
    C_Red,
    C_Reset,
    C_Underline,
    C_White,
    C_Yellow,
    Logger
} from './logger';

export function printResult(options: ITypeCheckerOptions, errors: IResults): TotalErrorsFound {
    // get the lint errors messages
    const tsErrorMessages: TypeCheckError[] = processTsDiagnostics(options, errors);

    // group by filename
    let groupedErrors: { [k: string]: TypeCheckError[] } = {};
    tsErrorMessages.forEach((error: TypeCheckError) => {
        if (!groupedErrors[error.fileName]) {
            groupedErrors[error.fileName] = [] as TypeCheckError[];
        }
        groupedErrors[error.fileName].push(error);
    });

    // get errors totals
    const optionsErrors = errors.optionsErrors.length;
    const globalErrors = errors.globalErrors.length;
    const syntacticErrors = errors.syntacticErrors.length;
    const semanticErrors = errors.semanticErrors.length;
    const totalsErrors = optionsErrors + globalErrors + syntacticErrors + semanticErrors;

    let allErrors = Object.entries(groupedErrors).map(([fileName, errors]) => {
        const short = options.shortenFilenames !== false ? true : false;
        const fullFileName = path.resolve(fileName);
        let shortFileName = fullFileName.split(options.basePath as string).join('.');
        if (path.isAbsolute(shortFileName)) {
            // most likely a tsconfig path
            shortFileName = path.relative(process.cwd(), fullFileName);
        } else {
            // if somepne passes in basepath we need to use that in print
            if (options.basePathSetup) {
                shortFileName = path.join(options.basePathSetup, shortFileName);
            }
        }

        return (
            `\n   ${C_Reset + C_Blue + C_Underline + shortFileName + C_Reset + C_Gray} - ${
                errors.length
            } errors.${C_Reset}\n` +
            errors
                .map((err: TypeCheckError) => {
                    const fName = short ? shortFileName : fullFileName;
                    let text = `${C_Yellow}    -  ${fName}:${err.line}:${
                        err.char
                    }${C_Reset}${C_Dim} (${(<ITSError>err).category} ${(<ITSError>err).code}) ${
                        (<ITSError>err).message
                    }${C_Reset}`;

                    return text;
                })
                .join(END_LINE)
        );
    });

    const name = options.name;
    // print if any
    if (allErrors.length > 0) {
        // insert header
        Logger.info(
            C_Reset,
            `${
                C_NewLine + C_White + C_BgRed
            } ERROR ${C_Reset} Typechecker inspection - (${name ? name : 'no-name'}):`,
            `${C_Gray}${totalsErrors} errors.${C_Reset}`
        );
        Logger.info(allErrors.join(END_LINE));
    } else {
        Logger.info(
            C_NewLine,
            C_BgGreen,
            `SUCCESS `,
            C_Reset,
            C_Green,
            `Typechecker inspection - (${name ? name : 'no-name'}):`,
            `No Errors found`,
            C_Reset,
            C_NewLine
        );
    }

    // print option errors
    if (errors.optionsErrors.length) {
        Logger.info(
            C_NewLine,
            `${C_Underline}Option errors:`,
            C_Reset,
            `${errors.optionsErrors.length} errors.`
        );
        let optionErrorsText = Object.entries(errors.optionsErrors).map(([no, err]) => {
            let messageText = (<any>err).messageText;
            if (typeof messageText === 'object' && messageText !== null) {
                messageText = JSON.stringify(messageText);
            }
            let text = `${C_Yellow}   -  tsConfig: (${(<any>err).category}:${
                (<any>err).code
            })${C_Gray} ${messageText}${C_Reset}`;
            return text;
        });
        Logger.info(optionErrorsText.join('\n'));
    }

    // todo: this needs testing, how do I create a global error??
    try {
        if (errors.globalErrors.length) {
            Logger.info(
                `\n`,
                C_Underline + C_Red,
                `Option errors:`,
                C_Gray,
                `${errors.globalErrors.length} errors`,
                C_Reset
            );
            let globalErrorsText = Object.entries(errors.globalErrors).map(([no, err]) => {
                let messageText = (<any>err).messageText;
                if (typeof messageText === 'object' && messageText !== null) {
                    messageText = JSON.stringify(messageText);
                }
                return `${C_Yellow}  -  tsConfig: (${(<any>err).category}:${
                    (<any>err).code
                })${C_Gray} ${messageText}${C_Reset}`;
            });
            Logger.info(globalErrorsText.join('\n'));
        }
    } catch (err) {
        console.log(`Global error`, err);
    }

    // if errors, show user
    if (options.print_summary) {
        if (totalsErrors) {
            // write header

            Logger.info(
                '\n',
                `${C_Underline}Error Summary:${C_Reset}`,
                `${C_Gray}- ${totalsErrors} errors.${C_Reset}`
            );

            Logger.info(
                `${C_Reset}${optionsErrors ? C_Red : C_Dim}   - Options: ${optionsErrors}\n`,
                `${C_Reset}${semanticErrors ? C_Red : C_Dim}  - Options: ${semanticErrors}\n`,
                `${C_Reset}${syntacticErrors ? C_Red : C_Dim}  - Options: ${syntacticErrors}\n`,
                `${C_Reset}${globalErrors ? C_Red : C_Dim}  - Options: ${globalErrors}\n`
            );
        }
    }

    if (options.print_runtime) {
        Logger.info(
            `${C_Gray}Typechecker inspection time:`,
            `${errors.elapsedInspectionTime}ms${C_Reset}`
        );
    }

    return totalsErrors;
}
