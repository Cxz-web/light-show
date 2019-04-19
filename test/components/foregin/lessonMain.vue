<template>
	<div class="lesson">
		<div class="lesson__title"><div class="title__icon"></div>Dual-teacher Live Broadcast</div>
		<div class="lesson__bread"> Home > class</div>
		<div v-show="!show">
			<div class="lesson__table">
				<div class="table__1">Course</div>
				<div class="table__2">Grade</div>
				<div class="table__3">Subject</div>
				<div class="table__4">Class</div>
				<div class="table__5">Next Lesson</div>
				<div class="table__6">Status</div>
			</div>
			<div class="lesson__content" v-for="item in list" @click="showDetails">
				<div class="table__1">七年级提升课程</div>
				<div class="table__2">七年级</div>
				<div class="table__3">英语</div>
				<div class="table__4">七年级三班</div>
				<div class="table__5">2019-04-01 19：00</div>
				<div class="table__6 btn__wrap"><div class="btn" @click="toLive">Live</div></div>
			</div>
		</div>
		
		<lessons-details v-if="show"></lessons-details>
		
	</div>
	
	
	
	
</template>

<script>
	import LessonsDetails from './lessonsDetails.vue'
	export default {
		name: 'lesson-main',
		data() {
			return {
				list: new Array(3),
				show: false
			}
		},
		
		components:{
			LessonsDetails
		},
		
		mounted() {
			this.notice()
		},
		
		methods: {
			notice() {
				const n = new Notification('读书郎提示你', {
					body: '直播开始啦，请尽快进入直播',
					tag: 'Readyboy',
					icon: require('../../assets/tip.png'),
					timestamp: 3000
				});
			},
			showDetails() {
				// this.show = true
				this.$router.push('/live/rtc')
			},
			
			toLive() {
				this.$router.push('/live/rtc')
			}
		}
	}
</script>

<style scoped>
	.lesson {
		color: black;
		animation: lessonIn ease-in-out .3s forwards;
		width: 100%;
		height: 100%;
		background-color: white;
		transform: translate3d(0,0,0);
		will-change: transform; 
	}
	
	@keyframes lessonIn{
		from{
			transform: translate3d(-5px, -10px, 0);
			opacity: 0;
		}
		to{
			transform: translate(0, 0, 0);
			opacity: 1;
		}
	}
	
	.lesson__title{
		height: 50px;
		background-color: #333333;
		color: white;
		font-size: 22px;
		line-height: 50px;
		text-align: left;
		display: flex;
		padding-left: 10px;
		margin-bottom: 3px;
	}
	
	.title__icon{
		height: 50px;
		width: 60px;
		background-image: url(asserts/u24.png);
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		margin-right: 10px;
	}
	
	.lesson__bread{
		background-color: #e8e8e8;
		height: 50px;
		font-weight: bold;
		font-size: 20px;
		line-height: 50px;
		text-align: left;
		text-indent: 14px;
	}
	.lesson__table{
		color: white;
		font-size: 20px;
		background-color: #0099ff;
		display: flex;
		height: 50px;
		line-height: 50px;
	}
	
	.table__1{
		width: 25%;
	}
	.table__2{width: 10%;}
	.table__3{width: 10%;}
	.table__4{width: 20%;}
	.table__5{width: 20%;}
	.table__6{width: 15%;}
	
	.lesson__content{
		display: flex;
		height: 45px;
		border-bottom: 1px solid darkgray;
		line-height: 45px;
		cursor: pointer;
	}
	.btn__wrap{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.btn{
		width: 60%;
		height: 40px;
		background-color: rgb(0,204,0);
		border-radius: 5px;
		color: white;
		line-height: 40px;
		font-weight: bold;
		font-size: 18px;
	}
	
	.lesson__content:hover{
		background-color: #99ffff;
	}
</style>
