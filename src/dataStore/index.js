/*
 Created by Gorky on 2019/7/1
*/
import DataStore from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import {app, remote} from 'electron'
import LodashId from 'lodash-id'

const APP = process.type === 'renderer' ? remote.app : app // 根据process.type来分辨在哪种模式使用哪种模块

const STORE_PATH = APP.getPath('userData') // 获取electron应用的用户目录

if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(STORE_PATH)) { // 如果不存在路径
    fs.mkdirpSync(STORE_PATH) // 就创建
  }
}

const adapter = new FileSync(path.join(STORE_PATH, '/to-do-data.json')) // 初始化lowdb读写的json文件名以及存储路径

const db = DataStore(adapter)

db._.mixin(LodashId)

if (!db.has('ListData').value()) {
  db.set('ListData', []).write()
}

export default db
