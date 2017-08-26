const ESCAPE_KEY = 27;


let rate = (value, callback) => {
  let url = 'http://ffac2887.ngrok.io/api/news/check/';
  let data = new FormData();
  data.append('news_url', window.location.href);
  data.append(value, 1);

  fetch(url, {
    method: 'POST',
    body: data
  }).then(response => response.json())
      .then(json => callback(json));
};


class RateBox {
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('manpower-rate-box');
  }

  setNewsData(info) {
    let result = info.json.result;
    let personCnt = result.num_of_person;
    let percent = result.rate_of_news * 100;

    let section = document.createElement('div');
    section.innerHTML = `
      <div class="chart">
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
            <h3>기사 품질 만족도</h3>
            <h1>${Math.round(percent)}%</h1>
          </div>
        </div>
        <div class="footer">
          <h3>신뢰할만한 기사라고 생각하시나요?</h3>
          <ul class="actions">
            <li class="action" id="btn-yes">네</li>
            <li class="action" id="btn-no">아니요</li>
          </ul>
        </div>
      </div>
    `;

    this.btnYes = section.querySelector('#btn-yes');
    this.btnNo = section.querySelector('#btn-no');

    let arc = d3.svg.arc()
        .innerRadius(96)
        .outerRadius(100)
        .startAngle(0)
        .endAngle(percent / 50 * Math.PI);

    let svg = d3.select(section.querySelector('.chart-wrapper'))
        .append("svg")
        .attr("width", 330)
        .attr("height", 200)
        .append("g")
        .attr("transform", "translate(165, 100)");

    svg.append("path")
        .attr("fill", "url(#grad1)")
        .attr("d", arc);

    this.element.innerHTML = '';
    this.element.appendChild(section);

    this.startListen();
  }

  setFishingWords(info) {
    let result = info.json.result;
    let count = result.critic_cnt;
    let wordArrayList = result.critic_words.join(', ');

    let section = document.createElement('div');
    section.classList.add('critic');
    section.innerHTML = `
      <h3>총 ${count}개의 신뢰성 저하 단어가 있습니다.</h3>
      <p>:${wordArrayList}</p>
      <br>
      <h3>추측성 내용이나 확인되지 않은 취재원 내용을 담고 있습니다.</h3>
    `;

    this.element.appendChild(section);
  }

  setTrustWords(info) {
    let result = info.json.result;
    let count = result.trust_cnt;
    let wordArrayList = result.trust_words.join(', ');

    let section = document.createElement('div');
    section.innerHTML = `
      <div>${count}개의 긍정적인 단어가 있습니다. (${wordArrayList})</div>
    `;

    this.element.appendChild(section);
  }

  getElement() {
    return this.element;
  }

  startListen() {
    this.btnYes.addEventListener('click', () => {
      rate('yes', json => {
        this.setNewsData(new Info(json));
      })
    });
    this.btnNo.addEventListener('click', () => {
      rate('no', json => {
        this.setNewsData(new Info(json));
      })
    });
  }
}


class Info {
  constructor(json) {
      this.json = json
  }

  hasFishingWord() {
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


let getPageInfo = (url, callback) => {
  let baseUrl = 'http://ffac2887.ngrok.io/api/news/check/';
  url = encodeURIComponent(window.location.href);

  fetch(baseUrl + '?news_url=' + url).then(response => {
    console.log(response);
    return response.json();
  }).then(json => {
    let info = new Info(json);
    callback(info);
  })
};


console.log('client run');
