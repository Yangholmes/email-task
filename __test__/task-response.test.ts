/**
 * @file task response test
 * @author Yangholmes 2025-03-03
 */

import { test, expect } from 'vitest';

import { EmialSender } from '../src/email-sender';

import dotenv from 'dotenv';

dotenv.config();

const options = {
  smtphost: process.env.smtphost || '',
  smtpport: Number.parseInt(process.env.smtpport || '', 10),
  user: process.env.user || '',
  password: process.env.password || '',
  proxy: process.env.proxy || '',
};

const sendto = process.env.sendto || '';

test('initial error', () => {
  // @ts-ignore
  expect(() => new EmialSender()).toThrowError('options is required!');
});

test('mail sender test', async () => {
  const emailSender = new EmialSender(options);
  const result = await emailSender.testTransport();
  expect(result).toBe(true);
});

test('task response', async () => {
  const emailSender = new EmialSender(options);

  const r = await emailSender.send('test', sendto, 'task response from testcase', 'hello world!', '<p>hello world!</p>');

  expect(r.accepted).toContain(sendto);
});
