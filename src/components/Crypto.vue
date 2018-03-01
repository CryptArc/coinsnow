<template>
	<div class="main currency_page" v-loading.fullscreen.lock="fullscreenLoading">
            <div class="container">
                  <div class="box mb-20">
                        <div class="inner">
                              <div class="row">
                                    <div class="col-lg-4 mmb-20 col-sm-12 text-left">
                                          <p class="subtitle">Name</p>
                                          <div class="name">
                                                <img :src="'/static/icons/'+(coin.id).toLowerCase()+'.png'" alt="" >
                                                <h2 >{{coin.display_name}} <small>{{coin.id}}</small></h2>
                                          </div>
                                    </div>
                                    <div class="col-lg-3 col-sm-12">

                                    </div>
                                    <div class="col-lg-3 mmb-20 col-sm-12 text-left">
                                          <p class="subtitle">Price</p>
                                          <div class="price">
                                                <h2 >{{money(coin.price, 2)}} <small>{{$eventHub.currency_rates[$eventHub.currency].name}}</small></h2>
                                          </div>
                                    </div>
                                    <div class="col-lg-2 col-sm-12 text-left">
                                          <p class="subtitle">Change (24h)</p>
                                          <div class="change" :class="{positive: coin.cap24hrChange > 0, negative: coin.cap24hrChange < 0}">
                                                <span v-if="coin.cap24hrChange > 0">+</span>{{coin.cap24hrChange}}%
                                          </div>
                                    </div>
                              </div>
                        </div>
                        <hr>
                        <div class="inner sml">
                              <div class="row">
                                    <div class="col-lg-7 col-sm-12 text-left mmb-20">
                                          <p class="mb-0">#Rank <strong>{{coin.rank}}</strong></p>
                                    </div>
                                    <div class="col-lg-5 col-sm-12 col-sm-offset-0 text-left">
                                          <p class="mb-0">{{coin.price_btc}} BTC</p>
                                    </div>
                              </div>
                        </div>
                  </div>
                  <div class="box mb-20">
                        <div class="row">
                              <div class="col-lg-4 col-sm-12 br text-left">
                                    <div class="inner">
                                          <p class="subtitle">Market Cap</p>
                                          <div class="price">
                                                <h4 >{{money(coin.market_cap, 0)}} <small>{{$eventHub.currency_rates[$eventHub.currency].name}}</small></h4>
                                                <p class="mb-0">{{(coin.market_cap / coin.price) | commaNumber}} BTC</p>
                                          </div>
                                    </div>
                              </div>
                              <div class="col-lg-4 col-sm-12 br text-left">
                                    <div class="inner">
                                          <p class="subtitle">Volume (24h)</p>
                                          <div class="price">
                                                <h4 >{{money(coin.volume, 0)}} <small>{{$eventHub.currency_rates[$eventHub.currency].name}}</small></h4>
                                                <p class="mb-0">{{(coin.volumeBtc / coin.price) | commaNumber}} BTC</p>
                                          </div>
                                    </div>
                              </div>
                              <div class="col-lg-4 col-sm-12 br text-left">
                                    <div class="inner">
                                          <p class="subtitle">Available Supply</p>
                                          <div class="price">
                                                <h4>{{coin.supply | commaNumber}} <small>BTC</small></h4>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>

                  <div class="box mb-20">
                        <div class="inner">
                              <h3>Realtime Price</h3>
                              <highcharts :options="realtime_options" ref="highcharts"></highcharts>
                        </div>
                  </div>

                  <div class="box">
                        <div class="inner">
                              <h3>Historic Chart</h3>
                              <highstock :options="options"></highstock>
                        </div>
                  </div>

            </div>
      </div>
</template>

<script>
	// this is the crypto page
	// every cryptocurrency will have its own page

	var _ = require('lodash')
	var axios = require('axios')
	var moment = require('moment')

	import Helpers from '@/mixins/Helpers'

	export default {
		mixins: [Helpers],
		data(){
			return {
				fullscreenLoading: true,
				coin: '',
				options: {
					credits: {
						enabled: false
					},
					tooltip: {
						shared: true
					},
					yAxis: {
						labels: {
							enabled: false
						}
					},
					rangeSelector: {
					      selected: 0
					},
					series: []
				},
				realtime_options: {
					chart: {
						height: 200,
						margin: [0,0,30,0]
					  },
					  rangeSelector: {
						selected: 1
					  },
					  credits: {
						enabled: false,
					  },
					  exporting: {
						enabled: false
					  },
					  title: {
						text: false
					  },
					  xAxis: {
					      type: 'datetime',
					      tickPixelInterval: 150
					  },
					  tooltip: {},
					  yAxis: {
						labels: {
						    enabled: false
						},
						gridLineColor: 'transparent',
					  },
					  navigator: {
						enabled: false
					  },
					  scrollbar: {
						enabled: false
					  },
					  rangeSelector: {
						enabled: false
					  },
					  plotOptions: {
						series: {
						    lineWidth: 4
						}
					  },
					  series: [{
						showInLegend: false,
						color: '#409EFF',
						data: []
					  }]
				}
			}
		},
		methods: {
			setupHistoric(){
				var self = this

				// call the api and get all the history data for the coin 
				axios.get('https://coincap.io/history/'+(this.$route.params.name).toUpperCase())
				     .then(function(data){
					     self.options.series.push({
						     name: 'Market Cap',
						     data: data.data.market_cap
					     },
					     {
						     name: 'Price',
						     data: data.data.price
					     },
					     {
						     name: 'Volume',
						     data: data.data.volume
					     })
				     })
			},
			setupCoin(){
				var self = this
				// call the api for the coin info based on the route name
				// i.e /btc , /eth
				axios.get('https://coincap.io/page/'+(this.$route.params.name).toUpperCase())
				     .then(function(data){
					     self.coin = data.data
				     })
			},
			setupRealtime(){
				var self = this

				// every second, we will update the chart with the price value
				setInterval(function(){
					if(self.$refs.highcharts && self.$refs.highcharts.chart){
						  var chart = self.$refs.highcharts.chart;
						  chart.series[0].addPoint([new Date().getTime(), fx(self.coin.price).from("USD").to(self.$eventHub.currency_rates[self.$eventHub.currency].name) ], true, false);
					}
				}, 1000)
			}
		},
		mounted(){
			var self = this

			// Change the historic chart tooltip format
			this.realtime_options.tooltip.formatter = function(){
				return moment(this.x).format('H:m:ss') + ' - <b>' + self.moneyNoConvert(this.y) + '</b>'
			}

			// Change the realtime chart tooltip format
			this.options.tooltip.formatter = function(){
				return moment(this.x).format('Do, MMM H:m:ss') + '<br>' +
					 'Market Cap: ' + self.money(this.points[0].y, 0) + '<br>' +
					 'Price: ' +  self.money(this.points[1].y, 2) + '<br>' +
					 'Volume: ' + self.money(this.points[2].y, 0)
			}

			if(this.$eventHub.rates){
				// if we have the rates, which we need for converting
				// we call these methods
				// setupCoin will get the coin info
				// setupHistoric will get the coin historic data
				// setupRealtime will update the realtime chart every second
				self.setupCoin()
				self.setupHistoric()
				self.setupRealtime()

				self.fullscreenLoading = false

				// we connect to the coincap websocket
				var socket = io.connect('https://coincap.io');

				socket.on('trades', function (tradeMsg) {

					// we update the price, when it changes
					if( (tradeMsg.msg.short) == self.coin.id){
						self.coin.price = parseFloat(tradeMsg.msg.price)
					}

				})
			}


		}
	}
</script>
