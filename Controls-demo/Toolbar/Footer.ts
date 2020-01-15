import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Toolbar/footer');
import entity = require('Types/entity');
import source = require('Types/source');

import 'css!Controls-demo/Controls-demo';

class FooterTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    static _theme: string[] = ['Controls/Classes'];
    private items = null;
    private _sourceVertical = null;
    private _keyProperty = 'key';
    private _parentProperty = 'parent';
    private _nodeProperty = 'node';
    private _selectedKeysVertical = null;

    protected _beforeMount(): void {
        this._selectedKeysVertical = [1];
        this.items = [{
            id: 1,
            title: 'Логистика',
        },
            {
                id: 2,
                title: 'Клиенты'
            },
            {
                id: 3,
                title: 'Товары'
            },
            {
                id: 4,
                title: 'Поставщики'
            }].map((item) => {
            return new entity.Model({
                rawData: item,
                keyProperty: 'id'
            });
        });

        this._sourceVertical = new source.Memory({
            keyProperty: 'key',
            data: [
                {
                    key: 1,
                    title: 'VIP'
                },
                {
                    key: 2,
                    title: 'Премиум'
                }
            ]
        });
    }
}

export default FooterTemplate;
