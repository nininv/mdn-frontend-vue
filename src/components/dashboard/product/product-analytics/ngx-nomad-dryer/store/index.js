import api from '../services/api'
import * as Sentry from '@sentry/vue'

const module = {
  namespaced: true,
  state: {
    loadingStates: false,

    hopperStates: []
  },

  actions: {
    async getDryingHopperStates({ commit }, payload) {
      commit('SET_LOADING_DRYING_HOPPERS', true)

      try {
        const response = await api.getDryingHopperStates(payload)

        commit('SET_HOPPER_STATES', response.data.states)
      } catch (error) {
        Sentry.captureException(error)
      } finally {
        commit('SET_LOADING_DRYING_HOPPERS', false)
      }
    }
  },

  mutations: {
    SET_LOADING_DRYING_HOPPERS(state, isLoading) { state.loadingStates = isLoading },

    SET_HOPPER_STATES(state, values) { state.hopperStates = values }
  }
}

export default module
