/**
 * @file 任务分发器
 * @author Yangholmes 2023-05-28
 */

import Imap from 'imap'
import { simpleParser } from 'mailparser'
import dotenv from 'dotenv'
import { inspect } from 'util'

const config = dotenv.config().parsed
console.log(config);

const { user, password, host, port } = config

console.log(Number.parseInt(port));

const imap = new Imap({
  user,
  password,
  host,
  port: Number.parseInt(port),
  tls: true
});

imap.on('ready', function () {
  inspect('I am ready')
  console.log('I am ready');
  imap.openBox('INBOX', true, function (err, box) {
    if (err) throw err;
    imap.on('mail', (count) => {
      console.log(count);
      const f = imap.seq.fetch(box.messages.total, {
        bodies: '',
        struct: true
      });
      f.on('message', function (msg, seqno) {
        console.log(msg);
        console.log('Message #%d', seqno);
        var prefix = '(#' + seqno + ') ';
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
              console.log(res);
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
        // imap.end();
      });
    })
  });
});

imap.on('error', function (err) {
  console.log(err);
});

imap.on('end', function () {
  console.log('Connection ended');
});

imap.connect();
