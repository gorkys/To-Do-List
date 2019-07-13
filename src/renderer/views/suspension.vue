<template>
    <div id="suspension"
         @drop.prevent="dragover = false"
         @dragover.prevent="dragover = true"
         @dragleave.prevent="dragover = false">
        <div class="progress-bar-logo">
            <img src="../assets/logo.png" style="width: 40px;height:40px;" alt="">
        </div>
        <div class="progress">
            <div class="progress-bar-1" :style="{bottom:`${progress}%`}"></div>
            <div class="progress-bar-2" :style="{bottom:`${progress-5}%`}"></div>
        </div>
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
          if (e.button === 0) { // 左0 中1 右2
            this.clipboardNew()
          }
        }
      },
      clipboardNew () {
        let text = clipboard.readText()
        let repeat = this.$db.read().get('ListData').value().find(item => {
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
          this.calcPercentage(this.$db.read().get('ListData').value())

          this.$electron.ipcRenderer.send('updateData')
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
        position: relative;
        align-items: center;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background-color: #8EC5FC;
        background-image: linear-gradient(135deg,#E0C3FC 24%,#8EC5FC 75%);
        background-image: -webkit-linear-gradient(135deg,#E0C3FC 24%,#8EC5FC 75%);
        overflow: hidden;
        .progress-bar-1, .progress-bar-2 {
            position: absolute;
            left: 50%;
            min-width: 300px;
            min-height: 300px;
            background-color: #e4e7ee;
            animation-name: rotate;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
            transition: bottom 2s;
        }

        .progress-bar-1 {
            border-radius: 45%;
            animation-duration: 8s;
        }

        .progress-bar-2 {
            opacity: .5;
            border-radius: 47%;
            animation-duration: 8s;
        }
    }

    .progress-bar-logo{
        position: fixed;
        left: 16px;
        top: 16px;
        z-index: 10;
        opacity: .9;
    }

    @keyframes rotate {
        0% {
            transform: translate(-50%, 0) rotateZ(0deg);
        }
        50% {
            transform: translate(-50%, -2%) rotateZ(180deg);
        }
        100% {
            transform: translate(-50%, 0%) rotateZ(360deg);
        }
    }

    #suspension {
        cursor: pointer;
    }
</style>