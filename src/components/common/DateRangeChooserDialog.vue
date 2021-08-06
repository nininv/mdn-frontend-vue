<template>
  <v-dialog :value="dlg" width="400" persistent>
    <v-card>
      <v-card-title class="primary white--text">Time Range</v-card-title>
      <v-card-text>
        <date-range-chooser
          ref="dateRangeChooser"
          :has-time-picker="hasTimePicker"
          :time-range="timeRange"
          :time-range-options="timeRangeOptions"
          :limit-two-weeks="limitTwoWeeks"
          @change="onChange"
        />

        <div class="text-right">
          <v-btn color="primary" text @click="$emit('close')">Cancel</v-btn>
          <v-btn color="primary" @click="apply">Apply</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import DateRangeChooser from './DateRangeChooser.vue'

const TODAY = new Date().toISOString().substr(0, 10) // YYYY-MM-DD
const BEFOREEIGHTHOURS = new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString().substr(0, 10) // YYYY-MM-DD

export default {
  components: {
    DateRangeChooser
  },
  props: {
    dlg: {
      type: Boolean,
      default: false
    },
    hasTimePicker: {
      type: Boolean,
      default: false
    },
    limitTwoWeeks: {
      type: Boolean,
      default: false
    },
    timeRangeOptions: {
      type: Array,
      default: () => []
    },
    timeRange: {
      type: Object,
      default: () => {
        return {
          timeRangeOption: 'last8Hours',
          dateFrom: TODAY,
          dateTo: TODAY,
          timeFrom: '00:00',
          timeTo: '00:00'
        }
      }
    }
  },
  data() {
    return {
      locTimeRangeOption: this.timeRange.timeRangeOption,
      locDateFrom: this.timeRange.dateFrom,
      locTimeFrom: this.timeRange.timeFrom,
      locDateTo: this.timeRange.dateTo,
      locTimeTo: this.timeRange.timeTo
    }
  },
  methods: {
    getTimes() {
      return this.$refs.dateRangeChooser.getTimes()
    },
    onChange(newValue) {
      this.locTimeRangeOption = newValue.timeRangeOption
      this.locDateFrom = newValue.dateFrom
      this.locTimeFrom = newValue.timeFrom
      this.locDateTo = newValue.dateTo
      this.locTimeTo = newValue.timeTo
    },
    dlgBtnClicked() {
      this.$emit('close')
    },
    apply() {
      this.$emit('submit', {
        timeRangeOption: this.locTimeRangeOption,
        dateFrom: this.locDateFrom,
        dateTo: this.locDateTo,
        timeFrom: this.locTimeFrom,
        timeTo: this.locTimeTo
      })
    }
  }
}
</script>
