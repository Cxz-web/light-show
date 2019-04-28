<template>
	<div class="lightShow__tip animated  bounceIn">
		<i class="tip__icon"></i>
		{{ content }}
	</div>
</template>

<script>

</script>

<style scoped>
	@import url("../../public/css/animate.min.css");
	.lightShow__tip {
		width: 30vmin;
		height: 6vmin;
		position: fixed;
		left: 50%;
		top: 4vmin;
		z-index: 3000;
		background: linear-gradient(to right, #fbc7d4, #9796f0); 
		color: white;
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 3vmin;
		margin-left: -15vmin;	
		padding-left: 4vmin;
		box-sizing: border-box;
		padding-right: 4vmin;
		
	}
	
	.tip__icon{
		content: url(../loading/tip.svg);
		width: 3vmin;
		height: 3vmin;
		position: absolute;
		left: 2vmin;
		top: 50%;
		transform: translateY(-50%);
		
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
