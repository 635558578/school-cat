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
  __name: "create",
  setup(__props) {
    const formData = common_vendor.reactive({
      password: ""
    });
    const { globalData: { openId } } = new getApp();
    const submit = async () => {
      const password = formData.password.trim();
      console.log(password);
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
        url: "https://wx.zyandwqy.top/home/create",
        method: "POST",
        data: {
          password: formData.password,
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
            homePersonnelInfo.push(res.data.map.Homeowner);
            console.log(homePersonnelInfo);
            common_vendor.index.setStorageSync("homePersonnelInfo", homePersonnelInfo);
            common_vendor.index.navigateTo({
              url: `/pages/join/join?homeId=${res.data.data.homeId}&Homeowner=1`
            });
          }
        },
        fail: () => {
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: formData.password,
        b: common_vendor.o(($event) => formData.password = $event.detail.value),
        c: common_vendor.p({
          label: "密码",
          name: "password"
        }),
        d: common_vendor.p({
          modelValue: formData
        }),
        e: common_vendor.o(submit)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-98f0e4ec"], ["__file", "D:/code/Practice/coderwhy/15-uni-app/uni-app/school-cat/pages/create/create.vue"]]);
wx.createPage(MiniProgramPage);
