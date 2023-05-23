"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
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
    creatRoom() {
      common_vendor.index.navigateTo({
        url: "../create/create"
      });
    },
    joinRoom() {
      common_vendor.index.navigateTo({
        url: "../join-home/join-home"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.joinRoom && $options.joinRoom(...args)),
    b: common_vendor.o((...args) => $options.creatRoom && $options.creatRoom(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-49055c66"], ["__file", "D:/code/Practice/coderwhy/15-uni-app/uni-app/school-cat/pages/room/room.vue"]]);
wx.createPage(MiniProgramPage);
