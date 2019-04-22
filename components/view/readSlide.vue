<template>
	<div class="read__wrap" @dblclick="close" >
		<div class="read__shade" ref="shade">
			<div class="shade__ball" ref="ball"></div>
		</div>
		
		
		
		<div class="read__btn">
			<div class="read__icon read__left" @click="back"></div>
			<div class="read__page">{{ currentPage + 1 }}</div>
			<div class="read__icon read__right" @click="next"></div>
		</div>
		
		<div class="read read__opacity"   ref="ppt"></div>
	</div>
	
</template>

<script>
	
	let READ_DATA = null
	let BAC_DATA = null
	let DOM_LIST = []
	export default {
		name: 'read-slide',
		data() {
			return{
				height: 0,
				currentPage: 0,
				currentStep: 0,
				canNext: true,
				currentDomList: [],
				index: 0,
				last: false,
				wk: 1, //长比例系数
				hk: 1 // 高比例系数
			}
		},
		
		
		watch: {
			currentPage(newValue, oldValue) {
				let dom = this.$refs.ppt
				dom.classList.remove('read__opacity')

			}
		},
		
		mounted() {
			this.initData()
			this.$refs.shade.addEventListener('animationend', () => {
				this.$refs.shade.style = "display:none"
				this.canNext = true
				// this.next()
				let dom = this.$refs.ppt
				dom.classList.add('read__opacity')
				dom.style =  BAC_DATA[this.currentPage]
				if(this.last) {
					this.createDom()
				}
				
			})
		},
		
		
		methods: {
			initData() {
				this.height = document.body.clientHeight
				const data = JSON.parse(localStorage.getItem('cxzppt')) 
				READ_DATA = data[0]
				BAC_DATA = data[1]
				this.$refs.ppt.style =  BAC_DATA[this.currentPage]
			},
			
			close() {
				this.$emit('close')
			},
			
			back() {
				this.currentStep --
				console.log('目前索引', this.currentStep)
				if(this.currentStep < 0) {
					if(this.currentPage === 0) {
						this.currentStep = 0
						console.log('当前页数据', READ_DATA[this.currentPage])
						return console.log('回到最初了')
					} else{
						this.currentPage  =  --this.currentPage < 0 ? 0 :  this.currentPage
						this.currentStep = READ_DATA[this.currentPage].length 
						console.log('上一页', this.currentPage)
						this.last = true
						this.$refs.shade.style = "display: flex;"
						console.log(DOM_LIST[this.index - 1], this.currentStep)
						console.log('当前页数据', READ_DATA[this.currentPage])
						return
					}
				}else {
					console.log(DOM_LIST[this.index - 1], '要删除的节点')
					DOM_LIST[this.index - 1].forEach((item) => {
						let child = document.getElementById(item)
						child.parentNode.removeChild(child)
					})
					console.log(this.currentStep)
					this.index --
					console.log('当前页数据', READ_DATA[this.currentPage])
				}
			},
			
			createDom() {
				this.last = false
				READ_DATA[this.currentPage].forEach((domList) => {
					domList.forEach((item) => {
						let oDom = document.createElement('div')
						
						item.css.forEach((className) => {
							oDom.classList.add(className)
						})
						oDom.style = item.style
						if(item.content) {
							oDom.innerHTML = item.content
						}
						oDom.id = item.id
						oDom.class = item.css
						oDom.classList.add('animated')
						if(item.moveIn) {
							oDom.classList.add(item.moveIn)
						}
						if(item.fontSize) {
							oDom.style.fontSize = parseFloat(item.fontSize) * this.height + 'px'
						}
						this.$refs.ppt.append(oDom)
						
					})
				})
			},
			
			
			next() {
				if(!this.canNext) return
				let data = READ_DATA[this.currentPage] || false
				if(!data) {
					return console.log('over')
				}
				
				if(this.currentStep >= data.length) {
					
					if(this.currentPage + 1 >= READ_DATA.length) {
						console.log('播放完毕')
						return 
					} else {
						this.currentPage = this.currentPage + 1
						setTimeout(() => {
							this.$refs.ppt.innerHTML = ''
						}, 400)
						this.canNext = false
						this.$refs.shade.style = "display: flex;"
						this.currentStep = 0
						return
					}
				}
				
				
				console.log('当前页数据', READ_DATA[this.currentPage])
				
				
				
				
				let domList = []
				let domId = []
				READ_DATA[this.currentPage][this.currentStep].forEach(item => {
					let oDom = undefined
					console.log('读取的类型', item.domType, item)
					if(item.domType === 'video') {
						oDom = document.createElement('video')
						oDom.src = item.src
						oDom.autoplay = "true"
						
					}else {
						oDom = document.createElement('div')
					}
					
					item.css.forEach((className) => {
						oDom.classList.add(className)
					})
					oDom.style = item.style
					if(item.content) {
						oDom.innerHTML = item.content
					}
					
					oDom.id = item.id
					oDom.classList.add('animated')
					if(item.moveIn) {
						oDom.classList.add(item.moveIn)
					}
					if(item.fontSize) {
						oDom.style.fontSize = parseFloat(item.fontSize) * this.height + 'px'
					}
					
					domList.push(oDom)
					domId.push(oDom.id)
					this.$refs.ppt.append(oDom)
				})
				DOM_LIST[this.index] = domId
				this.index ++
				console.log('目前的栈', DOM_LIST)
				this.currentStep++ 
			}
		},
	}
</script>

<style>
	@import url("./ppt.css");
	@import url("./animate.min.css");
	.read__wrap{
		width: 100%;
		height: 100%;
		position: fixed;
		background-color: white;
		z-index: 2000;
		left: 0px;
		top: 0px;
	}
	
	.read{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0px;
		top: 0px;
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		transition:  opacity ease-in-out .4s;
		opacity: 0;
		/* width: 1000px;
		height: 620px;
		box-shadow: 0px 1px 20px 2px hotpink;
		background-color: white; */	
	}
	
	.read__opacity{
		opacity: 1;
	}
	
	
	
	.remove{
		animation: removeAll linear 3s infinite;
	}
	
	.read__shade{
		position: fixed;
		z-index: 9999;
		width: 100%;
		height: 100%;
		display: none;
		left: 0px;
		top: 0px;
		justify-content: center;
		align-items: center;
		display: none;
	}
	
	.shade__ball {
		animation:  removeAll ease-in-out 1s  both alternate 2;
		will-change: transform; 
		width: 200px;
		height: 200px;
		background-color: cadetblue;
		border-radius: 50%;
	}
	
	.read__btn{
		width: 200px;
		height: 40px;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 10px;
		display: flex;
		justify-content: space-between;
		z-index: 3000;
		align-items: center;
		opacity: 0;
		transition: opacity ease-in .4s;
	}
	
	.read__btn:hover {
		opacity: 1;
	}
	
	.read__icon{
		background-image: url(./asserts/left.svg);
		background-size: contain;
		background-repeat: no-repeat;
		width: 60px;
		height: 40px;
		background-position: center;
		cursor: pointer;
		opacity: 1;
		
	}
	
	.read__page {
		color: #70A8AA;
		font-family: "courier new";
		font-size: 20px;
		font-weight: bold;
	}
	

	
	
	.read__icon:active {
		background-image: url(./asserts/left-active.svg);
	}
	
	.read__right{
		transform: rotateZ(180deg);
		left: 100%;
	}
	
	@keyframes removeAll{
		from{
			transform: scale(0) translate(0px);
			opacity: 0.8;
		}
		to{
			transform: scale(12) translate(10px);
			opacity: 1;
		}
	}
	
	
</style>
