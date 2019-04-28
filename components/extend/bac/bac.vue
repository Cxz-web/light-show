<template>
	<div class="lightShow__bac">
		<div class="lightShow__loading"></div>
		<div class="lightShow__tip animated flash">Just a moment...<i class="wait__icon" style="margin-left: 5px;"></i> <i class="wait__icon"></i> <i class="wait__icon"></i></div>
		
	</div>
</template>

<script>
</script>

<style scoped>
	@import url("../../public/css/animate.min.css");
	.lightShow__bac {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0px;
		top: 0px;
		z-index: 2200;
		background-color: rgba(50,47,81, 0.3);
		animation: change 0.3s ease-in forwards;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	
	.lightShow__loading{
		background-image: url(../loading/loading1.svg);
		width: 100px;
		height: 100px;
		background-size: contain;
		background-repeat: no-repeat;
	}
	
	.lightShow__tip{
		color: white;
		font-family: serif;
		font-weight: bold;
		font-size: 22px;
		margin-top: 30px;
		margin-bottom: 10px;
		animation-duration: 4s;
		animation-iteration-count: infinite;
	}
	
	.wait__icon{
		background-image: url(../loading/laugh.svg);
		background-size: contain;
		background-repeat: no-repeat;
		width: 20px;
		height: 20px;
		display: inline-block;
		margin-right: 10px;
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
