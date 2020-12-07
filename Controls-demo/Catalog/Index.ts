import {Memory} from 'Types/source';
import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/Catalog/Index';

const baseSource = new Memory({
    data: [
        {id: 1, title: 'Sun', kind: 'Star'},
        {id: 2, title: 'Mercury', kind: 'Planet'},
        {id: 3, title: 'Venus', kind: 'Planet'},
        {id: 4, title: 'Earth', kind: 'Planet'},
        {id: 5, title: 'Mars', kind: 'Planet'},
        {id: 6, title: 'Jupiter', kind: 'Planet'},
        {id: 7, title: 'Saturn', kind: 'Planet'},
        {id: 8, title: 'Uranus', kind: 'Planet'},
        {id: 9, title: 'Neptune', kind: 'Planet'},
        {id: 10, title: 'Pluto', kind: 'Dwarf planet'}
    ],
    keyProperty: 'id'
});

export default class extends Control {
    protected _template: TemplateFunction = Template;

    protected _baseSource: Memory = baseSource;

    /**
     * Флаг, идентифицирующий сколько колонок отображать в каталоге (одну или две)
     */
    protected _twoColumns: boolean = true;

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
