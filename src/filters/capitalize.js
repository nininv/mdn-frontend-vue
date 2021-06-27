import Vue from 'vue'

Vue.filter('capitalize', (value, allWords) => {
  if (!value) return ''

  return allWords ? value.replace(/\b\w/g, (l) => l.toUpperCase()) : value.replace(/\b\w/, (l) => l.toUpperCase())
})
