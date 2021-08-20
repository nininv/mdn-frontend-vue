<template>
  <div v-if="showHistory || showByReason">
    <div class="title mb-2 mt-4">Downtime Data</div>
    <div class="d-grid grid-cols-1 grid-cols-md-3 gap-2">
      <downtime-card v-if="showHistory"></downtime-card>
      <downtime-by-type-card v-if="showByReason"></downtime-by-type-card>
      <downtime-by-reason-card v-if="showByReason"></downtime-by-reason-card>
    </div>
  </div>
</template>

<script>
import DowntimeCard from './DowntimeCard'
import DowntimeByTypeCard from './DowntimeByTypeCardForProduct'
import DowntimeByReasonCard from './DowntimeByReasonCard'

export default {
  components: {
    DowntimeCard,
    DowntimeByTypeCard,
    DowntimeByReasonCard
  },
  props: {
    showHistory: {
      type: Boolean,
      default: false
    },
    showByReason: {
      type: Boolean,
      default: false
    }
  }
}
</script>
