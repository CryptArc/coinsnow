<template>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
	  <router-link class="navbar-brand" :to="{ path: '/'}">
		  <img src="/static/logo.png">
	  </router-link>
        <div class="navbar-text mr-auto">
    	   <ul class="list-inline header-metrics">
    		   <li>
    			  <p>Market Cap</p>
    			  <h5>{{money(metrics.totalCap, 0)}}</h5>
    		  </li>
    		  <li>
    			 <p>BTC Volume</p>
    			 <h5>{{money(metrics.volumeBtc, 0)}}</h5>
    		 </li>
    		 <li>
    			<p>Alt Volume</p>
    			<h5>{{money(metrics.volumeAlt, 0)}}</h5>
    	      </li>
		<li>
		     <p>Total Volume</p>
		     <h5>{{money(metrics.volumeTotal , 0)}}</h5>
	     </li>
    	   </ul>

        </div>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
	    	<div class="navbar-nav ml-auto">
			<select class="form-control" v-model="$eventHub.currency" id="exampleFormControlSelect1">
			      <option v-for="(item, index) in $eventHub.currency_rates" :value="index">{{item.name}}</option>
		      </select>
	    	</div>
        </div>
      </nav>
</template>

<script>
	// this is the header component
	// here we show the global crypto metrics
	var axios = require('axios')
	import Helpers from '@/mixins/Helpers'

	export default {
		mixins: [Helpers],
		data(){
			return {
				metrics: ''
			}
		},
		mounted(){
			var self = this
			// we call the api for the global metrics 
			axios.get('https://coincap.io/global')
			     .then(function(data){
				     self.metrics = data.data
			     })
		}
	}
</script>
