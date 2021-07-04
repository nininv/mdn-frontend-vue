<template>
  <v-card
    height="100%"
    :loading="isLoading"
    :disabled="isLoading"
  >
    <v-card-title>
      <div>
        <div>{{ title }}</div>
        <div class="text-caption font-italic">({{ timeRangeLabel(timeRange) }})</div>
      </div>
      <v-btn
        icon
        small
        class="ml-auto"
        @click="open()"
      >
        <v-icon>$mdi-refresh</v-icon>
      </v-btn>
      <v-btn
        icon
        class=" ml-2"
        @click="showTimeRangeChooser = true"
      >
        <v-icon>$mdi-filter</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <apexchart
        type="line"
        :height="height"
        :options="chartOptions"
        :series="series"
      >
      </apexchart>
    </v-card-text>
    <date-range-chooser-dialog
      :dlg="showTimeRangeChooser"
      :time-range="timeRange"
      show-short-intervals
      @close="showTimeRangeChooser = false"
      @submit="onTimeRangeChanged"
    >
    </date-range-chooser-dialog>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Store from './store'
import DateRangeChooserDialog from '../../../../common/DateRangeChooserDialog.vue'
import dynamicStoreMixin from '../dynamicStoreMixin'

export default {
  name: 'AreaGraph',
  components: {
    DateRangeChooserDialog
  },
  mixins: [dynamicStoreMixin],
  props: {
    namespace: {
      type: String,
      default: ''
    },
    fetch: {
      type: Function,
      default: () => {}
    },
    machineId: {
      type: Number,
      default: 0
    },
    serialNumber: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    },
    unit: {
      type: String,
      default: ''
    },
    names: {
      type: Array,
      default: () => []
    },
    height: {
      type: Number,
      default: 220
    },
    persist: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showTimeRangeChooser: false
    }
  },
  computed: {
    ...mapGetters('machines', ['timeRangeLabel', 'timeRangeFromTo']),
    Store() {
      // dynamic vuex store generators for the mixin
      return Store
    },
    state() {
      return this.$store.state[this.namespace]
    },
    isLoading() {
      return this.state['isLoading']
    },
    isImperial() {
      return this.state['isImperial']
    },
    timeRange() {
      return this.state['timeRange']
    },
    series() {
      if (this.names.length)
        if (this.names[0] === 'Utilization') {
          return this.state['items'] ? this.state['items'] : [[]]
        } else {
          return this.names.map((name, index) => {
            return {
              name,
              data: (this.state['items'].length) ? (this.state['items'][index]) : []
            }
          })
        }
      else {
        return (this.state['items']) ? (this.state['items']) : [[]]
      }
    },
    graphUnit() {
      if (this.unit === 'imperial-metric')
        return this.isImperial ? 'lbs/hr' : 'kgs/hr'
      else
        return this.unit ? this.unit : ''
    },
    chartOptions() {
      return {
        chart: {
          type: 'line',
          animations: {
            speed: 400
          },
          toolbar: {
            show: false
          }
        },
        colors: [this.$vuetify.theme.themes.light.secondary, this.$vuetify.theme.themes.light.primary, this.$vuetify.theme.themes.light.error, this.$vuetify.theme.themes.light.info, this.$vuetify.theme.themes.light.primary.surface, this.$vuetify.theme.themes.light.warning],
        fill: {
          type:'solid',
          opacity: [0.35, 1]
        },
        noData: {
          text: 'No Data From Devce'
        },
        yaxis: {
          title: {
            text: this.unit ? `${this.title} (${this.graphUnit})` : `${this.title}`
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: [2, 2]
        },
        xaxis: {
          type: 'datetime',
          min: this.timeRangeFromTo(this.timeRange).from,
          max: this.timeRangeFromTo(this.timeRange).to,
          labels: {
            formatter: (value, timestamp, opts) => {
              return [this.$options.filters.formatDate(value, 'MM-dd'), this.$options.filters.formatDate(value, ' HH:mm:ss')]
            }
          }
        }
      }
    }
  },
  mounted() {
    this.open()
  },
  methods: {
    ...mapActions({
      getSeries(dispatch, payload) {
        return dispatch(this.namespace + '/getSeries', payload)
      },
      updateTimeRange(dispatch, payload) {
        return dispatch(this.namespace + '/updateTimeRange', payload)
      }
    }),
    open () {
      this.getSeries({
        machineId: this.machineId,
        serialNumber: this.serialNumber,
        timeRange: this.timeRange
      })
    },
    onTimeRangeChanged(newTimeRange) {
      this.updateTimeRange(newTimeRange)
      this.showTimeRangeChooser = false
      this.getSeries({
        id: this.productId,
        machineId: this.machineId,
        serialNumber: this.serialNumber,
        timeRange: this.timeRange
      })
    }
  }
}
</script>
