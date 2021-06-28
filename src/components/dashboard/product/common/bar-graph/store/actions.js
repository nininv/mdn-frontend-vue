import * as Sentry from '@sentry/vue'
export default (fetch) => {
  const getSeries = async ({ commit }, payload) => {
    commit('SET_LOADING', true)

    try {
      const response = await fetch(payload)

      commit('LOADED', response.data)
    } catch (error) {
      Sentry.captureException(error)
      commit('SET_LOADING', false)
    }
  }

  return {
    getSeries
  }
}
