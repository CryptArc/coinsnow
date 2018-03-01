var numeral = require('numeral')
export default {
	filters: {
		commaNumber: function (value) {
			if (!value) return ''
			return numeral(value).format('0,0')
		},
		percentageNumber: function (value) {
			if (!value) return ''
			return value
		}
	},
	methods: {
		moneyNoConvert(value){
			if (!value){
				return ''
			}
			var symbol = this.$eventHub.currency_rates[this.$eventHub.currency].symbol
			return accounting.formatMoney(value, {
				symbol: symbol,
				format: "%s%v"
			});
		},
		money: function (value, precision) {
			if (!value){
				return ''
			}
			// first get currency to USD
			var target = this.$eventHub.currency_rates[this.$eventHub.currency].name
			var symbol = this.$eventHub.currency_rates[this.$eventHub.currency].symbol
			var currency = fx(value).from("USD").to(target)

			return accounting.formatMoney(currency, {
				symbol: symbol,
				format: "%s%v",
				precision : precision
			});
		},
	}
}
