import {detection} from "Env/Env";

export enum SupportStatusEnum {
    Full,
    Partial,
    None
}

export const GridLayoutUtil = {

    supportStatus: getSupportStatus(),

    isFullGridSupport: this.supportStatus === SupportStatusEnum.Full,
    isPartialGridSupport: this.supportStatus === SupportStatusEnum.Partial,
    isNoGridSupport: this.supportStatus === SupportStatusEnum.None,

    getCellStyles(rowIndex: number, columnIndex: number): string {
        let rules = {
            'grid-column': columnIndex + 1,
            'grid-row': rowIndex + 1
        };

        if (detection.isIE) {
            rules['-ms-grid-column'] = columnIndex + 1;
            rules['-ms-grid-row'] = rowIndex + 1;
        }
        return GridLayoutUtil.toCssString(rules);
    },

    getTemplateColumnsStyle(columnsWidth: Array<string>) {
        let
            widths = columnsWidth.join(' '),
            rules = {};

        rules['grid-template-columns'] = widths;

        if (detection.isIE) {
            rules["-ms-grid-columns"] = widths;
        }

        return GridLayoutUtil.toCssString(rules);
    },

    toCssString(cssRules: object): string {
        let cssString: string = '';
        for (let ruleName in cssRules) {
            cssString += (ruleName + ': ' + cssRules[ruleName] + '; ');
        }
        return cssString.trim();
    }
};

function getSupportStatus(): SupportStatusEnum {

    if (!detection.isNotFullGridSupport) {
        return SupportStatusEnum.Full;
    }

    if (detection.isModernIE || detection.isMacOSDesktop) {
        return SupportStatusEnum.Partial;
    }

    return SupportStatusEnum.None
}