

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

  let bodyContainer = document.querySelector('#articleBodyContents');
  bodyContainer.innerHTML = info.getContent();

  let titleContainer = document.querySelector('#articleTitle');
  titleContainer.innerHTML = info.getTitle();

})

console.log('naver run');
