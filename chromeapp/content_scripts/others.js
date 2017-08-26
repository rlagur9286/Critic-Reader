

class Page {
    constructor(target, url) {
        this.url = url;
        this.target = target;
        this.client = new Client();

        this.container = document.createElement('div');
        this.container.classList = 'fc-fixed-container';
    }

    setDisputed() {
        const evidenceUrl = this.client.getRedirectorUrl(this.url);

        this.container.innerHTML = `
            <div class="fc-status fc-false">
                <h1>이 문서는 거짓 정보를 담고 있습니다. <a href="${evidenceUrl}">근거 보기</a></h1>
            </div>
        `;
        this.target.append(this.container);
    }

    setVerified() {
        this.container.innerHTML = `
            <div>
                <h1>Test</h1>
            </div>
        `;
        this.target.append(this.container);
    }

    setNotVerified() {
        this.container.innerHTML = `
            <div>
                <h1>이 문서는 </h1>
            </div>
        `;
        this.target.append(this.container);
    }

    check() {
        this.client.getStatus(this.url, status => {
            switch (status.status) {
                // case client.STATUSES.NotVerified:
                //     this.setNotVerified();
                //     break;
                // case client.STATUSES.Verified:
                //     this.setVerified();
                //     break;
                case this.client.STATUSES.Disputed:
                    this.setDisputed();
                    break;
            }
        })
    }
}


let oMain = () => {
    const skipHosts = [
        'facebook.com',
        'twitter.com'
    ];

    if (skipHosts.indexOf(window.location.host) > 0) {
        return
    }

    let page = new Page(document.body, window.location.href);
    page.check();
};


oMain();
