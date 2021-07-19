<template>
  <v-card
    class="d-flex flex-column justify-space-between"
    height="100%"
    light
    :loading="isDowntimeByReasonGraphLoading"
    :disabled="isDowntimeByReasonGraphLoading"
  >
    <v-card-title>
      Downtime by Reason
      <v-spacer></v-spacer>
      <v-btn
        icon
        class=" ml-2"
        @click="showTimeRangeChooser = true"
      >
        <v-icon>$mdi-filter</v-icon>
      </v-btn>
    </v-card-title>
    <date-range-chooser-dialog
      ref="dateRangeChooserType"
      :dlg="showTimeRangeChooser"
      :time-range="selectedTimeRange"
      allow-custom
      limit-two-weeks
      @close="showTimeRangeChooser = false"
      @submit="onTimeRangeChanged"
    >
    </date-range-chooser-dialog>
    <v-card-text style="padding-bottom: 30px">
      <apexchart
        :options="chartOptions"
        :series="getDowntimeByReasonSeries"
        height="390"
      ></apexchart>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import DateRangeChooserDialog from '../common/DateRangeChooserDialog.vue'

const TODAY = new Date().toISOString().substr(0, 10) // YYYY-MM-DD
const BEFOREEIGHTHOURS = new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString().substr(0, 10) // YYYY-MM-DD

const seriesColors = [{
  name: 'No Demand',
  color: '#eeeeef'
}, {
  name: 'Preventative Maintenance',
  color: '#0f2d52'
}, {
  name: 'Machine Failure',
  color: '#29b1b8'
}, {
  name: 'Power Outage',
  color: '#5a5d61'
}, {
  name: 'Other',
  color: '#c8c62e'
}, {
  name: 'Change Over',
  color: '#623666'
}]

export default {
  components: {
    DateRangeChooserDialog
  },
  data() {
    return {
      showTimeRangeChooser: false,
      selectedTimeRange: {
        timeRangeOption: 'last8Hours',
        dateFrom: BEFOREEIGHTHOURS,
        dateTo: TODAY,
        timeFrom: '00:00',
        timeTo: '00:00'
      },
      showChart: true
    }
  },
  computed: {
    ...mapState({
      downtimeByReasonGraphSeries: (state) => state.devices.downtimeByReasonGraphSeries,
      isDowntimeByReasonGraphLoading: (state) => state.devices.isDowntimeByReasonGraphLoading
    }),
    chartOptions() {
      return {
        chart: {
          type: 'bar',
          horizontal: false,
          stacked: true,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: true
          }
        },
        stroke: {
          show: false
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '80%',
            dataLabels: {
              enabled: false,
              position: 'top',
              offsetX: -80
            },
            distributed: true,
            space: 0.25,
            endingShape: 'rounded'
          }
        },
        xaxis: {
          categories: this.downtimeByReasonGraphSeries.map((item) => item.name),
          labels: {
            show: false
          }
        },
        colors: this.getSeriesColors,
        legend: {
          position: 'bottom',
          markers: {
            radius: 12
          }
        },
        fill: {
          opacity: 1
        }
      }
    },
    getDowntimeByReasonSeries() {
      const series = [{ name: 'Hours', data: [] }]

      this.downtimeByReasonGraphSeries.map((item) => {
        series[0].data.push(item.data)

        return 0
      })

      return series
    },
    getSeriesColors() {
      const _colors = []

      this.downtimeByReasonGraphSeries.map((item) => {
        const seriesColor = seriesColors.find((data) => {
          return data.name === item.name
        })

        _colors.push(seriesColor ? seriesColor.color : '#fff')

        return _colors
      })

      return _colors
    }
  },
  methods: {
    ...mapActions({
      getDowntimeByTypeGraphSeries: 'devices/getDowntimeByTypeGraphSeries',
      getDowntimeByReasonGraphSeries: 'devices/getDowntimeByReasonGraphSeries'
    }),
    onTimeRangeChanged(newTimeRange) {
      this.selectedTimeRange = newTimeRange
      const { from, to } = this.$refs.dateRangeChooserType.getTimes()

      this.getDowntimeByTypeGraphSeries({ to, from, ...this.routeParams })
      this.getDowntimeByReasonGraphSeries({ to, from, ...this.routeParams })
      this.showTimeRangeChooser = false
    }
  }
}
</script>
<style scoped>
.v-card__title {
  word-break: break-word;
}
</style>
