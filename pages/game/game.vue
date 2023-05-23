<template>
	<view class="container">
		<!-- 头部 -->
		<view class="header" :style="{ paddingTop: `${statusBarHeight}rpx` }">
			<view class="left" @click="back">
				<uni-icons
					type="back"
					size="40"
					color="#f2f2f2"
				></uni-icons>
			</view>
			<view class="center">房间号: {{ houseId }}</view>
			<view class="right"></view>
		</view>

		<!-- 中间地图 -->
		<view id="map" class="map_box">
			<map
				:show-location="true"
				:markers="markers"
				class="map"
				:latitude="latitude"
				:longitude="longitude"
			>
				<cover-view slot="callout">
				<!--<block v-for="(item,index) in markers" :key="index">
						<cover-view class="customCallout" :marker-id="item.id">
							{{item.title}}
						</cover-view>
					</block> -->
				</cover-view>
			</map>
		</view>

		<!-- 底部说话展示区和输入区 -->
		<view class="chat_box" :style="{ height: `${chatBoxHeight}rpx` }">
			<!-- 遮罩层 -->
			<view class="voice-mask" v-if="isMask">
				<view class="voice-bar voice-del" :style="{ width: getVoiceBarWidth, backgroundColor: voiceBgc }">
					<view class="icon"></view>
				</view>
				
				<!-- 取消和提示区域 -->
				<view class="voice-middle-wrapper">
					<view class="send-tip">上滑 取消</view>
				</view>
				
				<!-- 底部语音按钮 -->
				<view class="mask-bottom">
					<uni-icons
						custom-prefix="iconfont"
						type="icon-saying"
						size="30"
						color="#666"
					></uni-icons>
				</view>
			</view>

			<!-- 展示区 -->
			<scroll-view :scroll-into-view="toView" :scroll-with-animation="true" :scroll-y="true" :enable-back-to-top="true" :show-scrollbar="0" :lower-threshold="0" class="view" :style="{ height: `${scrollHeight}rpx` }">
				<block v-for="(item, index) in messageList" :key="item.openId">
					<view :id="`item${index}`" class="other iten" v-if="item.openId !== openId">
						<view class="avatar">
							<image :src="item.avatarUrl" class="image"></image>
						</view>
						<view v-if="item.type === 'text'" class="content">{{ item.message }}</view>
						<view
							v-else-if="item.type === 'voice'"
							class="content voice"
							:style="{ width: item.time * 5 + 50 + 'rpx' }"
							@click="playVoice(item.voice)"
						>
							<view class="icon"></view>
						</view>
					</view>
					<view :id="`item${index}`" class="me iten" v-else>
						<view class="avatar">
							<image :src="item.avatarUrl" class="image"></image>
						</view>
						<view v-if="item.type === 'text'" class="content">{{ item.message }}</view>
						<view
							v-else-if="item.type === 'voice'"
							class="content voice"
							:style="{ width: item.time * 5 + 50 + 'rpx' }"
							@click="playVoice(item.voice)"
						>
							<view class="icon"></view>
						</view>
					</view>
				</block>
			</scroll-view>

			<!-- 输入区 -->
			<view class="input" v-if="isChangeBar">
				<view class="left item">
					<uni-icons
						custom-prefix="iconfont"
						type="icon-jianpan"
						size="30"
						@click="isChangeBar = false"
					></uni-icons>
				</view>
				<view
					class="center"
					@touchstart="handleTouchStart"
					@touchmove="handleTouchMove"
					@touchend="handleTouchEnd"
				>
					<text class="text">
						按住 说话
					</text>
				</view>
				<view class="right">
					<view class="scan_code item">
						<uni-icons
							custom-prefix="iconfont"
							type="icon-saoyisao"
							size="30"
						></uni-icons>
					</view>
				</view>
			</view>

			<view class="input" :style="{ bottom: `${inputBottom}rpx` }" v-else>
				<view class="left item">
					<uni-icons
						custom-prefix="iconfont"
						type="icon-yuyin"
						size="30"
						@click="isChangeBar = true"
					></uni-icons>
				</view>
				<view class="center">
					<input
						type="text"
						class="message"
						v-model="message"
						@focus="inputFocus"
						@blur="inputBlur"
						@confirm="inputconfirm"
						:adjust-position="false"
						:auto-blur="true"
					/>
				</view>
				<view class="right">
					<view class="scan_code item">
						<uni-icons
							custom-prefix="iconfont"
							type="icon-saoyisao"
							size="30"
						></uni-icons>
					</view>
					<view class="btn">
						<button @click="sendMessage" size="mini" type="primary">发送</button>
					</view>
				</view>
			</view>
		
			<!-- <view class="softKeyboard" :style="{ height: `${softKeyboardHeight}rpx` }"></view> -->
		</view>
	</view>
</template>

<script>
	import { toRaw } from "vue"
	export default {
		data() {
			return {
				// openId小程序用户的唯一标识符
				openId: '',
				// 运行该小程序手机状态栏的高度
				statusBarHeight: 0,
				// 手机可视区域的高度
				windowHeight: 0,
				// 软键盘的高度
				softKeyboardHeight: 0,
				// 滚动区域的高度
				scrollHeight: 0,
				// 输入框底部的高度
				inputBottom: 0,
				// 容器的高度
				// containerHeight: 0,
				// 手机底部安全区域的信息
				safeArea: null,
				// houseId游戏房间号
				houseId: '',
				// 发消息的信息
				message: '',
				// 消息列表
				messageList: [],
				// 切换语音和文字
				isChangeBar: true,
				// 获取DOM的实例
				selectorQuery: null,
				// 语音录制
				recorderManager: null,
				// 语音播放
				innerAudioContext: null,
				// 文件管理器的实例
				FileSystemManager: null,
				// 遮罩层的显示与隐藏
				isMask: false,
				// 语音的长度
				length: 0,
				// 录音时长的定时器
				timer: null,
				// 取消区域的背景颜色
				closeAreaBgc: '#000',
				// 取消区域上方提示汉字的显示与隐藏
				closeAreaTextShow: 'none',
				// 语音背景颜色
				voiceBgc: '#51ff50',
				// 是否可以播放声音
				isPlay: true,
				// 判断点的是否时同一个声音
				playSrc: '',
				// 存储滚动的id
				toView: '',
				// 地图默认显示的维度
				latitude: 0,
				// 地图默认显示的经度
				longitude: 0,
				// 地图标记点
				markers: [],
				// 高德地图记录位置信息
				locations: []
			}
		},
		computed:{
			// 计算语音条宽度
			getVoiceBarWidth() {
				return (50 + this.length * 5) + 'rpx';
			},
			// 地图下方整体的高度
			chatBoxHeight() {
				return this.windowHeight - this.statusBarHeight - 80 - 500 - this.softKeyboardHeight
			},
			containerHeight() {
				return this.windowHeight - this.softKeyboardHeight
			}
		},
		watch: {
			messageList: {
				handler(val, oldVal) {
					this.toView = `item${this.messageList.length - 1}`
				},
				deep: true,
				immediate: true
			}
		},
		onLoad(options) {
			this.houseId = '123412'
			
			// 从globalData中获取数据
			const global = getApp()
			this.openId = global.globalData.openId
			
			// 获取手机状态栏的高度
			this.statusBarHeight = uni.getWindowInfo().statusBarHeight * 2
			this.windowHeight = uni.getWindowInfo().windowHeight * 2
			this.safeArea = uni.getWindowInfo().safeArea
			this.scrollHeight = this.windowHeight - this.softKeyboardHeight - this.statusBarHeight - 500
			console.log(this.scrollHeight)
			
			// 监听软键盘变化的高度
			uni.onKeyboardHeightChange(res => {
				this.softKeyboardHeight = res.height * 2
			})
			
			// 创建一个可以获取DOM节点的实例
			this.selectorQuery = uni.createSelectorQuery().in(this)
			
			console.log(this.openId, this.houseId)
			// 链接WebSocket
		  uni.connectSocket({ url: `wss://zyandwqy.top/websocket/${this.openId}/${this.houseId}` })
			
			// 链接WebSocket成功
			uni.onSocketOpen(() => {
				console.log('连接成功')
				// 定时器，每隔1秒调用
				setInterval(() => {
					setTimeout(() => {
				 		// 调取接口
						this.getlocations()
						console.log("每隔1秒")
					}, 0)
				}, 5000)
			})
			
			// 监听服务端发来的信息
			uni.onSocketMessage((res) => {
				if (res.data !== 'null' && res.data) {
					console.log(JSON.parse(res.data))
					// 信息
					if (JSON.parse(res.data).type !== 'position') {
						this.messageList.push(JSON.parse(res.data))
					}
					// 地图位置
					else {
						console.log("获取位置")
						console.log(JSON.parse(res.data))
						const data = JSON.parse(res.data)
						console.log(data.openId)
						console.log(this.openId)
						console.log(data.openId !== this.openId)
						if (data.openId !== this.openId) {
							const index = this.markers.findIndex(item => item.id === data.openId)
							if (index !== -1) {
								this.markers[index].latitude = data.latitude
								this.markers[index].longitude = data.longitude
							} else {
								const item = {}
								item.id = data.openId
								item.latitude = data.latitude
								item.longitude = data.longitude
								item.iconPath = data.avatarUrl
								item.width = 15
								item.height = 15
								this.markers.push(item)
							}
							console.log(this.markers)
						}
					}
				}
			})
			
			// 创建一个可以录音的实例
			this.recorderManager = uni.getRecorderManager()
			
			// 创建一个获取全局唯一的文件管理器的实例
			this.FileSystemManager = uni.getFileSystemManager()
			
			// 创建一个播放音乐的实例
			this.innerAudioContext = uni.createInnerAudioContext()
		},
		onUnload() {
			// 关闭WebSocket
			uni.closeSocket()
		},
		methods: {
			// 返回上一个页面
			back() {
				uni.navigateBack()
			},
			
			// 获取位置方法
			getlocations(){
				const amapFile = require('../../static/lib/amap-wx.js')
				const myAmapFun = new amapFile.AMapWX({ key: '76c43a819cfcac86c1263fcf2763b098' })
				myAmapFun.getRegeo({
					success: (res) => {
						console.log(res)
						// 默认位置
						this.longitude = res[0].longitude
						// this.longitude = res[0].longitude + 0.004725
						this.latitude = res[0].latitude
						// this.latitude = res[0].latitude - 0.003134
						console.log("this.longitude  : " + this.longitude);
						console.log("this.latitude  : " + this.latitude);
						const { avatarUrl, nickName } = uni.getStorageSync('userInfo')
						const selflocation = {
							houseId: this.houseId,
							openId: this.openId,
							avatarUrl,
							nickName,
							type:'position',
							latitude: this.latitude,
							longitude: this.longitude,
							joinCluster: true,
						}
						// console.log("传的数据");
						// console.log(selflocation);
						uni.sendSocketMessage({
							data: JSON.stringify(selflocation)
						})
					},
					fail: (err) => {
						console.log("获取位置失败");
						console.log(err)
					}
				})
			},
			
			// 输入框聚焦
			inputFocus(e) {
				// console.log(e.detail)
				// console.log(this.safeArea)
				this.scrollHeight = this.windowHeight - this.softKeyboardHeight - this.statusBarHeight - 500
				this.inputBottom = this.softKeyboardHeight + this.safeArea.top / 2
			},
			
			// 输入框失去焦点
			inputBlur() {
				this.scrollHeight = this.windowHeight - this.softKeyboardHeight - this.statusBarHeight - 500
				this.inputBottom = 0
			},
			
			// 输入框触发完成时
			inputconfirm() {
				this.sendMessage()
			},
			
			// 点击发送按钮
			sendMessage() {
				const { avatarUrl, nickName } = uni.getStorageSync('userInfo')
				console.log(this.message)
				if (this.message.trim() !== '') {
					const data = {
						message: this.message,
						houseId: this.houseId,
						openId: this.openId,
						avatarUrl,
						nickName,
						type: 'text'
					}
					console.log(data)
					uni.sendSocketMessage({
						data: JSON.stringify(data),
						complete: () => {
							this.message = ''
						}
					})
				}
			},
			
			// 语音录制开始
			handleTouchStart(e) {
				this.isMask = true
				this.recorderManager.start()
				this.voiceBgc = '#51ff50'
				this.length = 1
				this.timer = setInterval(() => {
					this.length += 1
					if(this.length >= 60) {
						clearInterval(this.timer)
						this.handleTouchEnd()
					}
				}, 1000)
			},
			
			// 点击录音后手指移动
			handleTouchMove(e) {
				const position = this.windowHeight - e.touches[0].pageY * 2
				if (position > 104) {
					this.voiceBgc = '#f00'
				} else {
					this.voiceBgc = '#51ff50'
				}
			},
			
			// 语音录制结束
			handleTouchEnd(e) {
				const { avatarUrl, nickName } = uni.getStorageSync('userInfo')
				console.log(avatarUrl, nickName)
				clearInterval(this.timer)
				this.isMask = false
				const position = this.windowHeight - e.changedTouches[0].pageY * 2
				// console.log(position)
				this.recorderManager.stop()
				this.recorderManager.onStop((res) => {
					this.FileSystemManager.readFile({
						filePath: res.tempFilePath,
						encoding: 'base64',
						success: data => {
							// console.log(data)
							const voice = data.data
							if (position <= 104) {
								const info = {
									voice,
									time: this.length,
									houseId: this.houseId,
									openId: this.openId,
									avatarUrl,
									nickName,
									type: 'voice'
								}
								// console.log(info)
								uni.sendSocketMessage({
									data: JSON.stringify(info)
								})
							}
						}
					})
				})
			},
			
			// 将base64文件转化成本地文件路径
			writeAudio(voice) {
				const times = new Date().getTime()
				const filePath = uni.env.USER_DATA_PATH + '/' + times + '.aac'
				return new Promise((resolve, reject) => {
					this.FileSystemManager.writeFile({
						filePath,
						data: voice,
						encoding: 'base64',
						success: res => {
							resolve(filePath)
						},
						fail: reject
					})
				})
			},
			
			// 播放声音
			async playVoice(voice) {
				const innerAudioContext = toRaw(this.innerAudioContext)
				if(this.isPlay) {
					console.log(111)
					const res = await this.writeAudio(voice)
					innerAudioContext.src = res
					this.palySrc = voice
					innerAudioContext.play()
				} else {
					console.log(222)
					innerAudioContext.stop()
					if(this.palySrc !== voice) {
						console.log(333)
						const res = await this.writeAudio(voice)
						innerAudioContext.src = res
						this.palySrc = voice
						innerAudioContext.play()
					}
				}
				innerAudioContext.onPlay(() => {
					this.isPlay = false
				})
				innerAudioContext.onEnded(() => {
					this.isPlay = true
				})
				innerAudioContext.onStop(() => {
					this.isPlay = true
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/iconfont/iconfont.css";

	.container {
		position: fixed;
		width: 100%;
		height: 100%;
		background-image: url('https://pikacode.oss-cn-chengdu.aliyuncs.com/school_cat/house_bg_z.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		
		.header {
			// position: fixed;
			// top: 0;
			// left: 0;
			// right: 0;
			// z-index: 9;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80rpx;
			// padding-top: 40rpx;
			// background-color: hotpink;
			
			.center {
				font-size: 25rpx;
				font-family: "Adobe Heiti Std";
				color: rgba(251, 251, 251, 0.412);
				line-height: 2.841;
				-moz-transform: matrix( 1.73595499830929,-0.00947556258583,0.00947556258583,1.73595499830929,0,0);
				-webkit-transform: matrix( 1.73595499830929,-0.00947556258583,0.00947556258583,1.73595499830929,0,0);
				-ms-transform: matrix( 1.73595499830929,-0.00947556258583,0.00947556258583,1.73595499830929,0,0);
			}
			
			.right {
				width: 80rpx;
			}
		}

		.map_box {
			// margin-top: 120rpx;
			height: 500rpx;
			box-sizing: border-box;
			border: 18rpx solid #370d6f;

			.map {
				width: 100%;
				height: 100%;
			}
		}
		
		.chat_box {
			position: relative;
			display: flex;
			flex-direction: column;
			// height: calc(100vh - (500rpx + 120rpx));
			
			// 遮罩层
			.voice-mask{
				position: absolute;
				top:0;
				right:0;
				bottom:0;
				left:0;
				z-index: 9;
				background-color: rgba(0,0,0,0.6);
				
				// 语音长度
				.voice-bar{
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%,-30%);
					padding: 25rpx;
					background-position: 50rpx;
					border-radius: 26rpx;
					margin-bottom: 200rpx;
					transition: all ease 0.5s;
					
					.icon {
						width: 100%;
						height: 50rpx;
						background-image: url(https://pikacode.oss-cn-chengdu.aliyuncs.com/school_cat/sonic_wave.png);
						background-repeat: repeat-x;
						background-size: 50rpx;
					}
				}
	
				// 提示文字
				.send-tip{
					position: absolute;
					left: 50%;
					bottom: 150rpx;
					transform: translateX(-50%);
					color:#bfbfbf;
				}
				
				// 底部语音按钮
				.mask-bottom {
					display: flex;
					justify-content: center;
					align-items: center;
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					height: 100rpx;
					// margin: 0 100rpx;
					border-top: #BABABB 8rpx solid;
					border-radius: 100rpx 100rpx 0 0;
					background-image: linear-gradient(#949794,#e1e3e1);
					
				}
			}

			// 展示区域
			.view {
				flex: 1;
				overflow: auto;
				// height: 100%;
				// height: calc(100% - 80rpx);
				padding-bottom: 20rpx;
				margin-bottom: 80rpx;
				box-sizing: border-box;
				
				::-webkit-scrollbar {
					display: none;
				}

				.iten {
					overflow: auto;
					margin: 30rpx 18rpx;
					
					.avatar {
						width: 80rpx;
						height: 80rpx;
						border-radius: 15rpx;
						background-color: pink;
						overflow: hidden;
						
						.image {
							width: 100%;
							height: 100%;
						}
					}
					
					.content {
						position: relative;
						max-width: 400rpx;
						margin: 5rpx 30rpx;
						padding: 15rpx 20rpx;
						background-color: #fff;
						border-radius: 8rpx;
						word-wrap: break-word;
					}
					
					.voice {
						height: 40rpx;
						
						.icon {
							width: 100%;
							height: 50rpx;
							background-image: url(https://pikacode.oss-cn-chengdu.aliyuncs.com/school_cat/sonic_wave.png);
							background-repeat: repeat-x;
							background-size: 40rpx;
						}
					}
				}
				
				.other {
					
					.avatar {
						float: left;
					}
					
					.content {
						float: left;
						
						&::before {
							content: "";
							display: block;
							position: absolute;
							top: 50%;
							left: 0;
							width: 10rpx;
							height: 10rpx;
							transform: translate(-50%, -50%) rotate(45deg);
							background-color: #fff;
						}
					}
				}
				
				.me {

					.avatar {
						float: right;
					}
					
					.content {
						float: right;
						
						&::after {
							content: "";
							display: block;
							position: absolute;
							top: 50%;
							right: 0;
							width: 10rpx;
							height: 10rpx;
							transform: translate(50%, -50%) rotate(45deg);
							background-color: #fff;
						}
					}
				}
			}
			
			// 输入
			.input {
				position: fixed;
				left: 0;
				right: 0;
				bottom: 0;
				display: flex;
				height: 80rpx;
				background-color: #e7e3e8;
				
				.item {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 80rpx;
					height: 80rpx;
				}
				
				.center {
					display: flex;
					justify-content: center;
					align-items: center;
					flex: 1;
					margin: 10rpx;
					border-radius: 15rpx;
					background-color: #fff;
					
					.message {
						width: 100%;
						box-sizing: border-box;
						padding: 0 20rpx;
					}
					
					.text {
						font-size: 30rpx;
						font-family: "SimHei";
						color: rgb(0, 0, 0);
					}
				}
				
				.right {
					display: flex;
					
					.btn {
						display: flex;
						align-items: center;
						margin: 0 5rpx;
					}
				}
			}
		}
	}
</style>