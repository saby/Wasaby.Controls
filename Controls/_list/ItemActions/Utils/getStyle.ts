import Env = require('Env/Env');

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
        Env.IoC.resolve('ILogger').warn(controlName, 'Используются устаревшие стили. Используйте ' + deprecatedStyles[style] + ' вместо ' + style);
        return deprecatedStyles[style];
    }

    return style;
};
