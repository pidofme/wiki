---
permalink: python-ctypes-segment-fault-on-64－bit-os
tags: python
date: 2018-02-21
---

# Python ctypes segment fault on 64-bit os

在 Python 中通过 ctypes 调用使用 C++ 编写的平台无关的库，在 Windows、Linux 下测试均无问题，在 Mac OS X 下测试时出现 Segmentation fault: 11。出现 Segmentation fault 的具体位置是 C++ 中访问类公共成员变量的语句。可以确认这里的 C++ 代码是没有问题的。

C++代码：

```c++
#include <iostream>

class Foo{
    public:
        int mValue;
        void setValue(int inValue) {
            mValue = inValue;
            std::cout << "Value is now: " << mValue << std::endl;
        }
};

extern "C" {
    Foo* Foo_new(){ return new Foo(); }
    void Foo_setValue(Foo* foo, int v) { foo->setValue(v); }
}
```

编译：

```shell
clang++ -c -fPIC foo.cpp -o foo.o
clang++ -shared -Wl -o libfoo.dylib  foo.o
```

Python代码：

```python
from ctypes import *
lib = cdll.LoadLibrary('./libfoo.dylib')

class Foo(object):
    def __init__(self):
        self.obj = lib.Foo_new()
    def set(self, v):
        lib.Foo_setValue(self.obj, v);

if __name__ == "__main__":
    f = Foo()
    f.set(3)
```

问题出在 Python 中调用 C++ 库中的方法创建实例时没有指明返回类型，由于 Mac OS X 是 64 位系统，使用的也是 64－bit Python，默认返回的指针却是 32-bit C int，当通过这个指针去访问成员变量时就会出现 Segmentation fault。

对 Python 代码做如下修改，指定返回类型和参数类型即可：

```python
def __init__(self):
    lib.Foo_new.restype = c_void_p # 指定返回类型
    self.obj = lib.Foo_new()

def set(self, v):
    lib.Foo_setValue.argtypes=[c_void_p,c_int] ＃ 指定参数类型
    lib.Foo_setValue(self.obj, v)
```

## See also

* [ctypes class member access segfaulting](http://stackoverflow.com/questions/12482364/ctypes-class-member-access-segfaulting)

* [Wrapping simple c++ example with ctypes; segmentation fault](http://stackoverflow.com/questions/17240621/wrapping-simple-c-example-with-ctypes-segmentation-fault)

* [Calling C/C++ from python?](http://stackoverflow.com/questions/145270/calling-c-c-from-python)
