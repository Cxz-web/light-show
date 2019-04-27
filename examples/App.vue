<template>
  <div id="app">
		<router-view></router-view>
  </div>
</template>

<script>
	export default {
		created() {
			console.log('%c light-show GitHub地址:','background:#aaa;color:#fff','https://github.com/Cxz-web/light-show');
			this.judgeSystem()
		},
		
		methods: {
			judgeSystem() {
				if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
					this.$router.push('/light-show/error')
				}
			}
		},
	}

</script>

<style>
	

</style>
