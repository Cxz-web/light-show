<template>
	<div class="edit__main" @click="cancaleSelect($event)" ref="main">
		<div class="edit"  ref="wrap">
			<read-slide v-if="showRead" @close="close" ref="readSlide"></read-slide>
			
			
			<div class="edit__wrap" ref="ppt"></div>
			
			<div class="ppt_page">第&nbsp;{{currentPage + 1}}&nbsp;页</div>
			<div class="edit__operation">
				<div class="edit__select" v-show="!showTitle">
					
					
					<div class="edit__box edit__title" @click="toBack">
						<div class="edit__icon back_icon"></div>
						<div class="title_tip">上一页</div>
					</div>
					
					<div class="edit__box">
						<label class="edit__icon bac_icon" >
							<input type="file" style=" display: none;" @change="addImg($event, 'bacImg')" ref="bacSource">
						</label>
						<div class="title_tip">背景图</div>
					</div>
					
					<div class="edit__box edit__title" @click="addTitle">
						<div class="edit__icon title_icon"></div>
						<div class="title_tip">文本框</div>
					</div>
					
					
					
					<div class="edit__box edit__title" @click="save">
						<div class="edit__icon sava_icon" ></div>
						<div class="sava_tip">保存</div>
					</div>
					
					<div class="edit__box edit__title" @click="openRead">
						<div class="edit__icon read_icon" ></div>
						<div class="title_tip" >预览</div>
					</div>
					
					<div class="edit__box edit__title" @click="addVideo">
						<div class="edit__icon video_icon" ></div>
						<div class="title_tip" >视频</div>
					</div>
					
					
					<div class="edit__box edit__title" >
						<div class="edit__icon box__icon" @click="openBacWrap"></div>
						<div class="title_tip" >背景色</div>
						<transition name="fade">
							<div class="bac__wrap" v-show="showBacWrap">
								<div class="bac__box"><input type="text" class="font__input bac__input" v-model="bacLeft"> <span class="bac__color" @click="openBacColor(true)" :style="{backgroundColor: bacLeft, boxShadow: bacShadowLeft}"></span></div>
								<div class="bac__box"><input type="text" class="font__input bac__input" v-model="bacRight"> <span class="bac__color" @click="openBacColor(false)" :style="{backgroundColor: bacRight, boxShadow: bacShadowRight}"></span></div>
								
								<transition name="fade">
									<div class="color__picker color__picker--bac" v-show="showBacColor">
										<div class="cp-default cx-default" ref="bacColor"></div>
									</div>
								</transition>
							</div>
						</transition>
					</div>
					
					
					<div class="edit__box edit__title" >
						<label class="edit__icon img_icon" >
							<input type="file" style=" display: none;" @change="addImg($event, 'img')" ref="source">
						</label>
						<div class="title_tip">图片</div>
					</div>
					
					
					<div class="edit__box edit__title" @click="toNext">
						<div class="edit__icon next_icon" ></div>
						<div class="title_tip">下一页</div>
					</div>
					
					
				</div>
				
				<!-- 文字操作框 -->
				<div class="title__operation" v-show="showTitle">
					
					
					<div class="edit__box" @click="cancelDom">
						<div class="edit__icon cancel_icon"></div>
						<div class="title_tip">删除</div>
					</div>
					
					
					<div class="edit__box" v-show="domType==='title'" @click="addBold">
						<div class="edit__icon B_icon" :class="{BB_icon: currentBold==='bold'}"></div>
						<div class="title_tip">加粗</div>
					</div>
					
					<div class="edit__box" @click="showMove= !showMove">
						<div class="edit__icon move_icon"></div>
						<div class="title_tip" >动画</div>
						
						<transition name="bounce">
							<div class="move__select" v-show="showMove">
								<div class="move__btn" :class="{slect__move: index==currentMove }" v-for="(item, index) in moveList" @click.stop="addMove(item, index)"><span class="animated infinite" style="animation-duration: 2s;" :class="item">Animate</span></div>
							</div>
						</transition>
					</div>
					
					<!-- 视频类特殊操作栏 -->
					<template v-if="domType=='video'">
						<div class="edit__box" >
							<div class="title__size"><span class="title__name">地址:</span><input  class="font__input" style="border-bottom: 1px solid white;" type="text" v-model="videoSrc"></div>
						</div>
						
						<div class="edit__box">
							<div class="title__size"><span class="title__name">模糊度</span><input  class="font__input" type="text" v-model="blur"></div>
						</div>
					</template>
					
					
					<div class="edit__box">
						<div class="title__size" v-if="domType==='title'"><span class="title__name">size:</span><input class="font__input" type="text" v-model="fontSize"></div>
						<div class="title__size" v-if="domType==='img'"><span class="title__name">opacity:</span><input class="font__input" type="text" v-model="currentOpacity"></div>
						<div class="title__size"><span class="title__name">level:</span><input class="font__input" type="text" v-model="currentLevel"></div>
					</div>
					
					<div class="edit__box">
						<div class="title__size"><span class="title__name">宽度:</span><input @keydown="down($event)" class="font__input" type="text" v-model="currentWidth"></div>
						<div class="title__size"><span class="title__name">高度:</span><input class="font__input" type="text" v-model="currentHeight"></div>
					</div>
					
					
					
					<div class="edit__box">
						<div class="title__size"><span class="title__name" style="width:100px;">出场顺序:</span><input class="font__input" type="text" v-model="currentOrder"></div>
						<div class="title__size"><span class="title__name" style="width:100px">离场顺序:</span><input class="font__input" type="text" v-model="currentLeaveOrder"></div>
					</div>
					
					<div class="edit__box">
						<div class="title__size"><span class="title__name">X坐标:</span><input class="font__input" type="text" v-model="currentX"></div>
						<div class="title__size"><span class="title__name">Y坐标:</span><input class="font__input" type="text" v-model="currentY"></div>
					</div>
					
					<div class="edit__box">
						<div class="title__size"><span class="title__name">颜色:</span><span class="color__box" @click="openColor(0, $event)" ref="color1"></span></div>
						<div class="title__size"><span class="title__name">背景:</span><span class="color__box" @click="openColor(1, $event)" ref="color2"></span></div>
						<transition name="fade">
							<div class="color__picker" v-show="showColor">
								<div class="cp-default cx-default" ref="color"></div>
							</div>
						</transition>
					</div>
					
					
				</div>
				
			</div>
		</div>
	</div>
</template>

<script>
	let SAVE_DATA = null
	let SAVE_TEMP = []
	let READ_DATA = null
	let colorPick = null
	import ColorPicker from '../public/js/colorpicker.js'
	export default {
		name: 'edit-slide',
		data() {
			return {
				addType: null,
				bacShadowLeft: '',
				bacShadowRight: '', 
				bacSelect: null,
				bacLeft: '#ffffff',
				bacRight: '#ffffff',
				showBacColor: false,
				showBacWrap: false,
				currentMove: 100,
				colorType: 0,
				showColor: false,
				showRead: false,
				showMove: false,
				sW: 0,
				sH: 0,
				wrapH: 0,
				wrapW: 0,
				zIndex: 0,
				x: 0,
				y: 0,
				offsetY: 0,
				offsetX: 0,
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
				currentBold: 'none',
				currentLeaveOrder: 0,
				videoSrc: '',
				domType: null,
				recordData: [],
				recordTemp: [],
				leaveTemp: [],
				currentPage: 0,
				target: 0,
				blur: 0,
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
					'fadeInLeftBig',
					'heartBeat',
					'jackInTheBox',
					'flipInX',
					'jackInTheBox'
				],
				canAddMove: true,
				recordImg: [],
				imgTemp: [],
				loadList: [],
				bacColorList: []
			}
		},
		created() {
			this.$waiting.add()
		},
		
		mounted() {
			this.getScreenInfo()
			window.onresize = () => {
				this.getScreenInfo()
			}
			colorPick = ColorPicker(this.$refs.color, this.colorPick)
			colorPick = ColorPicker(this.$refs.bacColor, this.bacPick)
		},
		
		beforeDestroy() {
			window.onresize = null
			this.$waiting.close()
		},
		
		watch: {
			blur(newValue) {
				console.log(`blur:(${newValue}px)`)
				this.currentDom.style.filter = `blur(${newValue}px)`
			},
			
			fontSize(newValue, oldValue) {
				if(!this.currentDom) {
					this.fontSize = 3.2
					return
				}
				this.currentDom.style.fontSize = newValue + 'px'
				this.currentDom.dataset.fontSize = newValue / this.wrapH
			},
			
			videoSrc(newValue) {
				this.currentDom.src = newValue
				this.currentDom.play()
			},
			currentWidth(newValue) {
				this.currentDom.style.width = newValue + '%'
			},
			
			currentHeight(newValue) {
				this.currentDom.style.lineHeight = newValue + '%'
				this.currentDom.style.height = newValue + '%'
				console.log(123)
			},
			
			currentX(newValue) {
				this.currentDom.style.left = newValue + '%'
			},
			
			currentY(newValue) {
				this.currentDom.style.top = newValue + '%'
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
			},
			
			bacLeft(newValue) {
				let str = `background-image:linear-gradient(135deg, ${newValue} 0%, ${this.bacRight} 100%);`
				console.log(str)
				console.log(this.$refs.ppt)
				this.$refs.ppt.style = str
				this.bacColorList[this.currentPage] = str
			},
			
			bacRight(newValue) {
				let str = `background-image:linear-gradient(135deg, ${this.bacLeft} 0%, ${newValue} 100%);`
				console.log(str)
				console.log(this.$refs.ppt)
				this.$refs.ppt.style = str
				this.bacColorList[this.currentPage] = str
			}
			
		},
		
		methods: {
			down(e) {
				this.currentWidth ++
			},
			openBacWrap() {
				this.showBacWrap = !this.showBacWrap
				this.showBacColor = false
				this.bacShadowLeft = ''
				this.bacShadowRight = ''
			},
			bacPick(hex) {
				console.log(hex)
				this[this.bacSelect] = hex
			},
			openRead() {
				this.showRead = true
				this.$nextTick(() => {
					this.$refs.readSlide.initData(SAVE_DATA)
				})
				
			},
			
			openBacColor(who) {
				let str = '0px 0px 5px 4px #9face6'
				if(who) {
					this.bacShadowLeft = str
					this.bacShadowRight = ''
					this.bacSelect = 'bacLeft'
				}else {
					this.bacShadowRight = str
					this.bacShadowLeft = ''
					this.bacSelect = 'bacRight'
				}
				this.showBacColor = true
			},
			cancelDom() {
				this.currentDom.parentNode.removeChild(this.currentDom)
				this.currentDom = null
				this.showTitle = false
			},
			
			
			initData(stringFile) {
				this.$waiting.close()
				SAVE_DATA = stringFile
				if(!Array.isArray(SAVE_DATA)) return
				this.recordTemp = SAVE_DATA[0]
				this.recordImg = this.imgTemp = SAVE_DATA[1]
				this.loadList = SAVE_DATA[2]
				this.$refs.ppt.style =  this.recordImg[this.currentPage]
				this.id = parseInt(SAVE_DATA[3])
				this.readDom()
			},
			
			openColor(type, e) {
				this.showColor = true
				this.colorType = type
			},
			
			colorPick(hex) {
				if(this.colorType === 0) {
					this.currentDom.style.color = hex
					this.currentDom.dataset.color1 = hex
					this.$refs.color1.style.backgroundColor= hex
				}else {
					this.currentDom.style.backgroundColor = hex
					this.currentDom.dataset.color2 = hex
					this.$refs.color2.style.backgroundColor = hex 
				}
			},
			
			close() {
				this.showRead = false
			},
				
			
			// 获取屏幕大小
			getScreenInfo() {
				console.log(this.$refs.wrap)
				
				this.sW = document.body.clientWidth 
				this.sH = document.body.clientHeight
				
				this.$refs.wrap.style.height = this.sH / this.sW * this.$refs.wrap.clientWidth + 60 + 'px'
				this.wrapH = this.$refs.ppt.clientHeight
				this.wrapW = this.$refs.ppt.clientWidth
				
				this.offsetX = this.$refs.wrap.offsetLeft
				this.offsetY = this.$refs.wrap.offsetTop 
				console.log(this.offsetX, this.offsetY)
			},
			
			// 下一页
			toNext() {
				this.save()
				this.currentPage ++
				this.$refs.ppt.innerHTML = ''
				this.$refs.ppt.style =  this.recordImg[this.currentPage] || ''
				this.readDom()
			},
			
			
			// 上一页
			toBack() {
				if(this.currentPage === 0) return
				this.save()
				this.currentPage --
				this.$refs.ppt.innerHTML = ''
				this.$refs.ppt.style =  this.recordImg[this.currentPage] || ''
				this.readDom()
			},
			
			createDom(oDom, item) {
				item.css.forEach((className) => {
					oDom.classList.add(className)
				})
				oDom.style = item.style
				oDom.value = item.content
				oDom.id = item.id
				oDom.dataset.domType = item.domType
				oDom.dataset.moveIn = item.moveIn
				oDom.dataset.order = item.order
				oDom.dataset.left = item.left
				oDom.dataset.top = item.top
				oDom.dataset.leaveOrder = item.leaveOrder
				this.addMoveListen(oDom)
				this.$refs.ppt.append(oDom)
			},
			
			
			readDom() {
				let data = this.recordTemp[this.currentPage]
				if(!data || data.length === 0) return
				data.forEach( (currentList) => {
					if(!Array.isArray(currentList) || currentList.length === 0) return
					currentList.forEach((item) => {
						
						let oDom = ''
						switch (item.domType){
							case 'title':
								oDom = document.createElement('input')
								oDom.autocomplete = 'off'
								this.createDom(oDom, item)
								break;
							case 'img':
								oDom = document.createElement('div')
								this.createDom(oDom, item)
								break;
							case 'video':	
								console.log('video', item)
								oDom = document.createElement('video')
								oDom.src = item.src
								oDom.controls = true
								this.createDom(oDom, item)
								break;
						}
					})
				})
			},
			
		
			
			// 添加文本框
			addTitle() {
				let oInput = document.createElement('input')
				oInput.style = 'transition: transfrom linear 1s;transition: opacity linear 1s;position:absolute;font-size:20px;width:20%;height:6%;z-index:0;text-align: left;white-space: nowrap;'
				oInput.dataset.fontSize = 20 / this.wrapH
				oInput.classList.add('__input')
				oInput.dataset.cTarget = this.target++
				oInput.dataset.domType = 'title'
				oInput.dataset.order = 0
				oInput.dataset.leaveOrder = 0
				oInput.autocomplete = 'off'
				oInput.id = 'cxz' + this.id ++
				this.addMoveListen(oInput)
				this.$refs.ppt.append(oInput)
				oInput.value = '请输入文本内容'
				oInput.focus()	
			},
			
			
			// 添加图片
			addImg(e, type) {
				let oDom = e.target
				if( oDom.value === '') return 
				this.addType = type
				let source = oDom.files[0]
				let file = new FormData()
				file.append('file', source)
				oDom.value = ''
				this.$emit('upload', file, type)
			},
			
			// 添加视频
			addVideo() {
				let oVideo = document.createElement('video')
				oVideo.style = 'transition: transfrom linear 1s;transition: opacity linear 1s;position:absolute;width:20%;height:20%;z-index:0;object-fit: fill;outline:none;'
				oVideo.classList.add('__video')
				oVideo.dataset.cTarget = this.target++
				oVideo.dataset.domType = 'video'
				oVideo.dataset.order = 0
				oVideo.dataset.leaveOrder = 0
				oVideo.id = 'cxz' + this.id ++
				oVideo.controls = 'controls'
				oVideo.loop = 'loop'
				oVideo.src = 'https://api.cxzweb.club/test.mp4' 
				this.addMoveListen(oVideo)
				this.$refs.ppt.append(oVideo)
				oVideo.play()
			},
			
			createImg(path) {
				if(this.addType === 'bacImg') {
					this.createBacImgDom(path)
				}else {
					this.createImgDom(path)
				}
				this.$waiting.close()
			},
			
			createBacImgDom(imgURL) {
				const value = `background-image:url(${imgURL});`
				this.$refs.ppt.style =  value
				this.recordImg[this.currentPage] = value
				this.loadList.push(imgURL)
			},
			
			createImgDom(imgURL) {
				let oDiv = document.createElement('div')
				oDiv.classList.add('__img-wrap')
				oDiv.dataset.order = 0
				oDiv.id = 'cxz' + this.id ++
				oDiv.dataset.cTarget = this.target ++  
				oDiv.dataset.domType = 'img'
				oDiv.dataset.leaveOrder = 0
				oDiv.style =  `background-image:url(${imgURL}); transition: transfrom linear 1s;transition: opacity linear 1s;position:absolute;width:20%;height:20%;z-index:0;opacity:1`
				this.addMoveListen(oDiv)
				this.$refs.ppt.append(oDiv)
				this.loadList.push(imgURL)
			},
			
		
			// 保存数据
			save() {
				let list = Array.from(this.$refs.ppt.children)
				let temp = []
				list.forEach((item) => {
					let dataset = JSON.parse(JSON.stringify(item.dataset))
					let data = {
						style: item.style.cssText,
						id: item.id,
						css: Array.from(item.classList),
						content: item.value || undefined,
						isLeave: false
					}
					
					
					Object.keys(dataset).forEach((item) => {
						data[item] = dataset[item]
					})
					
					
					if(data.domType === 'video') {
						data.src = item.src
					}

					
					if(Array.isArray(temp[item.dataset.order])) {
						temp[item.dataset.order].push(data)
					} else{
						temp[item.dataset.order] = [data] 
					}
					
					if(item.dataset.leaveOrder > item.dataset.order) {
						let newData = JSON.parse(JSON.stringify(data))
						newData.isLeave = true
						if(Array.isArray(temp[item.dataset.leaveOrder])) {
							temp[item.dataset.leaveOrder].push(newData)
						} else{
							temp[item.dataset.leaveOrder] = [newData] 
						}
					}
					
				})
				this.recordTemp[this.currentPage] = temp
				SAVE_TEMP[0] = this.recordTemp
				this.imgTemp = []
				for(let i = 0; i < SAVE_TEMP[0].length; ++i) {
					this.imgTemp[i] = this.recordImg[i] ? this.recordImg[i] : this.bacColorList[i] ? this.bacColorList[i] : '' 
				}
				SAVE_TEMP[1] = this.imgTemp // 背景图片
				SAVE_TEMP[2] = this.loadList // 预加载数量
				SAVE_TEMP[3] = this.id + 1
				SAVE_DATA = JSON.stringify(SAVE_TEMP)
				this.$emit('saveData', SAVE_DATA)
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
					this.showColor = false
					this.showMove = false
					this.domType = dom.dataset.domType
					dom.classList.add('select__dom')
					this.x = e.offsetX
					this.y = e.offsetY
					
					
			
					if(this.currentDom && this.currentDom.id != dom.id) {
						this.currentDom.classList.remove('select__dom')
					}
					
					this.$refs.color1.style.backgroundColor = dom.dataset.color1 || '#000000'
					this.$refs.color2.style.backgroundColor = dom.dataset.color2 || '#ffffff'
					
					this.currentDom = dom
					this.showTitle = true
					this.currentBold = dom.style.fontWeight || 'none'
					this.fontSize = parseFloat(dom.style.fontSize)
					this.currentWidth = parseFloat(dom.style.width)
					this.currentHeight = parseFloat(dom.style.height)
					this.currentLevel = parseFloat(dom.style.zIndex)
					this.currentX = parseFloat(dom.style.left)
					this.currentY = parseFloat(dom.style.top)
					this.currentOpacity = parseFloat(dom.style.opacity)
					this.currentOrder = dom.dataset.order
					this.currentLeaveOrder = dom.dataset.leaveOrder
					this.currentMove = dom.dataset.currentMove || 100
					document.onmousemove = (e) => {
// 						const top = Math.ceil((e.clientY - this.y - this.offsetY)/this.sH * 100 * 10000) / 10000 + 'vh'
// 						const left = Math.ceil((e.clientX - this.x - this.offsetX)/this.sW * 100 * 10000) / 10000 + 'vw'
						const top = Math.ceil((e.clientY - this.y - this.offsetY) / this.wrapH * 100000) / 1000 + '%'
						const left = Math.ceil((e.clientX - this.x - this.offsetX) / this.wrapW * 100000) / 1000 + '%'
						dom.dataset.top = top
						dom.dataset.left = left
						dom.style.top = top
						dom.style.left = left
					}
					document.onmouseup = (e) => {
						document.onmousemove = null
						this.currentX = parseFloat(dom.style.left)
						this.currentY = parseFloat(dom.style.top)
					}
				}
			},
			
			cancaleSelect(e) {
				if(!(e.target.className === 'edit__main' || e.target.className === 'edit__wrap')) {return}
				if(this.currentDom) {
					this.currentDom.classList.remove('select__dom')
				}
				this.showColor = false
				this.showMove = false
				this.currentDom = null
				this.showTitle = false
				
				this.showBacColor =  false
				this.showBacWrap =  false
				this.bacShadowLeft = ''
				this.bacShadowRight= ''
				
			},
			
			addBold() {
				let temp = this.currentDom.style.fontWeight || ''
				if(temp === 'bold') {
					this.currentDom.style.fontWeight = ''
					this.currentBold = ''
				} else {
					this.currentDom.style.fontWeight = 'bold'
					this.currentBold = 'bold'
				}
			},
			
			addMove(item, index) {
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
				dom.dataset.currentMove = index
				this.currentMove = index
			}
		}
	}
</script>

<style scoped>
	
	@import url("../public/css/ppt.css");
	@import url("../public/css/animate.min.css");
	@import url("../public/css/themes.css");
	
	.edit{
		width: 83%;
		background-color: white;
		display: flex;
		flex-direction: column;
		box-shadow: 0px 1px 10px 1px mintcream;
		border-radius: 10px;
		overflow: hidden;
		position: relative;
	}
	
	.edit__main{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		background-image: linear-gradient(90deg, #74EBD5 0%, #9FACE6 100%);
		/* background-image: linear-gradient(19deg, #FAACA8 0%, #DDD6F3 100%); */
		
	}
	
	.edit__wrap{
		height: calc(100% - 60px);
		border-bottom: none;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		position: absolute;
		width: 100%;
	}
	
	.ppt_page{
		position: absolute;
		bottom: 65px;
		left: 50%;
		transform: translateX(-50%);
		color: lightslategray;
		font-size: 1.8vmin;
		vertical-align: baseline;
		color: #00b7c3;
		user-select: none;
	}
	
	.edit__operation{
		height: 60px;
		box-shadow: 0px -2px 5px rgba(0,0,0,0.3);
		background: lightseagreen; /* 标准的语法 */
		display: flex;
		align-items: center;
		color: white;
		position: absolute;
		bottom: 0px;
		width: 100%;
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
		user-select: none;
	}
	
	.bac__wrap{
		position: absolute;
		top: -170%;
		width: 150px;
		height: 75px;
		box-sizing: border-box;
		padding-left: 20px;
		padding-right: 20px;
		padding-top: 10px;
		background-image: linear-gradient( 135deg, #90F7EC 10%, #32CCBC 100%);
		border-radius: 10px;
		box-shadow: 0px 1px 10px 0px #00B7C3;
	}
	
	.bac__box{
		display: flex;
		
	}
	
	.bac__color {
		border-radius: 50%;
		width: 20px;
		height: 20px;
		background-color: white;
		margin-left: 15px;
		position: relative;
		top: 4px;
		transition: transform .1s ease-in;
	}
	
	.bac__color:active {
		transform: scale(0.8);
	}
	
	.edit__box>.title__size:first-child{
		margin-bottom: 4px;
	}
	
	.move__select {
		width: 380px;
		/* background-color: #80808085; */
		background-image: linear-gradient(19deg, #FAACA8 0%, #DDD6F3 100%);
		/* box-shadow: 0px 1px 20px rgba(0,0,0,0.3); */
		position: absolute;
		left: -140px;
		top: -253px;
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		padding: 12px;
		box-sizing: border-box;
		padding-top: 10px;
		padding-bottom: 5px;
		z-index: 200;
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
		font-size: 1.5vmin;
		overflow: hidden;
		margin-bottom: 5px;
	}
	
	.edit__icon{
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		width: 30px;
		height: 30px;
		cursor: pointer;
		
	}
	
	
	.title_icon {
		background-image: url(./asserts/title2.svg)
	}
	
	.title_icon:active {
		background-image: url(./asserts/title1.svg)
	}
	
	.B_icon {
		background-image: url(./asserts/b1.svg)
	}
	
	.B_icon:active{
		transform: scale(1.1);
	}
	
	.box__icon{
		background-image: url(./asserts/color.svg)
	}
	
	.box__icon:active {
		background-image: url(./asserts/color1.svg)
	}
	
	.BB_icon {
		background-image: url(./asserts/b3.svg)
	}
	
	.cancel_icon {
		background-image: url(./asserts/cancel1.svg)
	}
	
	.cancel_icon:active {
		background-image: url(./asserts/cancel.svg)
	}
	
	
	.bac_icon {
		background-image: url(./asserts/bac.svg)
	}
	
	.sava_icon{
		background-image: url(./asserts/save.svg);
	}
	
	.sava_icon:active{
		background-image: url(./asserts/save1.svg);
	}
	

	
	.bac_icon:active {
		background-image: url(./asserts/bac1.svg)
	}
	
	.move_icon {
		background-image: url(./asserts/an1.svg);
	}
	.move_icon:active {
		background-image: url(./asserts/an2.svg);
	}
	
	.back_icon{
		background-image: url(./asserts/last1.svg);
	}
	
	.back_icon:active {
		background-image: url(./asserts/back.svg)
	}
	
	.next_icon {
		background-image: url(./asserts/next4.svg);
	}
	
	.next_icon:active {
		background-image: url(./asserts/next5.svg);
	}
	
	.img_icon{
		background-image: url(./asserts/png3.svg);
	}
	.img_icon:active {
		background-image: url(./asserts/png.svg);
	}
	
	.read_icon{
		background-image: url(./asserts/read.svg);
	}
	
	.read_icon:active {
		background-image: url(./asserts/read1.svg)
	}
	
	.video_icon{
		background-image: url(./asserts/video2.svg);
	}
	
	.video_icon:active {
		background-image: url(./asserts/video3.svg);
	}
	
	.font__input{
		border: none;
		width: 50px;
		background-color: transparent;
		font-family: unset;
		color: deeppink;
		text-align: center;
		font-size: 1.6vmin;
		font-weight: bold;
		vertical-align: middle;
	}
	
	.font__input:focus{
		outline: none;
	}
	
	.bac__input{
		border-bottom: 1px solid white;
		width: 70px;
		text-align: center;
		letter-spacing: 1px;
		margin-bottom: 5px;
	}
	
	.title__name{
		width: 50px;
		text-align: left;
		display: inline-block;
	}
	
	.color__box{
		display: inline-block;
		width: 18px;
		height: 18px;
		background-color: white;
		box-shadow: 0px 0px 10px 2px #e876b4;
		border-radius: 50%;
		vertical-align: calc(-3px);
	}
	
	.color__box:active {
		transform: scale(1.2);
	}
	
	.color__picker{
		position: absolute;
		transform: translateY(-110%) translateX(-40%);
		top: 0px;
		z-index: 9999;
	}
	
	.color__picker--bac {
		transform: translateY(-107%)  translateX(-30%);;
	}
	
	.cx-default{
		display: flex;
		box-shadow: 0px 0px 10px black;
	}
	
	.slect__move {
		box-shadow: 0px 0px 5px 0px deeppink;
	}
	
	.bounce-enter-active {
		animation: bounce-in .5s;
	}
	.bounce-leave-active {
		animation: bounce-in .5s reverse;
	}
	@keyframes bounce-in {
	  0% {
		transform: scale(0);
		opacity: 0.2;
	  }
	  50% {
		transform: scale(1.1);
	  }
	  100% {
		transform: scale(1);
		opacity: 1;
	  }
	}
	
	.fade-enter-active{
		animation: fade-in .3s;
	}
	
	.fade-leave-active{
		animation: fade-in .3s reverse;
	}
	
	@keyframes fade-in {
	  0% {
		
		opacity: 0.2;
	  }
	 
	  100% {
		opacity: 1;
	  }
	}
	
	
</style>
