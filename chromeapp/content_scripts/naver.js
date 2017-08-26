getPageInfo('', info => {
  let rateBox = new RateBox();

  if (info.hasFishingWord()) {
      rateBox.setFishingWords(info);
  }

  if (info.hasTrustWord()) {
      rateBox.setTrustWords(info);
  }

  rateBox.setNewsData(info);

  document.body.appendChild(rateBox.getElement());

  rateBox.startListen();

  let bodyContainer = document.querySelector('#articleBodyContents');
  bodyContainer.innerHTML = info.getContent();

  let titleContainer = document.querySelector('#articleTitle');
  titleContainer.innerHTML = info.getTitle();
});


console.log('naver run');
