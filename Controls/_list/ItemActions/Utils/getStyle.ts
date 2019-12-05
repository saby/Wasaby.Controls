import {Logger} from 'UI/Utils';

var deprecatedStyles = {
    error: 'danger',
    done: 'success',
    attention: 'warning',
    default: 'secondary'
};

export = function getStyle(style, controlName) {
    if (!style) {
        return 'secondary';
    }

    if (deprecatedStyles.hasOwnProperty(style)) {
        Logger.warn(controlName + ': Используются устаревшие стили. Используйте ' + deprecatedStyles[style] + ' вместо ' + style);
        return deprecatedStyles[style];
    }

    return style;
};
