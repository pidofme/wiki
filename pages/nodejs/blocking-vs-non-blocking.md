---
permalink: blocking-vs-non-blocking
tags: node.js
date: 2018-04-14
---

# 阻塞与非阻塞概述

本文讲述 Node.js 中**阻塞**与**非阻塞**调用之间的区别。文中会涉及事件循环和 libuv 的话题，但不需要事先了解这些主题。文中假设读者对 JavaScript 和 Node.js 的回调模式具有基本的了解。

> 文中“I/O”主要是指由 [libuv](http://libuv.org) 提供的与系统磁盘和网络的交互。

## 阻塞

当 Node.js 进程中其余的 JavaScript 必须等到一个非 JavaScript 操作完成后才能执行时，称之为**阻塞**。这种情形的发生是因为当一个**阻塞**操作出现时事件循环无法继续执行 JavaScript。

Node.js 中，由于 CPU 密集计算而不是等待某个非 JavaScript 操作（如 I/O 操作）导致的性能问题，通常不称为**阻塞**。最常见的**阻塞**操作是 Node.js 标准库中那些使用 libuv 的同步方法。原生模块也可能有**阻塞**方法。

Node.js 标准库中提供的所有异步 I/O 方法都是**非阻塞**的，且接受回调函数。部分方法也提供以 `Sync` 开头命名的**阻塞**版本。

## 代码比较

**阻塞**方法以**同步**方式执行，**非阻塞**方法以**异步**方式执行。

以文件系统模块为例，这是**同步**方式的文件读取：
``` javascript
const fs = require('fs');
const data = fs.readFileSync('/file.md'); // 阻塞在这，直到文件读取完成
```
以下是相应的**异步**版本：
``` javascript
const fs = require('fs');
fs.readFile('/file.md', (err, data) => {
  if (err) throw err;
});
```
第一个例子看起来比第二个要简单一些，但缺点是第二行会阻塞其余 JavaScript 代码的执行直到整个文件读取完成。注意，在同步版本中如果有错误抛出，则需要被捕获，否则整个线程会崩溃。而异步版本中，则可以由编写者决定是否应该直接抛出。

让我们稍微扩展一下我们的例子：

``` javascript
const fs = require('fs');
const data = fs.readFileSync('/file.md'); // 阻塞在这，直到文件读取完成
console.log(data);
// moreWork(); 在 console.log 之后运行
```
接下来，是相似但并不等价的异步版本：

``` javascript
const fs = require('fs');
fs.readFile('/file.md', (err, data) => {
  if (err) throw err;
  console.log(data);
});
// moreWork(); 在 console.log 之前运行
```
在这里的第一个例子中，`console.log` 会在 `moreWork()` 之前被调用。在第二个例子中 `fs.readFile()` 是**非阻塞**的，所以 JavaScript 将继续执行下去，`moreWork()` 会先被调用。这种不用等待文件读取完成就执行 `moreWork()` 的能力是高吞吐量得以实现的关键设计抉择。

## 并发性与吞吐量

Node.js 中 JavaScript 是单线程执行的，所以并发是指事件循环在完成其它工作后执行 JavaScript 回调函数的能力。任何期望以并发方式运行的代码都必须保证事件循环在非 JavaScript 操作（如 I/O）发生时能够持续运行。

例如，考虑这样一个场景，对 Web 服务器的每个请求耗时 50ms，其中 45ms 是可以异步执行的数据库 I/O 。使用异步**非阻塞**操作可以释放这 45ms 去处理其它的请求。选择**非阻塞**方法相较于使用**阻塞**方法，将带来的显著的容量提升。

事件循环不同于其它编程语言采用的创建线程处理并发工作的模型。

## 阻塞与非阻塞混用的危险

在处理 I/O 相关操作时，应该避免使用某些模式。让我们看一個例子:

``` javascript
const fs = require('fs');
fs.readFile('/file.md', (err, data) => {
  if (err) throw err;
  console.log(data);
});
fs.unlinkSync('/file.md');
```
在这个例子中，`fs.unlinkSync()` 很有可能在 `fs.readFile()` 之前运行，导致 `file.md` 在读取完成之前被删除。更好的实现方法是，完全使用**非阻塞**并确保按正确的顺序执行：

``` javascript
const fs = require('fs');
fs.readFile('/file.md', (readFileErr, data) => {
  if (readFileErr) throw readFileErr;
  console.log(data);
  fs.unlink('/file.md', (unlinkErr) => {
    if (unlinkErr) throw unlinkErr;
  });
});
```
这里在 `fs.readFile()` 的回调函数中使用**非阻塞**的 `fs.unlink()` 方法，确保了操作顺序的正确。

## 更多信息

* [libuv](http://libuv.org)
* [About Node.js](https://nodejs.org/en/about/)
