'use strict'
import pkg from '../../package.json'
import '../renderer/store'
import updateChecker from './utils/updateChecker'
import {
  app,
  Menu,
  // dialog,
  // Notification,
  clipboard,
  ipcMain,
  BrowserWindow,
  Tray } from 'electron'

let tray
let window
let miniWindow
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const miniWinURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#suspension`
  : `file://${__dirname}/index.html#suspension`
const createWindow = () => {
  const options = {
    height: 600,
    width: 450,
    show: false,
    frame: true,
    center: true,
    fullscreenable: false,
    resizable: false,
    title: 'To-Do-List',
    vibrancy: 'ultra-dark',
    transparent: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      backgroundThrottling: false
    }
  }

  if (process.platform !== 'darwin') {
    options.show = true
    options.frame = false
    /* options.backgroundColor = '#4b4b4b' */
    options.transparent = true
    options.icon = `${__static}/menubar@48.png`
  }
  window = new BrowserWindow(options)

  window.loadURL(winURL)

  window.on('closed', () => {
    window = null
  })
  createMiniWidow()
  return window
}

const createMiniWidow = () => {
  if (miniWindow) {
    return false
  }
  let obj = {
    height: 70,
    width: 70,
    show: process.platform === 'linux',
    frame: false,
    fullscreenable: false,
    alwaysOnTop: true, // 窗口置顶
    skipTaskbar: true,
    resizable: false,
    transparent: process.platform !== 'linux',
    icon: `${__static}/logo.png`,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  }

  miniWindow = new BrowserWindow(obj)

  miniWindow.loadURL(miniWinURL)

  miniWindow.on('closed', () => {
    miniWindow = null
  })
  return miniWindow
}

function createTray () {
  const menuBar = `${__static}/menubar@32px.png`
  tray = new Tray(menuBar) // 指定图片的路径

  const menu = Menu.buildFromTemplate([
    {
      label: '打开详细窗口',
      click () {
        openWindow()
      }
    },
    {
      label: '剪贴板新建',
      click () {
        let text = clipboard.readText()
        if (text !== '') {
          setTimeout(() => {
            window.webContents.send('clipboardText', text)
          }, 0)
        }
      }
    }, {
      label: '重启应用',
      click () {
        app.relaunch()
        app.exit(0)
      }
    }, {
      role: 'quit',
      label: '退出',
      click () {
        app.quit()
      }
    }
  ])
  tray.on('right-click', () => { // 右键点击
    tray.popUpContextMenu(menu) // 打开菜单
  })
  tray.on('click', (event, bounds) => {
    openWindow()
  })
}
// 设置appId
if (process.platform === 'win32') {
  app.setAppUserModelId(pkg.build.appId)
}

function openWindow () {
  if (window === null) {
    createWindow()
    window.show()
  } else {
    window.show()
    window.focus()
  }
  if (miniWindow) {
    miniWindow.hide()
  }
}

// mini窗口新建的数据更新，发送给主窗口
ipcMain.on('updateData', () => {
  window.webContents.send('updateData')
})

ipcMain.on('openMiniWindow', (evt) => {
  if (!miniWindow) {
    createMiniWidow()
  }
  miniWindow.show()
  miniWindow.focus()
  window.hide()
})

ipcMain.on('openWindow', (evt) => {
  if (!window) {
    window()
  } else {
    window.show()
  }
  miniWindow.hide()
})

app.on('ready', () => {
  createWindow()
  createTray()
  updateChecker()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  /* if (settingWindow === null) {
    createWindow()
  } */
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
