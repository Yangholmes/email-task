/**
 * @file 邮件投递员
 * @author Yangholmes 2023-06-11
 */

import {createTransport} from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPPool from 'nodemailer/lib/smtp-pool';

interface Options {
  user:string;
  password: string;
  smtphost: string;
  smtpport: number;
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
      smtpport
    } = options;

    const config: SMTPPool.Options = {
      pool: true,
      host: smtphost,
      port: smtpport,
      secure: true,
      auth: {
        user,
        pass: password
      },
    };

    this.transport = createTransport(config);
  }

  public send(
    from: string,
    to: string,
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

