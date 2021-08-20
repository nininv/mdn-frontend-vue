<template>
  <div>
    <div class="d-grid grid-cols-1 grid-cols-md-2 grid-cols-lg-3 gap-2">
      <overview
        namespace="overview-id6"
        :machine-id="machineId"
        :serial-number="serialNumber"
        :fetch="getOverview"
      >
      </overview>
      <area-graph
        v-if="parameters.includes(1)"
        namespace="areaGraph-ngxDryer-utilization"
        title="Capacity Utilization"
        :height="220"
        unit="%"
        :fetch="getUtilization"
        :machine-id="machineId"
        :serial-number="serialNumber"
        :names="['Utilization']"
      >
      </area-graph>
      <drying-hopper-states
        v-if="parameters.includes(3)"
        :loading="loadingDryingHoppers"
        :drying-hoppers="dryingHoppers"
      >
      </drying-hopper-states>
      <bar-graph
        v-if="parameters.includes(4)"
        class="col-span-md-1"
        namespace="barGraph-ngxDryer-id1"
        title="Hopper Air Temperatures"
        :height="320"
        :fetch="getHopperTemperatures"
        :machine-id="machineId"
        :serial-number="serialNumber"
        :options="temperatureOptions"
        :names="['Process', 'Process Set Point', 'Outlet']"
        :categories="hopperAirTemperatureCategories"
      >
      </bar-graph>
      <area-graph
        class="col-span-md-2"
        namespace="areaGraph-ngxDryer-dew-temperature"
        title="Dew Point Temperature"
        :height="220"
        unit="ºC"
        :fetch="getDewPointTemperature"
        :machine-id="machineId"
        :serial-number="serialNumber"
        :names="['Dew Point Temperature']"
      >
      </area-graph>
      <area-graph
        class="col-span-md-3"
        namespace="areaGraph-ngxDryer-region-temperature"
        title="Regen Temperatures"
        :height="220"
        unit="ºC"
        :fetch="getRegionAirTemperature"
        :machine-id="machineId"
        :serial-number="serialNumber"
      >
      </area-graph>
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
import DryingHopperStates from './components/NgxDryerDryingHopperStates'
import DowntimeSection from '../../../DowntimeSection'

import { mapState, mapActions } from 'vuex'

export default {
  components: {
    BarGraph,
    AreaGraph,
    Overview,
    DryingHopperStates,
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
      getHopperTemperatures: api.getHopperTemperatures,
      getDewPointTemperature: api.getDewPointTemperature,
      getRegionAirTemperature: api.getRegionAirTemperature,
      getOverview: commonApi.getOverview,
      getUtilization: commonApi.getUtilization,
      getEnergyConsumption: commonApi.getEnergyConsumption,

      temperatureOptions: {
        plotOptions: {
          bar: {
            horizontal: true,
            columnWidth: '10%',
            dataLabels: {
              position: 'top'
            },
            space: 0.25,
            endingShape: 'rounded'
          }
        },
        stroke: {
          show: true,
          width: 6,
          colors: ['#fff']
        }
      }
    }
  },
  computed: {
    ...mapState('ngxDryer', [
      'dryingHoppers',
      'loadingDryingHoppers'
    ]),
    hopperAirTemperatureCategories() {
      return ['Hopper 1', 'Hopper 2', 'Hopper 3']
    }
  },
  mounted() {
    this.getDryingHopperStats({ serialNumber: this.serialNumber, machineId: this.machineId })
  },
  methods: {
    ...mapActions('ngxDryer', [
      'getDryingHopperStats'
    ])
  }
}
</script>
