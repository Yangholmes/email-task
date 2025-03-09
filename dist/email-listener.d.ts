/**
 * @file 邮件接受监听
 * @author Yangholmes 2023-05-28
 */
import { EventEmitter } from 'node:events';
import { Attachment } from 'mailparser';
export interface ActionParams {
    text: string;
    html: string;
    attachments: Attachment[];
}
export interface Command {
    command: string;
    action: (params: ActionParams) => boolean;
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
    private openInbox;
    private fetchLatestEmails;
    private parseEmail;
    start(): void;
    stop(): void;
    use(): void;
    useCmds(cmds: Command[]): void;
}
export {};
