import {Control, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/NewCalendar3/Month');

import 'css!Controls-demo/NewCalendar3/NewCalendar';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    _monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    _monthDays = [
        [1, 2, 3, 4, 5, 6, 7],
        [8, 9, 10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19, 20, 21],
        [22, 23, 24, 25, 26, 27, 28],
        [29, 30, 31]
    ];
}
