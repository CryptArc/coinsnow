// Import all the modules we need for the app
import Vue from 'vue'
import App from './App'
import router from './router'

// ElementUI is needed for the vue-data-tables module
import ElementUI from 'element-ui'
import DataTables from 'vue-data-tables'

// Highcharts are used for all the charts
import VueHighcharts from 'vue-highcharts';
import Highcharts from 'highcharts';
import loadStock from 'highcharts/modules/stock';

// Set the language to English
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

// We use vue cookie to store the users choosen currency
import VueCookie from 'vue-js-cookie'

Vue.use(VueCookie)
Vue.use(ElementUI)
Vue.use(DataTables)

loadStock(Highcharts);
Vue.use(VueHighcharts, { Highcharts });

locale.use(lang)

Vue.config.productionTip = true

var axios = require('axios')

// We made a eventhub so we can emit events between components
Vue.prototype.$eventHub = new Vue({
      data(){
            return {
                  currency_rates: [
                        {
                              "name": "AUD",
                              "symbol": "$"
                        },
                        {
                              "name": "BGN",
                              "symbol": "лв"
                        },
                        {
                              "name": "BRL",
                              "symbol": "R$"
                        },
                        {
                              "name": "CAD",
                              "symbol": "$"
                        },
                        {
                              "name": "CHF",
                              "symbol": "CHF"
                        },
                        {
                              "name": "CNY",
                              "symbol": "¥"
                        },
                        {
                              "name": "CZK",
                              "symbol": "Kč"
                        },
                        {
                              "name": "DKK",
                              "symbol": "kr"
                        },
                        {
                              "name": "GBP",
                              "symbol": "£"
                        },
                        {
                              "name": "HKD",
                              "symbol": "$"
                        },
                        {
                              "name": "HRK",
                              "symbol": "kn"
                        },
                        {
                              "name": "HUF",
                              "symbol": "Ft"
                        },
                        {
                              "name": "IDR",
                              "symbol": "Rp"
                        },
                        {
                              "name": "ILS",
                              "symbol": "₪"
                        },
                        {
                              "name": "INR",
                              "symbol": "₹"
                        },
                        {
                              "name": "JPY",
                              "symbol": "¥"
                        },
                        {
                              "name": "KRW",
                              "symbol": "₩"
                        },
                        {
                              "name": "MXN",
                              "symbol": "$"
                        },
                        {
                              "name": "MYR",
                              "symbol": "RM"
                        },
                        {
                              "name": "NOK",
                              "symbol": "kr"
                        },
                        {
                              "name": "NZD",
                              "symbol": "$"
                        },
                        {
                              "name": "PHP",
                              "symbol": "₱"
                        },
                        {
                              "name": "PLN",
                              "symbol": "zł"
                        },
                        {
                              "name": "RON",
                              "symbol": "lei"
                        },
                        {
                              "name": "RUB",
                              "symbol": "₽"
                        },
                        {
                              "name": "SEK",
                              "symbol": "kr"
                        },
                        {
                              "name": "SGD",
                              "symbol": "$"
                        },
                        {
                              "name": "THB",
                              "symbol": "฿"
                        },
                        {
                              "name": "TRY",
                              "symbol": "₺"
                        },
                        {
                              "name": "USD",
                              "symbol": "$"
                        },
                        {
                              "name": "ZAR",
                              "symbol": "R "
                        }
                  ],
                  rates: [],
                  currency: ''
            }
      },
      watch: {
            currency() {
                  // set the cookie currency
                  this.$cookie.set('currency', this.currency, 30)
            }
      },
      methods: {
            getRates(callback){
                  var self = this
                  // get the latest rates from fixer.io
                  // we then show them in the dropdown
                  axios.get('https://api.fixer.io/latest')
                       .then(function(data){
                             self.rates = data.data.rates
                             self.currency = self.$cookie.get('currency') || 29
                             callback()
                       })
            }
      }
});

// we setup the rates firstly
Vue.prototype.$eventHub.getRates(function(){
      fx.rates = Vue.prototype.$eventHub.rates
})

// We initialize vuejs
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
