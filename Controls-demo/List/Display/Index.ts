import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import * as template from 'wml!Controls-demo/List/Display/Display';

import { Memory as MemorySource } from 'Types/source';
import { Model } from 'Types/entity';

export default class DisplayList extends Control {
    protected _template: TemplateFunction = template;

    private _viewSource = new MemorySource({
        keyProperty: 'key',
        data: [
            {
                key: '1',
                title: 'test'
            },
            {
                key: '2',
                title: 'best'
            },
            {
                key: '3',
                title: 'vest'
            },
            {
                key: '4',
                title: 'guest'
            },
            {
                key: '5',
                title: 'quest'
            }
        ]
    });

    private _counterData: any[] = null;

    constructor(options) {
        super(options);

        this._counterData = [];
    }

    private _onItemClick(e: SyntheticEvent<MouseEvent>, item: Model): void {
        const title = item.get('title');
        item.set('title', `${title} clicked`);
    }

    private _updateCounters(e: SyntheticEvent<null>, counters: any): void {
        this._counterData = counters;
    }
}
