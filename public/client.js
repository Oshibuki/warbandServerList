let apiUrl = location.origin+'/api'
Vue.component('demo-grid', {
  template: '#grid-template',
  props: {
    columns: Array,
    filterKey: String
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      servers:[],
      sortOrders: sortOrders,
    }
  },
  computed: {
    filteredServers: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var servers = this.servers
      if (filterKey) {
        servers = servers.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        console.log(servers)
        servers = servers.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return servers
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    fetchData: function () {
      var xhr = new XMLHttpRequest()
      var self = this
      xhr.open('GET', apiUrl)
      xhr.onload = function () {
        self.servers = JSON.parse(xhr.responseText).data
      }
      xhr.send()
    }
  },
  created:function(){
    this.fetchData()
  },
})

// bootstrap the demo
var demo = new Vue({
  el: '#demo',
  data: {
    searchQuery: '',
    gridColumns: ['Name','ModuleName','MapName','NumberOfActivePlayers','HasPassword','IP']
  },

})
