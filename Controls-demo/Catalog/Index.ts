import {Memory} from 'Types/source';
import {Control, TemplateFunction} from 'UI/Base';
import {CatalogDetailViewMode} from 'Controls/catalog';
import {Gadgets} from 'Controls-demo/treeGrid/DemoHelpers/DataCatalog';
import * as Template from 'wml!Controls-demo/Catalog/Index';

const baseSource = new Memory({
    keyProperty: 'id',
    data: Gadgets.getFlatData()
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

    /**
     * Набор колонок, отображаемый в master
     */
    protected _masterTableColumns: unknown[] = [Gadgets.getGridColumnsForFlat()[0]];

    /**
     * Фильтр по которому отбираются только узлы в master-колонке
     */
    protected _masterFilter: {[key: string]: unknown} = {type: [true, false]};

    /**
     * Набор колонок, отображаемый в detail
     */
    protected _detailTableColumns: unknown[] = Gadgets.getGridColumnsForFlat();

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
