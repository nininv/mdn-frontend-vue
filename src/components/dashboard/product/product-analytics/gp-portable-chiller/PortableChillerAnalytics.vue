<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="4">
        <overview
          namespace="overview-id9"
          :machine-id="machineId"
          :serial-number="serialNumber"
          :fetch="getOverview"
        >
        </overview>
      </v-col>
      <v-col v-if="parameters.includes(1)" cols="12" md="4">
        <area-graph
          namespace="areaGraph-gpPortable-utilization"
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
      <v-col v-if="parameters.includes(3)" cols="12" md="4">
        <bar-graph
          namespace="barGraph-portableChiller-id1"
          title="Process out temperature"
          :height="220"
          unit="ºC"
          :fetch="getProcessOutTemperature"
          :machine-id="machineId"
          :serial-number="serialNumber"
          :categories="['Chiller set point', 'Chiller out temperature']"
          :options="temperatureOptions"
        >
        </bar-graph>
      </v-col>
      <v-col v-if="parameters.includes(20) || parameters.includes(21)" cols="12">
        <v-card-title>
          Downtime Data
        </v-card-title>
        <v-row class="flex-grow-0" dense>
          <v-col v-if="parameters.includes(20)" md="4" sm="12">
            <downtime-card></downtime-card>
          </v-col>
          <v-col v-if="parameters.includes(21)" md="4" sm="12">
            <downtime-by-type-card></downtime-by-type-card>
          </v-col>
          <v-col v-if="parameters.includes(21)" md="4" sm="12">
            <downtime-by-reason-card></downtime-by-reason-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import commonApi from '../../common/fetches/api'
import api from './services/api'

import AreaGraph from '../../common/area-graph/ProductAreaGraph'
import BarGraph from '../../common/bar-graph/ProductBarGraph'
import Overview from '../../common/overview/ProductOverview'
import DowntimeCard from '../../../DowntimeCard'
import DowntimeByTypeCard from '../../../DowntimeByTypeCardForProduct'
import DowntimeByReasonCard from '../../../DowntimeByReasonCard'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    AreaGraph,
    BarGraph,
    Overview,
    DowntimeCard,
    DowntimeByTypeCard,
    DowntimeByReasonCard
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
      getProcessOutTemperature: api.getProcessOutTemperature,

      temperatureOptions: {
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
          categories: ['Chiller set point', 'Chiller out temperature'],
          labels: {
            show: false
          }
        }
      }
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  }
}
</script>
