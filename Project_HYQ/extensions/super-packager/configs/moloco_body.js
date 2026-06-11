(function (window, document) {
    window.dataLayer = window.dataLayer || [];

    measurementId = 'G-L9HGT8CDWB'
    clientId = getCookie('_ga') || generateClientId();
    sessionId = getSessionId();
    sessionCount = getSessionCount();
    baseUrl = 'https://www.google-analytics.com/g/collect';
    var pageLoadTime = Date.now();

    var gtagCore = {
        js: function (timestamp) {
            // 处理 js 命令，通常用于初始化
            sendRequest('js', null, {_et: 0});
        },
        config: function (targetId, configParams) {
            // 处理 config 命令
            var engagementTime = Date.now() - pageLoadTime;
            sendRequest('config', targetId, configParams, engagementTime);
        },
        event: function (eventName, eventParams) {
            // 处理 event 命令
            var engagementTime = Date.now() - pageLoadTime;
            sendRequest('event', eventName, eventParams, engagementTime);
        },
        set: function (setParams) {
            // 处理 set 命令，如果需要的话
            // 这里可以添加 set 命令的具体实现
        }
    };

    function gtag() {
        var args = Array.prototype.slice.call(arguments);
        var command = args.shift();
        console.log("gtag_log")
        if (gtagCore[command]) {
            gtagCore[command].apply(null, args);
        }
        dataLayer.push(arguments);
    }

    function sendRequest(type, eventName, params, et) {
        var queryParams = [
            'v=2',
            'tid=' + measurementId,
            'cid=' + clientId,
            '_p=' + Date.now(),
            '_s=' + Math.floor(Math.random() * 100),
            'sid=' + sessionId,
            'sct=' + sessionCount,
        ];

        if (type === 'js') {
            queryParams.push('en=page_view');
        } else if (type === 'config') {
            queryParams.push('en=page_view');
            queryParams.push('_et=' + et);
        } else if (type === 'event') {
            queryParams.push('en=' + eventName);
            queryParams.push('_et=' + et);
        }

        // 添加自定义参数
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                if (typeof params[key] === 'number') {
                    queryParams.push('epn.' + key + '=' + params[key]);
                } else {
                    queryParams.push('ep.' + key + '=' + encodeURIComponent(params[key]));
                }
            }
        }

        var url = baseUrl + '?' + queryParams.join('&');

        // 使用img标签发送请求
        var img = new Image();
        img.src = url;
        
        // 临时增加本地域名获取ga超额数据
        // var url2 = 'https://bi-sw-event.rivergame.net/swhb?source=rgi&' + queryParams.join('&');
        // var img2 = new Image();
        // img2.src = url2;
    }

    function getCookie(name) {
        var value = '; ' + document.cookie;
        var parts = value.split('; ' + name + '=');
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function generateClientId() {
        var clientId = Math.round(2147483647 * Math.random()) + '.' + Math.round(Date.now() / 1000);
        document.cookie = '_ga=GA1.1.' + clientId + '; path=/; expires=' + new Date(Date.now() + 63072000000).toUTCString();
        return clientId;
    }

    function getSessionId() {
        var sessionId = sessionStorage.getItem('ga_session_id');
        if (!sessionId) {
            sessionId = Date.now();
            sessionStorage.setItem('ga_session_id', sessionId);
        }
        return sessionId;
    }

    function getSessionCount() {
        var count = localStorage.getItem('ga_session_count') || 0;
        count = parseInt(count) + 1;
        localStorage.setItem('ga_session_count', count);
        return count;
    }

    // 公开gtag方法
    window.gtag = gtag;

    // 初始化
    gtag('js', new Date());
    gtag('config', measurementId); 
})(window, document);