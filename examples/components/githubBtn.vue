<template>
	<div class="index__github">
		<span class="github__icon"></span>
		<span class="github__title">GitHub</span>
	</div>
</template>


<style scoped>
	
	.index__github{
		color: black;
		font-size: 16px;
		background-color: #eee;
		width: 90px;
		height: 30px;
		background-image: linear-gradient(to bottom,#fcfcfc 0,#eee 100%);
		border: 1px solid #d5d5d5;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding-left: 5px;
		padding-right: 5px;
		user-select: none;
		transition: transform .1s ease-in;
		position: relative;
	}
	
	.index__github:active {
		transform: scale(1.2);
	}
	
	.github__icon {
		background-image: url(../assets/github.jpg);
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: contain;
	}
</style>
