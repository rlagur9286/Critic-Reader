getPageInfo('', info => {
  let infoBox = new InfoBox();
  let content = new Content();
  let rateBox = new RateBox();
  rateBox.setNewsData(info);

  let wrapper = document.createElement('div');
  wrapper.classList.add('manpower-box-wrapper');

  if (info.hasFishngWord()) {
    infoBox.setHasFishWord(info);
  }

  if (info.hasTrustWord()) {
    infoBox.setTrustWord(info);
  }

  if(info.hasFishngWord() || info.hasTrustWord()) {
    wrapper.appendChild(infoBox.getElement());
  }

  wrapper.appendChild(rateBox.getElement());
  document.body.appendChild(wrapper);


  var yesBtn = document.getElementById("yesBtn");
  yesBtn.addEventListener("click", () => {
    console.log('클릭 이벤트 받음');

    let baseUrl = 'http://ffac2887.ngrok.io/api/news/check/';
    url = window.location.href;

    let data = new FormData();
    data.append('yes', 1);
    data.append('news_url', url);

    fetch(baseUrl, {
      method : 'POST',
      body : data
    }).then(response => {
      return response.json()
    }).then(json => {
      console.log(json);
      let info = new Info(json);
      rateBox.setNewsData(info);
    });
  });

  var noBtn = document.getElementById("noBtn");
  noBtn.addEventListener("click", () => {
    console.log('클릭 이벤트 받음');

    let baseUrl = 'http://ffac2887.ngrok.io/api/news/check/';
    url = window.location.href;

    let data = new FormData();
    data.append('no', 1);
    data.append('news_url', url);

    fetch(baseUrl, {
      method : 'POST',
      body : data
    }).then(response => {
      return response.json()
    }).then(json => {
      console.log(json);
      let info = new Info(json);
      rateBox.setNewsData(info);
    });
  });


  if(!info.hasFishngWord() && !info.hasTrustWord()) {
    return;
  }

  let bodyContainer = document.querySelector('#articleBodyContents');
  bodyContainer.innerHTML = info.getContent();

  let titleContainer = document.querySelector('#articleTitle');
  titleContainer.innerHTML = info.getTitle();
});


console.log('naver run');
