/**
 * @file 邮件接受监听
 * @author Yangholmes 2023-05-28
 */
import { EventEmitter } from 'node:events';
import { Attachment } from 'mailparser';
export interface ActionParams {
    msgUid?: number;
    text: string;
    html: string;
    attachments: Attachment[];
}
export interface Command {
    command: string;
    action: (params: ActionParams) => void;
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
    private msgUidMap;
    constructor(options: Options);
    private _setupImap;
    private openInbox;
    private fetchLatestEmails;
    private parseEmail;
    start(): void;
    stop(): void;
    use(): void;
    /**
     * 标记邮件为已读
     * @param msgUid 邮件uid
     */
    markAsRead(msgUid: number): Promise<boolean>;
    useCmds(cmds: Command[]): void;
}
export {};
