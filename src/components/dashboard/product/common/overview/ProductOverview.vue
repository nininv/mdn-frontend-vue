<template>
  <div>
    <v-card
      height="100%"
      :loading="isLoading"
      :disabled="isLoading"
    >
      <template v-if="overview.machineId !== 11">
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline">
              {{ overview.teltonikaDevice && overview.teltonikaDevice.customer_assigned_name }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-avatar class="mt-3" color="grey lighten-3">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  :loading="isSaveMachineLoading"
                  v-bind="attrs"
                  v-on="on"
                  @click="saveMachine({ deviceId: overview.teltonikaDevice.id })"
                >
                  <v-icon :color="isSavedMachine ? 'primary' : 'grey'">$mdi-star</v-icon>
                </v-btn>
              </template>
              <span>{{ isSavedMachine ? 'Remove from Favorites' : 'Add to Favorites' }}</span>
            </v-tooltip>
          </v-list-item-avatar>
        </v-list-item>

        <v-card-subtitle>
          <div v-if="overview.teltonikaDevice">{{ overview.teltonikaDevice.name }}</div>
          <div>{{ overview.machineName }}</div>
          <v-chip color="grey lighten-4" dense>
            <v-tooltip v-for="(status, index) in overview.status" :key="index" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-avatar
                  class="ml-0 mr-0"
                  v-bind="attrs"
                  :color="getColor(status)"
                  v-on="on"
                >
                  <v-icon
                    small
                  >
                    {{ getIcon(status) }}
                  </v-icon>
                </v-avatar>
              </template>
              <span>{{ getText(status) }}</span>
            </v-tooltip>
          </v-chip>
        </v-card-subtitle>
        <v-img
          height="150"
          contain
          :src="machineImage"
        ></v-img>
        <v-card-text>
          <div class="ml-2">
            <div>PLC Software Version: <small>{{ overview.version }}</small></div>
            <div>PLC Software Build: <small>{{ overview.software_build }}</small></div>
            <div>Serial Number: <small>{{ overview.serial }}</small></div>
          </div>
          <div class="mt-2">
            <v-card-actions>
              <v-btn color="primary" block @click="requestDialog = true">
                Request Service
              </v-btn>
            </v-card-actions>
          </div>
        </v-card-text>
      </template>
      <template v-else>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline">
              {{ overview.teltonikaDevice && overview.teltonikaDevice.customer_assigned_name }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-avatar class="mt-3" color="grey lighten-3">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  :loading="isSaveMachineLoading"
                  v-bind="attrs"
                  v-on="on"
                  @click="saveMachine({ deviceId: overview.teltonikaDevice.id })"
                >
                  <v-icon :color="isSavedMachine ? 'primary' : 'grey'">$mdi-star</v-icon>
                </v-btn>
              </template>
              <span>{{ isSavedMachine ? 'Remove from Favorites' : 'Add to Favorites' }}</span>
            </v-tooltip>
          </v-list-item-avatar>
        </v-list-item>
        <v-card-title>{{ overview.machineName }}</v-card-title>
        <v-img
          height="150"
          contain
          :src="machineImage"
        ></v-img>
        <v-card-text>
          <div class="ml-2">
            <div>PLC Software Version: <small>{{ overview.version }}</small></div>
          </div>
          <div class="mt-2">
            <v-card-actions>
              <v-btn color="primary" disabled block @click="requestDialog = true">
                Request Service
              </v-btn>
            </v-card-actions>
          </div>
        </v-card-text>
      </template>
    </v-card>
    <v-dialog v-model="requestDialog" max-width="500">
      <v-card>
        <v-card-text class="text-center">
          <v-avatar class="text-center mt-5" color="grey lighten-2" size="100">
            <v-icon color="primary" x-large>$mdi-cog</v-icon>
          </v-avatar>
        </v-card-text>
        <v-card-title class="mt-1 headline justify-center">You just requested a service request.</v-card-title>
        <v-card-text class="pb-0 text-center">Are you sure you want to place a service request?</v-card-text>
        <div class="mt-2 pb-3 text-center">
          <v-btn color="grey lighten-2" depressed @click="requestDialog = false">Cancel</v-btn>
          <v-btn class="ml-2" depressed color="primary" @click="handleRequestService">Confirm</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Store from './store'
import dynamicStoreMixin from '../dynamicStoreMixin'

export default {
  name: 'Overview',
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
    machineId: {
      type: Number,
      default: 0
    },
    serialNumber: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      requestDialog: false,
      deviceStatus: {
        machineRunning: {
          color: 'green',
          text: 'Machine Running',
          icon: '$mdi-check-circle-outline'
        },
        routerNotConnected: {
          color: 'yellow',
          text: 'Router No Communication',
          icon: '$mdi-wifi-off'
        },
        machineStopped: {
          color: 'grey',
          text: 'Machine Stopped',
          icon: '$mdi-block-helper'
        },
        machineIdle: {
          color: 'grey',
          text: 'Machine Idle - No Demand',
          icon: '$mdi-block-helper'
        },
        machineStoppedActiveAlarm: {
          color: 'red',
          text: 'Machine Stopped - Active Alarm',
          icon: '$mdi-block-helper'
        },
        machineRunningAlert: {
          color: 'yellow',
          text: 'Machine Running - Alert',
          icon: '$mdi-alert-outline'
        },
        plcNotConnected: {
          color: 'red',
          text: 'PLC No Communication',
          icon: '$mdi-database-remove'
        },
        machineRunningThreshold: {
          color: 'red',
          text: 'Machine Running - Threshold Alert',
          icon: '$mdi-alert-outline'
        }
      }
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user
    }),
    Store() {
      // dynamic vuex store generators for the mixin
      return Store
    },
    state() {
      return this.$store.state[this.namespace]
    },
    isLoading() {
      return this.state['isLoading']
    },
    overview() {
      return this.state['overview']
    },
    machineImage() {
      return this.overview.machineId ? require(`@/assets/imgs/${this.overview.machineId}.png`) : ''
    },
    isSavedMachine() {
      return this.state['isSavedMachine']
    },
    isSaveMachineLoading() {
      return this.state['isSaveMachineLoading']
    }
  },
  mounted() {
    this.getOverview({
      machineId: this.machineId,
      serialNumber: this.serialNumber
    })
  },
  methods: {
    ...mapActions({
      getOverview(dispatch, payload) {
        return dispatch(this.namespace + '/getOverview', payload)
      },
      requestService: 'machines/requestService',
      saveMachine(dispatch, payload) {
        return dispatch(this.namespace + '/saveMachine', payload)
      }
    }),
    handleRequestService() {
      const sendEmail = process.env.VUE_APP_SERVICE_REQUEST_SEND_EMAIL

      this.requestDialog = false
      const data = {
        email: sendEmail,
        user: this.user,
        overview: this.overview
      }

      this.requestService(data)
    },
    getIcon(item) {
      return this.deviceStatus[item] ? this.deviceStatus[item].icon : ''
    },
    getText(item) {
      return this.deviceStatus[item] ? this.deviceStatus[item].text : ''
    },
    getColor(item) {
      return this.deviceStatus[item] ? this.deviceStatus[item].color : ''
    }
  }
}
</script>
