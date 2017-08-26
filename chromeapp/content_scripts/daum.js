

getPageInfo('', info => {
  let infoBox = new InfoBox();
  let content = new Content();


  if (info.hasFishngWord()) {
    infoBox.setHasFishWord(info);
  }

  if (info.hasFictionWord()) {
    infoBox.setFictionWord();
  }


  document.body.appendChild(infoBox.getElement());

  let bodyContainer = document.querySelector('#harmonyContainer');
  bodyContainer.innerHTML = info.getContent();

  let titleContainer = document.querySelector('.tit_view');
  titleContainer.innerHTML = info.getTitle();


})

console.log('daum run');
