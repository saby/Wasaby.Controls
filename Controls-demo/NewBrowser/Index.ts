import {Memory} from 'Types/source';
import {Control, TemplateFunction} from 'UI/Base';
import {Browser, DetailViewMode} from 'Controls/newBrowser';
import {FlatHierarchy} from 'Controls-demo/_DemoData/Data';
import {DemoSource} from 'Controls-demo/NewBrowser/DemoSource';
// tslint:disable-next-line:ban-ts-ignore
// @ts-ignore
import * as Template from 'wml!Controls-demo/NewBrowser/Index';
import {SyntheticEvent} from 'UI/Vdom';
import {TKey} from 'Controls/_interface/IItems';

const baseSource = new DemoSource({
    keyProperty: 'id',
    parentProperty: 'parent',
    data: FlatHierarchy.getData()
});

export default class extends Control {
    protected _template: TemplateFunction = Template;

    protected _children: {
        browser: Browser
    };

    /**
     * Источник данных для колонок каталога
     */
    protected _baseSource: DemoSource = baseSource;

    /**
     * Флаг, идентифицирующий видна или нет master-колонка
     */
    protected _isMasterVisible: boolean = false;

    protected _viewMode: DetailViewMode;
    protected _userViewMode: DetailViewMode[];
    /**
     * Источник данных для выбора режима отображения списка в detail-колонке
     */
    protected _viewModeSource: Memory = new Memory({
        keyProperty: 'key',
        data: [
            {
                title: 'Список',
                icon: 'icon-ArrangeList',
                key: DetailViewMode.list
            },
            {
                title: 'Плитка',
                icon: 'icon-ArrangePreview',
                key: DetailViewMode.tile
            },
            {
                title: 'Таблица',
                icon: 'icon-Table',
                key: DetailViewMode.table
            }
        ]
    });

    /**
     * Набор колонок, отображаемый в master
     */
    protected _masterTableColumns: unknown[] = FlatHierarchy.getGridColumns(1);

    /**
     * Фильтр по которому отбираются только узлы в master-колонке
     */
    protected _masterFilter: {[key: string]: unknown} = {type: [true, false]};

    /**
     * Набор колонок, отображаемый в detail
     */
    protected _detailTableColumns: unknown[] = FlatHierarchy.getGridColumns();

    protected _root: TKey = null;

    //region life circle hooks
    protected _componentDidMount(options?: {}, contexts?: any): void {
        this._userViewMode = [this._children.browser.viewMode];
    }
    //endregion

    protected _onBrowserViewModeChanged(event: SyntheticEvent, viewMode: DetailViewMode): void {
        this._userViewMode = [viewMode];
    }

    protected _onUserViewModeChanged(event: SyntheticEvent, viewMode: DetailViewMode[]): void {
        if (this._children.browser.viewMode === viewMode[0]) {
            return;
        }

        this._viewMode = viewMode[0];
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
