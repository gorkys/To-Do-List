/*
 Created by Gorky on 2019/7/3
*/
import db from 'src/dataStore'

export default function () {
  setInterval(detection, 1000)
}

function dateTimeFormat () {
  const getDate = new Date().getDate()
  const getMonth = new Date().getMonth() + 1
  let Y = new Date().getFullYear()
  let M = getMonth < 10 ? '0' + getMonth : getMonth
  let D = getDate < 10 ? '0' + getDate : getDate

  const getHours = new Date().getHours()
  const getMinutes = new Date().getMinutes()
  const getSeconds = new Date().getSeconds()
  let h = getHours < 10 ? '0' + getHours : getHours
  let m = getMinutes < 10 ? '0' + getMinutes : getMinutes
  let s = getSeconds < 10 ? '0' + getSeconds : getSeconds
  return `${Y}-${M}-${D} ${h}:${m}:${s}`
}

function detection () {
  let ListData = db.get('ListData').value()
  ListData.forEach(item => {
    if (item.type === 'to' && item.date !== '') {
      if (item.date === dateTimeFormat()) {
        const notification = new window.Notification('提示', {
          body: `${item.content}任务的时间已到`
        })
        notification.onclick = () => {
          return true
        }
      }
    }
  })
}
