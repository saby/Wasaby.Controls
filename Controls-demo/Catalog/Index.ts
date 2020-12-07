import {Memory} from 'Types/source';
import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/Catalog/Index';
import {CatalogDetailViewMode} from 'Controls/catalog';

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

    /**
     * Источник данных для колонок каталога
     */
    protected _baseSource: Memory = baseSource;

    /**
     * Источник данных для выбора режима отображения списка в detail-колонке
     */
    protected _viewModeSource: Memory = new Memory({
        keyProperty: 'key',
        data: [
            {
                title: 'Список',
                icon: 'icon-ArrangeList',
                key: CatalogDetailViewMode.list
            },
            {
                title: 'Плитка',
                icon: 'icon-ArrangePreview',
                key: CatalogDetailViewMode.tile
            },
            {
                title: 'Таблица',
                icon: 'icon-Table',
                key: CatalogDetailViewMode.table
            }
        ]
    });

    /**
     * Текущий режим отображения контента в master-колонке
     */
    protected _viewMode: CatalogDetailViewMode[] = [CatalogDetailViewMode.list];

    /**
     * Флаг, идентифицирующий видна или нет master-колонка
     */
    protected _isMasterVisible: boolean = true;

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
