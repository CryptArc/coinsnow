<template>
	<data-tables class="cointable" :data="coins" :pagination-def="paginationDef" :table-props="tableProps" v-loading="loading">
    	  <el-table-column
    		 width="60"
    		 sortable="custom"
    		 prop="index"
    		 label="#">
    		<template scope="scope">
    		    {{scope.row.index}}
    		</template>
    	  </el-table-column>
    	  <el-table-column
    		 width="220"
    		 sortable="custom"
    		 prop="long"
    		label="Name">
    		<template scope="scope">
			<router-link :to="{ name: 'cryptocurrency', params: { name: (scope.row.short).toLowerCase() }}">
				<div class="name">
					<img :src="'/static/icons/'+(scope.row.short).toLowerCase()+'.png'" alt="">
					{{scope.row.long}} {{scope.row.short}}
				</div>
			</router-link>
    		</template>
    	  </el-table-column>
    	  <el-table-column
    		sortable="custom"
		width="170"
    		prop="mktcap"
    		label="Market Cap">
    		<template scope="scope">
    		    <span>{{ money(scope.row.mktcap) }}</span>
    		</template>
    	  </el-table-column>
    	  <el-table-column
    		sortable="custom"
    		prop="price"
		width="165"
    		label="Price">
    		<template scope="scope">
    		    <div :class="{changed: scope.row.active}">{{ money(scope.row.price) }}</div>
    		</template>
    	  </el-table-column>
    	  <el-table-column
    		sortable="custom"
    		prop="volume"
		width="165"
    		label="Volume (24h)">
    		<template scope="scope">
    		    <span>{{ money(scope.row.volume) }}</span>
    		</template>
    	  </el-table-column>
    	  <el-table-column
    		sortable="custom"
    		prop="supply"
		width="165"
    		label="Available Supply">
    		<template scope="scope">
    		    <span>{{scope.row.supply | commaNumber}}</span>
    		</template>
    	  </el-table-column>
    	  <el-table-column
    		 sortable="custom"
    		 prop="cap24hrChange"
		 width="165"
    		label="Change(24h)">
    		<template scope="scope">
    		    <span :class="{positiveColor: scope.row.cap24hrChange > 0, negativeColor: scope.row.cap24hrChange < 0}">
    			    <span v-if="scope.row.cap24hrChange > 0">+</span>{{scope.row.cap24hrChange}}%
    		    </span>
    		</template>
    	  </el-table-column>
        </data-tables>
</template>

<script>
	// This is the cryptocurrency table
	// here we display all 1000+ cryptos will realtime info
	var _ = require('lodash')
	var axios = require('axios')
	var numeral = require('numeral')

	import Helpers from '@/mixins/Helpers'

	export default {
		mixins: [Helpers],
		data(){
			return {
				coins: [],
				loading: true,
				paginationDef: {
				    pageSize: 25,
				    pageSizes: [25, 50, 100, 500],
				    currentPage: 1
			    },
			    tableProps: {
				  defaultSort: {
				    prop: 'index',
				    order: 'ascending'
				  }
			    }
			}
		},
		mounted(){
			var self = this

			// call the api for the cryptocurrencies
			axios.get('https://coincap.io/front')
			     .then(function(data){
				    self.coins = data.data

				    self.coins = _.map(data.data, function(o, i){
					    return {
						    index: i + 1,
						    price: o.price,
						    mktcap: o.mktcap,
						    volume: o.volume,
						    supply: o.supply,
						    short: o.short,
						    long: o.long,
						    cap24hrChange: o.cap24hrChange,
						    active: false
					    }
				    })

				    self.loading = false

				    // We make a socket and connect to coincaps websocket
				    // so we can get realtime updates for pricing etc
				    var socket = io.connect('https://coincap.io');
				    socket.on('trades', function (tradeMsg) {

					    var coin = _.find(self.coins, {short: tradeMsg.coin})

					    // if the price doesnt match, update it
					    if(numeral(coin.price ).format('$0,0.00') != numeral(tradeMsg.msg.price ).format('$0,0.00')){

						    coin.active = true
						    coin.price = tradeMsg.msg.price
						    coin.mktcap = tradeMsg.msg.mktcap
						    coin.volume = tradeMsg.msg.volume
						    coin.supply = tradeMsg.msg.supply
						    coin.cap24hrChange = tradeMsg.msg.cap24hrChange
					    }
					    
					    // after 1 second, make the coin not active
					    // this will remove the active class
					    setTimeout(function(){
						    coin.active = false
					    }, 1000)

				    })

			     })

		}
	}
</script>
