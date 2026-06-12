
export enum PLASDK_EVENT {
    LOADING = 'LOADING',        // 可试玩广告素材开始加载
    LOADED = 'LOADED',          // 可试玩广告素材加载完毕
    DISPLAYED = 'DISPLAYED',    // 向用户显示可试玩广告素材

    CHALLENGE_STARTED = 'CHALLENGE_STARTED',
    CHALLENGE_FAILED = 'CHALLENGE_FAILED',
    CHALLENGE_RETRY = 'CHALLENGE_RETRY',
    CHALLENGE_PASS_25 = 'CHALLENGE_PASS_25',    // 自动打点 玩20s
    CHALLENGE_PASS_50 = 'CHALLENGE_PASS_50',    // 自动打点 玩50s
    CHALLENGE_PASS_75 = 'CHALLENGE_PASS_75',    // 自动打点 玩80s
    CHALLENGE_SOLVED = 'CHALLENGE_SOLVED',

    CTA_CLICKED = 'CTA_CLICKED',        // 主动点击下载按钮
    ENDCARD_SHOWN = 'ENDCARD_SHOWN',    // 被动点击下载按钮
}

export default class PLASDK {

    static SendData(event: PLASDK_EVENT){
        console.log(`PLASDK.SendData: ${event}`);
        //@ts-ignore
        if (typeof window.ALPlayableAnalytics != 'undefined') {
            //@ts-ignore
            window.ALPlayableAnalytics.trackEvent(event);
        }
    }
    
}

