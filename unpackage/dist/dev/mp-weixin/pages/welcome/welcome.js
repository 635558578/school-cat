"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  async onLoad() {
  },
  methods: {
    gohome() {
      common_vendor.index.getUserProfile({
        desc: "获取信息用于头像展示"
      }).then((res) => {
        common_vendor.index.setStorageSync("userInfo", res.userInfo);
        const { globalData: { openId } } = new getApp();
        common_vendor.index.getStorageSync("userInfo");
        const { nickName: userName, avatarUrl: img } = common_vendor.index.getStorageSync("userInfo");
        common_vendor.index.request({
          url: "https://wx.zyandwqy.top/user/add",
          method: "POST",
          data: { openId, userName, img }
        });
      });
      common_vendor.index.navigateTo({
        url: "/pages/room/room"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.gohome && $options.gohome(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/code/Practice/coderwhy/15-uni-app/uni-app/school-cat/pages/welcome/welcome.vue"]]);
wx.createPage(MiniProgramPage);
