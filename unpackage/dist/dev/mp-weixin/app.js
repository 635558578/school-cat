"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/welcome/welcome.js";
  "./pages/room/room.js";
  "./pages/create/create.js";
  "./pages/join-home/join-home.js";
  "./pages/join/join.js";
  "./pages/game/game.js";
}
const _sfc_main = {
  globalData: {
    openId: ""
  },
  onLaunch: async function() {
    const res = await common_vendor.index.login();
    console.log(res);
    common_vendor.index.request({
      url: `https://wxappdmm.wyhzs.top/sendreq?code=${res.code}`
    }).then((res2) => {
      this.globalData.openId = res2.data.date.openid;
    }).catch((err) => {
      console.log(err);
    });
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/code/Practice/coderwhy/15-uni-app/uni-app/school-cat/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
