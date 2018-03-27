---
permalink: docker-container-restart-policy
tags: Docker
date: 2018-03-27
---

# Docker 容器重启策略

启动 Docker 容器时可以使用 --restart 参数指定容器重启策略。


Docker 支持如下几种容器重启策略：

| 策略                     | 简介                                                             |
| no                       | 当容器退出时，不自动重启。这是默认设置。                         |
| on-failure[:max-retries] | 仅当容器退出状态非零时才重启。可以指定重试次数。                 |
| always                   | 无视退出状态，总是重启容器。而且容器会随 Docker 守护进程启动。   |
| unless-stopped           | 总是重启容器，除非容器在 Docker 守护进程启动前已经处于停止状态。 |


# 参考链接

* [Docker run reference](https://docs.docker.com/engine/reference/run/#restart-policies---restart)
