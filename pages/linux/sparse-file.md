---
permalink: sparse-file
tags: linux
date: 2018-02-21
---

# Sparse file

在 Linux 下通常我们使用 dd 命令来创建指定大小的文件：
```
dd if=/dev/zero of=file bs=1k count=1024
```
但是在创建大文件时，这种方法速度很不理想。
如果需要快速创建大文件，可以使用 GNU dd 的 seek 选项：
```
dd of=file bs=1k seek=5120 count=0
```
指定 seek 选项时，GNU dd 会调用 ftruncate 直接设置文件大小。
这需要文件系统的支持，所幸大部分主流文件系统已支持这一特性。

## See also

* [Sparse file](http://en.wikipedia.org/wiki/Sparse_file)
