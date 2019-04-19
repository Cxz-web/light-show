<template>
	<div class="handle">
		
		<div class="handle__wrap">
			<!-- <div class="handle__move" ref="move"></div> -->
			<div class="handle__box">
				<div class="handle__open"><span>Open Room</span><div class="handle__btn" @click="openTip(roomTip, change, 'btn1_type', 0, $event)" ref="btn1"></div></div>
				<div class="handle__flow"><span>Push stream</span><div class="handle__btn" @click="openTip(flowTip, change, 'btn2_type', 1, $event)" ref="btn2"></div></div>
			</div>
			<div class="handle__content">
				<div class="content__operation">
					<div class="content__btn" @click="openPacketBox" :class="{'content__btn--active': isGivingPacket === 1}">Red Packet&nbsp;{{packetNum}}/{{packetLimit}}</div>
					<!-- <div class="content__btn">Raise hands</div>
					<div class="content__btn">Options</div>
					<div class="content__btn" >Questions</div> -->
					<div class="content__btn" @click="openTip('Confirm video call?', connectRtn)" :class="{'content__btn--active': isConnected === 1}">Video Call</div>
				</div>
				<div class="content__info"></div>
			</div>
			<div class="handle__send">
				<input type="text" class="send__content">
				<div class="send__btn">Send</div>
			</div>
		
			<div class="packet__wrap" v-show="showPacket">
				<div class="packet__box">
					<div class="packet__header"><div class="packet__close" @click="closePacket"></div></div>
					<p class="packet__tip" v-if="packetId"><span style="color: red;">{{ packetTip[receivedPacker] }}</span> students have got red packet</p>
					<p class="packet__tip" v-else>You haven't started handing out red packet yet</p>
					<div class="packet__btn" @click="packetBtn">{{ packetBtnTip }}</div>
				</div>
			</div>
		
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import qs from 'qs'
	
	const baseUrl = 'http://api.double-teacher-test.cs.dreamdev.cn'
	export default {
		name: 'live-handle',
		data() {
			return {
				lessonid: '01201903181114562641',
				TOKEN: '',
				interactiveState: null, // 交互状态
				liveInfo: null, // 直播信息
				liveState: null ,// 直播的状态
				liveBtnState: null ,// 按钮状态 
				btn1_type: 1, // 默认关闭
				btn2_type: 1, // 默认关闭
				enable: true,
				connectBtn: true, // 是都禁用rtn按钮
				applyId: null, // 连麦id
				showPacket: false,
				packetState: 0,
				packetType: 0,
				packetNum: 0,
				packetLimit: 5,
				packetId: null,
				isConnected: 0, // 连麦按钮状态
				receivedPacker: 0,
				totalPacker: 5,
				stateTip: {
					isConnected: 'Stop the video call before you can do anything else!',
					isGivingPacket: 'Stop giving red packets before you can do anything else!'
				},
				packetTip: {
					0: 'No',
					1: 'One',
					2: 'Two',
					3: 'Three',
					4: 'Four',
					5: 'Five'
				},
				currentState: null,
				id: null, // 轮询定时器
				canQuery: true
			}
		},
		created() {
			this.TOKEN = this.$store.state.token
			this.lessonid = this.$store.state.lessonId
		},
		
		computed: {
			roomTip() {
				return this.btn1_type === 0 ? 'Confirm close room?' : 'Confirm open room?'
			},
			flowTip() {
				return this.btn1_type === 0 ? 'Stop pushing flow?' : 'Confirm pushing flow?'
			},
			isGivingPacket() {
				return !this.packetId ? 0 : 1
			},
			packetBtnTip() {
				return !this.packetId ? 'Start giving out red packets' : 'Stop giving out red packets'
			}
		},
		
		
		mounted() {
			this.getInitState()
		},
		
		methods: {
			// 打开红包面板
			openPacketBox() {
				if(this.isConnected === 1) {
					this.$message({
						type: 'error',
						message: 'Video call, no other operation allowed!'
					})
					return
				}
				
				
				if(this.packetNum >= this.packetLimit) {
					this.$message({
						type: 'error',
						message: 'A maximum of five red packet can be handed out per class!'
					})
					return
				}
				
				
				this.showPacket = true
			},
			
			closePacket() {
				this.showPacket = false
			},
			
			beforeDestory() {
				clearInterval(this.id)
			},
			
			packetBtn() {
				// 没有发红包的状态
				this.canQuery = true
				if(this.isGivingPacket === 0) {
					this.giveRedPacket()
				} else {
					this.stopRedPacket()
				}
			},
			// 开始发红包
			giveRedPacket() {
				const url = baseUrl + '/v2/webapi/lesson/redpacket/publish'
				let params = {
					lesson_id: this.lessonid,
					type: this.packetType,
					total_score: 0,
					each_score: 5,
					count: 5
				}
				this._post(url, params).then((res) => {
					const data = res.data
					if(data.F_responseNo === 10000) {
						this.packetId = data.redpacket_id
						clearInterval(this.id)
						this.id = setInterval(() => {
							this.queryPacket()
						}, 1000)
					}
					
				})
			},
			
			// 查询红包情况
			queryPacket() {
				if(!this.canQuery) return
				this.canQuery = false
				const url = baseUrl + '/v2/webapi/lesson/redpacket/statistic'
				const params = {
					lesson_id: this.lessonid,
					redpacket_id: this.packetId,
					order_reverse: 0
				}
				this._get(url, params).then((res) => {
					const data = res.data
					this.receivedPacker = data.received_redpacket_num
					this.totalPacker = data.total_redpacket_num
					this.canQuery = true
				})
			},
			
			// 停止分发红包
			stopRedPacket() {
				const url = baseUrl + '/v2/webapi/lesson/redpacket/close'
				const params = {
					lesson_id: this.lessonid,
					redpacket_id: this.packetId
				}
				this._post(url, params).then((res) => {
					this.packetId = null
					clearInterval(this.id)
				})
			},
			
			// 初始化状态
			getInitState() {
				const url = baseUrl + '/v2/webapi/live/state'
				this._get(url, {lessonid: this.lessonid}).then((res) => {
					const data = res.data
					this.interactiveState = data.interactive_state
					this.liveInfo = data.live_info
					this.liveState = data.live_state
					this.liveBtnState = this.liveState.data
					console.log('交互状态', this.interactiveState)
					console.log('直播信息', this.liveInfo)
					console.log('直播状态', this.liveState)
					console.log(this.liveBtnState)
					this.applyId = this.interactiveState.rtn_apply_id // 初始化连麦id 
					this.isConnected = this.interactiveState.rtn_apply_state // 初始化
					this.initLiveBtnState(this.liveBtnState) // 初始化直播和推流的按钮状态
					this.isConnected = this.interactiveState.rtn_apply_state // 初始化连麦按钮状态
					
					// 红包相关
					this.packetState = this.interactiveState.red_packet_state // 红包状态
					this.packetType = this.interactiveState.red_packet_type // 红包类型
					this.packetNum = this.interactiveState.red_packet_num // 已发红包数量
					this.packetLimit = this.interactiveState.red_packet_limit // 红包限制数量
					this.packetId = this.interactiveState.red_packet_id
					
				})
			},
			
			// 连麦
			connectRtn() {
				if(this.isGivingPacket === 1) {
					this.$message({
						type: 'error',
						message: 'Please close the red packer activity before video call!'
					})
					return
				}
				
				this.connectBtn = false
				const state = this.isConnected === 0 
				
				if(state) {
					const url = baseUrl + `/v2/webapi/apply/publish`
					this._post(url, {lesson_id: this.lessonid}).then(res => {
						this.applyId = res.data.apply.apply_id
						this.connectBtn = true
						this.isConnected = this.isConnected === 0 ? 1 : 0
					})
				} else {
					const url = baseUrl + `/v2/webapi/apply/close`
					this._post(url, {lesson_id: this.lessonid, apply_id: this.applyId}).then(res => {
						this.connectBtn = true
						this.isConnected = this.isConnected === 0 ? 1 : 0
					})
				}
	
			},
			
			// 初始化推流， 房间按钮
			initLiveBtnState(state) {
				console.log(this.$refs)
				if(state[0].isopen)  {
					this.$refs.btn1.classList.add('handle__btn--active')
					this.btn1_type = 0
				}
				if(state[1].isopen) {
					this.$refs.btn2.classList.add('handle__btn--active')
					this.btn2_type = 0
				}
			},
			
		
			// 改变开关 
			change(which, id, e) {
				if(!this.enable) return
				this.enable = false
				console.log(this[which])
				const url = baseUrl + '/v2/webapi/roster/controlstream'
				
				const data = {
					lessonid: this.lessonid,
					id: id,
					type: this[which] === 1 ? 0 : 1
				}
				this._post(url, data).then((res) => {
					this.enable = true
					this[which] = this[which] === 1 ? 0 : 1
					e.target.classList.toggle('handle__btn--active')
				}).catch( (err) => {
					this.enable = true
					this.$message({
						type: 'error',
						message: 'Please close the push stream first!'
					})
				}) 
			},
			
			openTip(msg, fn, which, id, e) {
				this.$confirm(msg, 'Warning', {
						confirmButtonText: 'OK',
						cancelButtonText: 'Cancel',
						type: 'warning',
						center: true
				}).then(() => {
					if(which) {
						fn(which, id, e)
					}else {
						fn()
					}
					
				}).catch(() => {
					
				});
			},
    
//  this.$message({
//  	type: 'info',
//  	message: '已取消删除'
//  });
// 		
	
// 	this.$message({
// 		type: 'success',
// 		message: '删除成功!'
// 	});
			
			
			_post(url, data) {
				let options = {
					method: 'post',
					url,
					data,
					transformRequest: [function (data) {
					  return qs.stringify(data)
					}],
					headers: {'Authorization': this.TOKEN}
				}
				return axios(options)
			},
			
			_get(url, params) {
				let options = {
					method: 'get',
					url,
					params,
					headers: {'Authorization': this.TOKEN}
				}
				return axios(options)
			}
			
		}
	}
</script>

<style scoped>
	.handle{
		display: flex;
		justify-content: center;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 10px;
		animation: handle ease-in .3s forwards;
		user-select: none;
		will-change: transform;
	}
	
	@keyframes  handle{
		from{
			opacity: 0.4;
			transform: scale(0);
		}
		to{
			opacity: 1;
			transform: scale(1);
		}
	}
	
	.handle__wrap{
		background-color: #efefef;
		width: 100%;
		height: 100%;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		padding-bottom: 10px;
		position: relative;
		box-sizing: border-box;
		padding-top: 10px;
	}
	
	.handle__box{
		display: flex;
		height: 40px;
		font-size: 18px;
		line-height: 40px;
		padding-left: 14px;
		align-items: center;
		
	}
	
	.handle__open{
		display: flex;
		align-items: center;
	}
	
	.handle__flow{
		display: flex;
		align-items: center;
		margin-left: 50px;
	}
	
	.handle__btn{
		height: 20px;
		width: 45px;
		border-radius: 20px;
		background-color: dimgray;
		margin-left: 10px;
		cursor: pointer;
		background-image: url(asserts/ios3.svg);
		background-size: 20px 20px;
		background-position: left center;
		background-repeat:no-repeat ;
		transition: all ease-in 200ms;
		
	}
	
	.handle__btn--active{
		animation: rightMove ease-in 200ms forwards;
	}
	
	@keyframes rightMove{
		to{
			background-color: rgb(48,217,76);
			background-position: right center;
		}
	}
	
	.handle__content{
		padding-left: 14px;
		padding-right: 14px;
		display: flex;
		flex: 1;
		padding-bottom: 10px;
	}
	
	.content__operation{
		width: 140px;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-right: 20px;
	}
	
	
	.content__btn{
		width: 130px;
		line-height: 35px;
		border-radius: 10px;
		border: 1px solid black;
		margin-bottom: 16px;
		color: black;
		font-weight: bold;
		cursor: pointer;
	}
	
	.content__btn--active {
		background-color: darkorange;
		color: white;
		border: 1px solid navajowhite;
	}
	
	.content__info{
		flex: 1;
		background-color: white;
		border: 1px solid black;
	}
	
	.handle__send{
		height: 50px;
		display: flex;
		padding-left: 10px;
		align-items: center;
		justify-content: space-between;
		padding-right: 20px;
	}
	.send__content{
		width: 80%;
		height: 20px;
	}
	
	.send__btn{
		height: 26px;
		text-align: center;
		background-color: rgb(0,153,255);
		width: 60px;
		line-height: 26px;
		color: white;
		cursor: pointer;
		user-select: none;
	}
	
	.handle__move{
		-webkit-app-region: drag;
		
		z-index: 2000;
		width: 100%;
		height: 20px;
		top: 10px;
		background-color: green;
	}
	
	/* 红包面板模块 */
	
	.packet__wrap {
		position: fixed;
		width: calc(100% - 20px);
		height: calc(100% - 20px);
		background-color: rgba(0,0,0,0.3);
		left: 10px;
		top: 10px;
		border-radius: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.packet__box{
		overflow: hidden;
		width: 400px;
		height: 150px;
		background-color: white;
		border-radius: 5px;
		display: flex;
		align-items: center;
		flex-direction: column;
		box-sizing: border-box;
	}
	
	.packet__btn{
		width: 231px;
		height: 40px;
		border: 1px solid black;
		background-color: gray;
		border-radius: 20px;
		color: white;
		font-weight: bold;
		line-height: 40px;
		cursor: pointer;
	}
	.packet__header{
		background-color: dimgray;
		height: 26px;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding-right: 10px;
		border-radius: 5px 5px 0 0;
		
	}
	
	.packet__tip {
		line-height: 0px;
		font-size: 20px;
		margin-top: 36px;
		margin-bottom: 28px;
	}
	
	.packet__close{
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background-color: #F35A52;
		cursor: pointer;
	}
</style>


