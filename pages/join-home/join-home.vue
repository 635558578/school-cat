<script setup>
import { reactive } from 'vue'

const formData = reactive({
	homeId: '',
	password: ''
})

// 获取openId
const { globalData: { openId } } = new getApp()

// 加入房间
const submit = () => {
	const homeId = formData.homeId.trim()
	const password = formData.password.trim()
	// 判断房间号不能为空
	if (homeId === '') {
		uni.showToast({
			title: '房间号不能为空',
			duration: 1000,
			icon: 'error'
		})
		return
	}
	// 判断房间号长度
	if (homeId.length !== 6) {
		uni.showToast({
			title: '房间号为6位',
			duration: 1000,
			icon: 'error'
		})
		return
	}
	// 判断密码不能为空
	if (password === '') {
		uni.showToast({
			title: '密码不能为空',
			duration: 1000,
			icon: 'error'
		})
		return
	}
	// 判断密码长度
	if (password.length < 3 || password.length > 5) {
		uni.showToast({
			title: '密码应为 3 到 5 个数字',
			duration: 1000,
			icon: 'error'
		})
		return
	}
	const RegExp = /[^\d]/g
	// 判断密码只能是数字
	if (RegExp.test(password)) {
		uni.showToast({
			title: '密码只能是数字',
			duration: 1000,
			icon: 'error'
		})
		return
	}
	uni.request({
		url: 'https://wx.zyandwqy.top/user/join',
		method: 'POST',
		data: {
			password: formData.password,
			homeId: formData.homeId,
			openId: openId
		},
		success: res => {
			if (res.data.code !== 200) {
				uni.showToast({
					title: res.data.msg,
					duration: 1000,
					icon: 'error'
				})
			} else {
				console.log(res)
				const homePersonnelInfo = []
				for (const key in res.data.map) {
					console.log(key)
					homePersonnelInfo.push(res.data.map[key])
				}
				console.log(homePersonnelInfo)
				uni.setStorageSync('homePersonnelInfo', homePersonnelInfo)
				uni.navigateTo({
					url: `/pages/join/join?homeId=${homeId}&Homeowner=`
				})
			}
		},
		fail: () => {}
	})
}

</script>

<template>
	<view>
		<view class="room">
			<view class="img">
				<image src="https://pikacode.oss-cn-chengdu.aliyuncs.com/school_cat/choose_methods_bg.png" mode=""
					style="height: 100vh;width: 100vw;position: absolute;"></image>
			</view>
			<view class="form">
				<h1 class="title">JOIN</h1>
				<view style="margin-right: 100rpx">
					<uni-forms :modelValue="formData">
						<uni-forms-item label="房间号" name="homeId">
							<input type="text" v-model="formData.homeId" placeholder="请输入房间号" style="border-bottom: 2px solid #fff;" />
						</uni-forms-item>
						<uni-forms-item label="密码" name="password">
							<input type="text" v-model="formData.password" placeholder="请输入密码" style="border-bottom: 2px solid #fff;" />
						</uni-forms-item>
					</uni-forms>
					<!-- W5XDBR -->
				</view>
				<button @click="submit" style="width: 200rpx;">加入</button>
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

	.form {
		position: absolute;
		width: 100vw;
		height: 37vh;
		background-image: linear-gradient(to right, #5b6468, gray);
		margin-top: 30vh;


	}

	.title {
		color: #fff;
		text-align: center;
		margin-bottom: 80rpx;
		font-size: 40rpx;
	}

	.btn {
		width: 35%;
		margin: -2vh auto;
	}
</style>