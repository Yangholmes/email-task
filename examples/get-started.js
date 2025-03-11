/**
 * @file get started example
 * @author Yangholmes 2025-03-11
 */

import { EmailListener } from '../dist/index.js';

import * as dotenv from 'dotenv';

dotenv.config();

const options = {
  host: process.env.imaphost || '',
  port: process.env.imapport || '',
  user: process.env.user || '',
  password: process.env.password || '',
};

const listener = new EmailListener(
  // email server options
  options,
  // whether fetch all unread emails when initialization
  true
);

// send email to the email box, setting email subject as 'test-task', will receive the email and fire 'test-task' event, then run the action function.
listener.useCmds([
  {
    command: 'test-task',
    action(params) {
      const { msgUid } = params;
      // Do something with the message
      // mark as read
      msgUid && listener.markAsRead(msgUid);
    },
  },
]);

listener.start();