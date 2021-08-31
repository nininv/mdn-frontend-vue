<template>
  <div class="py-3 min-w-0 w-full">
    <div class="text-h4">FAQ</div>
    <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>

    <!-- search card -->
    <v-card :img="authBackgroundFile" class="mb-5">
      <div class="pa-4 py-8">
        <v-text-field
          v-model="search"
          solo
          hide-details
          append-icon="$mdi-magnify"
          placeholder="Search"
        ></v-text-field>
      </div>
    </v-card>

    <!-- faqs -->
    <v-row>
      <v-col cols="12" md="3" xl="2">
        <div class="sticky" style="top: 90px">
          <div class="title mb-2">Contents</div>
          <div v-for="faq in faqs" :key="faq.id" class="mb-1">
            <v-btn text color="primary" @click="$vuetify.goTo(`#${faq.id}`, { offset: 30 })">{{ faq.title }}</v-btn>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="9" xl="10">
        <div v-for="faq in faqs" :id="faq.id" :key="faq.id">
          <div id="#general" class="title pb-2">General Questions</div>
          <v-expansion-panels class="mb-4" multiple>
            <v-expansion-panel
              key="1"
            >
              <v-expansion-panel-header class="font-weight-black">How do I contact MiVue for technical help?</v-expansion-panel-header>
              <v-expansion-panel-content>
                <span>A: Send an email to : <a href="mailto:service@mivue.com">service@mivue.com</a></span>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel
              key="2"
            >
              <v-expansion-panel-header class="font-weight-black">How can I connect more of my equipment and factory to MiVue?</v-expansion-panel-header>
              <v-expansion-panel-content>
                <span>A: Please visit <a href="http://www.mivue.com">www.mivue.com</a> for more information.</span>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-col>
    </v-row>

    <div class="text-caption mt-2 text-center">
      Have other questions? Please reach out
      <router-link to="">Contact Us</router-link>
    </div>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Help Page Component
|---------------------------------------------------------------------
|
| Template to show frequently asked questions to your users
|
*/

import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      search: '',

      breadcrumbs: [{
        text: 'Pages',
        disabled: false,
        href: '#'
      }, {
        text: 'FAQ'
      }],

      faqs: [{
        id: 'general',
        title: 'General Questions',
        items: [{
          title: 'How do I contact MiVue for technical help?',
          content: 'A: Send an email to : service@mivue.com'
        }, {
          title: 'How can I connect more of my equipment and factory to MiVue?',
          content: 'A: Please visit www.mivue.com for more information.'
        }]
      }]
    }
  },
  computed: {
    ...mapState({
      authBackgroundFile: (state) => state.settings.auth_background_file
    })
  }
}
</script>
