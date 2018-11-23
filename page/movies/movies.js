// page/movies/movies.js
let app = getApp(); 
let utils = require('../../utils/utils.js');

Page({
  data: {
    isSearch: false,
    inputValue: ''
  },
  onLoad: function (options) {
    let inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters' + '?start=0&count=3';
    let comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon' + '?start=0&count=3';
    let top250Url = app.globalData.doubanBase + '/v2/movie/top250' + '?start=0&count=3';
    this.getMoviesListData(inTheatersUrl,'inTheaters','正在热映');
    this.getMoviesListData(comingSoonUrl, 'comingSoon', '即将上映');
    this.getMoviesListData(top250Url, 'top250', 'Top250');
  },
  getMoviesListData: function(url, settedkey,categoryTitle) {
    let that = this;
    wx.request({
      url: url, 
      header: {
        "Content-Type": "json"
      },
      method: 'GET',
      success(res) {
        that.processDoubanData(res.data, settedkey, categoryTitle)
      },
      fail(err) {
        console.log(err.errMsg);
      },
    })
  },
  processDoubanData(DoubanData, settedkey, categoryTitle) {
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
    };
    let readyData = {};
    readyData[settedkey] = {
      categoryTitle: categoryTitle,
      movies: movies,
    };
    this.setData(readyData);
  },
  onMoreTap(event) {
    let category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: '/page/movies/more-movie/more-movie' + '?category=' + category,
    })
  },
  onSearchFocus() {
    this.setData({
      isSearch: true,
    });
  },
  onSearchCancel() {
    this.setData({
      isSearch: false,
      inputValue: '',
      searchResult: {}
    });
  },
  onSearchConfirm(e) {
    let text = e.detail.value;
    let searchUrl = app.globalData.doubanBase + '/v2/movie/search?q="' + text + '"';
    this.getMoviesListData(searchUrl, 'searchResult');
  },
  onMovieTap(e) {
    let movieId = e.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId,
    })
  },
})