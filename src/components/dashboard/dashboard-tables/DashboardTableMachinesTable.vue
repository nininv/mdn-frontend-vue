<template>
  <v-card :disabled="loading">
    <v-card-title>Machine Status</v-card-title>
    <v-combobox
      v-model="machinesTableHeaders"
      :items="dashboardComboboxValues"
      chips
      solo
      label="Add/Remove Coloumns"
      multiple
      class="flex-grow-0 ma-1"
    >
      <template v-slot:selection="{ attrs, item }">
        <v-chip
          v-bind="attrs"
          close
          small
          color="primary lighten-2"
          outlined
          @click:close="remove(item)"
        >
          {{ item }}
        </v-chip>
      </template>
    </v-combobox>
    <v-card-text>
      <v-data-table
        :loading="loading"
        :headers="filtedHeaders"
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
        <template v-slot:item.capacityUtilization="{ item }">
          <div v-if="item" class="mx-auto d-flex justify-center">
            <span>{{ getCapacityUtilizationValue(item.capacityUtilization) }}</span>
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

import NoDowntime from './DashboardTableNoDowntime'
import DowntimeLegend from './DashboardTableDowntimeLegend'
import { debounce } from '../../../plugins/debounce'

const seriesColors = [{
  name: 'Planned',
  color: '#096288'
}, {
  name: 'Unplanned',
  color: '#c8c62e'
}, {
  name: 'Idle',
  color: '#5a5d61'
}]

export default {
  components: {
    NoDowntime, DowntimeLegend
  },
  props: {
  },
  data () {
    return {
      headers: [
        { text: 'Running', value: 'status' },
        { text: 'Machines', value: 'customer_assigned_name' },
        { text: 'Machine Type', value: 'machineType' },
        { text: 'Downtime By Type', align: 'center', value: 'downtimeByReason', sortable: false },
        { text: 'Capacity Utilization', align: 'center', value: 'capacityUtilization' }
      ],
      dashboardComboboxValues: [
        'Machine Type', 'Capacity Utilization', 'Downtime By Type'
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
    }),
    filtedHeaders() {
      const headerColumns = ['Running', 'Machines', ...this.machinesTableHeaders]

      return this.headers.filter((header) => {
        return headerColumns.includes(header.text)
      })
    },
    machinesTableHeaders: {
      get () {
        return this.$store.state.devices.machinesTableHeaders
      },
      set (value) {
        this.$store.commit('devices/SET_MACHINES_TABLE_HEADERS', {
          headers: value,
          pathName: this.$route.name
        })
      }
    }
  },
  watch: {
    machinesTableHeaders (newValue) {
      this.customizeTableHeader()
    }
  },
  async mounted() {
    await this.getMachinesTableHeaders({
      name: this.$route.name
    })
    this.getDashboardMachinesTable({
      location: this.$route.params.location,
      zone: this.$route.params.zone,
      page: 1,
      itemsPerPage: this.itemsPerPage
    })
  },
  methods: {
    ...mapActions({
      getDashboardMachinesTable: 'machines/getDashboardMachinesTable',
      getMachinesTableHeaders: 'devices/getMachinesTableHeaders',
      updateMachineTableHeader: 'devices/updateMachineTableHeader'
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
    },
    remove (item) {
      const headerColumnValues = [...this.machinesTableHeaders]

      headerColumnValues.splice(headerColumnValues.indexOf(item), 1)
      this.machinesTableHeaders = [...headerColumnValues]
    },
    setDefaultHeaders() {
      this.updateMachineTableHeader({
        name: this.$route.name,
        headers: this.machinesTableHeaders
      })
    },

    customizeTableHeader() {
      debounce(this.setDefaultHeaders)
    },

    getCapacityUtilizationValue(item) {
      return (item === null) ? 'No Data From Device' : `${item} %`
    }
  }
}
</script>