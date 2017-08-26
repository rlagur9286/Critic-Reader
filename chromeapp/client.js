

class Client {
    constructor(props) {
        this.STATUSES = {
            NotVerified: 'not_verified',
            Disputed: 'disputed',
            Verified: 'verified'
        };  // TODO : move to class property.s

        let manifest = chrome.runtime.getManifest();
        this.baseUrl = manifest.update_url ?
            'https://???' :
            'https://localhost:9004';
    }

    getStatus(url, callback) {
        fetch(this.baseUrl + '/api/page?url=' + encodeURIComponent(url))
            .then(response => response.json())
            .then(json => {
                if (callback) {
                    callback(json)
                }
            })
    }

    getReportUrl(url) {
        return this.baseUrl + '/report?url=' + encodeURIComponent(url)
    }

    getRedirectorUrl(url) {
        return this.baseUrl + '/redirect/by-url?url=' + encodeURIComponent(url)
    }
}
