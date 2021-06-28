function defaultTimeRange() {
  const TODAY = new Date().toISOString().substr(0, 10) // YYYY-MM-DD

  return {
    timeRangeOption: 'last24Hours',
    dateFrom: TODAY,
    dateTo: TODAY,
    timeFrom: '00:00',
    timeTo: '00:00'
  }
}

export default () => ({
  isLoading: false,
  items: [],
  isImperial: false,
  timeRange: defaultTimeRange()
})
