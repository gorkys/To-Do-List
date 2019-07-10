# To-Do-List

> 待办事宜

<p align="center" style="width:150px;height:150px">
  <img src="https://cdn.jsdelivr.net/gh/gorkys/CDN-Blog@master/blog/image/To-Do-List/logo.png" alt="">
</p>

## 下载
[点击进入下载页面](https://github.com/gorkys/To-Do-List/releases)

## 应用说明
项目功能：

- [x] 新建与编辑待办事项
- [x] 恢复与删除已完成事项
- [x] 完成事项进度条
- [x] Mini窗口以及双击新建剪贴板数据
- [x] 日程提醒
- [x] 支持剪贴板新建事项
- [x] Mini窗口动画

技术栈：

- `electron-vue`
- `Vue`
- `Vuex`
- `lowdb`
- `element-ui`

## 项目截图:

![](https://cdn.jsdelivr.net/gh/gorkys/CDN-Blog@master/blog/image/To-Do-List/to-do-list.gif)

## 开发说明

> 目前仅针对Windows。Mac、Linux平台并未兼容。

>如果想学习Electron-vue的开发，可以查看Molunerfinn写的系列教程——[Electron-vue开发实战](https://molunerfinn.com/tags/Electron-vue/)

遇到的一些问题可以参考我踩过的坑，[Electron-vue开发实战之To-do-List](http://tingtas.com/posts/7bca46d1)

## 开发模式
输入npm run dev进入开发模式，开发模式具有热重载特性。不过需要注意的是，开发模式不稳定，会有进程崩溃的情况。此时需要：
```base
ctrl+c # 退出开发模式
npm run dev # 重新进入开发模式
```
## 生产模式
如果你需要自行构建，可以npm run build开始进行构建。构建成功后，会在build目录里出现构建成功的相应安装文件。

注意：如果你的网络环境不太好，可能会出现electron-builder下载electron二进制文件失败的情况。这个时候需要在npm run build之前指定一下electron的源为国内源：
```base
npm set ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron/
npm run build
```
只需第一次构建的时候指定一下国内源即可。后续构建不需要特地指定。
其它打包问题参考：<http://tingtas.com/posts/7bca46d1#electron-vue打包的正确姿势>

## 赞助
> To-Do-List是免费开源的软件,如果你喜欢它，对你有帮助，不妨请我喝杯咖啡吧

微信：

![](https://cdn.jsdelivr.net/gh/gorkys/CDN-Blog@master/blog/sponsor/wechat.jpg)

支付宝：

![](https://cdn.jsdelivr.net/gh/gorkys/CDN-Blog@master/blog/sponsor/alipay.png)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017 - 2019 Gorkys
