/**
 * @file 邮件接受监听
 * @author Yangholmes 2023-05-28
 */
import { EventEmitter } from 'node:events';
import { Attachment } from 'mailparser';
export interface ActionParams {
    msgUid?: number;
    from?: string | string[];
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
    /** email 服务器配置 */
    private readonly options;
    /** 邮件序列-邮件 id 映射 */
    private msgUidMap;
    private readonly fetchUnread;
    /**
     * 邮件监听器
     * @param options email 服务器配置
     * @param fetchUnread 实例化时是否立即拉取所有未读邮件
     */
    constructor(options: Options, fetchUnread?: boolean);
    private _setupImap;
    private openInbox;
    private fetchUnreadEmails;
    private fetchLatestEmails;
    private fetchEmails;
    private parseEmail;
    /** 开启服务 */
    start(): void;
    /** 停止服务 */
    stop(): void;
    /** 注册中间件 (未完成) */
    use(): void;
    /**
     * 标记邮件为已读
     * @param msgUid 邮件uid
     */
    markAsRead(msgUid: number): Promise<boolean>;
    /** 注册命令 */
    useCmds(cmds: Command[]): void;
}
export {};
