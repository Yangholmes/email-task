/**
 * @file 邮件投递员
 * @author Yangholmes 2023-06-11
 */
interface Options {
    user: string;
    password: string;
    smtphost: string;
    smtpport: number;
    proxy?: string;
}
export declare class EmialSender {
    private readonly transport;
    constructor(options: Options);
    testTransport(): Promise<unknown>;
    send(from: string, to: string, subject: string, text?: string, html?: string): Promise<any>;
}
export {};
