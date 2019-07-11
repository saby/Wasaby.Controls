import {date as formatDate} from 'Types/formatter';

export default {
    dateToId: function(date: Date): string {
        return formatDate(date, 'YYYY-MM-DD');
    },
    idToDate: function(str: string): Date {
        const d: Array<string> = str.split('-');
        return new Date(d[0], (parseInt(d[1], 10) || 1) - 1);
    }
};
