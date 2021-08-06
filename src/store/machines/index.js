import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const TODAY = new Date().toISOString().substr(0, 10) // YYYY-MM-DD

const state = {
  machines: [],
  reportMachines: [],
  reportMachineTags: [],
  generateCompleted: false,
  reportName: '',
  reportsListLoading: false,
  reportsList: [],
  selectedId: 0,

  selectedCompany: null,

  isSavedMachine: false,
  isReportLoading: false,

  // Accumeter Ovation Continuous Blender
  actualRecipe2Values: [],
  targetRecipe2Values: [],

  systemStates: {},
  loadingSystemStates: false,

  // Feeder stables in machine type 2
  feederStables: [],
  loadingFeederStables2: false,

  loadingActualTargetBar: false,

  // Running hours per weekday
  loadingWeeklyRunningHours1: false,
  weeklyRuningHours: [],

  // Locations table series
  loadingLocationsTable: false,
  downtimeDistribution: [],

  // Zones table
  loadingZonesTable: false,

  loadingMachinesTable: false,

  // Alarm history
  alarmHistoryLoading: false,
  alarmHistory: [],

  timeRangeOptions: [{
    label: 'Last 8 hours',
    value: 'last8Hours'
  }, {
    label: 'Last 12 hours',
    value: 'last12Hours'
  }, {
    label: 'Last 24 hours',
    value: 'last24Hours'
  }, {
    label: 'Last 7 days',
    value: 'last7Days'
  }, {
    label: 'Custom',
    value: 'custom'
  }],

  // BD Batch Blender
  totalRunningPercentage: 0,

  loadingEnabledProperties: false,
  enabledProperties: [],

  loadingDataToolSeries: false,
  dataToolSeries: [],
  dataToolSeriesForTcu: [],
  tags: [],
  tcuTags: [],
  selectedTags: [],
  selectedTcuTags: [],
  dataToolTimeRange: {
    timeRangeOption: 'last8Hours',
    dates: [TODAY, TODAY]
  },
  dataToolTcuTimeRange: {
    timeRangeOption: 'last8Hours',
    dates: [TODAY, TODAY]
  },
  hopperSettingTimeRange: {
    timeRangeOption: 'last8Hours',
    dates: [TODAY, TODAY]
  },
  selectedHoppers: [{
    id: 0, name: 'Hopper 1'
  }, {
    id: 1, name: 'Hopper 2'
  }, {
    id: 2, name: 'Hopper 3'
  }],
  hopperWeightLoading: false,
  hopperWeightSeries: []
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
