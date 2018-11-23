// page/posts/post.js

let postData = require('../../data/posts-data.js');
Page({
  onLoad: function () {
    this.setData({
      postList: postData.postList,
    })
  },
  //点击列表进入文章详情页
  onPostTap: function(event) {
    let postId = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: './post-detail/post-detail?id=' + postId,
    })
  },
  //点击banner进入文章详情页
  onSwiperTap: function (event) {
    let postId = event.target.dataset.postId;
    wx.navigateTo({
      url: './post-detail/post-detail?id=' + postId,
    })
  }
})
