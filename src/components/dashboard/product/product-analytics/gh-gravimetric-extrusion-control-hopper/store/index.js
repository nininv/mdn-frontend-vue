import api from '../services/api'
import * as Sentry from '@sentry/vue'

const module = {
  namespaced: true,
  state: {
    loadingSystemStates: false,
    systemStates: {}
  },

  actions: {
    async getMachineStates ({ commit }, payload) {
      commit('SET_LOADING_SYSTEM_STATES', true)

      try {
        const response = await api.getMachineStates(payload)

        commit('SET_SYSTEM_STATES', response.data.machine_states)
      } catch (error) {
        Sentry.captureException(error)
      } finally {
        commit('SET_LOADING_SYSTEM_STATES', false)
      }
    }
  },

  mutations: {
    SET_LOADING_SYSTEM_STATES(state, isLoading) { state.loadingSystemStates = isLoading },
    SET_SYSTEM_STATES(state, data) { state.systemStates = data }
  }
}

export default module
