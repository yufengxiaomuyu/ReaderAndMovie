// page/movies/more-movie/more-movie.js
let app = getApp();
 let utils = require('../../../utils/utils.js');

Page({
  data: {
    curIdx: 0,
    movies: []
  },
  onLoad: function (options) {
    let category = options.category;
    let url = app.globalData.doubanBase;
    switch (category) {
      case '正在热映':
        url = url + '/v2/movie/in_theaters';
        break;
      case '即将上映':
        url = url + '/v2/movie/coming_soon';
        break;
      case 'Top250':
        url = url + '/v2/movie/top250';
        break;
    };
    this.setData({
      category,
      url,
    });
    utils.http(url, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.category,
    })
  },
  processDoubanData(DoubanData) {
    let movies = [];
    for (let idx in DoubanData.subjects) {
      let subject = DoubanData.subjects[idx];
      let title = (subject.title.length <= 6) ? subject.title : subject.title.substring(0, 6) + '...';
      let stars = utils.convertToStarsArray(subject.rating.stars);
      let movie = {
        coverImage: subject.images.large,
        title: title,
        score: subject.rating.average,
        stars: stars,
        movieId: subject.id,
      }
      movies.push(movie);
    }
    movies = this.data.movies.concat(movies);
    this.setData({
      movies,
    });
    wx.hideNavigationBarLoading();
    console.log(movies);
  },
  onReachBottom() {
    this.setData({
      curIdx: this.data.curIdx + 20,
    })
    let newUrl = this.data.url + '?start=' + this.data.curIdx + '&count=20';
    utils.http(newUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onPullDownRefresh() {
    let freshUrl = this.data.url + '?start=0&count=20';
    this.setData({
      movies: [],
    });
    wx.stopPullDownRefresh();
    utils.http(freshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onMovieTap(e) {
    let movieId = e.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    })
  },
})