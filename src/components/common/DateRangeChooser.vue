<template>
  <div
    :class="{
      'd-flex': horizontalLayout
    }"
  >
    <!-- range options -->
    <v-radio-group v-model="locTimeRangeOption" class="datetime-range-options flex-grow-1">
      <v-radio
        v-for="(item, i) in rangeOptions"
        :key="i"
        :label="item.label"
        :value="item.value"
      ></v-radio>
    </v-radio-group>

    <!-- custom pickers -->
    <v-expand-transition>
      <div v-show="locTimeRangeOption === 'custom'" class="flex-grow-1">
        <div class="d-flex">
          <div class="flex-grow-1">
            <v-menu
              ref="dateFrom"
              v-model="dateFromMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              width="250px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="locDateFrom"
                  label="From Date"
                  prepend-icon="$mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="locDateFrom"
                no-title
                scrollable
                @input="dateFromMenu = false"
              >
              </v-date-picker>
            </v-menu>
            <v-menu
              ref="dateTo"
              v-model="dateToMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              width="250px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="locDateTo"
                  label="To Date"
                  prepend-icon="$mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="locDateTo"
                no-title
                scrollable
                @input="dateToMenu = false"
              >
              </v-date-picker>
            </v-menu>
          </div>
          <div v-if="hasTimePicker" class="flex-grow-1">
            <v-menu
              ref="timeFrom"
              v-model="timeFromMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="locTimeFrom"
              transition="scale-transition"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="locTimeFrom"
                  label="From Time"
                  prepend-icon="$mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="timeFromMenu"
                v-model="locTimeFrom"
                @click:minute="$refs.timeFrom.save(locTimeFrom)"
              ></v-time-picker>
            </v-menu>

            <v-menu
              ref="timeTo"
              v-model="timeToMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="locTimeTo"
              transition="scale-transition"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="locTimeTo"
                  label="To Time"
                  prepend-icon="$mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="timeToMenu"
                v-model="locTimeTo"
                @click:minute="$refs.timeTo.save(locTimeTo)"
              ></v-time-picker>
            </v-menu>
          </div>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
const TODAY = new Date().toISOString().substr(0, 10) // YYYY-MM-DD
const BEFOREEIGHTHOURS = new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString().substr(0, 10) // YYYY-MM-DD

const DATE_PRESET = [{
  label: 'Last 8 hours',
  value: 'last8Hours'
}, {
  label: 'Last 12 hours',
  value: 'last12Hours'
}, {
  label: 'Last 24 hours',
  value: 'last24Hours'
}, {
  label: 'Last 7 days',
  value: 'last7Days'
}, {
  label: 'Custom',
  value: 'custom'
}]

export default {
  props: {
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
          dateFrom: BEFOREEIGHTHOURS,
          dateTo: TODAY,
          timeFrom: '00:00',
          timeTo: '00:00'
        }
      }
    },
    horizontalLayout: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      locTimeRangeOption: this.timeRange.timeRangeOption,
      dateFromMenu: false,
      timeFromMenu: false,
      dateToMenu: false,
      timeToMenu: false,
      locDateFrom: this.timeRange.dateFrom,
      locTimeFrom: this.timeRange.timeFrom,
      locDateTo: this.timeRange.dateTo,
      locTimeTo: this.timeRange.timeTo
    }
  },
  computed: {
    rangeOptions() {
      let options = []

      if (this.timeRangeOptions.length > 0) {
        options = this.timeRangeOptions
      } else {
        options = DATE_PRESET.slice(0)
      }

      return options
    }
  },
  watch: {
    timeRange (newValue) {
      this.locTimeRangeOption = newValue.timeRangeOption
      this.locDateFrom = newValue.dateFrom
      this.locTimeFrom = newValue.timeFrom
      this.locDateTo = newValue.dateTo
      this.locTimeTo = newValue.timeTo
    },
    locTimeRangeOption() { this.onChange() },
    locDateFrom() { this.onChange() },
    locTimeFrom() { this.onChange() },
    locDateTo() { this.onChange() },
    locTimeTo() { this.onChange() }
  },
  methods: {
    getTimes() {
      if (this.locTimeRangeOption !== 'custom') {
        return this.timeFromTo()
      } else {
        const from = new Date(`${this.locDateFrom} ${this.locTimeFrom}`).getTime()
        let to = new Date(`${this.locDateTo} ${this.locTimeTo}`).getTime()

        // validate custom input
        if (this.locTimeRangeOption === 'custom') {
          if (!this.hasTimePicker) {
            const oneDayInMs = (24 * 3600000) - 1

            // add 24 hours
            to = to + oneDayInMs
          }
        }

        return {
          from,
          to
        }
      }
    },
    onChange() {
      const { from, to } = this.getTimes()
      const oneDayInMs = (24 * 3600000) - 1

      // validate custom input
      if (this.locTimeRangeOption === 'custom') {
        const customRange = to - from

        if (customRange < 0) {
          this.$store.dispatch('app/showError', { message: 'Failed: ', error: { message: 'To date must be greater than the From date' } }, { root: true })

          this.locDateTo = this.timeRange.dateTo
          this.locTimeTo = this.timeRange.timeTo

          return
        } else if (this.limitTwoWeeks && customRange > oneDayInMs * 14) {
          this.$store.dispatch('app/showError', { message: 'Failed: ', error: { message: 'Time range selection is limited to two weeks' } }, { root: true })

          this.locDateTo = this.timeRange.dateTo
          this.locTimeTo = this.timeRange.timeTo

          return
        }
      }

      this.$emit('change', {
        timeRangeOption: this.locTimeRangeOption,
        dateFrom: this.locDateFrom,
        dateTo: this.locDateTo,
        timeFrom: this.locTimeFrom,
        timeTo: this.locTimeTo
      })
    },
    timeFromTo() {
      const dateGetTime = new Date().getTime()

      switch (this.locTimeRangeOption) {
      case 'last8Hours':
        return {
          from: dateGetTime - (8 * 60 * 60 * 1000),
          to: dateGetTime
        }
      case 'last12Hours':
        return {
          from: dateGetTime - (12 * 60 * 60 * 1000),
          to: dateGetTime
        }
      case 'last24Hours':
        return {
          from: dateGetTime - (24 * 60 * 60 * 1000),
          to: dateGetTime
        }
      case 'last7Days':
        return {
          from: dateGetTime - (7 * 24 * 60 * 60 * 1000),
          to: dateGetTime
        }
      default:
        return {
          from: dateGetTime - (24 * 60 * 60 * 1000),
          to: dateGetTime
        }
      }
    }
  }
}

</script>

<style lang="scss">
.datetime-range-options {
  .v-input--radio-group__input {
    display: grid;
    grid-template-columns: repeat(2,minmax(0,1fr));
  }
}
</style>
