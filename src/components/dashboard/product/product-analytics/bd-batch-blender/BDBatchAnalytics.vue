<template>
  <div>
    <div class="d-grid grid-cols-1 grid-cols-md-2 grid-cols-lg-3 gap-2">
      <overview
        namespace="overview-id1"
        :machine-id="machineId"
        :serial-number="serialNumber"
        :fetch="getOverview"
      >
      </overview>
      <area-graph
        v-if="parameters.includes(1)"
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
      <batch-blender-recipe
        v-if="parameters.includes(5)"
        :loading="loadingRecipe"
        :recipes="recipeValues"
        :ez-types="ezTypes"
        :mode="recipeMode"
        @reload="getRecipe({ serialNumber })"
      >
      </batch-blender-recipe>
      <batch-blender-weight
        v-if="parameters.includes(3)"
        class="col-span-md-2"
        :machine-id="machineId"
        :serial-number="serialNumber"
      >
      </batch-blender-weight>
      <batch-blender-standard-deviation v-if="parameters.includes(3)">
      </batch-blender-standard-deviation>
      <batch-blender-inventory-hoppers
        v-if="parameters.includes(4)"
        class="col-span-md-3"
        :serial-number="serialNumber"
        @reload="getInventory({ serialNumber })"
      >
      </batch-blender-inventory-hoppers>
      <batch-blender-inventory-reports
        v-if="parameters.includes(4)"
        class="col-span-md-3"
        :serial-number="serialNumber"
        @reload="getInventory({ serialNumber })"
      >
      </batch-blender-inventory-reports>
    </div>

    <downtime-section
      :show-history="parameters.includes(20)"
      :show-by-reason="parameters.includes(21)"
    ></downtime-section>
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
import DowntimeSection from '../../../DowntimeSection'

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
    DowntimeSection
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
