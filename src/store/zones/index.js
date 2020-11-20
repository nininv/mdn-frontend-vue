import zoneAPI from '@/services/api/zone'

const module = {
  namespaced: true,
  state: {
    data: [
      {
        id: 1,
        name: 'Zone 1'
      }, {
        id: 2,
        name: 'Zone 2'
      }, {
        id: 3,
        name: 'Zone 3'
      }
    ],
    table_loading: false,
    btn_loading: false
  },

  actions: {
    initLocationsZones({
      commit
    }) {
      commit('TABLE_LOAD')

      return new Promise((resolve, reject) => {
        zoneAPI.initLocationsZones()
          .then((response) => {
            commit('SET_DATA', response.data.zones)
            commit('locations/SET_DATA', response.data.locations, { root: true })
            resolve(response)
          })
          .catch((error) => {
            console.log(error.response)
            reject(error)
          })
          .finally(() => {
            commit('TABLE_LOADED')
          })
      })
    },
    getZones({
      commit
    }) {
      commit('TABLE_LOAD')

      return new Promise((resolve, reject) => {
        zoneAPI.getZones()
          .then((response) => {
            commit('SET_DATA', response.data)
            resolve(response)
          })
          .catch((error) => {
            console.log(error.response)
            reject(error)
          })
          .finally(() => {
            commit('TABLE_LOADED')
          })
      })
    },
    addZone({
      commit
    }, data) {
      commit('BTN_LOAD')

      return new Promise((resolve, reject) => {
        zoneAPI.addZone(data)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            console.log(error.response)
            reject(error)
          })
          .finally(() => {
            commit('BTN_LOADED')
          })
      })
    },
    updateZone({
      commit
    }, data) {
      commit('BTN_LOAD')

      return new Promise((resolve, reject) => {
        zoneAPI.updateZone(data)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            console.log(error.response)
            reject(error)
          })
          .finally(() => {
            commit('BTN_LOADED')
          })
      })
    }
  },

  mutations: {
    TABLE_LOAD(state) {
      state.table_loading = true
    },
    TABLE_LOADED(state) {
      state.table_loading = false
    },
    BTN_LOAD(state) {
      state.btn_loading = true
    },
    BTN_LOADED(state) {
      state.btn_loading = false
    },
    SET_DATA(state, zones) {
      state.data = zones
    }
  }
}

export default module