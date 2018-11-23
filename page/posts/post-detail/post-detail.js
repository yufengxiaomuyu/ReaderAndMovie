// page/posts/post-detail/post-detail.js
let postData = require('../../../data/posts-data.js');

Page({
  data: {
  },
  onLoad: function (options) {
    let postId = options.id;
    this.setData({
      postData: postData.postList[postId],
      postId: postId,
    });
    this.initColleced(postId);
    this.initMusic();
  },
  //初始化收藏
  initColleced: function (postId) {
    let postsCollected = wx.getStorageSync('posts_collected');
    let postCollected = postsCollected[postId];
    if (postsCollected && postCollected) {
      this.setData({
        collected: postCollected,
      });
    } 
  },
  //处理收藏函数
  handleCollected: function (id) {
    let postsCollected = wx.getStorageSync('posts_collected') ? wx.getStorageSync('posts_collected') : {};
    let postCollected = !this.data.collected;
    this.setData({
      collected: postCollected,
    });
    postsCollected[id] = postCollected;
    wx.setStorageSync('posts_collected', postsCollected);
  },
  //点击收藏按钮
  onCollectionTap: function (event) {
    this.handleCollected(this.data.postId);
    wx.showToast({
      title: this.data.collected ? '已成功收藏' : '已取消收藏',
    })
  },
  //处理右上角的分享
  onShareAppMessage: function () {
    return {
      title: this.data.postData.title,
      path: '/page/posts/post-detail/post-detail',
    }
  },
  //点击分享按钮
  onShareTap: function (event) {
    let itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博',
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success(res) {
        console.log(res);
        wx.showModal({
          title: itemList[res.tapIndex],
          content: "确定分享吗？",
          success(res) {
            if (res.confirm) {
              wx.showToast({
                icon: 'none',
                title: '抱歉暂不支持分享',
              })
            }
          }
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  //初始化音乐
  initMusic() {
    let music = this.data.postData.music; 
    let isPlayingMusic = true;
    let backgroundMusic = wx.getBackgroundAudioManager();
    backgroundMusic.src = music.url;
    backgroundMusic.title = music.title;
    backgroundMusic.coverImgUrl = music.coverImg;
    this.setData({
      isPlayingMusic: isPlayingMusic,
      backgroundMusic: backgroundMusic,
    });
    //监听音乐播放的总控开关、结束播放
    backgroundMusic.onPlay(this.musicOnPlay);
    backgroundMusic.onPause(this.musicOnPause);
    backgroundMusic.onEnded(this.musicOnEnded);
  },
  musicOnPlay() {
    this.setData({
      isPlayingMusic: true,
    })
  },
  musicOnPause() {
    this.setData({
      isPlayingMusic: false,
    })
  },
  musicOnEnded() {
    this.setData({
      isPlayingMusic: false,
    })
    console.log('end');
  }, 
  //点击音乐按钮
  onMusicTap() {
    let isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      this.data.backgroundMusic.pause();
    } else {
      this.data.backgroundMusic.play();
    };
    isPlayingMusic = !this.data.isPlayingMusic;
    console.log(isPlayingMusic);
    this.setData({
      isPlayingMusic: isPlayingMusic,
    })
  }
})