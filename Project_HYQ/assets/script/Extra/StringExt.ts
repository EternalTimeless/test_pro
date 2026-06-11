export default class StringExt {
    /**转换时间格式, 最大显示小时 100:00:00 */
    public static TimeFormatHM(mms: number) {
        var s = this.change(Math.floor((mms % (1000 * 60)) / 1000));
        var m = this.change(Math.floor((mms % (1000 * 60 * 60)) / (1000 * 60))) + ":";
        var h = Math.floor((mms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var day = Math.floor((mms % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
        var h2 = this.change(h + day * 24) + ":";
        return h2 + m + s;
    }
    public static change(t) {
        if (t < 10) {
            return "0" + t;
        } else {
            return t;
        }
    }
    /**转换时间格式 120:00 */
    public static TimeFormatMS(mms: number) {
        let s = this.change(Math.floor((mms % (1000 * 60)) / 1000));
        let m = Math.floor((mms % (1000 * 60 * 60)) / (1000 * 60))
        let h = Math.floor((mms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        let m1 = this.change(m + h * 60) + ":";
        return m1 + s;
    }
    /**
     * 转换带字母的时间格式 1h2m3s
     * @param s 秒
     * @param _capital 是否大写, 默认false
     */
    public static TimeFormatEn(s: number, _capital: boolean = false) {
        if (s <= 0)
            return "0";
        if (_capital) {
            var s1 = this.change1(Math.floor(s % 60)) + "S";
            var m = this.change1(Math.floor((s % (60 * 60)) / 60)) + "M";
            var h = this.change1(Math.floor((s % (60 * 60 * 24)) / (60 * 60))) + "H";
            if (s1 == "S")
                s1 = "";
            if (m == "M")
                m = "";
            if (h == "H")
                h = "";
        } else {
            var s1 = this.change1(Math.floor(s % 60)) + "s";
            var m = this.change1(Math.floor((s % (60 * 60)) / 60)) + "m";
            var h = this.change1(Math.floor((s % (60 * 60 * 24)) / (60 * 60))) + "h";
            if (s1 == "s")
                s1 = "";
            if (m == "m")
                m = "";
            if (h == "h")
                h = "";
        }
        return h + m + s1;
    }
    /**
     * 转换带字母的时间格式 101h2m3s
     * @param s 秒
     * @param _capital 是否大写, 默认false
     */
    public static TimeFormatEn2(s: number) {
        if (s <= 0)
            return "0";
        var s1 = this.change1(Math.floor(s % 60)) + "s";
        var min = this.change1(Math.floor((s % (60 * 60)) / 60)) + "m";
        var hour = this.change1(Math.floor((s % (60 * 60 * 24)) / (60 * 60)));
        var day = this.change1(Math.floor((s % (60 * 60 * 24 * 365)) / (60 * 60 * 24)));
        var h2 = hour + day * 24 + "h"
        if (s1 == "s")
            s1 = "";
        if (min == "m")
            min = "";
        if (hour == "h")
            h2 = "";
        return h2 + min + s1;
    }
    /**转换时间格式, 不带秒钟 24:00 */
    public static TimeFormatMin(s: number) {
        const H = Math.floor(s / 60);
        const M = Math.floor((s - H * 60) % 60);
        return this.change(H) + ":" + this.change(M)
    }
    public static change1(t) {
        if (t <= 0) {
            return "";
        } else {
            return t;
        }
    }
    /**
     * 转换出来的格式是1小时2分钟3秒
     * @param timeNumber 毫秒
     */
    public static TimeToZh(timeNumber: number, format?: string): string {
        var rText = ""
        var nValue = Math.floor(timeNumber / 1000);
        if (nValue % 60 > 0) {
            rText = (nValue % 60).toString() + (format ? "" : "秒");
        }
        nValue = Math.floor(nValue / 60);
        if (nValue % 60 > 0) {
            rText = (nValue % 60).toString() + (format ? format : "分钟") + rText;
        }
        nValue = Math.floor(nValue / 60);
        if (nValue % 24 > 0) {
            rText = (nValue % 24).toString() + (format ? format : "小时") + rText;
        }
        nValue = Math.floor(nValue / 24);
        if (nValue % 365 > 0) {
            rText = (nValue % 365).toString() + (format ? format : "天") + rText;
        }
        return rText;
    }
    /**
     * 转换天数
     * @param second 秒 
     * @returns 天数
     */
    public static getDay(second: number): number {
        return (second + 8 * 3600) / 86400 | 0;
    }
    /**
     * 转换小时 
     * @param second 毫秒
     * @returns 
     */
    public static getHour(second: number): number {
        return Math.floor(this.TimeToMinuteString(second) / 60) < 1 ? 1 : Math.floor(this.TimeToMinuteString(second) / 60);
    }
    /**
    * 转换出来的格式是  200分钟
    * @param timeNumber 毫秒
    */
    public static TimeToMinuteString(timeNumber: number): number {
        if (timeNumber <= 0)
            return 0;

        return Math.floor(timeNumber / 1000 / 60);
    }
    /**
     * 转换日期格式1970/01/01, 不传参数返回当天日期
     * @param _timestamp 毫秒
     * @returns 日期
     */
    public static GetDay(_timestamp?: number) {
        let date: Date
        if (_timestamp) {
            date = new Date(_timestamp);
        } else {
            date = new Date(Date.now())
        }
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return `${year}/${month < 10 ? "0" + month : month}/${day < 10 ? "0" + day : day}`;
    }
    /**
     * 转换时间格式12:12:12, 不传参数返回当前时刻表
     * @param _timestamp 毫秒
     * @returns 日期
     */
    public static GetTimetable(_timestamp?: number) {
        let date: Date
        if (_timestamp) {
            date = new Date(_timestamp);
        } else {
            date = new Date(Date.now())
        }
        let hour = date.getHours();
        let min = date.getMinutes();
        let second = date.getSeconds();
        return `${hour}:${min < 10 ? "0" + min : min}:${second < 10 ? "0" + second : second}`;
    }
    /**
     * 转换欧美日期格式 01/01/1970
     * @param _timestamp 毫秒
     * @returns 日期
     */
    public static GetDayUTC(_timestamp?: number) {
        let date: Date
        if (_timestamp) {
            date = new Date(_timestamp);
        } else {
            date = new Date(Date.now())
        }
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}`;
    }
}