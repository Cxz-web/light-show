<template>
	<div class="lightShow__bac"></div>
</template>

<script>
</script>

<style scoped>
	.lightShow__bac {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0px;
		top: 0px;
		z-index: 2200;
		background-color: rgba(50,47,81, 0.3);
		animation: change 0.3s ease-in forwards;
	}
	
	
	@keyframes change{
		to {
			background-color: rgba(50,47,81, 0.8);
		}
	}
	
	@keyframes leave{
		from {
			background-color: rgba(50,47,81, 0.8);
		}
		to {
			background-color: rgba(50,47,81, 0);
		}
	}
	
	.leave{
		animation: leave 1s linear forwards;
	}
</style>
