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


  if(!info.hasFishngWord() && !info.hasTrustWord()) {
    return;
  }

  let bodyContainer = document.querySelector('#articleBodyContents');
  bodyContainer.innerHTML = info.getContent();

  let titleContainer = document.querySelector('#articleTitle');
  titleContainer.innerHTML = info.getTitle();
});


console.log('naver run');
