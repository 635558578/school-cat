<script setup>
import { ref, reactive } from 'vue'

// 保存表单输入的数据
const formData = reactive({
	password: ''
})

// 获取openId
const { globalData: { openId } } = new getApp()

// 创建房间
const submit = async () => {
	const password = formData.password.trim()
	console.log(password)
	// 判断不能为空
	if (password === '') {
		uni.showToast({
			title: '密码不能为空',
			duration: 1000,
			icon: 'error'
		})
		return
	}
	// 判断长度
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
		url: 'https://wx.zyandwqy.top/home/create',
		method: 'POST',
		data: {
			password: formData.password,
			openId
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
				homePersonnelInfo.push(res.data.map.Homeowner)
				console.log(homePersonnelInfo)
				uni.setStorageSync('homePersonnelInfo', homePersonnelInfo)
				uni.navigateTo({
					url: `/pages/join/join?homeId=${res.data.data.homeId}&Homeowner=1`
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
				<image
				  src="https://pikacode.oss-cn-chengdu.aliyuncs.com/school_cat/choose_methods_bg.png"
					mode=""
					style="height: 100vh; width: 100vw; position: absolute;"
				></image>
			</view>

			<view class="form">
				<h1 class="title">CREATE</h1>
				<view style="margin-right: 100rpx;">
					<uni-forms :modelValue="formData">
						<uni-forms-item label="密码" name="password" style="margin-top: 100rpx;">
							<input
								type="text"
								v-model="formData.password"
								placeholder="密码"
								style="border-bottom: 2px solid #fff;"
							/>
						</uni-forms-item>
					</uni-forms>
				</view>
				<button @click="submit" style="margin-top: 100rpx;">创建</button>
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
		font-size: 70rpx;
	}

	.btn {
		width: 35%;
		margin: -2vh auto;
	}
	.uni-forms{
		margin-right: 100rpx;
	}
</style>