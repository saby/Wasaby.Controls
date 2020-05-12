import { Logger } from 'UI/Utils';

const deprecatedStyles = {
    error: 'danger',
    done: 'success',
    attention: 'warning',
    default: 'secondary'
};

export class Utils {
    static getStyle(style: string, controlName: string): 'secondary'|'warning'|'danger'|'success' {
        if (!style) {
            return 'secondary';
        }
        if (style in deprecatedStyles) {
            Logger.warn(controlName + ': Используются устаревшие стили. Используйте ' + deprecatedStyles[style] + ' вместо ' + style);
            return deprecatedStyles[style];
        }
        return style;
    }
}
