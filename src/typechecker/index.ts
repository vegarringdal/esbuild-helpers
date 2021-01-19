

import * as child from 'child_process';
import * as path from 'path';
import { ITypeCheckerOptions, WorkerCommand, IResults, END_LINE } from './interfaces';
import * as ts from 'typescript';
import './register.json';
import { getPath } from './getPath';
import { inspectCode } from './inspectCode';
import { printResult } from './printResult';
import { printSettings } from './printSettings';
import { C_BgYellow, C_Black, C_Reset, C_Yellow, Logger } from './logger';

export class TypeHelperClass {
    private options: ITypeCheckerOptions;
    private worker!: child.ChildProcess;

    constructor(options: ITypeCheckerOptions) {
        this.options = options;

        // get/set base path
        if (!this.options) {
            (this.options as any) = {};
        }

        this.options.basePathSetup = options.basePath; // save original path
        this.options.basePath = options.basePath
            ? path.resolve(process.cwd(), options.basePath)
            : process.cwd();

        // get name
        this.options.name = this.options.name ? this.options.name : '';

        // shorten filenames to de-clutter output?
        this.options.shortenFilenames = this.options.shortenFilenames === false ? false : true;

        // get tsconfig path and options
        if (options.tsConfig) {
            let tsconf = getPath(options.tsConfig, options);
            this.options.tsConfigJsonContent = require(tsconf);
        } else {
            // no settings, using default
            if (!this.options.tsConfigJsonContent) {
                this.options.tsConfigJsonContent = {
                    compilerOptions: {}
                };
            }
        }

        if (options.tsConfigOverride) {
            let oldConfig = this.options.tsConfigJsonContent;
            for (let att in options.tsConfigOverride) {
                if (att === 'compilerOptions') {
                    if (oldConfig.compilerOptions) {
                        for (let attCom in (<any>options.tsConfigOverride).compilerOptions) {
                            if (attCom) {
                                oldConfig.compilerOptions[attCom] = (<any>(
                                    options.tsConfigOverride
                                )).compilerOptions[attCom];
                            }
                        }
                    } else {
                        oldConfig.compilerOptions = (<any>options.tsConfigOverride).compilerOptions;
                    }
                } else {
                    oldConfig[att] = (<any>options.tsConfigOverride)[att];
                }
            }
        }
    }

    public printSettings() {
        printSettings(this.options);
    }

    public inspectAndPrint(): number {
        const lastResult = inspectCode(this.options);
        return printResult(this.options, lastResult);
    }

    public inspectOnly(oldProgram: ts.EmitAndSemanticDiagnosticsBuilderProgram) {
        return inspectCode(this.options, oldProgram);
    }

    public printOnly(errors: IResults) {
        if (!errors || (errors && !errors.oldProgram)) {
            Logger.info(
                C_BgYellow,
                C_Black,
                `WARNING  ${
                    C_Reset + C_Yellow
                } No old program in params, auto running inspect first`,
                C_Reset
            );
            return this.inspectAndPrint();
        } else {
            return printResult(this.options, errors);
        }
    }

    public worker_watch(pathToWatch: string): void {
        this.startWorker();
        this.worker.send({
            quit: false,
            type: WorkerCommand.watch,
            pathToWatch: pathToWatch,
            options: this.options
        });
    }

    public worker_kill(): void {
        if (this.worker) {
            this.worker.kill();
        }
    }

    public worker_inspect(): void {
        if (!this.worker) {
            this.startWorker();
        }

        this.worker.send({ type: WorkerCommand.inspectCode, options: this.options });
    }

    public worker_PrintSettings(): void {
        if (!this.worker) {
            this.startWorker();
        }

        this.worker.send({ type: WorkerCommand.printSettings, options: this.options });
    }

    public worker_print(): void {
        if (!this.worker) {
            Logger.info(
                C_BgYellow,
                `WARNING  ${C_Reset + C_Yellow}Need to inspect code before printing first`,
                C_Reset
            );
        } else {
            this.worker.send({ type: WorkerCommand.printResult, options: this.options });
        }
    }

    public worker_inspectAndPrint(): void {
        if (!this.worker) {
            this.startWorker();
        }
        this.worker.send({ type: WorkerCommand.inspectCodeAndPrint, options: this.options });
    }

    private startWorker(): void {
        // create worker fork
        this.worker = child.fork(path.join(__dirname, 'worker'), []);

        // listen for worker messages
        this.worker.on('message', (msg: any) => {
            if (msg === 'error') {
                // if error then exit
                Logger.info(
                    C_BgYellow,
                    `WARNING  ${
                        C_Reset + C_Yellow
                    }- error typechecker`,
                    C_Reset
                );
                process.exit(1);
            } else {
                // if not error, then just kill worker
                Logger.info(
                    C_BgYellow,
                    `WARNING  ${
                        C_Reset + C_Yellow
                    } Typechecker(${this.options.name}) killing worker`,
                    C_Reset
                );
                this.worker_kill();
            }
        });
    }
}

export const TypeChecker = (options: ITypeCheckerOptions): TypeHelperClass => {
    return new TypeHelperClass(options);
};
