/**
 * @file aria2 工具
 * @author Yangholmes 2023-06-11
 */

export function genToken() {
  const ns = 'email-task';
  const timestamp = new Date().getTime().toString();
  const random = Math.random().toString();
  const raw = `${ns}.${timestamp}.${random}`;
  const token = new Buffer(raw).toString('base64');
  return token;
}
