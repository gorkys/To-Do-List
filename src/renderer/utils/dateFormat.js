/*
 Created by Gorky on 2019/6/28
*/
export function format (params) {
  let _options = {
    weekNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    MonthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }
  switch (params) {
    case 'week':
      return _options.weekNames[new Date().getDay()]
    case 'day':
      const getDate = new Date().getDate()
      return getDate < 10 ? '0' + getDate : getDate
    case 'month':
      return _options.MonthNames[new Date().getMonth()]
    case 'year':
      return new Date().getFullYear()
  }
}
