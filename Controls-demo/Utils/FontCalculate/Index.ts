import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Utils/FontCalculate/FontCalculate');
import {Memory} from 'Types/source';

class Component extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    protected _source: Memory;
    protected _selectedKey: number[] = [0];

    private _numSymbols: number[];
    private _engStrSymbols: string[];
    private _ruStrSymbols: string[];
    private _otherSymbols: string[];
    private _sizes: string[] = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];
    private _areaInput: string;
    private _shouldUpdateValue: boolean = true;

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'id',
            data: [
                {id: 0, title: 'xs'},
                {id: 1, title: 's'},
                {id: 2, title: 'm'},
                {id: 3, title: 'l'},
                {id: 4, title: 'xl'},
                {id: 5, title: '2xl'},
                {id: 6, title: '3xl'},
                {id: 7, title: '4xl'},
                {id: 8, title: '5xl'}
            ]
        });
        this._numSymbols = this._getNumSymbols();
        this._engStrSymbols = this._getEngStrSymbols();
        this._ruStrSymbols = this._getRuStrSymbols();
        this._otherSymbols = this._getOtherSymbols();
    }
    protected _selectedKeysChangedHandler(): void {
        this._shouldUpdateValue = true;
    }

    protected _shouldUpdate(): boolean {
        return this._shouldUpdateValue;
    }

    protected _afterUpdate(): void {
        this._setWidths();
        this._shouldUpdateValue = false;
    }
    protected _afterMount(): void {
        this._setWidths();
    }

    private _setWidths(): void {
        this._areaInput = JSON.stringify({
            ...this._countEngStrWidth(),
            ...this._countNumsWidth(),
            ...this._countRuStrWidth(),
            ...this._countOtherSymbolsWidth()
        });
    }

    private _countEngStrWidth(): object {
        const obj = {};
        const engStrContainers = document.querySelectorAll('.eng');
        for (const str of engStrContainers) {
            obj[str.innerText] = str.getBoundingClientRect().width;
            str.innerText += ' |width: ' + str.getBoundingClientRect().width;
        }
        return obj;
    }

    private _countRuStrWidth(): object {
        const obj = {};
        const ruStrContainers = document.querySelectorAll('.ru');
        for (const str of ruStrContainers) {
            obj[str.innerText] = str.getBoundingClientRect().width;
            str.innerText += ' |width: ' + str.getBoundingClientRect().width;
        }
        return obj;
    }

    private _countOtherSymbolsWidth(): object {
        const obj = {};
        const otherSymboldContainers = document.querySelectorAll('.other');
        for (const sym of otherSymboldContainers) {
            obj[sym.innerText] = sym.getBoundingClientRect().width;
            sym.innerText += ' |width: ' + sym.getBoundingClientRect().width;
        }
        return obj;
    }

    private _countNumsWidth(): object {
        const obj = {};
        const numContainers = document.querySelectorAll('.numbers');
        for (const num of numContainers) {
            obj[num.innerText] = num.getBoundingClientRect().width;
            num.innerText += ' |width: ' + num.getBoundingClientRect().width;
        }
        return obj;
    }

    private _getNumSymbols = (): number[] => {
        return [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 0
        ];
    }

    private _getEngStrSymbols = (): string[] => {
        return [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
        ];
    }

    private _getRuStrSymbols = (): string[] => {
        return [
            'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о',
            'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я',
            'А', 'Б', 'В', 'г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'о',
            'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'
        ];
    }

    private _getOtherSymbols = (): string[] => {
        return [
            '&#32', '~', '`', '!', '@', '#', '#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '"', '№', ';', ':', '?', '_',
            '+', '/', '|', ']', '[', ','
        ];
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
    static _theme: string[] = ['Controls/Classes'];
}

export default Component;
