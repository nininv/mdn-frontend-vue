<template>
  <v-dialog :value="dlg" width="600" persistent>
    <v-card>
      <v-card-title class="primary white--text">Select Options</v-card-title>
      <v-card-text>
        <v-autocomplete
          v-model="locSelectedTags"
          chips
          dense
          multiple
          rounded
          small-chips
          solo
          :items="groupedTags"
          placeholder="Tags"
          item-text="name"
          item-value="id"
          :return-object="true"
          class="my-2"
        >
        </v-autocomplete>

        <date-range-chooser
          :time-range="locTimeRange"
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
import { mapState, mapGetters } from 'vuex'
import DateRangeChooser from '../common/DateRangeChooser.vue'

const TODAY = new Date().toISOString().substr(0, 10) // YYYY-MM-DD

export default {
  components: {
    DateRangeChooser
  },
  props: {
    dlg: {
      type: Boolean,
      default: false
    },
    timeRange: {
      type: Object,
      default: () => {
        return {
          timeRangeOption: 'last8Hours',
          dates: []
        }
      }
    },
    selectedTags: {
      type: Array,
      default: () => []
    },
    tags: {
      type: Array,
      default: () => []
    },
    noAlarms: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      locTimeRangeOption: this.timeRange.timeRangeOption,
      locDateFrom: this.timeRange.dateFrom,
      locDateTo: this.timeRange.dateTo,
      dates: this.timeRange.dates,
      locSelectedTags: this.selectedTags,
      locTimeRange: this.timeRange
    }
  },
  computed: {
    ...mapGetters('machines', ['timeRangeFromTo']),
    groupedTags() {
      if (this.noAlarms) {
        return this.tags
      } else {
        const ts = [...this.tags]
        const importantTags = this.tags.filter((t) => t.divided_by)

        ts.splice(importantTags.length, 0, { divider: true })
        ts.splice(importantTags.length + 1, 0, { header: 'Alarms' })

        return ts
      }

    }
  },
  watch: {
    selectedTags(newValue) {
      this.locSelectedTags = newValue
    },
    timeRange (newValue) {
      this.locTimeRangeOption = newValue.timeRangeOption

      this.locTimeRange = {
        timeRangeOption: newValue.timeRangeOption,
        dateFrom: newValue.dateFrom,
        dateTo: newValue.dateTo
      }
    },
    locTimeRangeOption (newValue) {
      if (newValue !== 'custom') {
        const tR = {
          timeRangeOption: newValue,
          dates: [TODAY, TODAY]
        }

        this.locDateFrom = new Date(this.timeRangeFromTo(tR).from).toISOString().substr(0, 10)
        this.locDateTo = new Date(this.timeRangeFromTo(tR).to).toISOString().substr(0, 10)
      }
    },
    locSelectedTags (newValue) {
      if (this.locSelectedTags.length > 6) {
        this.locSelectedTags.pop()

        this.$store.dispatch('app/showError', { message: 'Alert: ', error: { message: 'Max 6 options selected' } }, { root: true })
      }
    }
  },
  methods: {
    onChange(newValue) {
      this.locTimeRangeOption = newValue.timeRangeOption
      this.locDateFrom = newValue.dateFrom
      this.locDateTo = newValue.dateTo
    },
    dlgBtnClicked() {
      this.$emit('close')
    },
    apply() {
      this.$emit('submit', {
        timeRange: {
          timeRangeOption: this.locTimeRangeOption,
          dateFrom: this.locDateFrom,
          dateTo: this.locDateTo
        },
        selectedTags: this.locSelectedTags
      })
    }
  }
}
</script>
<style>
  #picker2 .v-picker__title {
    display: none
  }

  .v-autocomplete:not(.v-input--is-focused).v-select--chips input {
    max-height: 25px !important
  }
</style>
