<template>
	<div class="details">
		<div class="details__table">
			<div class="details__1">Lesson</div>
			<div class="details__2">Start time</div>
			<div class="details__3">Courseware</div>
			<div class="details__4">Operation</div>
		</div>
		
		<div class="details__content" v-for="item in list">
			<div class="details__1">Lesson1 what do i wear</div>
			<div class="details__2">2019 04017 19:00</div>
			<div class="details__3"><input type="file"></div>
			<div class="details__4 details__wrap"><div class="details__btn">Ended</div></div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'lessons-details',
		data() {
			return {
				list: new Array(3)
			}
		}
	}
</script>

<style scoped>
	.details__table{
		color: white;
		font-size: 20px;
		background-color: #0099ff;
		display: flex;
		height: 50px;
		line-height: 50px;
	}
	
	.details__1{
		width: 25%;
	}
	.details__2{
		width: 15%;
	}
	.details__3{
		width: 35%;
	}
	.details__4{
		width: 25%;
	}
	
	.details__content{
		display: flex;
		height: 45px;
		border-bottom: 1px solid darkgray;
		line-height: 45px;
		cursor: pointer;
	}
	
	.details__wrap{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.details__btn{
		height: 42px;
		background-color: #ff9900;
		border-radius: 6px;
		width: 60%;
		color: white;
	}
</style>
