<template>
	<div>
		<div class="jumbotron jumbotron-fluid mb-0">
		  <div class="container">
		    <h1 class="display-5">Realtime Cryptocurrency Market Capitalizations</h1>
		    <p class="lead">This is a modified jumbotron that occupies the entire horizontal space of its parent.</p>
		  </div>
		</div>
		<div class="market-coins mb-40">
			<div class="container">
				<crypto-table></crypto-table>
			</div>
		</div>
	</div>
</template>

<script>
	// this is the home (index) component
	// here we include the crytocurrency table component 
	import CryptoTable from '@/components/CryptoTable'
	export default {
		components: {
			CryptoTable
		}
	}
</script>
