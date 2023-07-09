/**
 * @file 邮件投递员
 * @author Yangholmes 2023-06-11
 */

import dotenv from 'dotenv'

import env from '../.env'

import {createTransport} from 'nodemailer'

const config = dotenv.parse(env)

const {
  user,
  password: pass,
  smtphost: host,
  smtpport: port
} = config

const transporter = createTransport({
  host,
  port,
  secure: true,
  auth: {
    user,
    pass
  },
});

export function send(subject: string, text?: string, html?: string) {
  return transporter.sendMail({
    from: `"我们家的小管家" <${user}>`,
    to: user,
    subject,
    text,
    html
  });
}
