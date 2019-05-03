<template>
	<div class="read__loading">
		<div class="loading__box">
			<p class="loading__title">Happy to write PPT!!!</p>
			<p class="loading__name">--XinZhu</p>
		</div>
		<div class="loading__wrap">
			<div class="loading__icon"></div>
			<div class="loading__icon"></div>
			<div class="loading__icon"></div>
			<div class="loading__icon"></div>
		</div>
		
		<div class="loading__tip">正在加载所有资源(图片资源比较多，请耐心等待) <i class="tip__icon"></i></div>
		
	
		
	</div>
</template>

<script>
</script>

<style scoped>
	.read__loading {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0px;
		top: 0px;
		z-index: 2200;
		background-image: linear-gradient(90deg, #74EBD5 0%, #9FACE6 100%);
		animation: change 0.3s ease-in-out forwards;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: white;
		box-sizing: border-box;
		padding-top: 14vmin;
		
	}
	
	.loading__box{
		font-family: monospace;
		color: white;
		font-size: 7vmin;
		text-align: center;
		font-weight: bold;
	}
	
	.loading__title {
		margin: 0px;
		padding: 0px;
		letter-spacing: 4px;
	}
	
	.loading__name{
		margin: 0px;
		padding: 0px;
		text-align: right;
		letter-spacing: 4px;
		margin-top: 2vmin;
		
		opacity: 0;
	}
	
	
	@keyframes change{
		to {
			opacity: 1;
		}
	}
	
	@keyframes leave{
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
	
	.leave{
		animation: leave 1s linear forwards;
	}
	
	.loading__name{
		font-size: 3vmin;
		text-indent: 5vmin;
	}
	
	.loading__wrap{
		display: flex;
		margin-top: 10vmin;
	}
	
	.loading__icon{
		width: 16vmin;
		height: 16vmin;
		background-image: url(../loading/loading6.svg);
		background-position:center ;
		background-size: contain;
		background-repeat: no-repeat;
	}
	
	.loading__tip{
		font-family: cursive;
		font-weight: bold;
		font-size: 3vmin;
		display: flex;
		margin-top: 10vmin;
		letter-spacing: 2px;
		text-indent: 4vmin;
	}
	
	.tip__icon{
		width: 10vmin;

		background-image: url(../loading/loading4.svg);
		background-position: left 0.8vmin;
		margin-left: 1vmin;
		background-size: contain;
		background-repeat: no-repeat;
	}
</style>
