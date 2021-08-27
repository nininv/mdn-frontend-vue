<template>
  <div class="flex-grow-1">
    <v-row dense>
      <v-col cols="12" md="4">
        <Overview :user="user"></Overview>
      </v-col>
      <v-col cols="12" md="8">
        <v-card height="300">
          <v-card-text>
            <v-tabs v-model="tab">
              <v-tab>Personal Info</v-tab>
              <v-tab>Password</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" class="my-2">
              <v-tab-item>
                <personal-info
                  :is-btn-loading="isBtnLoading"
                  :user="user"
                  :error="error"
                  :profile="profile"
                  @clearError="clearError"
                >
                </personal-info>
              </v-tab-item>
              <v-tab-item>
                <password-reset
                  :is-btn-loading="isBtnLoading"
                  :error="error"
                  @submit="submitPassword"
                  @clearError="clearError"
                >
                </password-reset>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <time-zone
          @submit="submitTimezone"
        >
        </time-zone>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import PersonalInfo from '../../components/profile/ProfilePersonalInfo'
import PasswordReset from '../../components/profile/ProfilePasswordReset'
import Overview from '../../components/profile/ProfileOverview'
import TimeZone from '../../components/profile/ProfileTimeZone'

import { mapState, mapActions } from 'vuex'

export default {
  components: {
    PasswordReset,
    PersonalInfo,
    Overview,
    TimeZone
  },
  data() {
    return {
      tab: null
    }
  },
  computed: {
    ...mapState({
      isBtnLoading: (state) => state.auth.buttonLoading,
      user: (state) => state.auth.user,
      error: (state) => state.auth.error,
      profile:(state) => state.auth.profile
    })
  },
  methods: {
    ...mapActions({
      updatePassword: 'auth/updatePassword',
      updateTimezome: 'auth/updateTimezome'
    }),
    submitPassword(data) {
      this.updatePassword(data)
    },
    submitTimezone(data) {
      this.updateTimezome(data)
    },
    clearError() {
      this.$store.commit('auth/CLEAR_ERROR')
    }
  }
}
</script>
