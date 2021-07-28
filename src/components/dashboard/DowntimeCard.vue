<template>
  <v-card
    class="d-flex flex-column justify-space-between"
    light
    :loading="isDowntimeGraphLoading"
    :disabled="isDowntimeGraphLoading"
  >
    <div v-if="showDowntimeChart">
      <v-card-title>
        Downtime History
        <v-spacer></v-spacer>
        <v-btn
          icon
          class=" ml-2"
          @click="showTimeRangeChooser = true"
        >
          <v-icon>$mdi-filter</v-icon>
        </v-btn>
        <template v-if="$route.name==='dashboard-product'">
          <v-btn
            v-if="canViewEquipmentAvailability || isNotOverrallOption"
            class="ml-1"
            color="primary"
            @click="showDowntimeChart = false"
          >
            Equipment Availability
          </v-btn>
        </template>
      </v-card-title>
      <v-card-text>
        <apexchart
          key="downtimegraph"
          :series="chartOptions1.series"
          height="420"
          :options="chartOptions1"
        ></apexchart>
      </v-card-text>
      <date-range-chooser-dialog
        ref="dateRangeChooser"
        :dlg="showTimeRangeChooser"
        :time-range="selectedTimeRange"
        allow-custom
        limit-two-weeks
        @close="showTimeRangeChooser = false"
        @submit="onTimeRangeChanged"
      >
      </date-range-chooser-dialog>
    </div>
    <div v-else>
      <template v-if="$route.name === 'dashboard-product'">
        <v-card-title>
          Equipment Availability
          <v-spacer></v-spacer>
          <v-btn
            class="ml-1"
            color="primary"
            @click="showDowntimeChart = true"
          >
            Downtime
          </v-btn>
          <v-btn
            v-if="canAddAvailabilityPlanTime"
            class="ml-1"
            color="primary"
            @click="showPlanTimeForm = true"
          >
            Set Plan Time
          </v-btn>
        </v-card-title>
      </template>
      <v-card-text style="padding-bottom: 30px;">
        <apexchart
          key="availability-chart"
          height="400"
          :series="chartOptions2.series"
          :options="chartOptions2"
        ></apexchart>
      </v-card-text>
      <availability-plan-time-form
        :dlg="showPlanTimeForm"
        @close="showPlanTimeForm = false"
        @submit="handleSetPlanTime"
      ></availability-plan-time-form>
    </div>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
// import TimeRangeChooser4 from './TimeRangeChooser4'
import DateRangeChooserDialog from '../common/DateRangeChooserDialog.vue'
import AvailabilityPlanTimeForm from './AvailabilityPlanTimeForm'

const TODAY = new Date().toISOString().substr(0, 10) // YYYY-MM-DD
const BEFOREWEEK = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10) // YYYY-MM-DD

export default {
  components: {
    DateRangeChooserDialog,
    AvailabilityPlanTimeForm
  },
  data() {
    return {
      showTimeRangeChooser: false,
      showPlanTimeForm: false,
      selectedTimeRange: {
        timeRangeOption: 'last7Days',
        dateFrom: BEFOREWEEK,
        dateTo: TODAY,
        timeFrom: '00:00',
        timeTo: '00:00'
      },
      showDowntimeChart: true,
      viewOptions: [
        'Daily', 'Weekly', 'Monthly'
      ],
      seriesColors: [{
        name: 'No Demand',
        color: '#bac1c6'
      }, {
        name: 'Preventative Maintenance',
        color: this.$vuetify.theme.themes.light.secondary
      }, {
        name: 'Machine Failure',
        color: this.$vuetify.theme.themes.light.info
      }, {
        name: 'Power Outage',
        color: '#004165'
      }, {
        name: 'Other',
        color: this.$vuetify.theme.themes.light.primary
      }, {
        name: 'Change Over',
        color: this.$vuetify.theme.themes.light.error
      }, {
        name: 'Average Downtime',
        color: '#ba7d55'
      }]
    }
  },
  computed: {
    ...mapState({
      downtimeGraphData: (state) => state.devices.downtimeGraphData,
      downtimeGraphDate: (state) => state.devices.downtimeGraphDate,
      availabilityGraphData: (state) => state.devices.availabilityGraphData,
      isDowntimeGraphLoading: (state) => state.devices.isDowntimeGraphLoading,
      selectedCompany: (state) => state.machines.selectedCompany
    }),
    ...mapGetters('machines', ['timeRangeFromTo']),
    ...mapGetters('auth', ['canAddAvailabilityPlanTime', 'canViewEquipmentAvailability']),
    chartOptions1() {
      return {
        series: this.downtimeGraphData,
        chart: {
          type: 'line',
          stacked: true,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        stroke: {
          width: this.getStrokeWidth,
          curve: 'smooth'
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'top',
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '70%',
            horizontal: false,
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          style: {
            fontSize: '10px',
            colors: ['#fff']
          }
        },
        xaxis: {
          type: 'date',
          categories: this.downtimeGraphDate,
          labels: {
            formatter: (value) => {
              return value ? value.slice(6, 10) : ''
            }
          }
        },
        legend: {
          position: 'bottom',
          offsetY:-8,
          markers: {
            radius: 12
          }
        },
        colors: this.getSeriesColors,
        fill: {
          colors: this.getSeriesColors,
          opacity: 1
        }
      }
    },
    chartOptions2() {
      return {
        chart: {
          type: 'line',
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        colors: ['#FF1654', '#247BA0'],
        series: this.availabilityGraphData,
        stroke: {
          width: [4, 4]
        },
        plotOptions: {
          bar: {
            columnWidth: '20%'
          }
        },
        xaxis: {
          type: 'date',
          categories: this.downtimeGraphDate,
          labels: {
            formatter: (value) => {
              return value ? value.slice(6, 10) : ''
            }
          }
        },
        yaxis: {
          forceNiceScale: true,
          min:0,
          labels: {
            offsetX: 10,
            formatter: (value) => {
              return (value * 100).toFixed(3) + '%'
            }
          },
          title: {
            text: 'Availability (%)'
          }
        },

        dataLabels: {
          style: {
            fontSize: '10px',
            colors: ['#fff']
          }
        },
        legend: {
          position: 'bottom',
          offsetY:-5
        }
      }
    },
    getTimeRange() {
      if (this.selectedTimeRange && this.selectedTimeRange.timeRangeOption !== 'custom') {
        const TODAY = new Date().toISOString().substr(0, 10) // YYYY-MM-DD
        const tR = {
          timeRangeOption: this.selectedTimeRange.timeRangeOption,
          dates: [TODAY, TODAY]
        }

        const from = new Date(this.timeRangeFromTo(tR).from)
        const to = new Date(this.timeRangeFromTo(tR).to)

        return {
          dateFrom: from.toLocaleDateString('en-US'),
          dateTo: to.toLocaleDateString('en-US'),
          timeFrom: from.toLocaleTimeString('en-US'),
          timeTo: to.toLocaleTimeString('en-US')
        }
      } else {
        return {
          dateFrom: this.selectedTimeRange.dateFrom,
          dateTo: this.selectedTimeRange.dateTo,
          timeFrom: this.selectedTimeRange.timeFrom,
          timeTo: this.selectedTimeRange.timeTo
        }
      }
    },
    getSeriesColors() {
      const _colors = []

      this.downtimeGraphData.map((item) => {
        const seriesColor = this.seriesColors.find((data) => {
          return data.name === item.name
        })

        _colors.push(seriesColor ? seriesColor.color : '#f1f1cb')

        return _colors
      })

      return _colors
    },
    getStrokeWidth() {
      const _widths = []

      this.downtimeGraphData.map((item) => {
        if (item.name === 'Average Downtime') {
          _widths.push(3)
        } else {
          _widths.push(0)
        }

        return _widths
      })

      return _widths
    },
    isNotOverrallOption() {
      return this.selectedCompany && this.selectedCompany.id !== 0
    },
    routeParams() {
      const location_id = this.$route.params.location ? this.$route.params.location : 0
      const zone_id = this.$route.params.zone ? this.$route.params.zone : 0

      if (this.$route.name === 'dashboard-product') {
        return {
          location_id,
          zone_id,
          company_id: this.selectedCompany ? this.selectedCompany.id : 0,
          machine_id: this.$route.params.configurationId,
          serial_number: this.$route.params.productId
        }
      }

      return {
        location_id,
        zone_id,
        company_id: this.selectedCompany ? this.selectedCompany.id : 0
      }

    }
  },
  methods: {
    ...mapActions({
      getDowntimeGraphData: 'devices/getDowntimeGraphData',
      setAvailabilityPlanTime: 'devices/setAvailabilityPlanTime'
    }),
    onTimeRangeChanged(newTimeRange) {
      let from, to

      this.selectedTimeRange = newTimeRange
      if (newTimeRange.timeRangeOption === 'custom') {
        from = this.$refs.dateRangeChooserType.getTimes().from
        to = this.$refs.dateRangeChooserType.getTimes().to
      } else {
        from = this.timeRangeFromTo(newTimeRange).from
        to = this.timeRangeFromTo(newTimeRange).to
      }

      this.getDowntimeGraphData({ to, from, ...this.routeParams })
      this.showTimeRangeChooser = false
    },
    handleSetPlanTime(data) {
      const timestamp = new Date(`${data.dateFrom} 00:00:00 GMT+00:00`).getTime()

      this.setAvailabilityPlanTime({
        date: timestamp,
        time: data.planTime
      })
    }
  }
}
</script>
