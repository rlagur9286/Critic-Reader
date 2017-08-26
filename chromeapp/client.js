


class Info {

  constructor(json) {
      this.json = json
  }

  hasFishngWord() {
    return this.json.result.critic_cnt > 0;
  }

  hasTrustWord() {
    return this.json.result.trust_cnt > 0;
  }

  getTitle() {
    return this.json['result']['header'];
  }

  getContent() {
    return this.json['result']['text'];
  }
}


class InfoBox {

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('manpower-news-info-box');
    this.element.addEventListener('click', event =>{

    });
    document.addEventListener('keydown', event => {
        if(event.keyCode === 27){
          this.element.style.display = 'none';
        }
    })
  }

  setHasFishWord(info) {
    console.log(info);
    let result = info.json.result;
    let count = result.critic_cnt;
    let wordArrayList = result.critic_words.join(', ');

    let section = document.createElement('div');
    section.innerHTML = `
      <div>${count}개의 신뢰성 저하 단어가 있습니다. (${wordArrayList})</div>
      <div>추측성 내용이나 확인되지 않은 취재원 내용을 담고 있습니다.</div>
    `
    this.element.appendChild(section);
  }

  setTrustWord(info) {
    let result = info.json.result;
    let count = result.trust_cnt;
    let wordArrayList = result.trust_words.join(', ');

    let section = document.createElement('div');
    section.innerHTML = `
      <div>${count}개의 긍정적인 단어가 있습니다. (${wordArrayList})</div>
    `
    this.element.appendChild(section);
  }

  getElement() {
    return this.element;
  }
}

class Content {

  constructor() {
    this.element = document.createElement('div');
  }

  setHilightWord() {
    // this.element.innerHTML('');
  }

  setFictionWord() {

  }

}


let getPageInfo = (url, callback) => {

  baseUrl = 'http://ffac2887.ngrok.io/api/news/check/';
  url = encodeURIComponent(window.location.href);

  fetch(baseUrl + '?news_url=' + url).then(response => {
    console.log(response);
    return response.json();
  }).then(json => {
    let info = new Info(json);
    callback(info);
  })

}



console.log('client run');
