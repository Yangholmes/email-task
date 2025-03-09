/**
 * @file 邮件接受监听
 * @author Yangholmes 2023-05-28
 */

import { Buffer } from 'node:buffer';
import { EventEmitter } from 'node:events';

import Imap from 'imap';
import { Attachment, simpleParser } from 'mailparser';


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
  user: string,
  password: string,
  host: string,
  port: string,
}

export class EmailListener extends EventEmitter {
  private readonly imap: Imap;
  private readonly options: Options;

  constructor(options: Options) {
    if (!options) {
      throw new Error('options is required!');
    }
    super();
    this.options = options;
    this.imap = this._setupImap();
  }

  private _setupImap() {
    const self = this;
    const { user, password, host, port } = self.options;
    const imap = new Imap({
      user,
      password,
      host,
      port: Number.parseInt(port, 10),
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    });

    imap.on('ready', () => {
      const self = this;
      console.log('IMAP连接就绪');
      self.openInbox();
    });

    imap.on('error', (err: Error) => {
      console.error('IMAP连接错误:', err);
    });

    imap.on('log', console.log);

    return imap;
  }

  private openInbox() {
    const self = this;
    self.imap.openBox('INBOX', true, (err, box) => {
      if (err) {
        console.error('打开邮箱失败:', err);
        throw err;
      }

      console.log('listening...');
      self.imap.on('mail', (msgCounts: number) => {
        console.log(`收到新邮件: ${msgCounts}`);
        self.fetchLatestEmails(box, msgCounts);
      });
    });
  }

  private fetchLatestEmails(box: Imap.Box, msgCounts: number) {
    const self = this;
    const totalCounts = box.messages.total;
    const fetchRange = `${Math.max(1, totalCounts - msgCounts + 1)}:${totalCounts}`;

    const fetch = self.imap.seq.fetch(fetchRange, {
      bodies: '',
      // bodies: ['HEADER.FIELDS (SUBJECT)', 'TEXT'],
      struct: true,
      markSeen: true
    });

    fetch.on('message', (msg, seqno) => {
      console.log(`正在解析邮件 #${seqno}`);
      msg.on('body', (stream, info) => {
        console.log(`邮件内容类型: ${info.which}`);
        console.log(`邮件大小: ${info.size}`);
        self.parseEmail(stream, info.size);
      });

      msg.on('end', () => {
        console.log(`邮件 #${seqno} 接收完成`);
      });
    });

    fetch.on('error', (err) => {
      console.error(err);
      throw err;
    });

    fetch.on('end', () => {
      console.log('邮件获取完成');
      // self.imap.end();
    });
  }

  private parseEmail(stream: NodeJS.ReadableStream, total: number) {
    const self = this;
    let buffer = Buffer.alloc(total);
    let count = 0;

    stream.on('data', (chunk) => {
      // TODO 处理长度超出异常
      chunk.copy(buffer, count);
      count += chunk.length;
      console.log(`received ${count} bytes, total ${total} bytes`);
    });

    stream.on('end', () => {
      console.log('邮件内容解析完成');
      simpleParser(buffer).then((res) => {
        const { subject: action, text, html, attachments } = res;
        console.log(`收到事件: ${action}`);
        action && self.emit(action, { text, html, attachments });
      });
    });
    stream.on('error', (err) => {
      console.error(err);
    });

    // const parser = new MailParser();
    // let emailData: ActionParams = {
    //   text: '', html: '', attachments: []
    // }
    // ;

    // parser.on('data', (data) => {
    //   console.log(data);
    //   if (data.type === 'text') {
    //     emailData.text = data.text;
    //     emailData.html = data.html;
    //   }
    //   if (data.type === 'attachment') {
    //     emailData.attachments.push(data);
    //   }
    // });

    // parser.on('end', () => {
    //   console.log('邮件解析完成');
    //   // TODO
    //   console.log(emailData);
    // });

    // stream.pipe(parser);
  }

  public start() {
    this.imap.connect();
  }

  public stop() {
    this.imap.end();
  }

  public use() {
    // TODO: 实现中间件
  }

  public useCmds(cmds: Command[]) {
    const self = this;
    cmds.forEach(cmd => {
      self.on(cmd.command, cmd.action);
    });
  }

}
