<template>
  <div class="d-flex text-center flex-column flex-md-row flex-grow-1">
    <div class="pa-2 pa-md-4 flex-grow-1 align-center justify-center d-flex flex-column">
      <div class="layout-content ma-auto w-full">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      logoImgError: false
    }
  },
  computed: {
    ...mapState({
      authBackgroundFile: (state) => state.settings.authBackgroundFile,
      logoFile: (state) => state.settings.logoFile,
      productName: (state) => state.settings.productName,
      productVersion: (state) => state.settings.productVersion
    }),
    authBackground() {
      return {
        'background-image': `url(${this.authBackgroundFile})`,
        // 'background-size': 'cover',
        'background-position': 'center center',
        'background-size': '100% 100%'
      }
    },
    logoFilePath() {
      return this.logoImgError ? require('../assets/imgs/logo-aec.png') : this.logoFile
    }
  },
  methods: {
    onLogoImgError() {
      this.logoImgError = true
    }
  }
}
</script>

<style scoped>
.layout-side {
  width: 420px;
}

.layout-content {
  max-width: 480px;
}

.w-full {
  height: 100%;
}

.defaultAuthBackground {
  background-image: url('../assets/imgs/auth-background.png');
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
