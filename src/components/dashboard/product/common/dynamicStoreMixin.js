export default {
  props: {
    namespace: {
      type: String,
      default: ''
    },
    fetch: {
      type: Function,
      default: () => {}
    },
    persist: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    state() {
      return this.$store.state[this.namespace]
    }
  },
  created() {
    if (!this.isModuleCreated([this.namespace])) {
      this.registerModule(this.Store)
    }
  },
  beforeDestroy() {
    if (!this.persist) this.$store.unregisterModule(this.namespace)
  },
  methods: {
    isModuleCreated(path) {
      let m = this.$store._modules.root

      return path.every((p) => {
        m = m._children[p]

        return m
      })
    },
    registerModule(Store) {
      this.$store.registerModule(this.namespace, {
        namespaced: true,
        state: Store.generateState ? Store.generateState() : {},
        actions: Store.generateActions ? Store.generateActions(this.fetch) : {},
        mutations: Store.generateMutations ? Store.generateMutations() : {}
      })
    }
  }
}
