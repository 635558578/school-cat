"use strict";const o=require("../../common/vendor.js"),e={methods:{creatRoom(){o.index.navigateTo({url:"../create/create"})},joinRoom(){o.index.navigateTo({url:"../join-home/join-home"})}}};const n=o._export_sfc(e,[["render",function(e,n,r,t,a,c){return{a:o.o(((...o)=>c.joinRoom&&c.joinRoom(...o))),b:o.o(((...o)=>c.creatRoom&&c.creatRoom(...o)))}}],["__scopeId","data-v-1f26510c"]]);wx.createPage(n);