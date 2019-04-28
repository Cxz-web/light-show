<template>
  <div id="app">
		<router-view></router-view>
  </div>
</template>

<script>
	export default {
		created() {
			console.log('hellow world')
			console.log('%c light-show GitHub地址:','background:#aaa;color:#fff','https://github.com/Cxz-web/light-show')
		}
	}

</script>

<style>
	

</style>
