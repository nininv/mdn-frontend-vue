<template>
  <v-card
    :loading="loadingAlarmsTable"
    :disabled="loadingAlarmsTable"
  >
    <v-card-title color="primary">
      Alarms
      <v-spacer></v-spacer>
      <v-btn
        icon
        small
        class="ml-2"
        @click="open()"
      >
        <v-icon>$mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="tableItems"
        item-key="type_id"
        no-data-text="No current alarms"
      >
        <!-- custom table header -->
        <template v-slot:header.alarm="{ header }">
          <v-icon color="primary">$mdi-message-alert</v-icon>
          {{ header.text }}
        </template>
        <template v-slot:header.createdAt="{ header }">
          <v-icon color="primary" left>$mdi-clock</v-icon>
          <span v-text="header.text"></span>
        </template>

        <!-- custom table row -->
        <template v-slot:item.createdAt="{ item }">
          {{ lastActivated(item) }}
        </template>

        <template v-slot:item.name="{ item }">
          {{ alarmTypeName(item) }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
/*
|---------------------------------------------------------------------
| Product Alarm Card Component
|---------------------------------------------------------------------
|
| Table that lists alarms of a certain product
|
*/
import { mapState, mapGetters, mapActions } from 'vuex'
import Store from './store'
import dynamicStoreMixin from '../dynamicStoreMixin'

export default {
  name: 'AlarmsTable',
  mixins: [dynamicStoreMixin],
  props: {
    namespace: {
      type: String,
      default: ''
    },
    fetch: {
      type: Function,
      default: () => {}
    },
    serialNumber: {
      type: Number,
      default: 0
    },
    machineId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      headers: [
        { text: 'Alarm', align: 'start', value: 'name', sortable: false },
        { text: 'Alarm activated at', align: 'start', value: 'createdAt' },
        { text: '', value: 'data-table-expand' }
      ]
    }
  },
  computed: {
    Store() {
      // dynamic vuex store generators for the mixin
      return Store
    },
    state() {
      return this.$store.state[this.namespace]
    },
    loadingAlarmsTable() {
      return this.state['loadingAlarmsTable']
    },
    alarmTypes() {
      return this.state['alarmTypes']
    },
    alarms() {
      return this.state['alarms']
    },
    tableItems() {
      return this.alarms.filter((alarm) => alarm.active)
    }
  },
  mounted() {
    this.open()
  },
  methods: {
    ...mapActions({
      getProductAlarms(dispatch, payload) {
        return dispatch(this.namespace + '/getProductAlarms', payload)
      }
    }),
    open() {
      this.getProductAlarms({
        serialNumber: this.serialNumber,
        machineId: this.machineId
      })
    },
    alarmTypeName(alarm) {
      const alarmType = this.alarmTypes.find((type) => type.id === alarm.type_id)

      return alarmType ? alarmType.name : ''
    },
    lastActivated(alarm) {
      const date = new Date(alarm.timestamp)
      const isoDate = date.toLocaleString()

      return `${isoDate.split(',')[0]} , ${isoDate.split(',')[1]}`
    }
  }
}
</script>
