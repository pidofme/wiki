---
permalink: tornado-v4-websocket-connections-get-refused-with-403
tags: [python, tornado]
date: 2018-02-22
---

# Tornado 4.0 WebSocket connections get refused with 403

在 tornado 4.0 以前的版本中 WebSocketHandler.check_origin(origin) 默认返回 True，即接受来自其它 host 的连接，但是 4.0 开始默认不再接受其它 host 的连接了。因此来自其它 host 的连接就会被拒绝。

在继承 WebSocketHandler 的 class 中重写 check_origin 方法，接受其它 host 的连接即可：

```python
def check_origin(self, origin):
    return True
```

## See also

* [Backwards-compatibility notesBackwards-compatibility notes](http://www.tornadoweb.org/en/stable/releases/v4.0.0.html#backwards-compatibility-notes)
* [Configuration](http://www.tornadoweb.org/en/stable/websocket.html#tornado.websocket.WebSocketHandler.check_origin)
* [Under tornado v4+ WebSocket connections get refused with 403Under tornado v4+ WebSocket connections get refused with 403](http://stackoverflow.com/questions/24800436/under-tornado-v4-websocket-connections-get-refused-with-403)
