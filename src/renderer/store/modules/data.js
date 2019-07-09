const data = {
  state: {
    progress: 10
  },
  getters: {
    progress: state => state.progress
  },
  mutations: {
    SET_PROGRESS: (state, progress) => {
      state.progress = progress
    }
  },
  actions: {
    calcPercentage ({commit}, listData) {
      const total = listData.length
      if (total) {
        const doData = listData.filter(item => {
          return item.type === 'do'
        }).length
        let pro = parseInt(doData / total * 100)
        commit('SET_PROGRESS', pro)
      } else {
        commit('SET_PROGRESS', total)
      }
    }
  }
}
export default data
