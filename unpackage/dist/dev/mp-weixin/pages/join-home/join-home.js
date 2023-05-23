"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_forms_item2 + _easycom_uni_forms2)();
}
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_forms_item + _easycom_uni_forms)();
}
const _sfc_main = {
  __name: "join-home",
  setup(__props) {
    const formData = common_vendor.reactive({
      homeId: "",
      password: ""
    });
    const { globalData: { openId } } = new getApp();
    const submit = () => {
      const homeId = formData.homeId.trim();
      const password = formData.password.trim();
      if (homeId === "") {
        common_vendor.index.showToast({
          title: "房间号不能为空",
          duration: 1e3,
          icon: "error"
        });
        return;
      }
      if (homeId.length !== 6) {
        common_vendor.index.showToast({
          title: "房间号为6位",
          duration: 1e3,
          icon: "error"
        });
        return;
      }
      if (password === "") {
        common_vendor.index.showToast({
          title: "密码不能为空",
          duration: 1e3,
          icon: "error"
        });
        return;
      }
      if (password.length < 3 || password.length > 5) {
        common_vendor.index.showToast({
          title: "密码应为 3 到 5 个数字",
          duration: 1e3,
          icon: "error"
        });
        return;
      }
      const RegExp = /[^\d]/g;
      if (RegExp.test(password)) {
        common_vendor.index.showToast({
          title: "密码只能是数字",
          duration: 1e3,
          icon: "error"
        });
        return;
      }
      common_vendor.index.request({
        url: "https://wx.zyandwqy.top/user/join",
        method: "POST",
        data: {
          password: formData.password,
          homeId: formData.homeId,
          openId
        },
        success: (res) => {
          if (res.data.code !== 200) {
            common_vendor.index.showToast({
              title: res.data.msg,
              duration: 1e3,
              icon: "error"
            });
          } else {
            console.log(res);
            const homePersonnelInfo = [];
            for (const key in res.data.map) {
              console.log(key);
              homePersonnelInfo.push(res.data.map[key]);
            }
            console.log(homePersonnelInfo);
            common_vendor.index.setStorageSync("homePersonnelInfo", homePersonnelInfo);
            common_vendor.index.navigateTo({
              url: `/pages/join/join?homeId=${homeId}&Homeowner=`
            });
          }
        },
        fail: () => {
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: formData.homeId,
        b: common_vendor.o(($event) => formData.homeId = $event.detail.value),
        c: common_vendor.p({
          label: "房间号",
          name: "homeId"
        }),
        d: formData.password,
        e: common_vendor.o(($event) => formData.password = $event.detail.value),
        f: common_vendor.p({
          label: "密码",
          name: "password"
        }),
        g: common_vendor.p({
          modelValue: formData
        }),
        h: common_vendor.o(submit)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2599e927"], ["__file", "D:/code/Practice/coderwhy/15-uni-app/uni-app/school-cat/pages/join-home/join-home.vue"]]);
wx.createPage(MiniProgramPage);
