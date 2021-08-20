<template>
  <div>
    <div class="d-grid grid-cols-1 grid-cols-md-2 grid-cols-lg-4 gap-2">
      <overview
        namespace="overview-id5"
        :machine-id="machineId"
        :serial-number="serialNumber"
        :fetch="getOverview"
      >
      </overview>
      <area-graph
        v-if="parameters.includes(1)"
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
      <bar-graph
        v-if="parameters.includes(3)"
        class="col-span-md-2"
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
      <bar-graph
        v-if="parameters.includes(4)"
        class="col-span-md-2"
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
      <bar-graph
        v-if="parameters.includes(5)"
        class="col-span-md-2"
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
import DowntimeSection from '../../../DowntimeSection'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    BarGraph,
    AreaGraph,
    Overview,
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
