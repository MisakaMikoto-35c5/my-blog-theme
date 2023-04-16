document.cookieHelper = {
    acceptAllTemplate: {'analytics': '1', 'disqus': '1'},
    denyAllTemplate: {'analytics': '0', 'disqus': '0'},
    changeCookieSettings: (settings) => {
        const origCookieConf = document.cookieHelper.readCookieConfiguration();

        for (const [key, value] of Object.entries(settings)) {
            origCookieConf[key] = value;
        }
        localStorage.cookieConfiguration = JSON.stringify(origCookieConf);
        if (document.cookieHelper.noticeElement) {
            document.cookieHelper.noticeElement.setAttribute('style', 'display: none;');
            document.cookieHelper.noticeElement.innerHTML = '';
        }
    },
    checkFeactureEnabled: (feature) => {
        return readCookieConfiguration()[feature] !== '0';
    },
    readCookieConfiguration: () => {
        const conf = localStorage.cookieConfiguration;
        if (conf == null || conf === '') {
            return {};
        } else {
            return JSON.parse(conf);
        }
    },
    onPageLoad: async () => {
        if (window.fetch == null) {
            console.error('Brower too old');
            return;
        }
        const conf = localStorage.cookieConfiguration;
        if (conf != null && conf !== '') {
            return;
        }
        const webPageResponse = await fetch ('/cookie-helper/privacy-notice.html');
        const htmlData = await webPageResponse.text();
        const elem = document.createElement('div');
        document.cookieHelper.noticeElement = elem;
        elem.innerHTML = htmlData;
        elem.setAttribute('style', 'position: fixed; left: 0; right: 0; bottom: 0; background-color: #ddd; height: 4rem; padding: .5rem;');
        document.body.appendChild(elem);
    }
};

window.addEventListener("load", function(event) {
    document.cookieHelper.onPageLoad();
});
 