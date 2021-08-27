<template>
  <v-card>
    <v-card-title>
      Add a note
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit="addNote"
      >
        <v-textarea
          v-model="note"
          label="Note"
          outlined
          required
          :rules="noteRules"
        ></v-textarea>

        <div class="d-flex">
          <v-spacer></v-spacer>
          <v-btn
            text
            class="mr-1"
            @click="resetNote"
          >
            Reset
          </v-btn>
          <v-btn
            color="primary"
            :loading="isLoading"
            :disabled="!valid"
            @click="_addNote"
          >
            <v-icon left small>
              $mdi-plus
            </v-icon>
            Add note
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    deviceId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      valid: true,
      note: '',
      noteRules: []
    }
  },
  computed: {
    ...mapState({
      isLoading: (state) => state.notes.isNoteAdding
    })
  },
  watch: {
    'note' (val) {
      this.noteRules = []
    }
  },
  methods: {
    ...mapActions({
      addNote: 'notes/addNote',
      getNotes: 'notes/getNotes'
    }),
    resetNote() {
      this.note = ''
      this.$refs.form.resetValidation()
    },
    _addNote() {
      this.noteRules = [this.$rules.required]

      setTimeout(async () => {
        if (this.$refs.form.validate()) {
          try {
            await this.addNote({
              deviceId: this.deviceId,
              note: this.note
            })

            this.resetNote()

            await this.getNotes(this.deviceId)
          } catch (error) {
            console.log(error)
          }
        }
      })
    }
  }
}
</script>
