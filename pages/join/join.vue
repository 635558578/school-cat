<script setup>
import { ref } from 'vue'
import { onLoad, onHide } from '@dcloudio/uni-app'

// 获取globalData中的openId
const { globalData: { openId } } = new getApp()

// 获取本地存储中的用户信息
const { nickName, avatarUrl } = uni.getStorageSync('userInfo')

// 获取本地存储的房间用户信息
const homePersonnelInfo = uni.getStorageSync('homePersonnelInfo')

const userList = ref(homePersonnelInfo)
console.log(userList)

// 从路由中取出房间号
let houseId = ref('')
let Homeowner = ref()
onLoad((options) => {
	console.log(options)
	houseId.value = options.homeId
	Homeowner.value = Boolean(options.Homeowner)
	console.log(Homeowner.value)
	sock()
})

// 离开页面发出离开房间的信息, 并断开WebSocket
onHide(() => {
	console.log(111)
	closeSock()
})

// WebSocket操作
const sock = () => {
	console.log(houseId.value)
	// 链接WebSocket
	uni.connectSocket({ url: `wss://zyandwqy.top/websocket/${openId}/${houseId.value}` })
	
	// 链接WebSocket成功
	uni.onSocketOpen(() => {
		console.log('连接成功')
		const data = {
			openId,
			nickName,
			img: avatarUrl,
			status: 1,
			houseId: houseId.value
		}
		
		// console.log(data)
		
		uni.sendSocketMessage({
			data: JSON.stringify(data)
		})
	})
	
	uni.onSocketMessage(res => {
		console.log(JSON.parse(res.data))
		const data = JSON.parse(res.data)
		if (data === null) {
			return
		}
		if (data.toGame === 'toGame') {
			uni.navigateTo({
				url:`/pages/game/game?houseId=${houseId.value}`
			})
			return
		}
		// 判断是进入房间还是离开房间, 1是进入房间, 0是离开房间
		if (data.status === 1) {
			const index = userList.value.findIndex(item => item.openId === data.openId)
			console.log(index)
			index === -1 ? userList.value.push(data) : ''
		} else if (data.status === 0) {
			const index = userList.value.findIndex(item => item.openId === data.openId)
			console.log(index)
			index !== -1 ? userList.value.splice(index, 1) : ''
		}
	})
}

// 关闭WebSocket
const closeSock = () => {
	uni.request({
		url: 'https://wx.zyandwqy.top/user/logout',
		data: {
			open_id: openId
		}
	})

	const data = {
		openId,
		nickName,
		img: avatarUrl,
		status: 0,
		houseId: houseId.value
	}
	
	uni.sendSocketMessage({
		data: JSON.stringify(data)
	})
	
	uni.closeSocket()
}

// 跳转到游戏界面
const startGame = () => {
	const data = {
		toGame: 'toGame',
		houseId: houseId.value
	}
	
	uni.sendSocketMessage({
		data: JSON.stringify(data)
	})
	uni.navigateTo({
		url: `/pages/game/game?houseId=${houseId.value}`
	})
}

</script>	
	
<template>
	<view>
		<view class="room">
			<view class="img">
				<image
					src="https://pikacode.oss-cn-chengdu.aliyuncs.com/school_cat/house_bg.png"
					mode=""
					style="height: 100vh; width: 100vw; position: absolute;"
				></image>
			</view>

			<view class="home">
				<view>房间号: </view>
				<view style="font-size: 60rpx;">{{ houseId }}</view>
			</view>

			<view style="position: relative; top: 400rpx;" class="view">
				<scroll-view  scroll-y="true" class="scroll-Y">
					<view class="user">
						<view v-for="(item, index) in userList" :key="item.openId">
							<view class="userimg" :style="{ backgroundImage: `url(${item.img})` }">
								<!-- {{ item }} -->
							</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<view class="startGame" @click="startGame" v-if="Homeowner">
				开始游戏
			</view>
		</view>
	</view>
</template>

<style scoped>
	.create {
		width: 100vw;
		height: 100vh;
	}

	.image image {
		position: relative;
		width: 100vw;
		height: 100vh;
	}

	.startGame {
		margin-top: 50vh;
		text-align: center;
		font-size: 40px;
		font-family: "Lucida Calligraphy", cursive, serif, sans-serif;
		color: #ddd;
		position: relative;
		z-index: 999;
	}

	.user{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 0 50rpx;
	}

	.userimg{
		width: 150rpx;
		height: 150rpx;
		background-color: black;
		border-radius: 50%;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.scroll-Y {
		height: 400rpx;
	}

	.scroll-view-item {
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
		font-size: 36rpx;
	}
	
	.view {
		background-color: transparent;
	}
	
	.home {
		position: relative;
		top: 100rpx;
		text-align: center;
		color: #ddd;
	}
</style>