import {detection} from 'Env/Env';

const FULL_GRID_IOS_VERSION = 12;
const OLD_IE_LAST_VERSION = 11;
const DEFAULT_GRID_COLUMN_WIDTH = '1fr';
const DEFAULT_TABLE_COLUMN_WIDTH = 'auto';

const RegExps = {
    pxValue: new RegExp('^[0-9]+px$'),
    percentValue: new RegExp('^[0-9]+%$')
};

interface ICssRule {
    name: string;
    value: string | number;
    applyIf?: boolean;
}

interface IColumnOptions {
    columnStart: number;
    columnSpan?: number;
    columnEnd?: number;
}

interface IRowOptions {
    rowStart: number;
    rowSpan?: number;
    rowEnd?: number;
}

function _isFullGridSafari(): boolean {
    return (
        detection.safari &&
        (
            detection.IOSVersion >= FULL_GRID_IOS_VERSION ||
            detection.isMacOSDesktop
        )
    );
}

function isFullGridSupport(): boolean {
    return (!detection.isWinXP || detection.yandex) && (!detection.isNotFullGridSupport || _isFullGridSafari());
}

function isPartialGridSupport(): boolean {
    const isOldIEBrowser = detection.isIE && !detection.isModernIE;
    const noGridSupport = (detection.isWinXP && !detection.yandex) || isOldIEBrowser;
    const fullGridSupport = _isFullGridSafari();

    return detection.isNotFullGridSupport && !(noGridSupport || fullGridSupport);
}

function isNoGridSupport(): boolean {
    return !isFullGridSupport() && !isPartialGridSupport();
}

function isOldIE(): boolean {
    return detection.isIE && detection.IEVersion <= OLD_IE_LAST_VERSION;
}

function isCompatibleWidth(width: string | number): boolean {
    return !!width && !!(`${width}`.match(RegExps.percentValue) || `${width}`.match(RegExps.pxValue));
}

function getDefaultColumnWidth(): string {
    return isFullGridSupport() ? DEFAULT_GRID_COLUMN_WIDTH : DEFAULT_TABLE_COLUMN_WIDTH;
}

function getColumnStyles(cfg: IColumnOptions): string {
    const columnStart = cfg.columnStart + 1;
    const columnSpan = typeof cfg.columnEnd !== 'undefined' ? (cfg.columnEnd - cfg.columnStart) : (cfg.columnSpan || 1);
    const columnEnd = (cfg.columnEnd || (cfg.columnStart + columnSpan)) + 1;

    return toCssString([
        {name: 'grid-column-start', value: columnStart},
        {name: 'grid-column-end', value: columnEnd},
        {name: '-ms-grid-column', value: columnStart, applyIf: detection.isIE},
        {name: '-ms-grid-column-span', value: columnSpan, applyIf: detection.isIE}
    ]);
}

function getRowStyles(cfg: IRowOptions): string {
    const rowStart = cfg.rowStart + 1;
    const rowSpan = typeof cfg.rowEnd !== 'undefined' ? (cfg.rowEnd - cfg.rowStart) : (cfg.rowSpan || 1);
    const rowEnd = (cfg.rowEnd || (cfg.rowStart + rowSpan)) + 1;

    return toCssString([
        {name: 'grid-row-start', value: rowStart},
        {name: 'grid-row-end', value: rowEnd},
        {name: '-ms-grid-row', value: rowStart, applyIf: detection.isIE},
        {name: '-ms-grid-row-span', value: rowSpan, applyIf: detection.isIE}
    ]);
}

function getCellStyles(cfg: IColumnOptions & IRowOptions): string {
    return getColumnStyles(cfg) + ' ' + getRowStyles(cfg);
}

function getMultiHeaderStyles(columnStart: number, columnEnd: number, rowStart: number, rowEnd: number, additionalColumn: number): string {
    return getCellStyles({
        columnStart: columnStart + additionalColumn - 1,
        columnEnd: columnEnd + additionalColumn - 1,
        rowStart: rowStart - 1,
        rowEnd: rowEnd - 1
    });
}

function getTemplateColumnsStyle(columnsWidth: Array<string | number>): string {
    const widths = columnsWidth.join(' ');
    return toCssString([
        {name: 'grid-template-columns', value: widths},
        {name: '-ms-grid-columns', value: widths, applyIf: detection.isIE}
    ]);
}

function getGridLayoutStyles(): string {
    return toCssString([
        {name: 'display', value: 'grid'},
        {name: 'display', value: '-ms-grid', applyIf: detection.isIE}
    ]);
}

function toCssString(cssRules: ICssRule[]): string {
    let cssString = '';

    cssRules.forEach((rule) => {
        // Применяем правило если нет условия или оно задано и выполняется
        cssString += (!rule.hasOwnProperty('applyIf') || !!rule.applyIf) ? `${rule.name}: ${rule.value}; ` : '';
    });

    return cssString.trim();
}

export {
    isCompatibleWidth,
    getDefaultColumnWidth,
    RegExps,

    isFullGridSupport,
    isPartialGridSupport,
    isNoGridSupport,
    isOldIE,

    getColumnStyles,
    getRowStyles,
    getCellStyles,
    getTemplateColumnsStyle,
    getGridLayoutStyles,
    toCssString,
    getMultiHeaderStyles
};
