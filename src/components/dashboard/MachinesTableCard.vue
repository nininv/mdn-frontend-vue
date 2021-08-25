<template>
  <v-card :disabled="loadingDashboardDevicesTable">
    <v-card-title>
      {{ machineTableTitle }}
      <br />
      <br />
      <v-combobox
        v-model="machinesTableHeaders"
        :items="machinesTableComboboxValues"
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
        :headers="filteredHeaders"
        :items="devices"
        :search="searchQuery"
        :loading="loadingDashboardDevicesTable"
        :items-per-page="50"
        :page.sync="page"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
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
        <template v-slot:header.downtimeByType="{ header }">
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
        <template v-slot:item.downtimeByType="{ item }">
          <div v-if="item && item.downtimeByType" class="mx-auto d-flex justify-center">
            <no-downtime v-if="hasNoDowntime(item.downtimeByType)"></no-downtime>
            <apexchart
              v-else
              key="downtime-chart"
              width="240"
              height="80"
              :options="getSeriesOptions(item.downtimeByType)"
              :series="getDowntimeSeries(item.downtimeByType)"
            >
            </apexchart>
          </div>
        </template>
        <template v-slot:item.capacityUtilization="{ item }">
          <div v-if="item" class="mx-auto d-flex justify-center">
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
import { debounce } from '../../plugins/debounce'
/*
|---------------------------------------------------------------------
| Machines Table Card Component
|---------------------------------------------------------------------
|
| Machines table card to list machines and their properties
|
*/

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
    NoDowntime,
    DowntimeLegend
  },
  props: {
    location: {
      type: Number,
      default: 0
    },
    // eslint-disable-next-line vue/require-default-prop
    machineTableTitle:{
      type:String,
      default: 'Machines in Location'
    }
  },
  data () {
    return {
      headers: [
        { text: 'Status', align: 'center', value: 'status' },
        { text: 'Machine Name', align: 'start', value: 'customer_assigned_name' },
        { text: 'Machine Type', align: 'start', value: 'machineType', width: '150px' },
        { text: 'Downtime By Type', align: 'center', value: 'downtimeByType', sortable: false },
        { text: 'Capacity Utilization', align: 'center', value: 'capacityUtilization' },
        { text: 'Locations', align: 'center', value: 'location_id', width: '110px' },
        { text: 'Zones', align: 'center', value: 'zone_id', width: '95px' }
      ],
      dashboardComboboxValues: [
        'Machine Type', 'Capacity Utilization', 'Downtime By Type'
      ],
      sortOptions: '',
      page: 1,
      hours: 8,
      searchQuery: '',
      row: '',
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
          toolbar: {
            show: false
          },
          animations: {
            enabled: false
          }
        },
        markers: {
          size: 0
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
    filteredHeaders() {
      const savedHeaders = Array.isArray(this.machinesTableHeaders) ? this.machinesTableHeaders : []
      const headerColumns = ['Status', 'Machine Name', ...savedHeaders]

      return this.headers.filter((header) => {
        return headerColumns.includes(header.text)
      })
    },
    machinesTableComboboxValues() {
      if (this.$route.name === 'dashboard-analytics') {
        return [...this.dashboardComboboxValues, 'Locations', 'Zones']
      } else if (this.$route.name === 'location-dashboard') {
        return [...this.dashboardComboboxValues, 'Zones']
      } else {
        return this.dashboardComboboxValues
      }
    },
    headerColumns() {
      return this.headers.map((header) => header.text)
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
    },
    sortBy: {
      get () {
        return this.$store.state.devices.machinesTableSortBy
      },
      set (value) {
        this.$store.commit('devices/SET_MACHINES_TABLE_SORT_OPTIONS', {
          sortBy: value,
          sortDesc: this.sortDesc
        })
      }
    },
    sortDesc: {
      get () {
        return this.$store.state.devices.machinesTableSortDesc
      },
      set (value) {
        this.$store.commit('devices/SET_MACHINES_TABLE_SORT_OPTIONS', {
          sortBy: this.sortBy,
          sortDesc: value
        })
      }
    }
  },
  watch: {
    machinesTableHeaders (newValue) {
      this.customizeTableHeader()
    },
    sortBy (newValue) {
      this.customizeTableSortOption('by', newValue)
    },
    sortDesc (newValue) {
      this.customizeTableSortOption('desc', newValue)
    }
  },
  async mounted() {
    await this.getMachinesTableHeaders({
      name: this.$route.name
    })
    this.getDevicesAnalytics({
      page: this.page,
      location_id: this.location,
      company_id: this.companyId
    })
  },
  methods: {
    ...mapActions({
      getDevicesAnalytics: 'devices/getDevicesAnalytics',
      updateMachineTableHeader: 'devices/updateMachineTableHeader',
      getMachinesTableHeaders: 'devices/getMachinesTableHeaders',
      updateMachineTableSortOption: 'devices/updateMachineTableSortOption'
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
        }).catch((error) => {})
      } else {
        this.$router.push({
          name: 'product-details',
          params: {
            configurationId: item.machine_id,
            productId: item.serial_number
          }
        }).catch((error) => {})
      }
    },
    remove (item) {
      const headerColumnValues = [...this.machinesTableHeaders]

      headerColumnValues.splice(headerColumnValues.indexOf(item), 1)
      this.machinesTableHeaders = [...headerColumnValues]
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
      return (!item) ? 'No Data From Device' : `${item} %`
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

    customizeTableSortOption(option, event) {
      if (option === 'by') this.sortBy = event
      if (option === 'desc') this.sortDesc = event

      debounce(this.setDefaultSortOptions)
    },

    setDefaultSortOptions() {
      this.updateMachineTableSortOption({
        sortOption: {
          sortBy: this.sortBy,
          sortDesc: this.sortDesc
        },
        name: this.$route.name
      })
    }
  }
}
</script>
