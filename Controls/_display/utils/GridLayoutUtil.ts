import { detection } from 'Env/Env';
import isFullGridSupport from './GridSupportUtil';

const DEFAULT_GRID_COLUMN_WIDTH = '1fr';
const DEFAULT_TABLE_COLUMN_WIDTH = 'auto';

interface ICssRule {
    name: string;
    value: string | number;
    applyIf?: boolean;
}

function toCssString(cssRules: ICssRule[]): string {
    let cssString = '';

    cssRules.forEach((rule) => {
        // Применяем правило если нет условия или оно задано и выполняется
        cssString += (!rule.hasOwnProperty('applyIf') || !!rule.applyIf) ? `${rule.name}: ${rule.value}; ` : '';
    });

    return cssString.trim();
}

function getTemplateColumnsStyle(columnsWidth: Array<string | number>): string {
    const widths = columnsWidth.join(' ');
    return toCssString([
        {name: 'grid-template-columns', value: widths},
        {name: '-ms-grid-columns', value: widths, applyIf: detection.isIE}
    ]);
}

function getDefaultColumnWidth(): string {
    return isFullGridSupport() ? DEFAULT_GRID_COLUMN_WIDTH : DEFAULT_TABLE_COLUMN_WIDTH;
}

export default {
    toCssString,
    getDefaultColumnWidth,
    getTemplateColumnsStyle
};
