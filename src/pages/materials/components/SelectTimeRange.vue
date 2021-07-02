<template>
  <div>
    <v-card-title>{{ getLocationName() }}</v-card-title>
    <date-range-chooser
      show-short-intervals
      :time-range="timeRange"
      @change="onChange"
    />
    <v-card>
      <v-card-title class="pb-0">Date and Time</v-card-title>
      <v-card-text class="mt-0">Select Date and Time for the report</v-card-text>
      <v-divider></v-divider>
      <div class="mt-2 pb-3 text-right">
        <v-btn color="grey lighten-2" depressed @click="$emit('cancel')">Back</v-btn>
        <v-btn class="ml-2" depressed color="primary" @click="handleNext">Next Step</v-btn>
      </div>
    </v-card>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import DateRangeChooser from '@/components/common/DateRangeChooser.vue'

const TODAY = new Date().toISOString().substr(0, 10) // YYYY-MM-DD

export default {
  components: {
    DateRangeChooser
  },
  props: {
    selectedTags: {
      type: Object,
      default: () => {}
    },
    locationId:{
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      timeRange: {
        timeRangeOption: 'last24Hours',
        dateFrom: TODAY,
        dateTo: TODAY,
        timeFrom: '00:00',
        timeTo: '00:00'
      }
    }
  },
  computed: {
    ...mapState({
      locations: (state) => state.locations.data
    })
  },
  methods: {
    onChange(newValue) {
      this.timeRange = newValue
    },
    handleNext() {
      this.$emit('setSelectedTimeRange', this.timeRange)
    },
    getLocationName() {
      const location = this.locations.find((location) => {
        return location.id === this.locationId
      })

      return location ? location.name : ''
    }
  }
}
</script>
