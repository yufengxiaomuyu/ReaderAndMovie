// page/welcom/welcom.js
Page({
  data: {
    avatarUrl: '/images/avatar/4.png',
    nickName: '七月'
  },
  onLoad: function(options) {
  },
  ontap: function(){
    wx.switchTab({
      url: '/page/posts/post',
    })
  },
})