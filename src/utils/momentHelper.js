import moment, { utc } from 'moment';
import 'moment-timezone';

/**
 * 계산은 utc로 변형해서 한다.
 */

class MomentHelper {
    constructor() {
        this.moment = moment;
        this.timezone = moment.tz.guess();
    }

    getLocaleDatetime = (_datetime) => {
        try {
            return this.moment(_datetime).tz(this.timezone).format("MM.DD HH:mm") 
        } catch (err) {
            return '';
        }
    }
    
    getLocaleHourMinute = (_datetime) => {
        return this.moment(_datetime).tz(this.timezone).format("HH:mm")
    }

    getLocaleDateWithYear = (_datetime) => {
        return this.moment(_datetime).tz(this.timezone).format("YYYY.MM.DD")
    }

    getLocaleFullDateWithYear = (_datetime) => {
        return this.moment(_datetime).tz(this.timezone).format("YYYY.MM.DD HH:mm")
    }

    getHHMMSSFromMillisecond = (millisecond) => {
        let inSec = Math.floor(millisecond / 1000);
        let sec = inSec % 60;
        sec = sec < 10 ? '0' + sec : sec;
        let inMin = Math.floor(inSec / 60);
        let min = inMin % 60;
        min = min < 10 ? '0' + min : min;
        let inHour = Math.floor(inMin / 60);
        let hour = inHour % 24;
        hour = hour < 10 ? '0' + hour : hour;
        return `${hour}:${min}:${sec}`;
    }

    calculateDueDateFromToday = (_datetime) => {
        const utcNowDate = this.moment.utc().toDate().toUTCString();
        const utcNow = this.moment(utcNowDate);
        const expirationDate = this.moment(_datetime);
        let restDays = this.moment.duration(expirationDate - utcNow).asDays();
        restDays = restDays.toString().split('.')[0];
        if (restDays.indexOf('-') != -1) {
            return 0;
        } else {
            return restDays;
        }
    }
}

const momentHelper = new MomentHelper();
export default momentHelper;