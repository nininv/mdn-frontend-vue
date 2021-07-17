let timeoutId = null

const debounce = (callback, wait = 1000) => {
  
  clearTimeout(timeoutId)

  timeoutId = setTimeout(() => {
    callback()
  }, wait)

}

export { 
  debounce
}