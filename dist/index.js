// src/email-listener.ts
import Imap from "imap";
import { simpleParser } from "mailparser";
import { inspect } from "util";
import { EventEmitter } from "events";
var EmailListener = class extends EventEmitter {
  imap;
  options;
  constructor(options) {
    if (!options) {
      throw new Error("options is required!");
    }
    super();
    this.options = options;
    this.imap = this._setupImap();
  }
  _setupImap() {
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
    imap.on("ready", function() {
      self.emit("email receiver started!");
      imap.openBox("INBOX", true, function(err, box) {
        console.log("listening...");
        if (err) {
          self.emit("error", err);
          throw err;
        }
        imap.on("mail", (count) => {
          console.log(count);
          const f = imap.seq.fetch(box.messages.total, {
            bodies: "",
            struct: true
          });
          f.on("message", function(msg, seqno) {
            console.log(msg);
            console.log("Message #%d", seqno);
            const prefix = "(#" + seqno + ") ";
            msg.on("body", function(stream, info) {
              console.log(info);
              console.log(prefix + "Body [%s] found, %d total bytes", inspect(info.which), info.size);
              let buffer = "";
              let count2 = 0;
              stream.on("data", function(chunk) {
                count2 += chunk.length;
                buffer += chunk.toString("utf8");
                console.log(prefix + "Body [%s] (%d/%d)", inspect(info.which), count2, info.size);
              });
              stream.once("end", function() {
                console.log(prefix + "Body [%s] Finished", inspect(info.which));
                simpleParser(buffer).then((res) => {
                  console.log(res);
                  const { subject: action, text } = res;
                  action && self.emit(action, text);
                });
              });
            });
            msg.on("end", function() {
              console.log(prefix + "Finished");
            });
          });
          f.on("error", function(err2) {
            console.log("Fetch error: " + err2);
          });
          f.on("end", function() {
            console.log("Done fetching all messages!");
            self.emit("end");
          });
        });
      });
    });
    return imap;
  }
  start() {
    this.imap.connect();
  }
  stop() {
    this.imap.end();
  }
  use() {
  }
  useCmds(cmds) {
    const self = this;
    cmds.forEach((cmd) => {
      self.on(cmd.command, cmd.action);
    });
  }
};

// src/email-sender.ts
import { createTransport } from "nodemailer";
var EmialSender = class {
  // private readonly options: Options;
  transport;
  constructor(options) {
    if (!options) {
      throw new Error("options is required!");
    }
    const {
      user,
      password,
      smtphost,
      smtpport,
      proxy
    } = options;
    const config = {
      pool: true,
      host: smtphost,
      port: smtpport,
      secure: true,
      auth: {
        user,
        pass: password
      },
      proxy
    };
    this.transport = createTransport(config);
  }
  testTransport() {
    return new Promise((resolve, reject) => {
      this.transport.verify((error, success) => {
        if (error) {
          reject(error);
        } else {
          resolve(success);
        }
      });
    });
  }
  send(from, to, subject, text, html) {
    return this.transport.sendMail({
      from,
      to,
      subject,
      text,
      html
    });
  }
};
export {
  EmailListener,
  EmialSender
};
