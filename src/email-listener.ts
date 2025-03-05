/**
 * @file 邮件接受监听
 * @author Yangholmes 2023-05-28
 */

import Imap from 'imap';
import { Attachment, simpleParser } from 'mailparser';
import { inspect } from 'util';
import { EventEmitter } from 'events';


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
    imap.on('ready', function () {
      self.emit('email receiver started!');
      imap.openBox('INBOX', true, function (err, box) {
        console.log('listening...');
        if (err) {
          self.emit('error', err);
          throw err;
        }
        imap.on('mail', (count: number) => {
          console.log(count);
          const f = imap.seq.fetch(box.messages.total, {
            bodies: '',
            struct: true
          });
          f.on('message', function (msg, seqno) {
            console.log(msg);
            console.log('Message #%d', seqno);
            const prefix = '(#' + seqno + ') ';
            msg.on('body', function (stream, info) {
              console.log(info);
              console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
              let buffer = '';
              let count = 0;
              stream.on('data', function (chunk) {
                count += chunk.length;
                buffer += chunk.toString('utf8');
                console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
              });
              stream.once('end', function () {
                console.log(prefix + 'Body [%s] Finished', inspect(info.which));
                simpleParser(buffer).then(res => {
                  // TODO: 处理收到的内容
                  console.log(res);
                  const { subject: action, text, html, attachments } = res;
                  action && self.emit(action, { text, html, attachments });
                });
              });
            });
            msg.on('end', function () {
              console.log(prefix + 'Finished');
            });
          });
          f.on('error', function (err) {
            console.log('Fetch error: ' + err);
          });
          f.on('end', function () {
            console.log('Done fetching all messages!');
            self.emit('end');
          });
        });
      });
    });
    return imap;
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
