/**
 * @file 邮件任务
 * @author Yangholmes 2023-06-04
 */

import { EmailListener } from './email-listener';

const emailListener = new EmailListener();

emailListener.start()
