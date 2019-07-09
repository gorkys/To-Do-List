<template>
    <div class="fake-title-bar">
        To-Do-List  {{ version }}
        <div class="handle-bar">
            <el-dropdown @command="handleCommand">
                <i class="el-icon-caret-bottom"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="about">关于</el-dropdown-item>
                    <el-dropdown-item command="sponsor">赞助</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <i class="el-icon-minus" @click="minimizeWindow"></i>
            <i class="el-icon-close" @click="closeWindow"></i>
        </div>
        <el-dialog
                title="To-Do-List"
                style="text-align: start"
                :visible.sync="dialogAbout"
                width="90%">
            <p>版本: {{version}}</p>
            <p>作者: Gorkys</p>
            <p @click="$electron.remote.shell.openExternal('http://www.github.com/gorkys/To-Do-List')"
            style="cursor: pointer">
                Github: http://www.github.com/gorkys/To-Do-List
            </p>
        </el-dialog>
        <el-dialog
                title="赞助To-Do-List"
                :visible.sync="visible"
                width="90%"
                top="10vh"
        >
            <p>To-Do-List是免费开源的软件</p>
            <p>如果你喜欢它，对你有帮助，不妨请我喝杯咖啡吧</p>
            <el-row class="support">
                <el-col :span="12">
                    <el-image style="width: 200px; height: 200px;background-color: beige"
                        src="https://cdn.jsdelivr.net/gh/gorkys/CDN-Blog@master/blog/sponsor/wechat.jpg">
                        <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
                    <div>支付宝</div>
                </el-col>
                <el-col :span="12">
                    <el-image style="width: 200px; height: 200px;background-color: beige"
                        src="https://cdn.jsdelivr.net/gh/gorkys/CDN-Blog@master/blog/sponsor/alipay.png">
                        <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
                    <div>微信</div>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import pkg from 'root/package.json'
    import { remote } from 'electron'
    const { BrowserWindow } = remote

    export default {
      name: 'index',
      components: {},
      created () {},
      mounted () {
      },
      data () {
        return {
          version: process.env.NODE_ENV === 'production' ? pkg.version : 'Dev',
          dialogAbout: false,
          visible: false
        }
      },
      methods: {
        minimizeWindow () {
          const window = BrowserWindow.getFocusedWindow()
          window.minimize()
        },
        closeWindow () {
          this.$electron.ipcRenderer.send('openMiniWindow')
        },
        handleCommand (command) {
          switch (command) {
            case 'about':
              this.dialogAbout = true
              break
            case 'sponsor':
              this.visible = true
              break
          }
        }
      },
      watch: {}
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .fake-title-bar {
        -webkit-app-region:drag;
        width: 100%;
        text-align: center;
        color: white;
        padding: 10px 0;
    }
    .handle-bar {
        -webkit-app-region:no-drag;
        position: absolute;
        right: 10px;
        top: 5px;
        i {
            padding: 5px;
            margin-left: 4px;
            cursor: pointer;
            border-radius: 5px;
            transition: all .5s;
            color: white;
            &:hover{
                color: black;
                background-color: white;
            }
        }
    }
   /deep/ .image-slot{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: #f5f7fa;
        color: #909399;
        font-size: 30px;
    }
</style>