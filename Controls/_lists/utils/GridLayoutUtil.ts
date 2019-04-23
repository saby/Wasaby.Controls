import {detection} from "Env/Env";

enum SupportStatusesEnum {
    Full,
    Partial,
    None
}

enum CssTemplatesEnum {
    GridIE = 'GridIE',
    GridChrome = 'GridChrome',
    Grid = 'Grid',
}

type CssRule = {
    name: string;
    value: string | number | Array<string>
}

const supportStatus = _getSupportStatus();
const isFullSupport = supportStatus === SupportStatusesEnum.Full;
const isPartialSupport = supportStatus === SupportStatusesEnum.Partial;
const isNoSupport = supportStatus === SupportStatusesEnum.None;


function getCellStyles(rowIndex: number, columnIndex: number, rowSpan?: number, colSpan?: number): string {
    let rules: Array<CssRule> = [
        {
            name: 'grid-column',
            value: columnIndex + 1
        },
        {
            name: 'grid-column-start',
            value: columnIndex + 1
        },
        {
            name: 'grid-row',
            value: rowIndex + 1
        }
    ];

    if (colSpan) {
        rules.push({
            name: 'grid-column-end',
            value: colSpan + columnIndex + 1
        })
    }

    if (detection.isIE) {
        rules.push(
            {
                name: '-ms-grid-column',
                value: columnIndex + 1
            },
            {
                name: '-ms-grid-row',
                value: rowIndex + 1
            }
        );
        if (colSpan) {
            rules.push({
                name: '-ms-grid-column-span',
                value: colSpan
            })
        }
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
            value: widths,
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

function _getSupportStatus(): SupportStatusesEnum {
    if (!detection.isNotFullGridSupport) {
        return SupportStatusesEnum.Full;
    }
    if (detection.isModernIE || detection.isMacOSDesktop) {
        return SupportStatusesEnum.Partial;
    }
    return SupportStatusesEnum.None
}

export {
    SupportStatusesEnum,
    CssRule,
    CssTemplatesEnum,

    supportStatus,
    isFullSupport,
    isPartialSupport,
    isNoSupport,

    getCellStyles,
    getTemplateColumnsStyle,
    getDefaultStylesFor,
    toCssString
}

