import {View as List} from 'Controls/list';
import { TemplateFunction } from 'UI/Base';
import TileView = require('./TileView');

/**
 * Список элементов, отображаемых в виде плиток. Может загружать данные из источника данных.
 * @remark
 * Полезные ссылки:
 * * {@link /materials/Controls-demo/app/Controls-demo%2FExplorer%2FDemo демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tile/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_tile.less переменные тем оформления tile}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_list.less переменные тем оформления}
 *
 *
 * @class Controls/_tile/View
 * @extends Controls/list:View
 * @mixes Controls/_interface/ISource
 * @mixes Controls/interface/IItemTemplate
 * @mixes Controls/interface/IPromisedSelectable
 * @mixes Controls/interface/IContentTemplate
 * @mixes Controls/interface/IGroupedList
 * @mixes Controls/_interface/INavigation
 * @mixes Controls/_interface/IFilterChanged
 * @mixes Controls/_list/interface/IList
 * @mixes Controls/_itemActions/interface/IItemActionsOptions
 * @mixes Controls/_interface/IHierarchy
 * @implements Controls/_tree/interface/ITreeControl
 * @mixes Controls/_interface/IDraggable
 * @mixes Controls/_tile/interface/ITile
 * @mixes Controls/_list/interface/IClickableView
 * @mixes Controls/_marker/interface/IMarkerList
 *
 * @mixes Controls/_list/interface/IVirtualScrollConfig
 *
 *
 * @author Авраменко А.С.
 * @public
 */

/*
 * List in which items are displayed as tiles. Can load data from data source.
 * <a href="/materials/Controls-demo/app/Controls-demo%2FExplorer%2FDemo">Demo examples</a>.
 * The detailed description and instructions on how to configure the control you can read <a href='/doc/platform/developmentapl/interface-development/controls/list/tile/'>here</a>.
 *
 * @class Controls/_tile/View
 * @extends Controls/list:View
 * @mixes Controls/_interface/ISource
 * @mixes Controls/interface/IItemTemplate
 * @mixes Controls/interface/IPromisedSelectable
 * @mixes Controls/interface/IGroupedList
 * @mixes Controls/_interface/INavigation
 * @mixes Controls/_interface/IFilterChanged
 * @mixes Controls/_list/interface/IList
 * @mixes Controls/_itemActions/interface/IItemActionsOptions
 * @mixes Controls/_interface/ISorting
 * @mixes Controls/_interface/IHierarchy
 * @implements Controls/_tree/interface/ITreeControl
 * @mixes Controls/_interface/IDraggable
 * @mixes Controls/List/interface/ITile
 * @mixes Controls/_list/interface/IClickableView
 * @mixes Controls/_marker/interface/IMarkerList
 *
 * @mixes Controls/_list/interface/IVirtualScrollConfig
 *
 *
 * @author Авраменко А.С.
 * @public
 */

export default class View extends List {
    protected _viewName: TemplateFunction = TileView;
    protected _supportNewModel: boolean = true;

    protected _beforeMount(): void {
        this._viewModelConstructor = this._getModelConstructor();
    }

    private _shouldOpenExtendedMenu(isActionMenu: boolean, isContextMenu: boolean, item): boolean {
        const isScalingTile = this._options.tileScalingMode !== 'none' &&
            this._options.tileScalingMode !== 'overlap' &&
            !item.isNode();
        return this._options.actionMenuViewMode === 'preview' && !isActionMenu && !(isScalingTile && isContextMenu);
    }

    protected _getModelConstructor(): string {
        return 'Controls/tileNew:TileCollection';
    }

    static getDefaultOptions(): object {
        return {
            actionAlignment: 'vertical',
            actionCaptionPosition: 'none'
        };
    }
}

Object.defineProperty(View, 'defaultProps', {
   enumerable: true,
   configurable: true,

   get(): object {
      return View.getDefaultOptions();
   }
});
