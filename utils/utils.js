function convertToStarsArray(stars) {
  let num = stars.substring(0,1);
  let newstars = [];
  for (let i = 0;i < 5;i++) {
    if (i<num) {
      newstars.push(1);
    } else {
      newstars.push(0);
    }  
  };
  return newstars;
};
function http(url,callBack) {
  wx.request({
    url: url,
    header: {
      "Content-Type": "json"
    },
    method: 'GET', 
    success(res) {
      callBack(res.data)
    },
    fail(err) {
      console.log(err.errMsg);
    },
  })
};
function convertToCastString(casts) {
  let castString = '';
  for (let idx in casts) {
    castString = castString + casts[idx].name + ' / ';
  }
  return castString.substring(0,castString.length-3);
};
function convertToCastInfos(casts) {
  let castsInfos = [];
  for (let idx in casts) {
    let cast = {
      avatar: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    };
    castsInfos.push(cast);
  }
  return castsInfos;
};
module.exports = {
  http,
  convertToStarsArray,
  convertToCastString,
  convertToCastInfos,
}