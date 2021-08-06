<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="4">
        <overview
          namespace="overview-id8"
          :machine-id="machineId"
          :serial-number="serialNumber"
          :fetch="getOverview"
        >
        </overview>
      </v-col>
      <v-col v-if="parameters.includes(1)" cols="12" md="4">
        <area-graph
          namespace="areaGraph-t50-utilization"
          title="Capacity Utilization"
          :height="220"
          unit="%"
          :fetch="getUtilization"
          :machine-id="machineId"
          :serial-number="serialNumber"
          :names="['Utilization']"
        >
        </area-graph>
      </v-col>
      <v-col cols="12" md="4">
        <t50-running
          :loading="loadingT50Runnings"
          :states="t50Runnings"
        >
        </t50-running>
      </v-col>
      <v-col cols="12" md="4">
        <t50-hours
          :loading="loadingT50Hours"
          :hours="t50Hours"
        >
        </t50-hours>
      </v-col>
      <v-col cols="12" md="4">
        <bar-graph
          namespace="barGraph-t50-id1"
          title="Bearing Temperature"
          :height="320"
          unit="ºC"
          :fetch="getT50BearingTemp"
          :options="tempOptions"
          :machine-id="machineId"
          :serial-number="serialNumber"
          :categories="['Bearing Temp 1', 'Bearing Temp 2']"
        >
        </bar-graph>
      </v-col>
      <v-col v-if="parameters.includes(20) || parameters.includes(21)" cols="12">
        <v-card-title>
          Downtime Data
        </v-card-title>
        <v-row class="flex-grow-0" dense>
          <v-col v-if="parameters.includes(20)" cols="12" md="4">
            <downtime-card></downtime-card>
          </v-col>
          <v-col v-if="parameters.includes(21)" cols="12" md="4">
            <downtime-by-type-card></downtime-by-type-card>
          </v-col>
          <v-col v-if="parameters.includes(21)" cols="12" md="4">
            <downtime-by-reason-card></downtime-by-reason-card>
          </v-col>
        </v-row>
      </v-col>
      <!-- <v-col cols="12" md="4">
        <t50-amp
          :loading="loadingT50Amps"
          :amps="t50Amps"
        >
        </t50-amp>
      </v-col> -->
    </v-row>
  </div>
</template>
<script>
import commonApi from '../../common/fetches/api'
import api from './services/api'

import AreaGraph from '../../common/area-graph/ProductAreaGraph'
import BarGraph from '../../common/bar-graph/ProductBarGraph'
import Overview from '../../common/overview/ProductOverview'
import T50Running from './components/T50Running'
import T50Hours from './components/T50Hours'
import DowntimeCard from '../../../DowntimeCard'
import DowntimeByTypeCard from '../../../DowntimeByTypeCardForProduct'
import DowntimeByReasonCard from '../../../DowntimeByReasonCard'
// import T50Amp from './components/T50Amp'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    AreaGraph,
    BarGraph,
    Overview,
    T50Running,
    T50Hours,
    DowntimeCard,
    DowntimeByTypeCard,
    DowntimeByReasonCard
    // T50Amp
  },
  props: {
    machineId: {
      type: Number,
      default: 0
    },
    serialNumber: {
      type: Number,
      default: 0
    },
    parameters: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      getOverview: commonApi.getOverview,
      getUtilization: commonApi.getUtilization,
      getT50BearingTemp: api.getT50BearingTemp,
      tempOptions: {
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '30%',
            dataLabels: {
              position: 'top'
            },
            distributed: true,
            space: 0.25,
            endingShape: 'rounded'
          }
        },
        colors: [this.$vuetify.theme.themes.light.primary, this.$vuetify.theme.themes.light.secondary],
        fill: {
          colors: [this.$vuetify.theme.themes.light.primary, this.$vuetify.theme.themes.light.secondary]
        },
        xaxis: {
          categories: ['Bearing Temp 1', 'Bearing Temp 2'],
          labels: {
            show: false
          }
        },
        yaxis: [
          {
            labels: {
              formatter: function(val) {
                return val.toFixed(2)
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapState('t50', [
      'loadingT50Runnings',
      'loadingT50Hours',
      'loadingT50Amps',
      't50Runnings',
      't50Hours',
      't50Amps'
    ])
  },
  mounted() {
    this.getRunnings({ serialNumber: this.serialNumber })
    this.getHours({ serialNumber: this.serialNumber })
    // this.getAmps({ serialNumber: this.serialNumber })
  },
  methods: {
    ...mapActions('t50', [
      'getRunnings',
      'getHours',
      'getAmps'
    ])
  }
}
</script>
