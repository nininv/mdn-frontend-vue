<template>
  <v-menu
    offset-y
  >
    <template v-slot:activator="{ attrs, on }">
      <v-btn class="company-menu-text" text v-on="on">
        <v-icon left>$mdi-menu</v-icon> Companies
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="company in companies"
        :key="company.id"
        link
        @click="$emit('companyChanged', company)"
      >
        <v-list-item-title v-text="company.name"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
export default {
  props: {
    companies: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style>
 .company-menu-text .v-btn__content {
   color: #818a8f
 }
</style>
