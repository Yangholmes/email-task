/**
 * @file 邮件接受监听
 * @author Yangholmes 2023-05-28
 */
import { EventEmitter } from 'events';
export interface Command {
    command: string;
    action: <T>(args: T) => boolean;
}
interface Options {
    user: string;
    password: string;
    host: string;
    port: string;
}
export declare class EmailListener extends EventEmitter {
    private readonly imap;
    private readonly options;
    constructor(options: Options);
    private _setupImap;
    start(): void;
    stop(): void;
    use(): void;
    useCmds(cmds: Command[]): void;
}
export {};
