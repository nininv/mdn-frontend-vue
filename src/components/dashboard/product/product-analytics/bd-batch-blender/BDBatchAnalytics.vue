<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="4">
        <overview
          namespace="overview-id1"
          :machine-id="machineId"
          :serial-number="serialNumber"
          :fetch="getOverview"
        >
        </overview>
      </v-col>
      <v-col v-if="parameters.includes(1)" cols="12" md="4">
        <area-graph
          namespace="areaGraph-dbBlender-utilization"
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
      <v-col v-if="parameters.includes(5)" cols="12" md="4">
        <batch-blender-recipe
          :loading="loadingRecipe"
          :recipes="recipeValues"
          :ez-types="ezTypes"
          :mode="recipeMode"
          @reload="getRecipe({ serialNumber })"
        >
        </batch-blender-recipe>
      </v-col>
      <v-col v-if="parameters.includes(3)" cols="12" md="8">
        <batch-blender-weight
          :machine-id="machineId"
          :serial-number="serialNumber"
        >
        </batch-blender-weight>
      </v-col>
      <v-col v-if="parameters.includes(3)" cols="12" md="4">
        <batch-blender-standard-deviation>
        </batch-blender-standard-deviation>
      </v-col>
      <v-col v-if="parameters.includes(4)" cols="12">
        <batch-blender-inventory-hoppers
          :serial-number="serialNumber"
          @reload="getInventory({ serialNumber })"
        >
        </batch-blender-inventory-hoppers>
      </v-col>
      <v-col v-if="parameters.includes(4)" cols="12">
        <batch-blender-inventory-reports
          :serial-number="serialNumber"
          @reload="getInventory({ serialNumber })"
        >
        </batch-blender-inventory-reports>
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
    </v-row>
  </div>
</template>
<script>
import api from './services/api'
import commonApi from '../../common/fetches/api'

import BarGraph from '../../common/bar-graph/ProductBarGraph'
import AreaGraph from '../../common/area-graph/ProductAreaGraph'
import Overview from '../../common/overview/ProductOverview'
import BatchBlenderRecipe from './components/BatchBlenderRecipe'
import BatchBlenderInventoryReports from './components/BatchBlenderInventoryReports'
import BatchBlenderInventoryHoppers from './components/BatchBlenderInventoryHoppers'
import BatchBlenderWeight from './components/BatchBlenderWeight'
import BatchBlenderStandardDeviation from './components/BatchBlenderStandardDeviation'
import DowntimeCard from '../../../DowntimeCard'
import DowntimeByTypeCard from '../../../DowntimeByTypeCardForProduct'
import DowntimeByReasonCard from '../../../DowntimeByReasonCard'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    AreaGraph,
    Overview,
    BatchBlenderRecipe,
    BatchBlenderInventoryReports,
    BatchBlenderInventoryHoppers,
    BatchBlenderWeight,
    BatchBlenderStandardDeviation,
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
      getWeight: api.getWeight,
      getOverview: commonApi.getOverview,
      getUtilization: commonApi.getUtilization
    }
  },
  computed: {
    ...mapState('bdBlenderAnalytics', [
      'loadingRecipe',
      'recipeValues',
      'ezTypes',
      'recipeMode'
    ])
  },
  mounted() {
    this.getRecipe({ serialNumber: this.serialNumber })
  },
  methods: {
    ...mapActions('bdBlenderAnalytics', [
      'getRecipe',
      'getInventory'
    ])
  }
}
</script>
