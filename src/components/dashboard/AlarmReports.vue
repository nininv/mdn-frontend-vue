<template>
  <v-card
    max-width="900"
    class="mx-auto"
  >
    <v-card-title class="primary white--text">Alarms</v-card-title>
    <v-list
      subheader
      two-line
    >
      <template v-for="(alarm, index) in activeAlarms">
        <v-list-item
          :key="`${alarm.alarmName}${alarm.device_id}`"
        >

          <v-list-item-content>
            <v-list-item-title v-text="alarm.machineName"></v-list-item-title>

            <v-list-item-subtitle class="text--primary" v-text="alarm.deviceData.name"></v-list-item-subtitle>
            <v-list-item-subtitle class="red--text" v-text="alarm.alarmName"></v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon @click="handleClick(alarm)">
                  <v-icon
                    color="primary lighten-1"
                    v-bind="attrs"
                    v-on="on"
                  >$mdi-eye</v-icon>
                </v-btn>
              </template>
              <span>See Machine Details</span>
            </v-tooltip>
          </v-list-item-action>

        </v-list-item>
        <v-divider
          v-if="index < activeAlarms.length - 1"
          :key="index"
        ></v-divider>
      </template>
    </v-list>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$emit('close')">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    activeAlarms: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    handleClick(item) {
      if (item.deviceData.location_id && item.deviceData.zone_id) {
        this.$router.push({
          name: 'dashboard-product',
          params: {
            location: item.deviceData.location_id,
            zone: item.deviceData.zone_id,
            configurationId: item.machine_id,
            productId: item.device_id
          }
        })
      } else {
        this.$router.push({
          name: 'product-details',
          params: {
            configurationId: item.machine_id,
            productId: item.device_id
          }
        })
      }

      this.$emit('close')
    }
  }
}
</script>
