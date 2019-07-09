<template>
    <div id="suspension"
         @dblclick="clipboardNew">
        <el-progress class="progress"
                     :percentage="progress"
                     :text-inside="true"
                     :show-text="false"
                     :stroke-width="70">
        </el-progress>
    </div>
</template>

<script>
  import { remote } from 'electron'
  import { mapActions, mapGetters } from 'vuex'
  const { clipboard } = remote
  export default {
    name: 'suspension',
    created () {
      window.addEventListener('mousedown', this.handleMouseDown, false)
      window.addEventListener('mousemove', this.handleMouseMove, false)
      window.addEventListener('mouseup', this.handleMouseUp, false)
    },
    data () {
      return {
        dragOver: false,
        dragging: false,
        pageX: '',
        pageY: '',
        screenX: '',
        screenY: ''
      }
    },
    computed: {
      ...mapGetters([
        'progress'
      ])
    },
    mounted () {
      this.calcPercentage(this.$db.get('ListData').value())
    },
    methods: {
      ...mapActions([
        'calcPercentage'
      ]),
      handleMouseDown (e) {
        this.dragging = true
        this.pageX = e.pageX
        this.pageY = e.pageY
        this.screenX = e.screenX
        this.screenY = e.screenY
      },
      handleMouseMove (e) {
        e.preventDefault()
        e.stopPropagation()
        if (this.dragging) {
          const xLoc = e.screenX - this.pageX
          const yLoc = e.screenY - this.pageY
          const win = this.$electron.remote.BrowserWindow.getFocusedWindow()
          win.setPosition(xLoc, yLoc)
          /* win.setBounds({
            x: xLoc,
            y: yLoc,
            width: 100,
            height: 64
          }) */
        }
      },
      handleMouseUp (e) {
        this.dragging = false
        if (this.screenX === e.screenX && this.screenY === e.screenY) {
          if (e.button === 0) { // left mouse
          } else {
          }
        }
      },
      clipboardNew () {
        let text = clipboard.readText()
        let repeat = this.$db.get('ListData').value().find(item => {
          return item.content === text
        })
        if (repeat === undefined) {
          this.$db.get('ListData').insert({
            content: text,
            type: 'to',
            date: ''
          }).write()
          let notepad = new window.Notification('提示', {
            body: '新建成功'
          })
          notepad.onclick = () => { return true }
          this.calcPercentage(this.$db.get('ListData').value())
        } else {
          let notepad = new window.Notification('提示', {
            body: '事项已存在'
          })
          notepad.onclick = () => { return true }
        }
      }
    },
    beforeDestroy () {
      window.removeEventListener('mousedown', this.handleMouseDown, false)
      window.removeEventListener('mousemove', this.handleMouseMove, false)
      window.removeEventListener('mouseup', this.handleMouseUp, false)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .progress{
        border-radius: 50%;
        transform:rotate(270deg);
        width: 70px;
        /deep/ .el-progress-bar__outer{
            border-radius: 50%;
            .el-progress-bar__inner {
                border-radius: 0;
                background-color: #8EC5FC;
                background-image: linear-gradient(177deg,#E0C3FC 24%,#8EC5FC 75%);
                background-image: -webkit-linear-gradient(177deg,#E0C3FC 24%,#8EC5FC 75%);
            }
        }
    }
    #suspension {
        cursor: pointer;
        height: 80px;
        border-radius: 5px;
    }
</style>