<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="4">
        <overview
          namespace="overview-id5"
          :machine-id="machineId"
          :serial-number="serialNumber"
          :fetch="getOverview"
        >
        </overview>
      </v-col>
      <v-col v-if="parameters.includes(1)" cols="12" md="4">
        <area-graph
          namespace="areaGraph-vtc-utilization"
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
      <v-col v-if="parameters.includes(3)" cols="12" md="6">
        <bar-graph
          namespace="barGraph-vtc-id1"
          title="Pump Hours"
          :height="500"
          :fetch="getPumpHours"
          unit="h"
          :machine-id="machineId"
          :serial-number="serialNumber"
          :categories="pumpHoursOilCategories"
        >
        </bar-graph>
      </v-col>
      <v-col v-if="parameters.includes(4)" cols="12" md="6">
        <bar-graph
          namespace="barGraph-vtc-id2"
          title="Pump Hours Oil Change"
          :height="500"
          :fetch="getPumpHoursOil"
          unit="h"
          :names="['Actual', 'Target']"
          :machine-id="machineId"
          :serial-number="serialNumber"
          :categories="pumpHoursOilCategories"
        >
        </bar-graph>
      </v-col>
      <v-col v-if="parameters.includes(5)" cols="12" md="6">
        <bar-graph
          namespace="barGraph-vtc-id3"
          title="Online Life"
          :height="500"
          :fetch="getPumpOnlineLife"
          unit="%"
          :machine-id="machineId"
          :serial-number="serialNumber"
          :categories="pumpHoursOilCategories"
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
import api from './services/api'
import commonApi from '../../common/fetches/api'

import BarGraph from '../../common/bar-graph/ProductBarGraph'
import AreaGraph from '../../common/area-graph/ProductAreaGraph'
import Overview from '../../common/overview/ProductOverview'
import DowntimeCard from '../../../DowntimeCard'
import DowntimeByTypeCard from '../../../DowntimeByTypeCardForProduct'
import DowntimeByReasonCard from '../../../DowntimeByReasonCard'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    BarGraph,
    AreaGraph,
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
      getPumpHours: api.getPumpHours,
      getPumpHoursOil: api.getPumpHoursOil,
      getPumpOnlineLife: api.getPumpOnlineLife,
      getOverview: commonApi.getOverview,
      getUtilization: commonApi.getUtilization
    }
  },
  computed: {
    pumpHoursOilCategories() {
      return ['Pump 1', 'Pump 2', 'Pump 3', 'Pump 4', 'Pump 5', 'Pump 6', 'Pump 7', 'Pump 8', 'Pump 9', 'Pump 10', 'Pump 11', 'Pump 12']
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
