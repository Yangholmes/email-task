/**
 * @file 邮件投递员
 * @author Yangholmes 2023-06-11
 */

import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPPool from 'nodemailer/lib/smtp-pool';

interface Options {
  user:string;
  password: string;
  smtphost: string;
  smtpport: number;
  proxy?: string;
}

export class EmialSender {
  // private readonly options: Options;
  private readonly transport: Mail;

  constructor(options: Options) {
    if (!options) {
      throw new Error('options is required!');
    }
    // this.options = options;

    const {
      user,
      password,
      smtphost,
      smtpport,
      proxy
    } = options;

    const config: SMTPPool.Options & {
      proxy?: string;
    } = {
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

  public testTransport() {
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

  public send(
    from: string,
    to: string | string[],
    subject: string,
    text?: string,
    html?: string
  ) {
    return this.transport.sendMail({
      from,
      to,
      subject,
      text,
      html
    });
  }
}

