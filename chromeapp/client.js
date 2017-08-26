
const ESCAPE_KEY = 27;

class RateBox {

  constructor() {
    this.nRates = 0;
    this.rate = null;
    this.element = document.createElement('div');
    this.element.classList.add('manpower-box');
    this.element.classList.add('manpower-rate-box');
  }

  setNewsData(info) {

    let result = info.json.result;
    let personCnt = result.num_of_person;
    let rateOfNews = result.rate_of_news;

    let section = document.createElement('div');
    section.innerHTML = `
      <div>
        <svg width="0" height="0">
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#BA00FF;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#00F2FF;stop-opacity:1" />
          </linearGradient>
        </svg>
        <div>
          <h3>이 기사의 품질을 평가한 사람</h3>
          <h1>${personCnt}</h1>
        </div>
        <div class="chart-wrapper">
          <div class="info">
            <h1>${rateOfNews}%</h1>
          </div>
          <svg class="chart" width="200" height="200"><g transform="translate(100,100)"><path class="arc" fill="url(#grad1)" d="M4.2862637970157365e-15,-70A70,70 0 1,1 -41.14496766047313,-56.631189606246316L-38.793826651303235,-53.39512162874652A66,66 0 1,0 4.0413344371862654e-15,-66Z"></path></g></svg>
        </div>
        <div>
          <h3>신뢰할만한 기사 인가요?</h3>
          <ul class="actions">
            <li class="action">네</li>
            <li class="action">아니요</li>
          </ul>
        </div>
      </div>
    `
    this.element.appendChild(section);

  }

  getElement() {
    return this.element;
  }



}

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
    this.element.classList.add('manpower-box');
    this.element.addEventListener('click', event =>{

    });
    document.addEventListener('keydown', event => {
        if(event.keyCode === ESCAPE_KEY){
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
      <div>총 ${count}개의 신뢰성 저하 단어가 있습니다. (${wordArrayList})</div>
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
