import {Date as WSDate} from 'Types/entity';
import {date as formatDate} from 'Types/formatter';

export default {
    dateToId: function(date: Date): string {
        return formatDate(date, 'YYYY-MM-DD');
    },
    idToDate: function(str: string, dateConstructor: Function): Date {
        const d: Array<string> = str.replace('h', '').split('-');
        return new (dateConstructor || WSDate)(d[0], (parseInt(d[1], 10) || 1) - 1);
    }
};
