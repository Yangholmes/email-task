/**
 * @file email task listener test
 * @author Yangholmes 2025-03-02
 */

import { test } from 'vitest';

import dotenv from 'dotenv';

import { EmailListener } from '../src/email-listener';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

dotenv.config();

const options = {
  host: process.env.imaphost || '',
  port: process.env.imapport || '',
  user: process.env.user || '',
  password: process.env.password || '',
};

test('task listener start and stop', async () => {
  console.log('lanching email listener...');
  const listener = new EmailListener(options);

  listener.start();
  console.log('listener started, will stop in 2s...');

  await sleep(2e3);
  listener.stop();
  console.log('listener stopped');
});
