<template>
  <v-card
    class="d-flex flex-column justify-space-between"
    height="100%"
    light
    :loading="isDowntimeByTypeGraphLoading"
    :disabled="isDowntimeByTypeGraphLoading"
  >
    <v-card-title>
      Downtime by Type
      <v-spacer></v-spacer>
      <v-btn
        class="ml-1"
        color="primary"
        @click="showDowntimeTable=!showDowntimeTable"
      >
        Downtime Administration
      </v-btn>
      <v-dialog
        v-model="showDowntimeTable"
        max-width="1200px"
      >
        <downtime-data-table @closed="showDowntimeTable=false"></downtime-data-table>
      </v-dialog>
    </v-card-title>
    <v-card-text style="padding-bottom: 35px;">
      <apexchart
        :options="chartOptions"
        height="400"
        :series="getDowntimeByTypeSeries"
      ></apexchart>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import DowntimeDataTable from './product/DowntimeDataTable'

const TYPE_CATEGORIES = ['Planned', 'Unplanned', 'Idle']

export default {
  components: {
    DowntimeDataTable
  },
  data() {
    return {
      selectedTimeRange: {},
      showChart: true,
      showDowntimeTable:false
    }
  },
  computed: {
    ...mapState({
      downtimeByTypeGraphSeries: (state) => state.devices.downtimeByTypeGraphSeries,
      isDowntimeByTypeGraphLoading: (state) => state.devices.isDowntimeByTypeGraphLoading
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
          },
          animations: {
            enabled: false
          }
        },
        markers: {
          size: 0
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '60%',
            dataLabels: {
              show: false,
              position: 'top'
            },
            distributed: true,
            space: 0.25,
            endingShape: 'rounded'
          }
        },
        xaxis: {
          categories: TYPE_CATEGORIES.map((item) => item),
          labels: {
            show: false
          }
        },
        colors: [this.$vuetify.theme.themes.light.primary, this.$vuetify.theme.themes.light.secondary, this.$vuetify.theme.themes.light.surface],
        legend: {
          position: 'bottom',
          offsetY: 7,
          markers: {
            radius: 12
          }
        },
        fill: {
          colors: [this.$vuetify.theme.themes.light.primary, this.$vuetify.theme.themes.light.secondary, this.$vuetify.theme.themes.light.surface],
          opacity: 1
        }
      }
    },
    getDowntimeByTypeSeries() {
      const series = [{ name: 'Hours', data: [] }]

      TYPE_CATEGORIES.map((category) => {
        const data = this.downtimeByTypeGraphSeries.find((item) => {
          return item.name === category
        })

        series[0].data.push(data ? data.data : 0)

        return 0
      })

      return series
    }
  }
}
</script>
