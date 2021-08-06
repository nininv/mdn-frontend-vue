const selectedMachine = (state) => {
  if (state.selectedId) {
    return state.data.find((machine) => machine.id === state.selectedId)
  }

  return {}
}

const extendedMachines = (state) => {
  const _machines = state.machines.slice()

  _machines.unshift({
    id: 0,
    name: 'Not Assigned'
  })

  return _machines
}

const timeRangeLabel = (state) => (timeRange) => {
  if (timeRange.timeRangeOption !== 'custom') {
    const tr = state.timeRangeOptions.find((item) => item.value === timeRange.timeRangeOption)

    return tr ? tr.label : ''
  } else {
    return timeRange.dateFrom + ' ~ ' + timeRange.dateTo
  }
}

const timeRangeDataToolLabel = (state) => (timeRange) => {
  if (timeRange.timeRangeOption !== 'custom') {
    const tr = state.timeRangeOptions.find((item) => item.value === timeRange.timeRangeOption)

    return tr ? tr.label : ''
  } else {
    return timeRange.dateFrom + ' ~ ' + timeRange.dateTo
  }
}

const timeRangeFromTo = (state) => (timeRange) => {
  if (timeRange.timeRangeOption !== 'custom') {
    const tr = state.timeRangeOptions.find((item) => item.value === timeRange.timeRangeOption)
    const trOption = tr ? tr.value : 'last7Days'
    const dateGetTime = new Date().getTime()

    switch (trOption) {
    case 'last8Hours':
      return {
        from: dateGetTime - (8 * 60 * 60 * 1000),
        to: dateGetTime
      }
    case 'last12Hours':
      return {
        from: dateGetTime - (12 * 60 * 60 * 1000),
        to: dateGetTime
      }
    case 'last24Hours':
      return {
        from: dateGetTime - (24 * 60 * 60 * 1000),
        to: dateGetTime
      }
    case 'last7Days':
      return {
        from: dateGetTime - (7 * 24 * 60 * 60 * 1000),
        to: dateGetTime
      }
    default:
      return {
        from: dateGetTime - (24 * 60 * 60 * 1000),
        to: dateGetTime
      }
    }
  } else {
    return {
      from: new Date(`${timeRange.dateFrom} 00:00:00`).getTime(),
      to: new Date(`${timeRange.dateTo} 23:59:59`).getTime()
    }
  }
}

export default {
  selectedMachine,
  extendedMachines,
  timeRangeLabel,
  timeRangeDataToolLabel,
  timeRangeFromTo
}
