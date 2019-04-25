<template>
	<div class="example__read">
		<read-slide ref="read"></read-slide>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		mounted() {
			this.readData()
		},
		methods: {
			readData() {
				axios.get('https://www.cxzweb.club/api/public/data2.js').then((res) => {
					let data = res.data
					this.$refs.read.initData(data)
				})
			}
		}
	}
</script>

<style scoped>
	.example__read {
		width: 100%;
		height: 100%;
	}
</style>
