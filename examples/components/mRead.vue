<template>
	<div class="example__read">
		<read-slide ref="read"  @getPage="getPage"></read-slide>
		
		<!-- <example-index @close="closeIndex" v-if="showIndx"></example-index> -->
		
		<div class="over__main animated fadeIn" v-if="showOver">
			<div class="example__over">
				<p class="title1">Thanks you!</p>
				<p class="title2">如果对你有帮助, 来个star吧!</p>
				<div class="over__btn">
					<git-hub @openGitHub="openGitHub"></git-hub>
					<div class="over__close" @click.stop="showOver=false">取消</div>
				</div>
			</div>
		</div>
		
		<div class="github__wrap animated pulse" v-if="showWrap" @click="openEdit"><div class="edit__address">编辑器地址</div></div>
		
		
	</div>
</template>

<script>
	import ExampleIndex from './example.vue'
	import GitHub from './githubBtn.vue'
	import axios from 'axios'
	
	export default {
		data() {
			return{
				showWrap: false,
				showIndx: true,
				showOver: false,
				index: 0,
				id: null
			}
		},
		
		components: {
			ExampleIndex,
			GitHub
		},
		created() {
			// this.judgeSystem()
			this.id = this.$route.params.id
		},
		
		mounted() {
			
			this.readData()
		},
		
		methods: {
			judgeSystem() {
				if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
					this.$router.push('/light-show/error')
				}
			},
			
			openGitHub(url) {
				window.open(url)
			},
			getPage(currentPage, totalPage, step) {
				let show = currentPage >= totalPage ? true : false
				let id = null
				if(show) {
					id = setTimeout(()=>{
						this.showWrap = true
					}, 2000)
				} else{
					clearTimeout(id)
					this.showWrap = false
				}
				this.showOver = step === 2 ? true : false
			},
			closeIndex() {
				this.showIndx = false
				this.$nextTick(() => {
					this.readData()
				})
			},
			openEdit() {
				window.open('https://www.cxzweb.club/#/light-show/edit')
			},
		
			
			async readData() {
				try{			
					const { data } = await axios.post( 'https://www.cxzweb.club/api/getData',{ id: this.id})
					console.log(data)
					const content = data.content
					if(content) {
						let string = content.ppt_data
						let json = string ? JSON.parse(string) : undefined
						this.$refs.read.initData(json)
					}else{
						this.$tip({content: '没有该PPT内容'})
					}
				}catch(e){
					console.log(e)
				}
				
			}
			
			
		}
	}
</script>

<style scoped>
	.example__read {
		width: 100%;
		height: 100%;
		position: relative;
	}
	
	.over__main{
		position: fixed;
		left: 0px;
		top: 0px;
		background-color: rgba(0,0,0,0.6);
		z-index: 9999;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	.example__over{
		width: 300px;
		height: 120px;
		background-image: linear-gradient( 135deg, #81FFEF 10%, #F067B4 100%);
		border-radius: 10px;
		color: white;
		padding: 10px;
		font-weight: bold;
		font-size: 20px;
		box-shadow: 0px 0px 6px 2px white;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		
	}
	
	.title1, .title2{
		margin: 0px;
		padding: 0px;
		text-align: center;
		font-size: 20px;
	}
	.title1{
		font-size: 24px;
		color: red;
		font-weight: bold;
	}
	
	.over__btn{
		margin-top: 10px;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	
	.over__close{
		background-color: #f5f5f5;
		padding-left: 5px;
		padding-right: 5px;
		width: 90px;
		height: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: black;
		font-size: 18px;
		letter-spacing: 1px;
		font-weight: normal;
		cursor: pointer;
		border: 1px solid #d5d5d5;
		user-select: none;
	}
	
	.over__close:active {
		background-color: lightgray;
	}
	
	.github__wrap{
		position: absolute;
		z-index: 6000;
		left: 200px;
		top: 80px;
		animation-iteration-count: infinite;
		animation-duration: 2s;
	}
	
	.edit__address{
		user-select: none;
		padding: 5px 10px;
		border-radius: 5px;
		background-color: orangered;
		color: white;
		cursor: pointer;
		box-shadow: 0px 0px 5px black;
		transition: background-color .1s ease-in;
		
	}
	.edit__address:active{
		background-color: firebrick;
	}
</style>
