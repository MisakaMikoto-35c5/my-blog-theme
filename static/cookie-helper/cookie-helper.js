document.cookieHelper = {
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
        if (conf == null && conf === '') {
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
        if (conf != null || conf !== '') {
            return;
        }
        const webPageResponse = await fetch ('/cookie-helper/privacy-notice.html');
        const htmlData = await webPageResponse.text();
        const elem = document.createElement('div');
        document.cookieHelper.noticeElement = elem;
        elem.innerHTML = htmlData;
        document.body.appendChild(elem);
    }
};

document.addEventListener("DOMContentLoaded", function(event) {
    document.cookieHelper.onPageLoad();
});
 