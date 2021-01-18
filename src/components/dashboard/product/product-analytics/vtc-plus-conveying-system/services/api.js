import api from '@/api.js'
export default {
  getPumpHoursOil(id) {
    return api.get(`/analytics/product-pump-hours-oil/${id}`)
  },
  getPumpHours(id) {
    return api.get(`/analytics/product-pump-hours/${id}`)
  },
  getPumpOnlines(id) {
    return api.get(`/analytics/vtc-plus/pump-onlines/${id}`).then((response) => {
      return response
    })
  },
  getPumpBlowBacks(id) {
    return api.get(`/analytics/vtc-plus/pump-blowbacks/${id}`).then((response) => {
      return response
    })
  }
}