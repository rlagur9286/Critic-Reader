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

  let bodyContainer = document.querySelector('#harmonyContainer');
  bodyContainer.innerHTML = info.getContent();

  let titleContainer = document.querySelector('.tit_view');
  titleContainer.innerHTML = info.getTitle();
});


console.log('daum run');
