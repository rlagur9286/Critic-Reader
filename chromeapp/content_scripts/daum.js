

getPageInfo('', info => {
  let infoBox = new InfoBox();
  let content = new Content();
  let rateBox = new RateBox();
  rateBox.setNewsData(info);

  if (info.hasFishngWord()) {
      infoBox.setHasFishWord(info);
  }

  if (info.hasTrustWord()) {
      infoBox.setTrustWord(info);
  }

  if(!info.hasFishngWord() && !info.hasTrustWord()) {
      return;
  }

  let wrapper = document.createElement('div');
  wrapper.classList.add('manpower-box-wrapper');
  wrapper.appendChild(infoBox.getElement());
  wrapper.appendChild(rateBox.getElement());

  document.body.appendChild(wrapper);

  let bodyContainer = document.querySelector('#harmonyContainer');
  bodyContainer.innerHTML = info.getContent();

  let titleContainer = document.querySelector('.tit_view');
  titleContainer.innerHTML = info.getTitle();

});

console.log('daum run');
