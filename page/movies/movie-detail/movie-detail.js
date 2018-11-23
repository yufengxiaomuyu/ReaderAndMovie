let utils = require('../../../utils/utils.js');
let app = getApp(); 
Page({
  onLoad: function (options) {
    let movieId = options.id;
    let url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
    utils.http(url,this.processDoubanData);
  },
  processDoubanData(data) {
    if (!data) {
        return;
    }
    let director = {
        avatar: "",
        name: "",
        id: ""
    }
    if (data.directors[0] != null) {
        if (data.directors[0].avatars != null) {
            director.avatar = data.directors[0].avatars.large

        }
        director.name = data.directors[0].name;
        director.id = data.directors[0].id;
    }
    let movie = {
        movieImg: data.images ? data.images.large : "",
        country: data.countries[0],
        title: data.title,
        originalTitle: data.original_title,
        wishCount: data.wish_count,
        commentCount: data.comments_count,
        year: data.year,
        genres: data.genres.join("、"),
        stars: utils.convertToStarsArray(data.rating.stars),
        score: data.rating.average,
        director: director,
        casts: utils.convertToCastString(data.casts),
        castsInfo: utils.convertToCastInfos(data.casts),
        summary: data.summary
    }
    this.setData({
      movie,
    });
  },
  //放大查看图片
  onPreviewImg(e) {
    let url = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [url],
    })
  },
})