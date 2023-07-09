/**
 * @file 命令
 * @author Yangholmes 2023-06-05
 */

import { aria2List } from './listeners/aria2/list';

export interface Commands {
  event: '下载' | '查看下载';
  listener: (options?: {
    [o in string]?: string;
  }) => any;
}

export const commands: Array<Commands> = [
  /** 列出 aria2 下载列表 */
  {
    event: '查看下载',
    listener: aria2List
  },
  {
    event: '下载',
    listener: () => {}
  }
];
