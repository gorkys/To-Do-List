<template>
    <div id="todoList">
        <div class="home" v-if="listData.length===0">
            <img src="../../../../static/goal-setting.png" @mousedown="mouse($event)"/>
            <p>一个明确的目标</p>
            <p>是所有成就的起点</p>
        </div>
        <ul id="toList">
            <li v-for="(item,index) in listData" :key="index"  v-if="item.type === 'to'">
                <el-row type="flex" justify="space-between">
                    <el-col :span="2">
                        <i class="iconfont icon-circle" title="点击完成" @click="changeType(item.id)"></i>
                    </el-col>
                    <el-col :span="22">
                        <p @click="openDialogs('edit',item.id)">{{item.content}}</p>
                    </el-col>
                    <div class="remind" v-if="item.date!==''">
                        <i class="el-icon-alarm-clock"></i>
                        <span>{{item.date}}</span>
                    </div>
                </el-row>
            </li>
        </ul>
        <div class="hidden" v-if="hiddenButton" @click="hiddenDo=!hiddenDo">
            <i :class="hiddenDo?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
            <span>{{hiddenDo?'隐藏':'显示'}}已完成待办 · {{completedNumber}}</span>
        </div>
        <transition name="el-zoom-in-center">
            <ul id="doList" v-show="hiddenDo">
                <li v-for="(item,index) in listData" :key="index" v-if="item.type === 'do'">
                    <el-row type="flex" justify="space-between">
                        <el-col :span="2">
                            <i class="iconfont icon-check-circle" title="点击恢复" @click="changeType(item.id)"></i>
                        </el-col>
                        <el-col :span="21">
                            <p>{{item.content}}</p>
                        </el-col>
                        <el-col :span="1">
                            <i class="el-icon-delete" title="点击删除" @click="delListItem(item.id)"></i>
                        </el-col>
                        <div class="remind dateAnimation" v-if="item.date!==''">
                            <i class="el-icon-alarm-clock"></i>
                            <span>{{item.date}}</span>
                        </div>
                    </el-row>
                </li>
            </ul>
        </transition>
        <div id="new" @click="openDialogs('new','')"><i class="el-icon-s-promotion"></i></div>
        <el-dialog
                :title="dialogTitle"
                :visible.sync="openDialog"
                width="98%"
                top="25vh">
            <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="content">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-row type="flex" justify="space-between">
                    <el-col style="text-align: start;">
                        <el-date-picker
                                v-model="date"
                                class="resetPicker"
                                type="datetime"
                                :prefix-icon="date?'el-icon-alarm-clock':'el-icon-circle-plus-outline'"
                                clear-icon="el-icon-delete"
                                :editable="false"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="添加日程提醒">
                        </el-date-picker>
                    </el-col>
                    <el-col>
                        <el-button @click="openDialog = false">取 消</el-button>
                        <el-button type="primary" @click="newListItem">确 定</el-button>
                    </el-col>
                </el-row>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    // import { remote } from 'electron'
    import '../../assets/reset.scss' // 重置el-date-picker样式
    // const { Menu, dialog, BrowserWindow } = remote
    import timeDetection from '@/utils/timeDetection'
    import { mapActions } from 'vuex'
    export default {
      name: 'index',
      components: {},
      mounted () {
        this.listData = this.$db.get('ListData').value()

        // 日程检测
        timeDetection()
        this.clipboardNew()
        this.updateData()
      },
      data () {
        return {
          openDialog: false,
          dialogTitle: '',
          content: '',
          date: '',
          id: '',
          hiddenDo: true,
          listData: []
        }
      },
      computed: {
        hiddenButton () {
          const doData = this.listData.filter(item => {
            return item.type === 'do'
          })
          return doData.length !== 0
        },
        completedNumber () {
          const doNumber = this.listData.filter(item => {
            return item.type === 'do'
          })
          return doNumber.length
        }
      },
      methods: {
        ...mapActions([
          'calcPercentage'
        ]),
        mouse (e) {
          e.preventDefault()
        },
        clipboardNew () {
          this.$electron.ipcRenderer.on('clipboardText', (event, text) => {
            let repeat = this.$db.get('ListData').value().find(item => {
              return item.content === text
            })
            if (repeat === undefined) {
              this.$db.get('ListData').insert({
                content: text,
                type: 'to',
                date: ''
              }).write()

              this.listData = this.$db.get('ListData').value()
              this.calcPercentage(this.listData)

              let notepad = new window.Notification('提示', {
                body: '新建成功'
              })
              notepad.onclick = () => { return true }
            } else {
              let notepad = new window.Notification('提示', {
                body: '事项已存在'
              })
              notepad.onclick = () => { return true }
            }
          })
        },
        newListItem () {
          let repeat = this.listData.find(item => {
            return item.content === this.content
          })
          if (this.content !== '' && repeat === undefined) {
            if (this.dialogTitle === '新建待办') {
              this.$db.get('ListData').insert({
                content: this.content,
                type: 'to',
                date: this.date
              }).write()

              this.listData = this.$db.get('ListData').value()
              this.calcPercentage(this.listData)
            } else {
              const data = this.$db.get('ListData').find({ id: this.id }).value()
              data.content = this.content
              data.date = this.date
              this.$db.update(data).write()

              this.listData = this.$db.get('ListData').value()
              this.calcPercentage(this.listData)
            }
            this.openDialog = false
          } else {
            this.$message.error({
              message: '未填写待办内容或待办内容已存在',
              center: true
            })
          }
        },
        openDialogs (type, id) {
          if (type === 'new') {
            this.dialogTitle = '新建待办'
            this.content = ''
            this.date = ''
            this.openDialog = true
          } else {
            this.dialogTitle = '编辑待办'
            const data = this.$db.get('ListData').find({ id: id }).value()
            this.content = data.content
            this.date = data.date
            this.id = id
            this.openDialog = true
          }
        },
        changeType (id) {
          const data = this.$db.get('ListData').find({ id: id }).value()
          data.type = data.type === 'do' ? 'to' : 'do'
          this.$db.update(data).write()

          this.listData = this.$db.get('ListData').value()
          this.calcPercentage(this.listData)
        },
        delListItem (id) {
          this.$db.get('ListData').removeById(id).write()

          this.listData = this.$db.get('ListData').value()
          this.calcPercentage(this.listData)
        },
        updateData () {
          this.$electron.ipcRenderer.on('updateData', () => {
            this.listData = this.$db.read().get('ListData').value()
          })
        }
      },
      watch: {}
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    ul {
        padding: 0;
    }
    .home{
        text-align: center;
        img {
            border-radius: 5px;
            width: 100%;
            opacity: .5
        }
    }
    #todoList{
        overflow-x: hidden;
        padding: 0 50px;
        color: white;
        height: calc(600px - 170px);
        &::-webkit-scrollbar{
            width:5px;
            height:5px;
        }
        &::-webkit-scrollbar-thumb{
            border-radius:4px;
            background-color: #8EC5FC;
            background-image: linear-gradient(177deg,#8EC5FC 24%,#E0C3FC 75%);
            background-image: -webkit-linear-gradient(177deg,#8EC5FC 24%,#E0C3FC 75%);
        }
        &::-webkit-scrollbar-track{
            background-color:transparent
        }
    }
    @-webkit-keyframes date
    {
        0% {color: #8BC6EC;}
        50% {color: #9599E2;}
        100% {color: #8BC6EC;}
    }
    #toList,#doList{
        list-style-type: none;
        .remind{
            position: absolute;
            bottom: 14px;
            right: 10px;
            color: #8e8e8e;
            font-size: 12px;
            i{
                margin: 0;
                font-size: 14px;
            }
        }
        li{
            .el-col-22 ,.el-col-21,.el-col-1{
                border-bottom: 1px solid rgba(121, 121, 121, 0.6);
                margin-bottom: 10px;
                padding-bottom: 10px;
            }
            p {
                display: inline-block;
                margin-left: 5px;
                width: calc(100% - 18px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            i {
                margin: 16px 0;
                cursor: pointer;
                font-size: 18px;
                transition: color .5s;
                &:hover{
                    color: #9599E2;
                }
            }
        }
    }
    #toList{
        .remind {
            i{
                animation: date 1s infinite;
            }
        }
        p:hover{
            text-decoration:underline;
            cursor: pointer;
        }
    }
    #doList{
        .remind {
            text-decoration:line-through;
        }
        margin-bottom: 40px;
        color: #8e8e8e;
        p {
            text-decoration:line-through;
        }
    }
    .hidden{
        width: 200px;
        color: #fff;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        margin: 40px auto;
        text-align: center;
        cursor: pointer;
        border-radius: 5px;
        transition: all .5s ease-in-out;
        -webkit-transition: all .5s ease-in-out;
        background-color: #8EC5FC;
        background-image: linear-gradient(135deg,#E0C3FC 24%,#8EC5FC 75%);
        background-image: -webkit-linear-gradient(135deg,#E0C3FC 24%,#8EC5FC 75%);
        &:hover{
            background-position:200px;
        }
        span{
            margin-left: 5px;
        }
    }
    /deep/ .el-divider{
        background-color: #a8a8a8;
    }
    #new{
        position: fixed;
        background-color: #8BC6EC;
        background-image: linear-gradient(135deg,#9599E2 24%,#8BC6EC 75%);
        background-image: -webkit-linear-gradient(135deg,#9599E2 24%,#8BC6EC 75%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 25px;
        box-shadow: 0 0 6px rgba(255, 255, 255, 0.12);
        cursor: pointer;
        z-index: 5;
        right: 20px;
        bottom: 20px;
        transition: all 1s;
        &:hover{
            color: #E0C3FC;
        }
    }
    /deep/ .el-textarea{
        .el-textarea__inner{
            height: 150px;
            resize: none;
            border: none;
            &::-webkit-scrollbar{
                width:5px;
                height:5px;
            }
            &::-webkit-scrollbar-thumb{
                border-radius:4px;
                background-color: #8EC5FC;
                background-image: linear-gradient(177deg,#8EC5FC 24%,#E0C3FC 75%);
                background-image: -webkit-linear-gradient(177deg,#8EC5FC 24%,#E0C3FC 75%);
            }
            &::-webkit-scrollbar-track{
                background-color:transparent
            }
        }
    }
    .resetPicker{
        /deep/ .el-input__prefix{
            color: #3a8ee6;
            font-size: 18px;
        }
        /deep/ .el-input__suffix{
            color: #F56C6C;
            font-size: 16px;
        }
        /deep/ .el-input__inner{
            border: none;
            cursor: pointer;
            transition: all 1s;
            padding-left: 35px;
            &:hover {
                background-color: #f3f3f3;
            }
        }
    }
</style>