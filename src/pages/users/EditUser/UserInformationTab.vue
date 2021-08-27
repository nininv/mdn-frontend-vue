<template>
  <v-card class="my-2">
    <v-card-title>User Information</v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="isFormValid"
        lazy-validation
        class="flex-grow-1 pt-2"
        @submit.prevent="save"
      >
        <v-text-field
          v-model="user.phone"
          v-mask="'###-###-####'"
          label="Phone Number"
          placeholder="123-456-7890"
          :rules="[$rules.required, $rules.phoneFormat]"
          outlined
          dense
        >
        </v-text-field>
        <v-divider class="mb-4"></v-divider>
        <div class="d-grid grid-cols-1 grid-cols-md-3 gap-2">
          <v-text-field
            v-model="user.address_1"
            label="Address"
            :rules="[$rules.required]"
            outlined
            dense
          >
          </v-text-field>
          <v-select
            v-model="user.state"
            label="State"
            :items="states"
            :rules="[$rules.required]"
            outlined
            dense
            @change="onStateChange"
          >
          </v-select>
          <v-combobox
            v-model="user.city"
            :disabled="!user.state || loadingCities"
            :items="cities"
            label="City"
            item-text="city"
            :return-object="false"
            :rules="[$rules.required]"
            :loading="loadingCities"
            outlined
            dense
          ></v-combobox>
          <v-text-field
            :value="zipCode"
            label="Zip Code"
            :rules="[$rules.required]"
            :disabled="!user.state || !user.city"
            outlined
            dense
            readonly
          >
          </v-text-field>
          <v-text-field
            v-model="user.country"
            :rules="[$rules.required]"
            label="Country"
            outlined
            dense
            readonly
          >
          </v-text-field>
        </div>

        <div class="d-flex">
          <v-btn
            color="primary"
            :loading="buttonLoading"
            @click="save"
          >
            Save
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import states from '../../../services/data/states'

import { mapState, mapActions } from 'vuex'

export default {
  props: {
    buttonLoading: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    isFormValid: true,

    states
  }),
  computed: {
    ...mapState({
      cities: (state) => state.cities.data,
      loadingCities: (state) => state.cities.loadingCities
    }),
    zipCode() {
      const _zip = this.cities.find((city) => city.city === this.user.city)

      return _zip ? _zip.zip : ''
    }
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    ...mapActions({
      getCities: 'cities/getCities'
    }),
    onStateChange() {
      this.getCities(this.user.state)
    },
    save() {
      if (this.$refs.form.validate()) {
        const data = Object.assign(this.user, {
          zip: this.zipCode
        })

        this.$emit('submit', data)
      }
    }
  }
}
</script>
