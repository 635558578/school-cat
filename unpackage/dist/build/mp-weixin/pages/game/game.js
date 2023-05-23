"use strict";const e=require("../../common/vendor.js"),t={data:()=>({openId:"",statusBarHeight:0,windowHeight:0,softKeyboardHeight:0,scrollHeight:0,inputBottom:0,safeArea:null,houseId:"",message:"",messageList:[],isChangeBar:!0,selectorQuery:null,recorderManager:null,innerAudioContext:null,FileSystemManager:null,isMask:!1,length:0,timer:null,closeAreaBgc:"#000",closeAreaTextShow:"none",voiceBgc:"#51ff50",isPlay:!0,playSrc:"",toView:"",latitude:0,longitude:0,markers:[],locations:[]}),computed:{getVoiceBarWidth(){return 50+5*this.length+"rpx"},chatBoxHeight(){return this.windowHeight-this.statusBarHeight-80-500-this.softKeyboardHeight},containerHeight(){return this.windowHeight-this.softKeyboardHeight}},watch:{messageList:{handler(e,t){this.toView="item"+(this.messageList.length-1)},deep:!0,immediate:!0}},onLoad(t){this.houseId=t.houseId;const i=getApp();this.openId=i.globalData.openId,this.statusBarHeight=2*e.index.getWindowInfo().statusBarHeight,this.windowHeight=2*e.index.getWindowInfo().windowHeight,this.safeArea=e.index.getWindowInfo().safeArea,this.scrollHeight=this.windowHeight-this.softKeyboardHeight-this.statusBarHeight-500,console.log(this.scrollHeight),e.index.onKeyboardHeightChange((e=>{this.softKeyboardHeight=2*e.height})),this.selectorQuery=e.index.createSelectorQuery().in(this),console.log(this.openId,this.houseId),e.index.connectSocket({url:`wss://zyandwqy.top/websocket/${this.openId}/${this.houseId}`}),e.index.onSocketOpen((()=>{console.log("连接成功"),setInterval((()=>{setTimeout((()=>{this.getlocations(),console.log("每隔1秒")}),0)}),5e3)})),e.index.onSocketMessage((e=>{if("null"!==e.data&&e.data)if(console.log(JSON.parse(e.data)),"position"!==JSON.parse(e.data).type)this.messageList.push(JSON.parse(e.data));else{console.log("获取位置"),console.log(JSON.parse(e.data));const t=JSON.parse(e.data);if(console.log(t.openId),console.log(this.openId),console.log(t.openId!==this.openId),t.openId!==this.openId){const e=this.markers.findIndex((e=>e.id===t.openId));if(-1!==e)this.markers[e].latitude=t.latitude,this.markers[e].longitude=t.longitude;else{const e={};e.id=t.openId,e.latitude=t.latitude,e.longitude=t.longitude,e.iconPath=t.avatarUrl,e.width=15,e.height=15,this.markers.push(e)}console.log(this.markers)}}})),this.recorderManager=e.index.getRecorderManager(),this.FileSystemManager=e.index.getFileSystemManager(),this.innerAudioContext=e.index.createInnerAudioContext()},onUnload(){e.index.closeSocket()},methods:{back(){e.index.navigateBack()},getlocations(){new(require("../../static/lib/amap-wx.js").AMapWX)({key:"76c43a819cfcac86c1263fcf2763b098"}).getRegeo({success:t=>{this.longitude=t[0].longitude,this.latitude=t[0].latitude,console.log("this.longitude  : "+this.longitude),console.log("this.latitude  : "+this.latitude);const{avatarUrl:i,nickName:s}=e.index.getStorageSync("userInfo"),o={houseId:this.houseId,openId:this.openId,avatarUrl:i,nickName:s,type:"position",latitude:this.latitude,longitude:this.longitude,joinCluster:!0};e.index.sendSocketMessage({data:JSON.stringify(o)})},fail:e=>{console.log("获取位置失败"),console.log(e)}})},inputFocus(e){this.scrollHeight=this.windowHeight-this.softKeyboardHeight-this.statusBarHeight-500,this.inputBottom=this.softKeyboardHeight+this.safeArea.top/2},inputBlur(){this.scrollHeight=this.windowHeight-this.softKeyboardHeight-this.statusBarHeight-500,this.inputBottom=0},inputconfirm(){this.sendMessage()},sendMessage(){const{avatarUrl:t,nickName:i}=e.index.getStorageSync("userInfo");if(console.log(this.message),""!==this.message.trim()){const s={message:this.message,houseId:this.houseId,openId:this.openId,avatarUrl:t,nickName:i,type:"text"};console.log(s),e.index.sendSocketMessage({data:JSON.stringify(s),complete:()=>{this.message=""}})}},handleTouchStart(e){this.isMask=!0,this.recorderManager.start(),this.voiceBgc="#51ff50",this.length=1,this.timer=setInterval((()=>{this.length+=1,this.length>=60&&(clearInterval(this.timer),this.handleTouchEnd())}),1e3)},handleTouchMove(e){const t=this.windowHeight-2*e.touches[0].pageY;this.voiceBgc=t>104?"#f00":"#51ff50"},handleTouchEnd(t){const{avatarUrl:i,nickName:s}=e.index.getStorageSync("userInfo");console.log(i,s),clearInterval(this.timer),this.isMask=!1;const o=this.windowHeight-2*t.changedTouches[0].pageY;this.recorderManager.stop(),this.recorderManager.onStop((t=>{this.FileSystemManager.readFile({filePath:t.tempFilePath,encoding:"base64",success:t=>{const n=t.data;if(o<=104){const t={voice:n,time:this.length,houseId:this.houseId,openId:this.openId,avatarUrl:i,nickName:s,type:"voice"};e.index.sendSocketMessage({data:JSON.stringify(t)})}}})}))},writeAudio(t){const i=(new Date).getTime(),s=e.index.env.USER_DATA_PATH+"/"+i+".aac";return new Promise(((e,i)=>{this.FileSystemManager.writeFile({filePath:s,data:t,encoding:"base64",success:t=>{e(s)},fail:i})}))},async playVoice(t){const i=e.toRaw(this.innerAudioContext);if(this.isPlay){console.log(111);const e=await this.writeAudio(t);i.src=e,this.palySrc=t,i.play()}else if(console.log(222),i.stop(),this.palySrc!==t){console.log(333);const e=await this.writeAudio(t);i.src=e,this.palySrc=t,i.play()}i.onPlay((()=>{this.isPlay=!1})),i.onEnded((()=>{this.isPlay=!0})),i.onStop((()=>{this.isPlay=!0}))}}};if(!Array){e.resolveComponent("uni-icons")()}Math;const i=e._export_sfc(t,[["render",function(t,i,s,o,n,a){return e.e({a:e.p({type:"back",size:"40",color:"#f2f2f2"}),b:e.o(((...e)=>a.back&&a.back(...e))),c:e.t(n.houseId),d:`${n.statusBarHeight}rpx`,e:n.markers,f:n.latitude,g:n.longitude,h:n.isMask},n.isMask?{i:a.getVoiceBarWidth,j:n.voiceBgc,k:e.p({"custom-prefix":"iconfont",type:"icon-saying",size:"30",color:"#666"})}:{},{l:e.f(n.messageList,((t,i,s)=>e.e({a:t.openId!==n.openId},t.openId!==n.openId?e.e({b:t.avatarUrl,c:"text"===t.type},"text"===t.type?{d:e.t(t.message)}:"voice"===t.type?{f:5*t.time+50+"rpx",g:e.o((e=>a.playVoice(t.voice)),t.openId)}:{},{e:"voice"===t.type,h:`item${i}`}):e.e({i:t.avatarUrl,j:"text"===t.type},"text"===t.type?{k:e.t(t.message)}:"voice"===t.type?{m:5*t.time+50+"rpx",n:e.o((e=>a.playVoice(t.voice)),t.openId)}:{},{l:"voice"===t.type,o:`item${i}`}),{p:t.openId}))),m:n.toView,n:`${n.scrollHeight}rpx`,o:n.isChangeBar},n.isChangeBar?{p:e.o((e=>n.isChangeBar=!1)),q:e.p({"custom-prefix":"iconfont",type:"icon-jianpan",size:"30"}),r:e.o(((...e)=>a.handleTouchStart&&a.handleTouchStart(...e))),s:e.o(((...e)=>a.handleTouchMove&&a.handleTouchMove(...e))),t:e.o(((...e)=>a.handleTouchEnd&&a.handleTouchEnd(...e))),v:e.p({"custom-prefix":"iconfont",type:"icon-saoyisao",size:"30"})}:{w:e.o((e=>n.isChangeBar=!0)),x:e.p({"custom-prefix":"iconfont",type:"icon-yuyin",size:"30"}),y:e.o(((...e)=>a.inputFocus&&a.inputFocus(...e))),z:e.o(((...e)=>a.inputBlur&&a.inputBlur(...e))),A:e.o(((...e)=>a.inputconfirm&&a.inputconfirm(...e))),B:n.message,C:e.o((e=>n.message=e.detail.value)),D:e.p({"custom-prefix":"iconfont",type:"icon-saoyisao",size:"30"}),E:e.o(((...e)=>a.sendMessage&&a.sendMessage(...e))),F:`${n.inputBottom}rpx`},{G:`${a.chatBoxHeight}rpx`})}]]);wx.createPage(i);