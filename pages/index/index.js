// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    inputVal: null,
    scrollTop: 0,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    QA: [{ role: 'assistant', content:'Hi! 我是云聊机器人Robo，你可以问我任何问题。例如：\n"描写春天的诗句"\n"Explain quantum computing in simple terms"\n\n我可以记住您在对话中早些时候说的话，允许您后续更正。'}]
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindconfirm(e) {
    const inputVal = e.detail.value;
    e.detail.value = null;
    const QA = [...this.data.QA];
    QA.push({ role: 'user', content: inputVal });
    this.setData({ QA, inputVal: null});
    this.setData({scrollTop: 999999})
    const that = this;
    wx.request({
      // url: 'https://api.openai.com/v1/chat/completions',
      url: 'https://service-foyugpuy-1256746910.sg.apigw.tencentcs.com/release/v1/chat/completions',
      method: 'POST',
      data: {
        model: "gpt-3.5-turbo",
        // messages: [{ "role": "user", "content": inputVal }],
        messages: this.data.QA.slice(1),
        // stream: true,
        // prompt: inputVal,
        // max_tokens: 2048,
        // user: "1",
        // temperature: 0.5,
        // frequency_penalty: 0.0, //Number between -2.0 and 2.0  
        // //Positive values decrease the model's likelihood 
        // //to repeat the same line verbatim.
        // presence_penalty: 0.0,  //Number between -2.0 and 2.0. 
        // //Positive values increase the model's likelihood 
        // //to talk about new topics.
        // stop: ["#", ";"]
      },
      header: {
        'Accept':'application/json',
        'content-type': 'application/json',
        'Authorization':'Bearer ' + 'key'
      },
      success(res) {
        const result = res.data.choices[0].message.content;
        QA.push({ role: 'assistant', content: result });
        that.setData({ QA });
        that.setData({ scrollTop: 999999 })
      }
    })
  }
})
