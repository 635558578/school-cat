<template>
	<!-- 语音遮罩层 -->
	
</template>
 
<style>
   .voice-mask{
		position: absolute;
		top:0;
		right:0;
		bottom:0;
		left:0;
		/* display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center; */
		background-color: rgba(0,0,0,0.8);
	}
	.voice-bar{
		position: absolute;
		left:50%;
		top: 50%;
		transform: translate(-50%,-30%);
		/* width: 230rpx; */
		height:150rpx;
		background-color:#51ff50;
		border-radius: 26rpx;
		margin-bottom: 220rpx;
	}
	.voiceDel{
		left:80rpx;
		top: 50%;
		width: 170rpx !important;
		transform: translateX(0%);
		transform: translateY(-30%);
		background-color: red;
	}
	.voice-volume{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		width: 160rpx;
		height: 36rpx;
	}
	.volumeDel{
		width: 80rpx;
	}
	.trangle-bottom{
		position: absolute;
		bottom: -38rpx;
		left:50%;
		transform: translateX(-50%);
		border-width: 20rpx;
		border-style: solid;
		border-color: #51FF50 transparent transparent transparent;
	}
	.trangleDel{
		border-color: red transparent transparent transparent;
	}
	.voice-send{
		position: absolute;
		bottom: 0;
		width: 100%;
	}
	.voice-middle-wrapper{
		width: 100%;
		display: flex;
		position:relative;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 40rpx;
	}
	.voice-left-wrapper{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
	}
	.cancel-del{
		display:none;
	}
	.delTip{
		display:block;
		color:#bfbfbf;
		margin: 0 22rpx 18rpx 0;
	}
	.voice-middle-inner{
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0,0,0,0.2);
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
	}
	.close{
		transform: rotate(350deg);
		margin-left: 80rpx;
	}	
	.bigger{
		width: 170rpx;
		height: 170rpx;
	}
	.to-text{
		transform: rotate(10deg);
		margin-right: 80rpx;
	}
	.close-icon{
		width: 80rpx;
		height: 80rpx;	
	}
	.wen{
		font-size: 40rpx;
		color:#bfbfbf;
	}
	.send-tip{
		position: absolute;
		left: 50%;
		bottom:0rpx;
		transform: translate(-50%,36%);
		color:#bfbfbf;
	}
	.sendTipNone{
		display: none;
	}
	.mask-bottom{
		position: relative;
		width: 100%;
		height:190rpx;
		border-top: #BABABB 8rpx solid;
		border-radius: 300rpx 300rpx 0 0;
		background-image: linear-gradient(#949794,#e1e3e1);
	}
	.mask-bottom image{
		position: absolute;
		width: 60rpx;
		height: 60rpx;
		top: 0;
		right:0;
		bottom: 0;
		left: 0;
		margin: auto;
	}
</style>
