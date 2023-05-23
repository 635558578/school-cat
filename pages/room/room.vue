<template>
	<view class="room">
		<image class="image" src="https://pikacode.oss-cn-chengdu.aliyuncs.com/school_cat/choose_methods_bg.png" mode=""></image>
		<div @click="joinRoom" class="join">加入房间</div>
		<div @click="creatRoom" class="create">创建房间</div>
		
	</view>
	
</template>

<script >
	export default {
		// data() {
		// 	return {
	 
		// 	}
		// },
		// mounted() {
		// 	this.addPerson()
		// },
		
		methods: {
			// addPerson(){
			// 	const { globalData: { openId } } = new getApp()
			// 	console.log(openId)
			// 	const userInfo = uni.getStorageSync('userInfo')
			// 	const { nickName: userName, avatarUrl: img } = uni.getStorageSync('userInfo')
			// 	console.log(openId, userName, img)
				
			// },
			creatRoom(){
				uni.navigateTo({
					url: '../create/create'
				})
			},
			joinRoom(){
				uni.navigateTo({
					url: '../join-home/join-home'
				})
			}
		}
	}
</script>

<style scoped>
	.room{
		height: 100vh;
		position: relative;
	}
 .room .image{
	 width: 100%;
	 height: 100%;
	
 }
 .join{
	 width: 50vw;
	 height: 10vh;
	 line-height: 10vh;
	 background-image: linear-gradient(to right, #70bd76 , yellow);
	 opacity: 0.8;
	 position: absolute;
	 top: 41vw;
	 color: #fff;
	 font-size: 8vw;
 }
 .create{
	 width: 50vw;
	 height: 10vh;
	 line-height: 10vh;
	 background-image: linear-gradient(to right, #70bd76 , yellow);
	 opacity: 0.8;
	 position: absolute;
	 top: 82vw;
	 color: #fff;
	 font-size: 8vw;
 }
 


</style>
