/* globals chrome */

let postSelector = '._5pcr:not([data-checked=true])';
let linkSelector = '._52c6';


class Post {
    constructor(el) {
        this.el = el;
        this.client = new Client();
    }

    setChecked() {
        this.el.dataset.checked = true;
    }

    setChecking(link) {
        let container = link
            .parentElement
            .parentElement
            .parentElement
            .parentElement
            .parentElement
            .parentElement;  // sorry.

        let bar = document.createElement('div');

        bar.innerHTML = `
            <div class="fc-status-bar">
                <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946 s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634 c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"></path>
                <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0 C22.32,8.481,24.301,9.057,26.013,10.047z" transform="rotate(204 20 20)">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"></animateTransform>
                </path>
                </svg>
            </div>
        `;
        container.insertBefore(bar, container.firstChild);

        return {container, bar};
    }

    setDisputed(container, bar) {
        container.style.border = '1px solid #a20404';

        bar.innerHTML = `
            <div class="fc-status-bar fc-disputed">
                <span>이 링크는 거짓 정보를 담고 있습니다.</span> <a href="https://newstapa.org">판단 근거</a>
            </div>
        `;
    }

    setVerified(container, bar) {
        bar.innerHTML = `
            <div class="fc-status-bar fc-verified">
                <div class="fc-mark fc-mark-verified">V</div>
            </div>
        `;
    }

    setNotVerified(container, bar, url) {
        let reportUrl = this.client.getReportUrl(url);

        bar.innerHTML = `
            <div class="fc-status-bar fc-not-verified">
                <a class="fc-toggle-menu" href="#">?</a>
                <ul class="fc-menu">
                    <li class="fc-menu-item fc-btn-report"><a href="${reportUrl}" target="_blank">가짜뉴스 신고</a></li>
                    <li class="fc-menu-item fc-btn-report"><a href="${reportUrl}" target="_blank">내용 검증 요청</a></li>
                </ul>
            </div>
        `;

        let menuToggle = bar.querySelector('.fc-toggle-menu');
        let menu = bar.querySelector('.fc-menu');
        menuToggle.addEventListener('click', e => menu.classList.toggle('opened'));
    }

    check() {
        this.setChecked();

        let links = this.el.querySelectorAll(linkSelector);
        if (links.length < 1) {
            return
        }
        let link = links[0];

        let { container, bar } = this.setChecking(link);

        let url = link.href;
        url = url.split('l.php?u=')[1];
        url = url.split('&')[0];
        url = decodeURI(url);


        // this.setNotVerified(container, bar, url);
        this.setDisputed(container, bar);
        this.client.getStatus(url, status => {
            switch (status.status) {
                case this.client.STATUSES.NotVerified:
                    this.setNotVerified(container, bar, url);
                    break;
                case this.client.STATUSES.Verified:
                    this.setVerified(container, bar);
                    break;
                case this.client.STATUSES.Disputed:
                    this.setDisputed(container, bar);
                    break;
            }
        });
    }
}

let lastPosition = document.body.scrollHeight;  // TODO : move to global namespace.
let fbMain = () => {
    if (document.body.scrollHeight === lastPosition) {
        return
    } else {
        lastPosition = document.body.scrollHeight;
    }

    let posts = document.querySelectorAll(postSelector);
    posts.forEach(el => {
        new Post(el).check();
    });
};


setInterval(fbMain, 2000);
