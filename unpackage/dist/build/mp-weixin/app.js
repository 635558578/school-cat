"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const e=require("./common/vendor.js");Math;const o={globalData:{openId:""},onLaunch:async function(){const o=await e.index.login();console.log(o),e.index.request({url:`https://wxappdmm.wyhzs.top/sendreq?code=${o.code}`}).then((e=>{this.globalData.openId=e.data.date.openid})).catch((e=>{console.log(e)}))}};function t(){return{app:e.createSSRApp(o)}}t().app.mount("#app"),exports.createApp=t;
