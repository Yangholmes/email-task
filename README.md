# 邮件任务服务

## 简介

这个项目的起因是我想不在家的时候控制家里的一些设备，这就需要一个公网 IP ，或者做一下内网穿透。但是当地网络运营商不给我分配一个固定的公网 IP ，购买一个云服务器只是为了控制一下家里的几个小电器不怎么划算，最终便想到了使用电子邮箱的 imap 来做这个伺服。

这个仓库有两个导出，一个用来做邮件监听，另一个用来做邮件发送。

支持 TypeScript。

## 使用方法

### 安装

```bash
npm i email-task
```

或

```bash
yarn add email-task
```

或

```bash
pnpm add email-task
```

### 监听

```ts
import { EmailListener } from 'email-task';

// 准备邮箱信息
const options = {
  host: '邮箱服务商的服务器地址',
  port: '端口',
  user: '邮箱账号',
  password: '邮箱密码',
};

// 实例化监听器
const listener = new EmailListener(options);

// 订阅事件
listener.useCmds([/** 事件列表 */])

// 开启服务
listener.start();

// 监听器会一直运行，直到手动停止
listener.stop();

```

### 发送

```ts
import { EmialSender } from 'email-task';

const options = {
  smtphost: '邮箱服务商的服务器地址',
  smtpport: '端口',
  user: '邮箱账号',
  password: '邮箱密码',
};

const emailSender = new EmialSender(options);

const sendto = '收件人邮箱';

emailSender.send('<from>', sendto, '<subject>', '<text>', '<html>');
```

`examples` 目录查看更多示例

## 订阅方式

TBC...

## 运行测试代码

### 执行测试用例

```bash
pnpm test
```

### 执行测试用例并生成覆盖率报告

```bash
pnpm coverage
```

## 贡献

欢迎提交 PR 或 Issue。

## TODO

 * [X] ~~配置加载工具~~
 * [X] 邮件任务监听
 * [X] 邮件发送
 * [X] 测试用例
 * [X] 邮件标记已读
 * [ ] 增加获取所有未读邮件选项，未读邮件读取并触发事件
