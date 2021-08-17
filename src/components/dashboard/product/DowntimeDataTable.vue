<template>
  <v-card
    id="device-downtime"
    :loading="isDowntimeTableLoading"
    :disabled="isDowntimeTableLoading"
  >
    <v-card-title>
      Device Downtimes
      <template v-if="downtimeTableData.min_max">
        ({{ getTimeFromTimestamp(downtimeTableData.min_max.start_value) }} - {{ getTimeFromTimestamp(downtimeTableData.min_max.end_value) }})
      </template>
      <v-spacer></v-spacer>
      <v-btn
        class="ml-1"
        color="primary"
        @click="$emit('closed')"
      >Close
      </v-btn>
      <v-dialog
        v-model="dialog"
        max-width="400px"
      >
        <v-card>
          <v-card-title class="primary white--text">
            <span class="text-h5">Edit Downtime</span>
          </v-card-title>

          <v-card-text class="mt-4">
            <v-form ref="editForm" v-model="isFormValid" lazy-validation @submit.prevent="submit">
              <v-combobox
                v-model="editedItem.type"
                :items="downtimeTypes"
                item-text="name"
                item-value="id"
                label="Type"
                placeholder="Type of downtime plan"
                :rules="[$rules.required]"
                outlined
                dense
              ></v-combobox>

              <v-combobox
                v-model="editedItem.reason "
                :items="downtimeReasons"
                item-text="name"
                item-value="id"
                label="Reason"
                placeholder="Type in reason or choose from existing for ex: No Demand"
                :rules="[$rules.required]"
                outlined
                dense
              ></v-combobox>

              <v-textarea
                v-model="editedItem.comment"
                label="Comment"
                outlined
              ></v-textarea>

              <div class="d-flex">
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="closeDialog"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="isUpdatingDowntime"
                >
                  Save
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-card-text>
      <v-data-table
        class="flex-grow-1"
        :headers="headers"
        :items="downtimeTableData.data"
        :server-items-length="totalItems"
        :options.sync="options"
        @update:options="updateDowntimeData"
      >
        <template v-slot:item="{ item }">
          <tr :class="getDowntimeReason(item)">
            <td>
              <span>{{ item.machine_name }}</span>
            </td>
            <td>
              <span>{{ item.location_name }}</span>
            </td>
            <td>
              <span>{{ item.zone_name }}</span>
            </td>
            <td>
              <span>{{ getTimeFromTimestamp(item.start_time) }}</span>
            </td>
            <td>
              <span>{{ getTimeFromTimestamp(item.end_time) }}</span>
            </td>
            <td>
              <span>{{ item.downtime_type_name }}</span>
            </td>
            <td>
              <span>{{ getDowntimeReason(item) }}</span>
            </td>
            <td>
              <span>{{ printComment(item) }}</span>
            </td>
            <td>
              <v-btn icon @click="editPlan(item)">
                <v-icon small>$mdi-pencil</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>
/*
|---------------------------------------------------------------------
| Location Component
|---------------------------------------------------------------------
|
*/

import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      headers: [
        { text: 'Machine', value: 'device_id' },
        { text: 'Location', value: 'location' },
        { text: 'Zone', value: 'zone', sortable: true },
        { text: 'Start Time', value: 'start_time', align: 'center' },
        { text: 'End Time', value: 'end_time', align: 'center' },
        { text: 'Type', value: 'type', align: 'center' },
        { text: 'Reason', value: 'reason_id', align: 'center' },
        { text: 'Comment', value: 'comment', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ],

      dialog: false,
      editedItem: {},
      defaultItem: {},
      isFormValid: true,
      options: {}
    }
  },
  computed: {
    ...mapState({
      downtimeTableData: (state) => state.devices.downtimeTableData,
      isDowntimeTableLoading: (state) => state.devices.isDowntimeTableLoading,
      downtimeTypes: (state) => state.devices.downtimeTypes,
      downtimeReasons: (state) => state.devices.downtimeReasons,
      isUpdatingDowntime: (state) => state.devices.isUpdatingDowntime
    }),
    totalItems () {
      return this.downtimeTableData.pagination ? this.downtimeTableData.pagination.totalItems : 0
    },
    routeParams() {
      return {
        location:this.$route.params.location,
        zone:this.$route.params.zone,
        machine_id:this.$route.params.configurationId,
        serial_number:this.$route.params.productId
      }
    }
  },
  mounted() {
    this.options.sortBy.push('start_time')
    this.options.sortDesc.push(true)
    this.updateDowntimeData()
  },
  methods: {
    ...mapActions({
      getDowntimeTableData: 'devices/getDowntimeTableData',
      updateDowntime: 'devices/updateDowntime'
    }),
    updateDowntimeData() {
      this.getDowntimeTableData({
        params:{
          page:this.options.page,
          items:this.options.itemsPerPage,
          sort:this.options.sortBy.length ? this.options.sortBy[0] : null,
          order:this.options.sortDesc.length && this.options.sortDesc[0] ? 'desc' : 'asc',
          ...this.routeParams
        }
      })
    },
    editPlan(item) {
      const editType = this.downtimeTypes.find((type) => {
        return type.id === item.type
      })

      const editReason = this.downtimeReasons.find((reason) => {
        return reason.id === item.reason_id
      })

      Object.assign(this.editedItem, {
        'reason': editReason,
        'type': editType,
        'comment': item.comment,
        'id': item.id
      })

      this.dialog = true
      this.$nextTick(() => {
        this.$refs.editForm.resetValidation()
      })
    },
    closeDialog () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },
    submit() {
      if (this.$refs.editForm.validate()) {
        this.updateDowntime(this.editedItem)
          .then(() => {
            this.dialog = false
            this.updateDowntimeData()
          })
      }
    },
    machineName(item) {
      const _machine = this.deviceInfo.find((device) => {
        return Number(device.serial_number) === item.device_id
      })

      return _machine.configuration.name || ''
    },
    getTimeFromTimestamp(timestamp) {
      const date = timestamp !== -1 ? new Date(timestamp * 1000) : ''

      return date !== '' ? `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US')}` : ''
    },
    getDowntimeReason(item) {
      const _reason = this.downtimeReasons.find((reason) => {
        return reason.id === item.reason_id
      })

      return _reason ? _reason.name : ''
    },
    printComment(item) {
      return item.comment ? item.comment : '?'
    }
  }
}
</script>

<style>
tr.Other{
  background-color: #eedc5b;
}
</style>
