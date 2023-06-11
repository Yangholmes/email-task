/**
 * @file 邮件接受监听
 * @author Yangholmes 2023-05-28
 */

import Imap from 'imap';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';
import { inspect } from 'util';
import { EventEmitter } from 'events';
import { Commands } from './commands';

import env from '../.env'

const config = dotenv.parse(env)

const {
  user,
  password,
  imaphost: host,
  imapport: port
} = config

export class EmailListener extends EventEmitter {
  private readonly imap: Imap

  constructor() {
    super()
    this.imap = this._setupImap()
  }

  private _setupImap() {
    const self = this
    const imap = new Imap({
      user,
      password,
      host,
      port: Number.parseInt(port),
      tls: true
    });
    imap.on('ready', function () {
      self.emit('email receiver started!');
      imap.openBox('INBOX', true, function (err, box) {
        console.log('listening...');
        if (err) {
          self.emit('error', err)
          throw err;
        }
        imap.on('mail', (count) => {
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
                  const { subject, text } = res
                  self.emit(subject, text)
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
            self.emit('end')
          });
        })
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

  public useCmd(cmds: Commands[]) {
    const self = this
    cmds.forEach(cmd => {
      self.on(cmd.event, cmd.listener)
    });
  }

}
