<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="4">
        <overview
          namespace="overview-id4"
          :machine-id="machineId"
          :serial-number="serialNumber"
          :fetch="getOverview"
        >
        </overview>
      </v-col>
      <v-col v-if="parameters.includes(1)" cols="12" md="4">
        <area-graph
          namespace="areaGraph-gh-f-utilization"
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
    </v-row>

    <downtime-section
      :show-history="parameters.includes(20)"
      :show-by-reason="parameters.includes(21)"
    ></downtime-section>
  </div>
</template>
<script>
import commonApi from '../../common/fetches/api'

import AreaGraph from '../../common/area-graph/ProductAreaGraph'
import Overview from '../../common/overview/ProductOverview'
import DowntimeSection from '../../../DowntimeSection'

import { mapState, mapActions } from 'vuex'

export default {
  components: {
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
      getOverview: commonApi.getOverview,
      getUtilization: commonApi.getUtilization
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
