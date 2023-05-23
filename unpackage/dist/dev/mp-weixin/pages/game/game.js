"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      // openId小程序用户的唯一标识符
      openId: "",
      // 运行该小程序手机状态栏的高度
      statusBarHeight: 0,
      // 手机可视区域的高度
      windowHeight: 0,
      // 软键盘的高度
      softKeyboardHeight: 0,
      // 滚动区域的高度
      scrollHeight: 0,
      // 输入框底部的高度
      inputBottom: 0,
      // 容器的高度
      // containerHeight: 0,
      // 手机底部安全区域的信息
      safeArea: null,
      // houseId游戏房间号
      houseId: "",
      // 发消息的信息
      message: "",
      // 消息列表
      messageList: [],
      // 切换语音和文字
      isChangeBar: true,
      // 获取DOM的实例
      selectorQuery: null,
      // 语音录制
      recorderManager: null,
      // 语音播放
      innerAudioContext: null,
      // 文件管理器的实例
      FileSystemManager: null,
      // 遮罩层的显示与隐藏
      isMask: false,
      // 语音的长度
      length: 0,
      // 录音时长的定时器
      timer: null,
      // 取消区域的背景颜色
      closeAreaBgc: "#000",
      // 取消区域上方提示汉字的显示与隐藏
      closeAreaTextShow: "none",
      // 语音背景颜色
      voiceBgc: "#51ff50",
      // 是否可以播放声音
      isPlay: true,
      // 判断点的是否时同一个声音
      playSrc: "",
      // 存储滚动的id
      toView: "",
      // 地图默认显示的维度
      latitude: 0,
      // 地图默认显示的经度
      longitude: 0,
      // 地图标记点
      markers: [],
      // 高德地图记录位置信息
      locations: []
    };
  },
  computed: {
    // 计算语音条宽度
    getVoiceBarWidth() {
      return 50 + this.length * 5 + "rpx";
    },
    // 地图下方整体的高度
    chatBoxHeight() {
      return this.windowHeight - this.statusBarHeight - 80 - 500 - this.softKeyboardHeight;
    },
    containerHeight() {
      return this.windowHeight - this.softKeyboardHeight;
    }
  },
  watch: {
    messageList: {
      handler(val, oldVal) {
        this.toView = `item${this.messageList.length - 1}`;
      },
      deep: true,
      immediate: true
    }
  },
  onLoad(options) {
    this.houseId = "123412";
    const global = getApp();
    this.openId = global.globalData.openId;
    this.statusBarHeight = common_vendor.index.getWindowInfo().statusBarHeight * 2;
    this.windowHeight = common_vendor.index.getWindowInfo().windowHeight * 2;
    this.safeArea = common_vendor.index.getWindowInfo().safeArea;
    this.scrollHeight = this.windowHeight - this.softKeyboardHeight - this.statusBarHeight - 500;
    console.log(this.scrollHeight);
    common_vendor.index.onKeyboardHeightChange((res) => {
      this.softKeyboardHeight = res.height * 2;
    });
    this.selectorQuery = common_vendor.index.createSelectorQuery().in(this);
    console.log(this.openId, this.houseId);
    common_vendor.index.connectSocket({ url: `wss://zyandwqy.top/websocket/${this.openId}/${this.houseId}` });
    common_vendor.index.onSocketOpen(() => {
      console.log("连接成功");
      setInterval(() => {
        setTimeout(() => {
          this.getlocations();
          console.log("每隔1秒");
        }, 0);
      }, 5e3);
    });
    common_vendor.index.onSocketMessage((res) => {
      if (res.data !== "null" && res.data) {
        console.log(JSON.parse(res.data));
        if (JSON.parse(res.data).type !== "position") {
          this.messageList.push(JSON.parse(res.data));
        } else {
          console.log("获取位置");
          console.log(JSON.parse(res.data));
          const data = JSON.parse(res.data);
          console.log(data.openId);
          console.log(this.openId);
          console.log(data.openId !== this.openId);
          if (data.openId !== this.openId) {
            const index = this.markers.findIndex((item) => item.id === data.openId);
            if (index !== -1) {
              this.markers[index].latitude = data.latitude;
              this.markers[index].longitude = data.longitude;
            } else {
              const item = {};
              item.id = data.openId;
              item.latitude = data.latitude;
              item.longitude = data.longitude;
              item.iconPath = data.avatarUrl;
              item.width = 15;
              item.height = 15;
              this.markers.push(item);
            }
            console.log(this.markers);
          }
        }
      }
    });
    this.recorderManager = common_vendor.index.getRecorderManager();
    this.FileSystemManager = common_vendor.index.getFileSystemManager();
    this.innerAudioContext = common_vendor.index.createInnerAudioContext();
  },
  onUnload() {
    common_vendor.index.closeSocket();
  },
  methods: {
    // 返回上一个页面
    back() {
      common_vendor.index.navigateBack();
    },
    // 获取位置方法
    getlocations() {
      const amapFile = require("../../static/lib/amap-wx.js");
      const myAmapFun = new amapFile.AMapWX({ key: "76c43a819cfcac86c1263fcf2763b098" });
      myAmapFun.getRegeo({
        success: (res) => {
          console.log(res);
          this.longitude = res[0].longitude;
          this.latitude = res[0].latitude;
          console.log("this.longitude  : " + this.longitude);
          console.log("this.latitude  : " + this.latitude);
          const { avatarUrl, nickName } = common_vendor.index.getStorageSync("userInfo");
          const selflocation = {
            houseId: this.houseId,
            openId: this.openId,
            avatarUrl,
            nickName,
            type: "position",
            latitude: this.latitude,
            longitude: this.longitude,
            joinCluster: true
          };
          common_vendor.index.sendSocketMessage({
            data: JSON.stringify(selflocation)
          });
        },
        fail: (err) => {
          console.log("获取位置失败");
          console.log(err);
        }
      });
    },
    // 输入框聚焦
    inputFocus(e) {
      this.scrollHeight = this.windowHeight - this.softKeyboardHeight - this.statusBarHeight - 500;
      this.inputBottom = this.softKeyboardHeight + this.safeArea.top / 2;
    },
    // 输入框失去焦点
    inputBlur() {
      this.scrollHeight = this.windowHeight - this.softKeyboardHeight - this.statusBarHeight - 500;
      this.inputBottom = 0;
    },
    // 输入框触发完成时
    inputconfirm() {
      this.sendMessage();
    },
    // 点击发送按钮
    sendMessage() {
      const { avatarUrl, nickName } = common_vendor.index.getStorageSync("userInfo");
      console.log(this.message);
      if (this.message.trim() !== "") {
        const data = {
          message: this.message,
          houseId: this.houseId,
          openId: this.openId,
          avatarUrl,
          nickName,
          type: "text"
        };
        console.log(data);
        common_vendor.index.sendSocketMessage({
          data: JSON.stringify(data),
          complete: () => {
            this.message = "";
          }
        });
      }
    },
    // 语音录制开始
    handleTouchStart(e) {
      this.isMask = true;
      this.recorderManager.start();
      this.voiceBgc = "#51ff50";
      this.length = 1;
      this.timer = setInterval(() => {
        this.length += 1;
        if (this.length >= 60) {
          clearInterval(this.timer);
          this.handleTouchEnd();
        }
      }, 1e3);
    },
    // 点击录音后手指移动
    handleTouchMove(e) {
      const position = this.windowHeight - e.touches[0].pageY * 2;
      if (position > 104) {
        this.voiceBgc = "#f00";
      } else {
        this.voiceBgc = "#51ff50";
      }
    },
    // 语音录制结束
    handleTouchEnd(e) {
      const { avatarUrl, nickName } = common_vendor.index.getStorageSync("userInfo");
      console.log(avatarUrl, nickName);
      clearInterval(this.timer);
      this.isMask = false;
      const position = this.windowHeight - e.changedTouches[0].pageY * 2;
      this.recorderManager.stop();
      this.recorderManager.onStop((res) => {
        this.FileSystemManager.readFile({
          filePath: res.tempFilePath,
          encoding: "base64",
          success: (data) => {
            const voice = data.data;
            if (position <= 104) {
              const info = {
                voice,
                time: this.length,
                houseId: this.houseId,
                openId: this.openId,
                avatarUrl,
                nickName,
                type: "voice"
              };
              common_vendor.index.sendSocketMessage({
                data: JSON.stringify(info)
              });
            }
          }
        });
      });
    },
    // 将base64文件转化成本地文件路径
    writeAudio(voice) {
      const times = new Date().getTime();
      const filePath = common_vendor.index.env.USER_DATA_PATH + "/" + times + ".aac";
      return new Promise((resolve, reject) => {
        this.FileSystemManager.writeFile({
          filePath,
          data: voice,
          encoding: "base64",
          success: (res) => {
            resolve(filePath);
          },
          fail: reject
        });
      });
    },
    // 播放声音
    async playVoice(voice) {
      const innerAudioContext = common_vendor.toRaw(this.innerAudioContext);
      if (this.isPlay) {
        console.log(111);
        const res = await this.writeAudio(voice);
        innerAudioContext.src = res;
        this.palySrc = voice;
        innerAudioContext.play();
      } else {
        console.log(222);
        innerAudioContext.stop();
        if (this.palySrc !== voice) {
          console.log(333);
          const res = await this.writeAudio(voice);
          innerAudioContext.src = res;
          this.palySrc = voice;
          innerAudioContext.play();
        }
      }
      innerAudioContext.onPlay(() => {
        this.isPlay = false;
      });
      innerAudioContext.onEnded(() => {
        this.isPlay = true;
      });
      innerAudioContext.onStop(() => {
        this.isPlay = true;
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      type: "back",
      size: "40",
      color: "#f2f2f2"
    }),
    b: common_vendor.o((...args) => $options.back && $options.back(...args)),
    c: common_vendor.t($data.houseId),
    d: `${$data.statusBarHeight}rpx`,
    e: $data.markers,
    f: $data.latitude,
    g: $data.longitude,
    h: $data.isMask
  }, $data.isMask ? {
    i: $options.getVoiceBarWidth,
    j: $data.voiceBgc,
    k: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "icon-saying",
      size: "30",
      color: "#666"
    })
  } : {}, {
    l: common_vendor.f($data.messageList, (item, index, i0) => {
      return common_vendor.e({
        a: item.openId !== $data.openId
      }, item.openId !== $data.openId ? common_vendor.e({
        b: item.avatarUrl,
        c: item.type === "text"
      }, item.type === "text" ? {
        d: common_vendor.t(item.message)
      } : item.type === "voice" ? {
        f: item.time * 5 + 50 + "rpx",
        g: common_vendor.o(($event) => $options.playVoice(item.voice), item.openId)
      } : {}, {
        e: item.type === "voice",
        h: `item${index}`
      }) : common_vendor.e({
        i: item.avatarUrl,
        j: item.type === "text"
      }, item.type === "text" ? {
        k: common_vendor.t(item.message)
      } : item.type === "voice" ? {
        m: item.time * 5 + 50 + "rpx",
        n: common_vendor.o(($event) => $options.playVoice(item.voice), item.openId)
      } : {}, {
        l: item.type === "voice",
        o: `item${index}`
      }), {
        p: item.openId
      });
    }),
    m: $data.toView,
    n: `${$data.scrollHeight}rpx`,
    o: $data.isChangeBar
  }, $data.isChangeBar ? {
    p: common_vendor.o(($event) => $data.isChangeBar = false),
    q: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "icon-jianpan",
      size: "30"
    }),
    r: common_vendor.o((...args) => $options.handleTouchStart && $options.handleTouchStart(...args)),
    s: common_vendor.o((...args) => $options.handleTouchMove && $options.handleTouchMove(...args)),
    t: common_vendor.o((...args) => $options.handleTouchEnd && $options.handleTouchEnd(...args)),
    v: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "icon-saoyisao",
      size: "30"
    })
  } : {
    w: common_vendor.o(($event) => $data.isChangeBar = true),
    x: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "icon-yuyin",
      size: "30"
    }),
    y: common_vendor.o((...args) => $options.inputFocus && $options.inputFocus(...args)),
    z: common_vendor.o((...args) => $options.inputBlur && $options.inputBlur(...args)),
    A: common_vendor.o((...args) => $options.inputconfirm && $options.inputconfirm(...args)),
    B: $data.message,
    C: common_vendor.o(($event) => $data.message = $event.detail.value),
    D: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "icon-saoyisao",
      size: "30"
    }),
    E: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    F: `${$data.inputBottom}rpx`
  }, {
    G: `${$options.chatBoxHeight}rpx`
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/code/Practice/coderwhy/15-uni-app/uni-app/school-cat/pages/game/game.vue"]]);
wx.createPage(MiniProgramPage);
