/**
 * @file 罗列下载列表
 * @author Yangholmes 2023-06-11
 */

import { send } from '@/email-sender';
import { genToken } from './utils';
import dotenv from 'dotenv';
import env from './.env';

const config = dotenv.parse(env);

const {url, token} = config

export function aria2List() {
  const id = genToken()
  fetch(`${url}/jsonrpc`, {
    method: 'POST',
    body: JSON.stringify({
      id,
      jsonrpc: '2.0',
      method: 'aria2.tellActive',
      params: [`token:${token}`]
    })
  }).then(res => {
    return res.json();
  }).then(res => {
    console.log(res);
    const {id: rid, result} = res
    if (rid !== id) {
      console.warn('返回 id 和输入 id 不负');
    }
    const tbody = result.map((r) => {
      const {
        bittorrent,
        infoHash,
        totalLength,
        completedLength,
        downloadSpeed,
        uploadSpeed
      } = r
      return `
        <tr>
          <td>
            ${bittorrent?.info?.name || infoHash}
          </td>
          <td>
            ${((completedLength / totalLength) * 100).toFixed(2)}%
          </td>
          <td>
            ${downloadSpeed}
          </td>
        </tr>
      `
    })

    const table = `
      <table border="1">
        <caption>aria2 当前下载列表</caption>
        <tr>
          <th id="name">名称</th>
          <th id="progress">进度</th>
          <th id="speed">下载速度</th>
        </tr>
        ${tbody.reduce((a, t) => a += t, '')}
      </table>
      <style>
        #name { width: ${14 * 15}px; width: 15em; }
        #progress { width: ${14 * 5}px; width: 5em; }
        #speed { width: ${14 * 7}px; width: 7em; }
      </style>
    `

    send('下载列表', '', table)
  }).catch(err => {
    console.log(err);
  });
}
