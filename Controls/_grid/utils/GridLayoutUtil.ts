import {detection} from "Env/Env";

const nonDynamicWidthRegExp = new RegExp('(px|%|fr)$');
const compatibleWidthRegExp = new RegExp('(px|%)$');

enum CssTemplatesEnum {
    GridIE = 'GridIE',
    GridChrome = 'GridChrome',
    Grid = 'Grid'
}

type CssRule = {
    name: string;
    value: string | number | Array<string>
};

function _isFullGridSafari(): boolean {
    return (
        detection.safari &&
        (
            detection.IOSVersion >= 12 ||
            detection.isMacOSDesktop
        )
    )
}

function isFullGridSupport(): boolean {
    return !detection.isWinXP && (!detection.isNotFullGridSupport || _isFullGridSafari());
}

function isPartialGridSupport(): boolean {
    let
        isOldIE = detection.isIE && !detection.isModernIE,
        noGridSupport = detection.isWinXP || isOldIE,
        fullGridSupport = _isFullGridSafari();

    return detection.isNotFullGridSupport && !(noGridSupport || fullGridSupport);
}

function isNoGridSupport(): boolean {
    return !isFullGridSupport() && !isPartialGridSupport();
}

function isOldIE(): boolean {
    return detection.isIE && detection.IEVersion <= 11;
}


function getCellStyles(rowIndex: number, columnIndex: number, rowSpan: number = 1, colSpan: number = 1): string {
    let rules: Array<CssRule> = [
        {
            name: 'grid-column',
            value: ((columnIndex + 1) + ' / ' + (columnIndex + 1 + colSpan))
        },
        {
            name: 'grid-row',
            value: rowIndex + 1
        }
    ];

    if (detection.isIE) {
        rules.push(
            {
                name: '-ms-grid-column',
                value: columnIndex + 1
            },
            {
                name: '-ms-grid-row',
                value: rowIndex + 1
            },
            {
                name: '-ms-grid-column-span',
                value: colSpan
            }
        );
    }
    return toCssString(rules);
}

function getMultyHeaderStyles(startColumn, endColumn, startRow, endRow, additionalColumn) {
    let gridStyles = [
        {
            name: 'grid-column',
            value: `${startColumn + additionalColumn}/${endColumn + additionalColumn}`
        },
        {
            name: 'grid-row',
            value: `${startRow}/${endRow}`
        },
    ];

    if (detection.isIE) {
        gridStyles.push(
            {
                name: '-ms-grid-column',
                value: `${startColumn + additionalColumn}`
            },
            {
                name: '-ms-grid-row',
                value: `${startRow}`
            },
            {
                name: '-ms-grid-column-span',
                value: `${endColumn - startColumn}`
            },
            {
                name: '-ms-grid-row-span',
                value: `${endRow - startRow}`
            }
        );
    }
    return toCssString(gridStyles);
}


function getTemplateColumnsStyle(columnsWidth: Array<string | number>) {
    let
        widths = columnsWidth.join(' '),
        rules = [
            {
                name: 'grid-template-columns',
                value: widths
            }
        ];

    if (detection.isIE) {
        rules.push({
            name: '-ms-grid-columns',
            value: widths
        });
    }

    return toCssString(rules);
}

function getDefaultStylesFor(...cssTemplates: CssTemplatesEnum[]): string {
    let styles = '';

    cssTemplates.forEach(function (element) {
        let templateName = CssTemplatesEnum[element];
        styles += toCssString(_cssTemplatesStyles[templateName]) + ' ';
    });

    return styles.trim();
}

function toCssString(cssRules: Array<CssRule>): string {
    let cssString = '';

    cssRules.forEach(rule => {
        if (rule.value instanceof Array) {
            rule.value.forEach(value => {
                cssString += `${rule.name}: ${value}; `
            });
        } else {
            cssString += `${rule.name}: ${rule.value}; `
        }
    });

    return cssString.trim();
}

function isCompatibleWidth(width: string|number): boolean {
    return !!`${width}`.match(compatibleWidthRegExp);
}

const _cssTemplatesStyles = {
    GridChrome: [
        {
            name: 'display',
            value: 'grid'
        }
    ],
    GridIE: [
        {
            name: 'display',
            value: '-ms-grid'
        }
    ],
    Grid: [
        {
            name: 'display',
            value: ['grid', '-ms-grid']
        }
    ]
};

export {
    CssRule,
    CssTemplatesEnum,
    nonDynamicWidthRegExp,

    isCompatibleWidth,

    isFullGridSupport,
    isPartialGridSupport,
    isNoGridSupport,
    isOldIE,

    getCellStyles,
    getTemplateColumnsStyle,
    getDefaultStylesFor,
    toCssString,
    getMultyHeaderStyles
};
