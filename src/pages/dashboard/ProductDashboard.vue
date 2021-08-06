<template>
  <div class="d-flex flex-grow-1 flex-column">
    <v-sheet v-if="$route.name !== 'product-details'" color="surface2" class="my-n10 py-9">
      <v-container class="pb-0" fluid>
        <div v-if="$route.name === 'product-acs-dashboard'" class="d-flex mt-2 align-center">
          <v-breadcrumbs :items="acsBreadcrumbItems"></v-breadcrumbs>
          <v-spacer></v-spacer>
          <company-menu
            :companies="companies"
          >
          </company-menu>
        </div>
        <v-breadcrumbs v-else :items="breadcrumbItems"></v-breadcrumbs>
      </v-container>
    </v-sheet>
    <v-container fluid>
      <div v-if="loadingDeviceConfig" class="text-center mt-10">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <div class="mt-1">Loading configuration...</div>
      </div>
      <div v-else>
        <v-alert
          v-if="error"
          dense
          outlined
          type="error"
          width="500"
          class="mx-auto"
          style="margin-top: 160px;"
        >
          Device <i class="font-weight-bold">{{ $route.params.productId }}</i> is not connected.
        </v-alert>
        <div v-else>
          <v-tabs v-if="deviceConfiguration.isTcuConnected && deviceConfiguration.plcMachineId !== 11" v-model="tabModel">
            <v-tab>{{ deviceConfiguration.plcMachineName }}</v-tab>
            <v-tab v-if="deviceConfiguration.plcMachineName !== deviceConfiguration.tcuMachineName">{{ deviceConfiguration.tcuMachineName }}</v-tab>
          </v-tabs>

          <br>

          <v-tabs-items v-model="tabModel" class="overflow-visible">
            <v-tab-item>
              <v-row class="flex-grow-0" dense>
                <v-col cols="12">
                  <product-analytics
                    :machine-id="deviceConfiguration.plcMachineId"
                    :serial-number="parseInt(deviceConfiguration.plcSerialNumber)"
                    :enabled-graphs="deviceConfiguration.plcEnabledAnalyticsGraphs"
                    :graphs="deviceConfiguration.plcAnalyticsGraphs"
                  >
                  </product-analytics>
                </v-col>
                <v-col cols="12">
                  <alarms-table
                    namespace="alarms-table-id1"
                    :fetch="getProductAlarms"
                    :machine-id="deviceConfiguration.plcMachineId"
                    :serial-number="parseInt(deviceConfiguration.plcSerialNumber)"
                  >
                  </alarms-table>
                </v-col>
                <v-col cols="12">
                  <product-parameters-chart
                    :machine-id="deviceConfiguration.plcMachineId"
                    :serial-number="parseInt(deviceConfiguration.plcSerialNumber)"
                  >
                  </product-parameters-chart>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item reverse-transition>
              <v-row class="flex-grow-0" dense>
                <v-col cols="12">
                  <product-analytics
                    :machine-id="11"
                    :serial-number="parseInt(deviceConfiguration.tcuSerialNumber)"
                    :enabled-graphs="deviceConfiguration.tcuEnabledAnalyticsGraphs"
                    :graphs="deviceConfiguration.tcuAnalyticsGraphs"
                  >
                  </product-analytics>
                </v-col>
                <v-col cols="12">
                  <v-card-title>
                    Downtime Data
                  </v-card-title>
                  <v-row class="flex-grow-0" dense>
                    <v-col md="4" cols="12">
                      <downtime-card></downtime-card>
                    </v-col>
                    <v-col md="4" cols="12">
                      <downtime-by-type-card></downtime-by-type-card>
                    </v-col>
                    <v-col md="4" cols="12">
                      <downtime-by-reason-card></downtime-by-reason-card>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <alarms-table
                    namespace="alarms-table-id2"
                    :fetch="getProductAlarms"
                    :machine-id="11"
                    :serial-number="parseInt(deviceConfiguration.plcSerialNumber)"
                  >
                  </alarms-table>
                </v-col>
                <v-col cols="12">
                  <div class="text-h4">Parameters & Points</div>
                </v-col>
                <v-col cols="12">
                  <product-parameters-chart-for-tcu
                    :machine-id="11"
                    :serial-number="parseInt(deviceConfiguration.tcuSerialNumber)"
                  >
                  </product-parameters-chart-for-tcu>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>

          <br>

          <v-row dense>
            <v-col cols="12" md="5">
              <note-form
                :device-id="parseInt($route.params.productId)"
              >
              </note-form>
            </v-col>
            <v-col cols="12" md="7">
              <notes-timeline
                :notes="notes"
              >
              </notes-timeline>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Product Page Component
| url: dashboard/product/:id
|---------------------------------------------------------------------
|
| Product detail page
*/

// import vuex helper functions
import { mapState, mapGetters, mapActions } from 'vuex'

import commonApi from '../../components/dashboard/product/common/fetches/api'
import AlarmsTable from '../../components/dashboard/product/common/alarms-table/ProductAlarms'

// import AlarmTable from '../../components/dashboard/product/AlarmTable'
import ProductParametersChart from '../../components/dashboard/product/ProductParametersChart'
import ProductParametersChartForTcu from '../../components/dashboard/product/ProductParametersChartForTcu'
import ProductAnalytics from '../../components/dashboard/product/ProductAnalytics'
import NotesTimeline from '../../components/dashboard/NotesTimeline'
import NoteForm from '../../components/dashboard/NoteForm'
import CompanyMenu from '../../components/dashboard/CompanyMenu'
import DowntimeCard from '../../components/dashboard/DowntimeCard'
import DowntimeByTypeCard from '../../components/dashboard/DowntimeByTypeCard'
import DowntimeByReasonCard from '../../components/dashboard/DowntimeByReasonCard'

export default {
  components: {
    CompanyMenu,
    ProductParametersChart,
    ProductParametersChartForTcu,
    ProductAnalytics,
    NotesTimeline,
    NoteForm,
    AlarmsTable,
    DowntimeCard,
    DowntimeByTypeCard,
    DowntimeByReasonCard
  },
  data() {
    return {
      tabModel: 0,
      getProductAlarms: commonApi.getProductAlarms
    }
  },
  computed: {
    ...mapState('devices', ['loadingDeviceConfig', 'error', 'deviceConfiguration']),
    ...mapState({
      notes: (state) => state.notes.data,
      companies: (state) => state.companies.companies,
      selectedCompanyName: (state) => state.machines.selectedCompany ? state.machines.selectedCompany.name : '',
      userCompanyName: (state) => state.auth.user.companyName,
      downtimeTableData: (state) => state.devices.downtimeTableData,
      selectedCompany: (state) => state.machines.selectedCompany
    }),
    ...mapState('alarms', ['loadingAlarmsTable', 'alarmTypes', 'alarms']),

    ...mapGetters({
      locationName: 'locations/locationName',
      zoneName: 'zones/zoneName',
      canViewCompanies: 'auth/canViewCompanies'
    }),
    breadcrumbItems() {
      return [
        {
          text: this.userCompanyName,
          disabled: false,
          exact: true,
          to: '/dashboard/analytics'
        }, {
          text: this.locationName(parseInt(this.$route.params.location)),
          disabled: false,
          exact: true,
          to: `/dashboard/analytics/${this.$route.params.location}`
        }, {
          text: this.zoneName(parseInt(this.$route.params.zone)),
          disabled: false,
          exact: true,
          to: `/dashboard/analytics/${this.$route.params.location}/${this.$route.params.zone}`
        }, {
          text: this.deviceConfiguration.plcMachineName,
          disabled: true
        }
      ]
    },
    acsBreadcrumbItems() {
      return [
        {
          text: this.selectedCompanyName,
          disabled: false,
          exact: true,
          to: '/acs-machines'
        }, {
          text: this.locationName(parseInt(this.$route.params.location)),
          disabled: false,
          exact: true,
          to: `/acs-machines/${this.$route.params.location}`
        }, {
          text: this.zoneName(parseInt(this.$route.params.zone)),
          disabled: false,
          exact: true,
          to: `/acs-machines/${this.$route.params.location}/${this.$route.params.zone}`
        }, {
          text: this.deviceConfiguration.plcMachineName,
          disabled: true
        }
      ]
    }
  },

  async mounted() {
    if (this.canViewCompanies) this.initAcsDashboard()

    this.getLocations()
    this.getZones()

    await this.getDeviceConfiguration(this.$route.params.productId)

    this.getDowntimeGraphs()

    if (!this.error) {
      this.getNotes(this.$route.params.productId)
    }
  },

  methods: {
    ...mapActions({
      getDeviceConfiguration: 'devices/getDeviceConfiguration',
      initAcsDashboard: 'machines/initAcsDashboard',
      getLocations: 'locations/getLocations',
      getZones: 'zones/getZones',
      getNotes: 'notes/getNotes',
      getDowntimeGraphData: 'devices/getDowntimeGraphData',
      getDowntimeByTypeGraphSeries: 'devices/getDowntimeByTypeGraphSeries',
      getDowntimeByReasonGraphSeries: 'devices/getDowntimeByReasonGraphSeries'
    }),

    getDowntimeGraphs() {
      const now = new Date().getTime()
      const before7days =  now - 7 * 60 * 60 * 24 * 1000
      const before8Hours = now - 8 * 60 * 60 * 1000

      const params = {
        company_id: this.selectedCompany ? this.selectedCompany.id : 0,
        location_id: this.$route.params.location,
        zone_id: this.$route.params.zone,
        machine_id: this.$route.params.configurationId,
        serial_number: this.$route.params.productId,
        from: before7days,
        to: now
      }

      this.getDowntimeGraphData(params)
      this.getDowntimeByTypeGraphSeries({ ...params, from: before8Hours })
      this.getDowntimeByReasonGraphSeries({ ...params, from: before8Hours })
    }
  }
}
</script>
