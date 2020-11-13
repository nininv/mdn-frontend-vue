const module = {
  namespaced: true,
  state: {
    data: [
      {
        id: 1,
        customerId: 3,
        parameters: [],
        status: 'Warning',
        machinename: 'BD Batch Blender',
        capacity: 89,
        consumption: '80 Watts',
        factory: '30 Elm Street, NY',
        department: 'Zone 1',
        notes: []
      },
      {
        id: 2,
        customerId: 3,
        parameters: [],
        status: 'Normal',
        machinename: 'Accumeter Ovation Continuous',
        capacity: 30,
        consumption: '30 Watts',
        factory: '45 Main street, FL',
        department: 'Zone 2',
        notes: []
      },
      {
        id: 3,
        customerId: 3,
        parameters: [],
        status: 'Normal',
        machinename: 'GH Gravimetric Extrusion Control',
        capacity: 57,
        consumption: '20 Watts',
        factory: '50 Gracy Street, TX',
        department: 'Zone 3',
        notes: []
      },
      {
        id: 4,
        customerId: 3,
        parameters: [],
        status: 'Alarm',
        machinename: 'GH-F Gravimetric Additive',
        capacity: 99,
        consumption: '90 Watts',
        factory: '44 Main Street, GA',
        department: 'Zone 4',
        notes: []
      },
      {
        id: 5,
        customerId: 2,
        parameters: [],
        status: 'Normal',
        machinename: 'VTC Plus Conveying',
        capacity: 32,
        consumption: '10 Watts',
        factory: '33 One Drive, MA',
        department: 'Zone 1',
        notes: []
      },
      {
        id: 6,
        customerId: 2,
        parameters: [],
        status: 'Normal',
        machinename: 'NGX',
        capacity: 27,
        consumption: '10 Watts',
        factory: '29 Georgia Ave, CA',
        department: 'Zone 4',
        notes: []
      },
      {
        id: 7,
        customerId: 2,
        parameters: [],
        status: 'Normal',
        machinename: 'NGX Nomad',
        capacity: 38,
        consumption: '40 Watts',
        factory: '746 Macon, CO',
        department: 'Zone 5',
        notes: []
      },
      {
        id: 8,
        customerId: 1,
        parameters: [],
        status: 'Warning',
        machinename: 'Truetemp',
        capacity: 74,
        consumption: '20 Watts',
        factory: '1 Cantance Street, UT',
        department: 'Zone 1',
        notes: []
      },
      {
        id: 9,
        customerId: 1,
        parameters: [],
        status: 'Not',
        machinename: 'GP & HE Central',
        capacity: '',
        consumption: 'OFF',
        factory: '45 Spring Street, NY',
        department: 'Zone 5',
        notes: []
      },
      {
        id: 10,
        customerId: 1,
        parameters: [],
        status: 'Normal',
        machinename: 'T50 Central',
        capacity: '52',
        consumption: '30 Watts',
        factory: '69 Borden Rd, IL',
        department: 'Zone 3',
        notes: []
      }
    ],
    machines: [],
    selectedId: 0
  },

  actions: {
    selectMachine({
      commit
    }, id) {
      commit('selectData', id)
    },
    updateSelections({
      commit
    }, selections) {
      commit('updateSelections', selections)
    },
    addProductNote({
      commit
    }, note) {
      commit('addProductNote', note)
    }
  },

  mutations: {
    selectData: (state, id) => {
      state.selectedId = parseInt(id)
    },
    updateSelections: (state, selections) => {
      state.data.forEach( (_data) => {
        if (_data.id === state.selectedId) {
          _data.selections = selections
        }
      })
    },
    addProductNote: (state, note) => {
      state.data.forEach( (_data) => {
        if (_data.id === state.selectedId) {
          const currentTime = new Date()

          _data.notes.push({
            text: note,
            time: currentTime
          })
        }
      })
    },
    SET_MACHINES: (state, machines) => {
      state.machines = machines
    }
  },

  getters: {
    machineNames: (state) => {
      return state.data.map((machine) => machine.machinename)
    },
    selectedMachine: (state) => {
      if (state.selectedId) {
        const _machine = state.data.find((machine) => machine.id === state.selectedId)

        return _machine
      }

      return {}
    },
    extendedMachines: (state) => {
      const _machines = state.machines

      _machines.unshift({
        id: 0,
        name: 'Not Assigned'
      })

      return _machines
    }
  }
}

export default module
