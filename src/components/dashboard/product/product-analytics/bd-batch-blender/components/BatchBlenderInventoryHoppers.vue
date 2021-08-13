<template>
  <div>
    <v-card
      height="100%"
      :loading="loadingInventories"
      :disabled="loadingInventories"
    >
      <v-card-title>
        Material Used
        <v-card-title v-if="inventory.last_cleared_time" class="overline">
          Since Cleared On {{ getClearedTime(inventory.last_cleared_time) }}
        </v-card-title>
        <v-btn
          icon
          small
          class="ml-auto"
          @click="$emit('reload')"
        >
          <v-icon>$mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div v-if="inventory.inventories && inventory.inventories.length" class="d-grid grid-cols-2 grid-cols-md-4 gap-2">
          <v-card
            v-for="(inv, i) in inventory.inventories"
            :key="i"
          >
            <div class="overline ml-2">{{ `Hopper ${i + 1}` }}</div>
            <v-card-title class="text--primary">{{ inv }} {{ inventory.unit }}</v-card-title>
          </v-card>
        </div>
        <div v-else class="text-center">
          No Data From Device
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  props: {
    serialNumber: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      userRole: (state) => state.auth.user.role
    }),
    ...mapState('bdBlenderAnalytics', ['loadingInventories', 'inventory'])
  },
  methods: {
    ...mapActions({
      getInventory: 'bdBlenderAnalytics/getInventory'
    }),
    getClearedTime(timestamp) {
      const date = new Date(timestamp)

      return `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US')}`
    }
  }
}
</script>
