<template>
  <v-card :disabled="loadingDashboardDevicesTable">
    <v-card-title>
      Machine Status
      <br />
      <br />
      <v-combobox
        v-model="headerColumnValues"
        :items="headerColumns"
        chips
        solo
        label="Add/Remove Coloumns"
        multiple
        class="flex-grow-0 ml-auto"
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
    </v-card-title>
    <v-card-text>
      <v-data-table
        id="machines-table"
        :headers="filtedHeaders"
        :items="devices"
        :search="searchQuery"
        :loading="loadingDashboardDevicesTable"
        :items-per-page="50"
        :page.sync="page"
        class="link-table"
        hide-default-footer
        @click:row="productView"
      >
        <template v-slot:header.status="{ header }">
          <v-icon color="primary">$mdi-chevron-double-right</v-icon>
          {{ header.text }}
        </template>
        <template v-slot:header.name="{ header }">
          <v-icon small color="primary">$mdi-wrench</v-icon>
          {{ header.text }}
        </template>
        <template v-slot:header.capacityUtilization="{ header }">
          <v-icon color="primary">$mdi-trending-up</v-icon>
          {{ header.text | percentageLabel }}
        </template>
        <template v-slot:header.downtimeByReason="{ header }">
          <v-icon class="mdi-rotate-90" color="primary">$mdi-battery-30</v-icon>
          {{ header.text }}
        </template>
        <template v-slot:header.location_id="{ header }">
          <v-icon small color="primary">$mdi-factory</v-icon>
          {{ header.text }}
        </template>

        <!-- -->

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

        <template v-slot:item.configuration="{ item }">
          <span v-if="item.configuration">{{ item.configuration.name }}</span>
        </template>
        <template v-slot:item.downtimeByReason="{ item }">
          <div v-if="item && item.downtimeByReason" class="mx-auto d-flex justify-center">
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
        <template v-slot:item.capacityUtilization="{ item }">
          <div v-if="item && item.capacityUtilization" class="mx-auto d-flex justify-center">
            <span>{{ getCapacityUtilizationValue(item.capacityUtilization) }}</span>
          </div>
        </template>
        <template v-slot:item.location_id="{ item }">
          {{ locationName(item.location_id) }}
        </template>
        <template v-slot:item.zone_id="{ item }">
          {{ zoneName(item.zone_id) }}
        </template>
      </v-data-table>
      <div class="d-flex justify-end mr-4">
        <downtime-legend></downtime-legend>
      </div>
      <v-pagination
        v-model="page"
        :length="pageCountReport"
        :total-visible="7"
        @input="getDevicesAnalytics({ page: page, location_id: location, company_id: companyId })"
      ></v-pagination>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import NoDowntime from './dashboard-tables/DashboardTableNoDowntime'
import DowntimeLegend from './dashboard-tables/DashboardMachinesTableLegend'
/*
|---------------------------------------------------------------------
| Machines Table Card Component
|---------------------------------------------------------------------
|
| Machines table card to list machines and their properties
|
*/

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
    NoDowntime,
    DowntimeLegend
  },
  props: {
    location: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      headers: [
        { text: 'Running', align: 'center', value: 'status' },
        { text: 'Machine Name', align: 'start', value: 'name' },
        { text: 'Machine Type', align: 'start', value: 'configuration' },
        { text: 'Downtime By Reason', align: 'center', value: 'downtimeByReason', sortable: false },
        { text: 'Capacity Utilization', align: 'center', value: 'capacityUtilization' },
        { text: 'Locations', align: 'center', value: 'location_id' },
        { text: 'Zones', align: 'center', value: 'zone_id' }
      ],
      page: 1,
      hours: 8,
      searchQuery: '',
      row: '',
      headerColumnValues: [
        'Running',
        'Machine Name',
        'Machine Type',
        'Capacity Utilization',
        'Downtime By Reason',
        'Locations',
        'Zones'
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
      utilizationOptions: {
        chart: {
          type: 'area',
          animations: {
            speed: 400
          },
          toolbar: {
            show: false
          }
        },
        colors: [this.$vuetify.theme.themes.light.background, this.$vuetify.theme.themes.light.accent, this.$vuetify.theme.themes.light.surface, '#5a5d61', this.$vuetify.theme.themes.light.secondary, this.$vuetify.theme.themes.light.error],
        noData: {
          text: 'No Data From Devce'
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
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        xaxis: {
          type: 'datetime',
          axisBorder: {
            show: false
          },
          labels: {
            show: false
          }
        },
        legend: {
          show: false
        },
        grid: {
          show: false
        }
      }
    }
  },
  computed: {
    ...mapState({
      devices: (state) => state.devices.data,
      loadingDashboardDevicesTable: (state) => state.devices.loadingDashboardDevicesTable,
      pageCountReport: (state) => state.devices.pageCountReport,
      companyId: (state) => state.machines.selectedCompany ? state.machines.selectedCompany.id : 0
    }),
    ...mapGetters({
      locationName: 'locations/locationName',
      zoneName: 'zones/zoneName'
    }),
    filtedHeaders() {
      return this.headers.filter((header) => {
        return this.headerColumnValues.includes(header.text)
      })
    },
    headerColumns() {
      return this.headers.map((header) => header.text)
    }
  },
  mounted() {
    this.getDevicesAnalytics({
      page: this.page,
      location_id: this.location,
      company_id: this.companyId
    })
  },
  methods: {
    ...mapActions({
      getDevicesAnalytics: 'devices/getDevicesAnalytics'
    }),
    open(item) { },
    getColor(status) {
      return this.deviceStatus[status] ? this.deviceStatus[status].color : ''
    },
    getIcon(status) {
      return this.deviceStatus[status] ? this.deviceStatus[status].icon : ''
    },
    getText(status) {
      return this.deviceStatus[status] ? this.deviceStatus[status].text : ''
    },
    productView(item) {
      if (item.location_id && item.zone_id) {
        this.$router.push({
          name: 'dashboard-product',
          params: {
            location: item.location_id,
            zone: item.zone_id,
            configurationId: item.machine_id,
            productId: item.serial_number
          }
        })
      } else {
        this.$router.push({
          name: 'product-details',
          params: {
            configurationId: item.machine_id,
            productId: item.serial_number
          }
        })
      }
    },
    remove (item) {
      this.headerColumnValues.splice(this.headerColumnValues.indexOf(item), 1)
      this.headerColumnValues = [...this.headerColumnValues]
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

    getCapacityUtilizationValue(item) {
      return (item[0].length === 0) ? 'No Data From Device' : `${item[0][item[0].length - 1][1]} %`
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

    hasNoDowntime(data) {
      let sum = 0

      data.map((item) => {
        sum += item.data

        return sum
      })

      return sum === 0
    }
  }
}
</script>
