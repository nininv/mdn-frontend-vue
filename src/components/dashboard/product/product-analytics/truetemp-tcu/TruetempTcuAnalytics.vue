<template>
  <div>
    <div class="d-grid grid-cols-1 grid-cols-md-2 gap-2">
      <overview
        namespace="overview-id11"
        :machine-id="machineId"
        :serial-number="serialNumber"
        :fetch="getOverview"
      >
      </overview>
      <area-graph
        v-if="parameters.includes(3)"
        namespace="areaGraph-trueTemp-utilization"
        title="Capacity Utilization"
        :height="220"
        unit="%"
        :fetch="getUtilization"
        :machine-id="machineId"
        :serial-number="serialNumber"
        :names="['Utilization']"
      >
      </area-graph>
      <machine-state
        v-if="parameters.includes(1)"
        :loading="loadingMachineState"
        :machine="machineState"
      ></machine-state>
      <bar-graph
        v-if="parameters.includes(2)"
        namespace="barGraph-id1"
        title="TCU Temperature"
        :height="320"
        unit="ºC"
        :fetch="getActTgtTemperatures"
        :machine-id="machineId"
        :serial-number="serialNumber"
        :categories="['Actual Delivery Temperature', 'Actual Return Temperature', 'Target Setpoint 1']"
        :options="temperatureOptions"
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
import MachineState from './components/TruetempTcuMachineState'
import DowntimeSection from '../../../DowntimeSection'

import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  components: {
    Overview,
    MachineState,
    BarGraph,
    AreaGraph,
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
      temperatureOptions: {
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '40%',
            dataLabels: {
              position: 'top'
            },
            distributed: true,
            space: 0.25,
            endingShape: 'rounded'
          }
        },
        colors: [this.$vuetify.theme.themes.light.primary, this.$vuetify.theme.themes.light.secondary, this.$vuetify.theme.themes.light.error],
        fill: {
          colors: [this.$vuetify.theme.themes.light.primary, this.$vuetify.theme.themes.light.secondary, this.$vuetify.theme.themes.light.error]
        },
        xaxis: {
          categories: ['Actual Delivery Temperature', 'Actual Return Temperature', 'Target Setpoint 1'],
          labels: {
            show: false
          }
        }
      },
      getActTgtTemperatures: api.getActTgtTemperatures,
      getUtilization: commonApi.getUtilization
    }
  },
  computed: {
    ...mapState({
      loadingMachineState: (state) => state.truetempTcu.loadingMachineState,
      machineState: (state) => state.truetempTcu.machineState
    })
  },
  mounted() {
    this.getSystemStates({
      machineId: this.machineId,
      serialNumber: this.serialNumber
    })
  },
  methods: {
    ...mapActions({
      getSystemStates: 'truetempTcu/getSystemStates'
    })
  }
}
</script>
