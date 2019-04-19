<template>
	<div class="edit" @click="cancaleSelect($event)">
		<read v-if="showRead" @close="close"></read>
		<!-- <div @click="set">存储</div>
		<div @click="get">读取</div> -->
		<!-- <input type="file" @change="upload()" ref="source"> -->
		<div class="edit__wrap" ref="ppt"></div>
		
		<div class="ppt_page">第&nbsp;{{currentPage + 1}}&nbsp;页</div>
		<div class="edit__operation">
			<div class="edit__select" v-show="!showTitle">
				
				
				<div class="edit__box edit__title">
					<div class="edit__icon back_icon" @click="toBack"></div>
					<div class="title_tip">上一页</div>
				</div>
				
				<div class="edit__box edit__title" @click="addTitle">
					<div class="edit__icon title_icon"></div>
					<div class="title_tip">文本框</div>
				</div>
				
				<div class="edit__box edit__title" @click="save">
					<div class="edit__icon title_icon" ></div>
					<div class="title_tip">保存</div>
				</div>
				
				<div class="edit__box edit__title">
					<div class="edit__icon read_icon" @click="showRead=true"></div>
					<div class="title_tip" >预览</div>
				</div>
				
				<div class="edit__box edit__title">
					<div class="edit__icon video_icon" @change="showRead=true"></div>
					<div class="title_tip" >视频</div>
				</div>
				
				
				<div class="edit__box edit__title" >
					<label class="edit__icon img_icon" >
						<input type="file" style=" display: none;" @change="addImg" ref="source">
					</label>
					<div class="title_tip">图片</div>
				</div>
				
				
				<div class="edit__box edit__title" >
					<div class="edit__icon next_icon" @click="toNext"></div>
					<div class="title_tip">下一页</div>
				</div>
				
				
			</div>
			
			<!-- 文字操作框 -->
			<div class="title__operation" v-show="showTitle">
				<div class="edit__box">
					<div class="edit__icon B_icon" @click="addBold"></div>
					<div class="title_tip">加粗</div>
				</div>
				
				<div class="edit__box">
					<label class="edit__icon bac_icon" >
						<input type="file" style=" display: none;" @change="addBac" ref="bacSource">
					</label>
					<div class="title_tip">背景</div>
				</div>
				
				<div class="edit__box">
					<div class="edit__icon move_icon"></div>
					<div class="title_tip">运动</div>
					
					<div class="move__select">
						<div class="move__btn" v-for="item in moveList" @click.stop="addMove(item)"><span class="animated infinite" style="animation-duration: 2s;" :class="item" >Animate</span></div>
					</div>
				</div>
				
				
				<div class="edit__box">
					<div class="title__size" v-if="domType==='title'"><span class="title__name">size:</span><input class="font__input" type="text" v-model="fontSize"></div>
					<div class="title__size" v-if="domType==='img'"><span class="title__name">opacity:</span><input class="font__input" type="text" v-model="currentOpacity"></div>
					<div class="title__size"><span class="title__name">level:</span><input class="font__input" type="text" v-model="currentLevel"></div>
				</div>
				
				<div class="edit__box">
					<div class="title__size"><span class="title__name">width:</span><input class="font__input" type="text" v-model="currentWidth"></div>
					<div class="title__size"><span class="title__name">height:</span><input class="font__input" type="text" v-model="currentHeight"></div>
				</div>
				
				<div class="edit__box">
					<div class="title__size"><span class="title__name" style="width:100px;">start order:</span><input class="font__input" type="text" v-model="currentOrder"></div>
					<div class="title__size"><span class="title__name" style="width:100px">leave order:</span><input class="font__input" type="text" v-model="currentLeaveOrder"></div>
				</div>
				
				<div class="edit__box">
					<div class="title__size"><span class="title__name">X:</span><input class="font__input" type="text" v-model="currentX"></div>
					<div class="title__size"><span class="title__name">Y:</span><input class="font__input" type="text" v-model="currentY"></div>
				</div>
				
				<div class="edit__box">
					<div class="title__size"><span class="title__name">color:</span><input class="font__input" type="text" v-model="currentX"></div>
					<div class="title__size"><span class="title__name">background color:</span><input class="font__input" type="text" v-model="currentY"></div>
				</div>
				
				
			</div>
			
		</div>
	</div>
</template>

<script>
	const fs = require('fs')
	const path = require('path')
	import { remote } from 'electron'
	import read from './read.vue'
	let SAVE_DATA = null
	let SAVE_TEMP = []
	let READ_DATA = null
	export default {
		name: 'edit-ppt',
		created() {
			console.log(remote.app.getPath('userData'))
			console.log(remote.app.getAppPath())
			
			this.initData()
		},
		
		components: {
			read
		},
		mounted() {
			this.getScreenInfo()
		},
		
		
		data() {
			return {
				showRead: false,
				sW: 0,
				sH: 0,
				wrapH: 0,
				wrapW: 0,
				zIndex: 0,
				x: 0,
				y: 0,
				fontSize: 3.2,
				showTitle: false,
				currentDom: null,
				currentOpacity: 1,
				currentWidth: 0,
				currentHeight: 0,
				currentX: 0,
				currentY: 0,
				currentLevel: 0,
				currentOrder: 0,
				currentLeaveOrder: 0,
				domType: null,
				recordData: [],
				recordTemp: [],
				currentPage: 0,
				target: 0,
				currentStep: 0,
				id: 0,
				moveList: [
					'bounce',
					'flash',
					'pulse',
					'rubberBand',
					'shake',
					'headShake',
					'swing',
					'tada',
					'wobble',
					'jello',
					'bounceIn',
					'bounceInDown',
					'bounceInLeft',
					'bounceInRight',
					'bounceInUp',
					'bounceOut',
					'fadeIn',
					'fadeInDown',
					'fadeInDownBig',
					'fadeInLeft',
					'fadeInLeftBig'
				],
				canAddMove: true,
				recordImg: []
			}
		},
		watch: {
			fontSize(newValue, oldValue) {
				if(!this.currentDom) {
					this.fontSize = 3.2
					return
				}
				this.currentDom.style.fontSize = newValue + 'vh'
			},
			
			currentWidth(newValue) {
				this.currentDom.style.width = newValue + 'vw'
			},
			
			currentHeight(newValue) {
				this.currentDom.style.lineHeight = newValue + 'vh'
				this.currentDom.style.height = newValue + 'vh'
				console.log(123)
			},
			
			currentX(newValue) {
				this.currentDom.style.left = newValue + 'vw'
			},
			
			currentY(newValue) {
				this.currentDom.style.top = newValue + 'vh'
			},
			
			currentLevel(newValue) {
				this.currentDom.style.zIndex = newValue
			},
			
			currentOpacity(newValue) {
				this.currentDom.style.opacity = newValue
			},
			
			currentOrder(newValue) {
				this.currentDom.dataset.order = parseInt(newValue)
			},
			
			currentLeaveOrder(newValue) {
				this.currentDom.dataset.leaveOrder = newValue
			}
		},
		methods: {
			close() {
				this.showRead = false
			},
			initData() {
				const url = remote.app.getPath('userData') + '/ReadyBoy.js'
				fs.readFile(url, 'utf-8', (err, data) => {
					READ_DATA = JSON.parse(data)
					console.log(READ_DATA)
				})
			},
				
			
			// 获取屏幕大小
			getScreenInfo() {
				this.sW = document.body.clientWidth
				this.sH = document.body.clientHeight
				this.wrapH = this.$refs.ppt.clientHeight
				this.wrapW = this.$refs.ppt.clientWidth
			},
			
			// 下一
			toNext() {
				this.save()
				this.currentPage ++
				this.$refs.ppt.innerHTML = ''
				this.$refs.ppt.style =  this.recordImg[this.currentPage] || ''
				this.readDom()
			},
			
			
			
			toBack() {
				this.save()
				this.currentPage --
				this.$refs.ppt.innerHTML = ''
				this.$refs.ppt.style =  this.recordImg[this.currentPage] || ''
				this.readDom()
			},
			
			
			readDom() {
				
				let data = this.recordTemp[this.currentPage]
				
				if(!data || data.length === 0) return
				
				data.forEach( (currentList) => {
					currentList.forEach((item) => {
						if(item.domType === 'title'){
							let oDom = document.createElement('input')
							item.css.forEach((className) => {
								oDom.classList.add(className)
							})
							oDom.style = item.style
							oDom.value = item.content
							oDom.id = item.id
							item.css.forEach((className) => {
								oDom.classList.add(className)
							})
							oDom.dataset.domType = item.domType
							oDom.dataset.moveIn = item.moveIn
							oDom.dataset.order = item.order
							oDom.dataset.left = item.left
							oDom.dataset.top = item.top
							oDom.dataset.leaveOrder = item.leaveOrder
							// oDom.dataset = item.dataset
							console.log('mydom', oDom)
							this.addMoveListen(oDom)
							this.$refs.ppt.append(oDom)
						}else if(item.domType === 'img') {
							
						}
					})
				})
			},
			
		
			
			// 添加文本框
			addTitle() {
				let oInput = document.createElement('input')
				oInput.style = 'transition: transfrom linear 1s;transition: opacity linear 1s;position:absolute;font-size:2.4vh;width:20vw;height:6vh;z-index:0;text-align: left;'
				
				oInput.classList.add('__input')
				oInput.dataset.cTarget = this.target++
				oInput.dataset.domType = 'title'
				oInput.dataset.order = 0
				oInput.dataset.leaveOrder = 0
				oInput.id = 'cxz' + this.id ++
				this.addMoveListen(oInput)
				this.$refs.ppt.append(oInput)
				oInput.value = '请输入文本内容'
				oInput.focus()
				
			},
			
			addBac() {
				let source = this.$refs.bacSource
				let reader = new FileReader()
				let name = Math.random()
				reader.onload = (e)=> {
					let url = path.join(remote.app.getPath('userData'), `${name}png`)
					console.log(url)
					fs.writeFile(url, reader.result,  "binary", () => {
						let newURL = url.replace(/\\/g, "/");
						const value = `background-image:url(file:///${newURL});`
						this.$refs.ppt.style =  value
						this.recordImg[this.currentPage] = value
					})
					
				}
				
				reader.readAsBinaryString(source.files[0])
			},
			
			addImg() {
				let source = this.$refs.source
				let reader = new FileReader();
				let name = Math.random()
				reader.onload = (e)=> {
					let url = path.join(remote.app.getPath('userData'), `${name}png`)
					console.log(url)
					fs.writeFile(url, reader.result,  "binary", () => {
						let oDiv = document.createElement('div')
						oDiv.classList.add('__img-wrap')
						oDiv.dataset.order = 0
						oDiv.id = 'cxz' + this.id ++
						oDiv.dataset.cTarget = this.target ++  
						oDiv.dataset.domType = 'img'
						oDiv.dataset.leaveOrder = 0
						let newURL = url.replace(/\\/g, "/");
						oDiv.style =  `background-image:url(file:///${newURL}); transition: transfrom linear 1s;transition: opacity linear 1s;position:absolute;width:20vw;height:20vh;z-index:0;opacity:1`
						this.addMoveListen(oDiv)
						this.$refs.ppt.append(oDiv)
					})
				}
				reader.readAsBinaryString(source.files[0])
			},
			
			savaTemp(){
				
			},
			
			// 保存数据
			save() {
				let list = Array.from(this.$refs.ppt.children)
				console.log('当前页面的节点', list)
				let temp = []
				list.forEach((item) => {
		
					if(item.dataset.leaveOrder == 0) {
						let data = {
							domType: item.dataset.domType,
							style: item.style.cssText,
							id: item.id,
							css: Array.from(item.classList),
							content: item.value || undefined,
							moveIn: item.dataset.moveIn,
							order: item.dataset.order,
							left: item.dataset.left, 
							top: item.dataset.top,
							leaveOrder: item.dataset.leaveOrder
						}
						if(Array.isArray(temp[item.dataset.order])) {
							temp[item.dataset.order].push(data)
						} else{
							temp[item.dataset.order] = [data] 
						}
						
					}
					
				})
				console.log('存储的数据1', temp)
				this.recordTemp[this.currentPage] = temp
				SAVE_TEMP[0] = this.recordTemp
				let imgTemp = []
				for(let i = 0; i < SAVE_TEMP[0].length; ++i) {
					imgTemp[i] = this.recordImg[i] || ''
				}
				SAVE_TEMP[1] = imgTemp
				SAVE_DATA = JSON.stringify(SAVE_TEMP)
				const url = remote.app.getPath('userData') + '/ReadyBoy.js'
				console.log('所有的数据', this.recordTemp)
				fs.writeFile(url, SAVE_DATA, (err, data) => {
					console.log(err)
				})
				
			},
			
			stringifyClass(classList) {
				console.log(classList)
				let list = Array.from(classList)
				let value = list.join(' ')
				console.log(1)
				return value
			},
			
			
			// 为元素添加事件
			addMoveListen(dom) {
				dom.onmousedown = (e) => {
					this.domType = dom.dataset.domType
					console.log('dom类型', this.domType)
					dom.classList.add('select__dom')
					this.x = e.offsetX
					this.y = e.offsetY
					if(this.currentDom && this.currentDom.dataset.cTarget != dom.dataset.cTarget) {
						this.currentDom.classList.remove('select__dom')
					}
					
					this.currentDom = dom
					this.showTitle = true
					
					this.fontSize = parseFloat(dom.style.fontSize)
					this.currentWidth = parseFloat(dom.style.width)
					this.currentHeight = parseFloat(dom.style.height)
					this.currentLevel = parseFloat(dom.style.zIndex)
					this.currentX = parseFloat(dom.style.left)
					this.currentY = parseFloat(dom.style.top)
					this.currentOpacity = parseFloat(dom.style.opacity)
					this.currentOrder = dom.dataset.order
					this.currentLeaveOrder = dom.dataset.leaveOrder
					
					document.onmousemove = (e) => {
						const top = Math.ceil((e.clientY - this.y)/this.sH * 100 * 10000) / 10000 + 'vh'
						const left = Math.ceil((e.clientX - this.x)/this.sW * 100 * 10000) / 10000 + 'vw'
						dom.dataset.top = Math.ceil((e.clientY - this.y)/this.wrapH * 100 * 10000) / 10000 + 'vh'
						dom.dataset.left = Math.ceil((e.clientX - this.x)/this.wrapW * 100 * 10000) / 10000 + 'vw'
						dom.style.top = top
						dom.style.left = left
					}
					document.onmouseup = (e) => {
						document.onmousemove = null
						this.currentX = parseFloat(dom.style.left)
						this.currentY = parseFloat(dom.style.top)
					}
				}
// 				dom.onfocus = () => {
// 					
// 					
// 				}
// 				dom.onblur = () => {
// 					this.showTitle = false

// 				}
			},
			
			cancaleSelect(e) {
				if(!(e.target.className === 'edit__wrap')) {return}
				if(this.currentDom) {
					this.currentDom.classList.remove('select__dom')
				}
				
				this.currentDom = null
				this.showTitle = false
			},
			
			addBold() {
				this.currentDom.style.fontWeight = 'bold'
			},
			
			addMove(item) {
				console.log(123, this.canAddMove)
				let dom = this.currentDom
				let self = this
				if(!this.canAddMove) return
 				this.canAddMove = false
				dom.addEventListener('animationend', remove)
				
				function remove() {
					console.log('结束了')
					dom.classList.remove(item)
					dom.classList.remove('animated')
					dom.onanimationend = null
					self.canAddMove = true
					dom.removeEventListener('animationend', remove)
				}
				
				dom.classList.add('animated')
				dom.classList.add(item)
				dom.dataset.moveIn = item
// 				setTimeout(() => {
// 					this.currentDom.classList.add('slideOutLeft')
// 				}, 3000)
			},
						
			upload() {
				let source = this.$refs.source
				console.log(source)
				var reader = new FileReader();
				reader.onload = function(e) {
					fs.writeFile(remote.app.getPath('userData') + '/test.png', reader.result,  "binary", function() {
						console.log(123)
					})
				}
				reader.readAsBinaryString(source.files[0])
			},
			set() {
				this.$db.insert({id: 1, name: 'cxz'}, function(err, new_doc){
					console.log(err, new_doc);
				})
			},
			get() {
				this.$db.find({id: 1}, function(err, docs){
					console.log(err, docs);
				});
			}
		}
	}
</script>

<style scoped>
	@import url("./ppt.css");
	@import url("./animate.min.css");
	.edit{
		width: 100%;
		height: 100%;
		background-color: white;
		display: flex;
		flex-direction: column;
		
	}
	
	.edit__wrap{
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		border: 2px solid #70A8AA;
		border-bottom: none;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}
	
	.ppt_page{
		position: absolute;
		bottom: 64px;
		left: 50%;
		transform: translateX(-50%);
		color: lightslategray;
		font-size: 1.8vmin;
		vertical-align: baseline;
	}
	
	.edit__operation{
		height: 60px;
		box-shadow: 0px -2px 5px rgba(0,0,0,0.3);
		background-color: darkslategray;
		display: flex;
		align-items: center;
		color: white;
	}
	
	.edit__select{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
	
	.title__operation{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
	
	.edit__box{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		cursor: pointer;
		position: relative;
	}
	
	.move__select {
		width: 380px;
		background-color: #80808085;
		box-shadow: 0px 1px 20px rgba(0,0,0,0.3);
		position: absolute;
		left: -17px;
		top: -253px;
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		padding: 12px;
		box-sizing: border-box;
		padding-top: 10px;
		padding-bottom: 5px;
	}
	
	.move__btn {
		color: black;
		font-weight: bold;
		width: 60px;
		height: 40px;
		background-color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.8vmin;
		overflow: hidden;
		margin-bottom: 5px;
	}
	
	.edit__icon{
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		width: 30px;
		height: 30px;
	}
	
	
	.title_icon {
		background-image: url(./asserts/title.svg)
	}
	
	.B_icon {
		background-image: url(./asserts/bold.svg)
	}
	
	.bac_icon {
		background-image: url(./asserts/bac.svg)
	}
	
	.bac_icon:active {
		background-image: url(./asserts/bac1.svg)
	}
	
	.move_icon {
		background-image: url(./asserts/move.svg);
	}
	
	.back_icon{
		background-image: url(./asserts/last1.svg);
	}
	
	.next_icon {
		background-image: url(./asserts/next1.svg);
	}
	
	.img_icon{
		background-image: url(./asserts/png.svg);
		cursor: pointer;
	}
	
	.read_icon{
		background-image: url(./asserts/read.svg);
	}
	
	.video_icon{
		background-image: url(./asserts/video.svg);
	}
	
	.font__input{
		border: none;
		width: 50px;
		background-color: transparent;
		font-family: fantasy;
		color: deeppink;
		text-align: center;
	}
	
	.title__name{
		width: 50px;
		text-align: left;
		display: inline-block;
	}
	
	
	
</style>
