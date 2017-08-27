getPageInfo('', info => {
  if(!info.json.success) {
    return;
  }
  let rateBox = new RateBox();
  let starBox = new StarBox();

  if (info.hasFishingWord()) {
      rateBox.setFishingWords(info);
  }

  if (info.hasTrustWord()) {
      rateBox.setTrustWords(info);
  }

  rateBox.setNewsData(info);
  starBox.setStar(info);
  // rateBox.setStar(info);

  // document.body.appendChild(rateBox.getElement());

  let boxContainer = document.createElement('div');
  boxContainer.classList.add('manpower-box-container');
  boxContainer.appendChild(rateBox.getElement());
  boxContainer.appendChild(starBox.getElement());
  document.body.appendChild(boxContainer);


  rateBox.startListen();

  let bodyContainer = document.querySelector('#articleBodyContents');
  bodyContainer.innerHTML = info.getContent();

  let titleContainer = document.querySelector('#articleTitle');
  titleContainer.innerHTML = info.getTitle();
});


console.log('naver run');
