import Vue from 'vue'

Vue.filter('formatPhoneNumber', (value) => {
  if (!value) return ''

  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

  return phoneRegex.test(value) ? value.replace(phoneRegex, '($1) $2-$3') : 'Invalid'
})
