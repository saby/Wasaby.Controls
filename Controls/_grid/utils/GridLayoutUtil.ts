import {detection} from "Env/Env";

enum CssTemplatesEnum {
    GridIE = 'GridIE',
    GridChrome = 'GridChrome',
    Grid = 'Grid'
}

type CssRule = {
    name: string;
    value: string | number | Array<string>
};

function isFullGridSupport(): boolean {
    return !detection.isNotFullGridSupport;
}

function isPartialGridSupport(): boolean {
    return detection.isModernIE || detection.isMacOSDesktop;
}

function isNoGridSupport(): boolean {
    return !isFullGridSupport() && !isPartialGridSupport();
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


const takeWhile = (f, xs) => xs.length ? takeWhileNotEmpty(f, xs) : [];
const takeWhileNotEmpty = (f, [x, ...xs]) =>  f(x) ? [x, ...takeWhile(f, xs)] : [];

function _sortedColumns(arr) {
    return arr.map((cur) => {
        const sort = cur.sort((a, b) => {
            if (a.startColumn > b.startColumn) {
                return 1;
            }
            if (a.startColumn < b.startColumn) {
                return -1;
            }
            return 0;
        })
        return sort;
    });
};

function getRowsArray(arr, multiSelectVisibility) {
    let result = [];
    if (!arr[0].startRow) {
        result.push(arr);
    } else {
        let sortedArray = arr.sort((a, b) => {
            if (a.startRow > b.startRow) {
                return 1;
            }
            if (a.startRow < b.startRow) {
                return -1;
            }
            return 0;
        })
        for (let i = 1, rows = _getRowsCount(sortedArray); i <= rows; i++) {
            const odd = (x) => x.startRow === i;
            const row = takeWhile(odd, sortedArray);
            result.push(row);
            sortedArray = sortedArray.slice(row.length);
        }
        result = _sortedColumns(result);
    }
    if (multiSelectVisibility) {
        result[0] = [{}, ...result[0]];
    }
    return result;
}

function _getRowsCount(arr): number {
    let maxEndRow = 0;
    arr.forEach((cur) => {
        if (cur.endRow > maxEndRow) {
            maxEndRow = cur.endRow;
        }
    })
    return maxEndRow - 1;
}

function getMaxEndRow(arr): number {
    let max = 0;
    if (arr.length === 1) {
        return 2;
    };
    arr.forEach((cur) => {
        cur.forEach((c) => {
            if (c.endRow > max) {
                max = c.endRow;
            }
        });
    });
    return max;
}

export {
    CssRule,
    CssTemplatesEnum,

    isFullGridSupport,
    isPartialGridSupport,
    isNoGridSupport,

    getCellStyles,
    getTemplateColumnsStyle,
    getDefaultStylesFor,
    toCssString,

    getRowsArray,
    getMaxEndRow
};
