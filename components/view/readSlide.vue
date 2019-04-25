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
	let LEAVE_DATA = null
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
		
		created() {
			this.$read.init()
		},
		
		mounted() {
			this.$refs.shade.addEventListener('animationend', () => {
				this.$refs.shade.style = "display:none"
				this.canNext = true
				// this.next()
				let dom = this.$refs.ppt
				dom.classList.add('read__opacity')
				dom.style =  BAC_DATA[this.currentPage]
				if(this.last) {
					this.last = false
					READ_DATA[this.currentPage].forEach((domList) => {
						domList.forEach((item) => {
							this.createToDom(item, true)
						})
					})
				}
				
			})
		},
		
		
		methods: {
			initData(requestData) {
				this.height = document.body.clientHeight
				
				const data = requestData ? requestData : JSON.parse(localStorage.getItem('cxzppt'))
				
				if(!data) {
					this.$tip({content: '没有数据'})
					this.$read.close()
					this.close()
					return
				}
				READ_DATA = data[0]
				BAC_DATA = data[1]
				this.$refs.ppt.style =  BAC_DATA[this.currentPage]
				
				let i = 0
				
				console.log('图片数据', data[2])
				if(!Array.isArray(data[2]) )  {
					this.$read.close().then(() => {
						// this.$tip({content: '加载完毕'})
					})
					
					return 
				}
				let length = data[2].length
				if(length === 0) {
					this.$read.close().then(() => {
						// this.$tip({content: '加载完毕'})
					})
					return 
				}
				
				
				if(length > 0) {
					data[2].forEach((item) => {
						let oImg = new Image()
						oImg.onload = () => {
							++i
							if( i >= length) {
								this.$read.close()
								// this.$tip({content: '加载完毕'})
							}
							oImg.onload = null
							oImg = null
							
						}
						oImg.src = item
						
					})
				}
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
						this.$tip({content: '第一页了哦！'})
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
					console.log(DOM_LIST, '要删除的节点')
					DOM_LIST[this.index - 1].forEach((item) => {
						console.log('开始添加', item)
						this.createToDom(item, false)
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
					return this.$tip({content: '最后页了哦！'})
				}
				
				if(this.currentStep >= data.length) {
					
					if(this.currentPage + 1 >= READ_DATA.length) {
						this.$tip({content: '最后页了哦！'})
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
					domList.push(item)
					this.createToDom(item, true)
				})
				DOM_LIST[this.index] = domList
				this.index ++
				console.log('目前的栈', DOM_LIST)
				this.currentStep++ 
			},
			
			createToDom(item, reversal) {
				
				let condition = reversal ? item.isLeave : !item.isLeave
				let oDom = undefined
				// 删除本次要离开的节点
				if(condition) {
					let removeDom = document.getElementById(item.id)
					removeDom.addEventListener('animationend', leaveMove) 
					removeDom.classList.add('zoomOut')
					
					function leaveMove() {
						removeDom.removeEventListener('animationend', leaveMove)
						removeDom.parentNode.removeChild(removeDom)
					}
					
					
					// 
				}else {
					
					// 生成节点
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
					
					console.log('开始生成', oDom)
					this.$refs.ppt.append(oDom)
					
				}
				// 
				
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
		width: 190px;
		height: 40px;
		position: absolute;
		left: 50%;
		margin-left: -95px;
		bottom: 10px;
		display: flex;
		justify-content: space-between;
		z-index: 3000;
		align-items: center;
		opacity: 1;
		transition: transform ease-in .2s;
		font-weight: bold;
		
	}
	
	.read__btn:hover {
		transform: scale(1.1);
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
		font-size: 22px;
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
