<template>
	<div class="box">
		<image class="image" src="https://pikacode.oss-cn-chengdu.aliyuncs.com/school_cat/welcome_bg_z.png" @click="gohome"></image>
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
	  async	onLoad() {
		  
		},
		methods: {
			gohome() {
				uni.getUserProfile({
					desc: "获取信息用于头像展示"
				}).then(res => {
					uni.setStorageSync('userInfo', res.userInfo)
					const { globalData: { openId } } = new getApp()
					const userInfo = uni.getStorageSync('userInfo')
					const { nickName: userName, avatarUrl: img } = uni.getStorageSync('userInfo')
					uni.request({
						url: 'https://wx.zyandwqy.top/user/add',
						method: 'POST',
						data: { openId, userName, img }
					})
				})
				uni.navigateTo({
					url: '/pages/room/room'
				})
			}
		}
	}
</script>

<style>
	.image{
	  width: 100vw;
	  height: 100vh;
	}
	.box {
		width: 100%;
		height: 100vh;
		background-color: hotpink;
	}
</style>