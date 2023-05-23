"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "join",
  setup(__props) {
    const { globalData: { openId } } = new getApp();
    const { nickName, avatarUrl } = common_vendor.index.getStorageSync("userInfo");
    const homePersonnelInfo = common_vendor.index.getStorageSync("homePersonnelInfo");
    const userList = common_vendor.ref(homePersonnelInfo);
    console.log(userList);
    let houseId = common_vendor.ref("");
    let Homeowner = common_vendor.ref();
    common_vendor.onLoad((options) => {
      console.log(options);
      houseId.value = options.homeId;
      Homeowner.value = Boolean(options.Homeowner);
      console.log(Homeowner.value);
      sock();
    });
    common_vendor.onHide(() => {
      console.log(111);
      closeSock();
    });
    const sock = () => {
      console.log(houseId.value);
      common_vendor.index.connectSocket({ url: `wss://zyandwqy.top/websocket/${openId}/${houseId.value}` });
      common_vendor.index.onSocketOpen(() => {
        console.log("连接成功");
        const data = {
          openId,
          nickName,
          img: avatarUrl,
          status: 1,
          houseId: houseId.value
        };
        common_vendor.index.sendSocketMessage({
          data: JSON.stringify(data)
        });
      });
      common_vendor.index.onSocketMessage((res) => {
        console.log(JSON.parse(res.data));
        const data = JSON.parse(res.data);
        if (data === null) {
          return;
        }
        if (data.toGame === "toGame") {
          common_vendor.index.navigateTo({
            url: `/pages/game/game?houseId=${houseId.value}`
          });
          return;
        }
        if (data.status === 1) {
          const index = userList.value.findIndex((item) => item.openId === data.openId);
          console.log(index);
          index === -1 ? userList.value.push(data) : "";
        } else if (data.status === 0) {
          const index = userList.value.findIndex((item) => item.openId === data.openId);
          console.log(index);
          index !== -1 ? userList.value.splice(index, 1) : "";
        }
      });
    };
    const closeSock = () => {
      common_vendor.index.request({
        url: "https://wx.zyandwqy.top/user/logout",
        data: {
          open_id: openId
        }
      });
      const data = {
        openId,
        nickName,
        img: avatarUrl,
        status: 0,
        houseId: houseId.value
      };
      common_vendor.index.sendSocketMessage({
        data: JSON.stringify(data)
      });
      common_vendor.index.closeSocket();
    };
    const startGame = () => {
      const data = {
        toGame: "toGame",
        houseId: houseId.value
      };
      common_vendor.index.sendSocketMessage({
        data: JSON.stringify(data)
      });
      common_vendor.index.navigateTo({
        url: `/pages/game/game?houseId=${houseId.value}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(common_vendor.unref(houseId)),
        b: common_vendor.f(userList.value, (item, index, i0) => {
          return {
            a: `url(${item.img})`,
            b: item.openId
          };
        }),
        c: common_vendor.unref(Homeowner)
      }, common_vendor.unref(Homeowner) ? {
        d: common_vendor.o(startGame)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-46bff7b1"], ["__file", "D:/code/Practice/coderwhy/15-uni-app/uni-app/school-cat/pages/join/join.vue"]]);
wx.createPage(MiniProgramPage);
