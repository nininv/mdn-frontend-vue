<template>
  <v-card :disabled="loading">
    <v-card-title>Machine Status</v-card-title>
    <v-card-text>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="devices"
        :items-per-page="5"
        :page.sync="page"
        class="link-table"
        hide-default-footer
        @click:row="(item) => $router.push({ path: item.machine_id + '/' + item.serial_number, append: true })"
      >
        <template v-slot:header.status="{ header }">
          <v-icon color="primary">$mdi-chevron-double-right</v-icon>
          {{ header.text }}
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip color="grey lighten-4" dense>
            <v-tooltip v-for="(status, index) in item.status" :key="index" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-avatar
                  class="ml-0 mr-0"
                  v-bind="attrs"
                  :color="getColor(status)"
                  v-on="on"
                >
                  <v-icon
                    small
                  >
                    {{ getIcon(status) }}
                  </v-icon>
                </v-avatar>
              </template>
              <span>{{ getText(status) }}</span>
            </v-tooltip>
          </v-chip>
        </template>
        <template v-slot:header.customer_assigned_name="{ header }">
          <v-icon small color="primary">$mdi-wrench</v-icon>
          {{ header.text }}
        </template>
        <template v-slot:item.customer_assigned_name="{ item }">
          <span class="primary--text font-weight-bold">{{ item.customer_assigned_name }}</span>
        </template>
        <template v-slot:item.configuration="{ item }">
          <span v-if="item.configuration">{{ item.configuration.name }}</span>
        </template>
        <template v-slot:item.rate="{ item }">
          <production-rate-chart
            :height="120"
            :series="[item.rate]"
          >
          </production-rate-chart>
        </template>
        <template v-slot:item.downtimeAvailability="{ item }">
          <div class="d-flex justify-center mx-auto" style="width: 180px;">
            <apexchart
              key="availability-chart"
              type="line"
              width="160"
              :options="availabilityChartOptions"
              :series="item.downtimeAvailability"
            >
            </apexchart>
          </div>
        </template>
        <template v-slot:item.downtimeByReason="{ item }">
          <div v-if="item && item.downtimeByReason" class="d-flex justify-center">
            <no-downtime v-if="hasNoDowntime(item.downtimeByReason)"></no-downtime>
            <apexchart
              v-else
              key="downtime-chart"
              width="240"
              height="80"
              :options="getSeriesOptions(item.downtimeByReason)"
              :series="getDowntimeSeries(item.downtimeByReason)"
            >
            </apexchart>
          </div>
        </template>
      </v-data-table>

      <div class="d-flex justify-end mr-4">
        <downtime-legend></downtime-legend>
      </div>

      <v-pagination
        v-model="page"
        :length="pageCount"
        :total-visible="7"
        @input="getDevices"
      ></v-pagination>
    </v-card-text>
  </v-card>
</template>

<script>

import { mapState, mapActions } from 'vuex'

import ProductionRateChart from '../charts/ProductionRateChart'
import NoDowntime from './DashboardTableNoDowntime'
import DowntimeLegend from './DashboardTableDowntimeLegend'

const seriesColors = [{
  name: 'No Demand',
  color: '#eeeeef'
}, {
  name: 'Preventative Maintenance',
  color: '#012d52'
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
    ProductionRateChart, NoDowntime, DowntimeLegend
  },
  props: {
  },
  data () {
    return {
      headers: [
        { text: 'Running', value: 'status' },
        { text: 'Machines', value: 'customer_assigned_name' },
        { text: 'Machine Type', value: 'configuration' },
        { text: 'Downtime By Reason', align: 'center', value: 'downtimeByReason', sortable: false },
        { text: 'Availability', align: 'center', value: 'downtimeAvailability' }
      ],
      deviceStatus: {
        machineRunning: {
          color: 'green',
          text: 'Machine Running',
          icon: '$mdi-check-circle-outline'
        },
        routerNotConnected: {
          color: 'yellow',
          text: 'Router No Communication',
          icon: '$mdi-wifi-off'
        },
        machineStopped: {
          color: 'grey',
          text: 'Machine Stopped',
          icon: '$mdi-block-helper'
        },
        machineIdle: {
          color: 'grey',
          text: 'Machine Idle - No Demand',
          icon: '$mdi-block-helper'
        },
        machineStoppedActiveAlarm: {
          color: 'red',
          text: 'Machine Stopped - Active Alarm',
          icon: '$mdi-block-helper'
        },
        machineRunningAlert: {
          color: 'yellow',
          text: 'Machine Running - Alert',
          icon: '$mdi-alert-outline'
        },
        plcNotConnected: {
          color: 'red',
          text: 'PLC No Communication',
          icon: '$mdi-database-remove'
        },
        machineRunningThreshold: {
          color: 'red',
          text: 'Machine Running - Threshold Alert',
          icon: '$mdi-alert-outline'
        }
      },
      searchQuery: '',
      page: 1,
      itemsPerPage: 5,

      chartOptions: {
        chart: {
          type: 'bar',
          stacked: true,
          stackType: '100%',
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              enabled: false
            }
          }
        },
        xaxis: {
          axisBorder: {
            show: false
          },
          labels: {
            show: false
          }
        },
        yaxis: {
          floating: true,
          labels: {
            show: false
          },
          title: {
            text: undefined
          }
        },
        tooltip: {
          enabled: false
        },
        legend: {
          show: false
        },
        grid: {
          show: false
        }
      },

      availabilityChartOptions: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          }
        },
        colors: ['#FF1654', '#247BA0'],
        dataLabels: {
          enabled: false
        },
        title: {
          text: '',
          align: 'left'
        },
        xaxis: {
          labels: {
            show: false
          },
          axisBorder: {
            show: false
          }
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        grid: {
          show: false
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        tooltip: {
          enabled: false
        },
        annotations: {
          yaxis: [
            {
              y: 25,
              borderColor: '#00E396'
            }
          ]
        },
        legend: {
          show: false
        }
      }
    }
  },
  computed: {
    ...mapState({
      loading: (state) => state.machines.loadingMachinesTable,
      devices: (state) => state.devices.data,
      totalDevices: (state) => state.devices.totalDevices,
      pageCount: (state) => state.devices.pageCount
    })
  },
  mounted() {
    this.getDashboardMachinesTable({
      location: this.$route.params.location,
      zone: this.$route.params.zone,
      page: 1,
      itemsPerPage: this.itemsPerPage
    })
  },
  methods: {
    ...mapActions({
      getDashboardMachinesTable: 'machines/getDashboardMachinesTable'
    }),
    getDevices() {
      this.getDashboardMachinesTable({
        location: this.$route.params.location,
        zone: this.$route.params.zone,
        page: this.page,
        itemsPerPage: this.itemsPerPage
      })
    },
    hasNoDowntime(data) {
      let sum = 0

      data.map((item) => {
        sum += item.data

        return sum
      })
      
      return sum === 0
    },
    getDowntimeSeries(data) {
      const series = []

      data.map((item) => {
        const temp = {
          name: item.name,
          data: [item.data]
        }

        series.push(temp)

        return 0
      })

      return series
    },
    getSeriesOptions(series) {
      const _colors = []

      series.map((item) => {
        const seriesColor = seriesColors.find((data) => {
          return data.name === item.name
        })

        _colors.push(seriesColor ? seriesColor.color : '#fff')

        return _colors
      })

      return {
        ...this.chartOptions,
        colors: _colors,
        fill: {
          colors: _colors,
          opacity: 1
        }
      }
    },
    getColor(status) {
      return this.deviceStatus[status] ? this.deviceStatus[status].color : ''
    },
    getIcon(status) {
      return this.deviceStatus[status] ? this.deviceStatus[status].icon : ''
    },
    getText(status) {
      return this.deviceStatus[status] ? this.deviceStatus[status].text : ''
    }
  }
}
</script>