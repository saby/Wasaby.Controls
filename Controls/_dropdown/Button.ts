import Control = require('Core/Control');
import Deferred = require('Core/Deferred');
import template = require('wml!Controls/_dropdown/Button/Button');
import MenuUtils = require('Controls/_dropdown/Button/MenuUtils');
import tmplNotify = require('Controls/Utils/tmplNotify');
import ActualApi from 'Controls/_buttons/ActualApi';

/**
 * Кнопка с меню.
 *
 * <a href="/materials/demo-ws4-button-menu">Демо-пример</a>.
 *
 * @class Controls/_dropdown/Button
 * @extends Core/Control
 * @mixes Controls/_interface/ICaption
 * @mixes Controls/_interface/ITooltip
 * @mixes Controls/_interface/ISource
 * @mixes Controls/interface/IFilter
 * @mixes Controls/_interface/IHierarchy
 * @mixes Controls/_dropdown/interface/IFooterTemplate
 * @mixes Controls/_dropdown/interface/IHeaderTemplate
 * @mixes Controls/interface/INavigation
 * @mixes Controls/_dropdown/interface/IGrouped
 * @mixes Controls/interface/IDropdown
 * @mixes Controls/_interface/IIcon
 * @mixes Controls/_interface/IIconSize
 * @mixes Controls/_interface/IIconStyle
 * @mixes Controls/_interface/IFontColorStyle
 * @mixes Controls/_interface/IFontSize
 * @mixes Controls/_interface/IHeight
 * @control
 * @public
 * @author Герасимов А.М.
 * @category Button
 * @demo Controls-demo/Buttons/Menu/MenuPG
 */

/*
 * Button by clicking on which a drop-down list opens.
 *
 * <a href="/materials/demo-ws4-button-menu">Demo-example</a>.
 *
 * @class Controls/_dropdown/Button
 * @extends Core/Control
 * @mixes Controls/_interface/ICaption
 * @mixes Controls/_interface/ITooltip
 * @mixes Controls/_interface/ISource
 * @mixes Controls/interface/IFilter
 * @mixes Controls/_interface/IHierarchy
 * @mixes Controls/_dropdown/interface/IFooterTemplate
 * @mixes Controls/_dropdown/interface/IHeaderTemplate
 * @mixes Controls/interface/INavigation
 * @mixes Controls/_dropdown/interface/IGrouped
 * @mixes Controls/interface/IDropdown
 * @mixes Controls/_interface/IButton
 * @mixes Controls/_interface/IIcon
 * @mixes Controls/_interface/IIconStyle
 * @control
 * @public
 * @author Герасимов А.М.
 * @category Button
 * @demo Controls-demo/Buttons/Menu/MenuPG
 */

var Button = Control.extend({
   _template: template,
   _tmplNotify: tmplNotify,
   _filter: null,

   constructor: function () {
      Button.superclass.constructor.apply(this, arguments);
      this._dataLoadCallback = this._dataLoadCallback.bind(this);
   },

   _beforeMount: function (options) {
      this._offsetClassName = MenuUtils.cssStyleGeneration(options);
      this._updateState(options);
   },

   _beforeUpdate: function (options) {
      if (this._options.size !== options.size || this._options.icon !== options.icon ||
         this._options.viewMode !== options.viewMode) {
         this._offsetClassName = MenuUtils.cssStyleGeneration(options);
      }
      this._updateState(options);
   },

   _updateState: function (options) {
      const currentButtonClass = ActualApi.styleToViewMode(options.style);

      this._fontSizeButton = ActualApi.fontSize(options);
      this._viewModeButton = ActualApi.viewMode(currentButtonClass.viewMode, options.viewMode).viewMode;
   },

   _dataLoadCallback: function (items) {
      this._hasItems = items.getCount() > 0;

      if (this._options.dataLoadCallback) {
         this._options.dataLoadCallback(items);
      }
   },

   _onItemClickHandler: function (event, result) {
      //onMenuItemActivate will deleted by task https://online.sbis.ru/opendoc.html?guid=6175f8b3-4166-497e-aa51-1fdbcf496944
      const onMenuItemActivateResult = this._notify('onMenuItemActivate', [result[0]]);
      const menuItemActivateResult = this._notify('menuItemActivate', [result[0]]);
      let handlerResult;

      // (false || undefined) === undefined
      if (onMenuItemActivateResult !== undefined) {
         handlerResult = onMenuItemActivateResult;
      } else {
         handlerResult = menuItemActivateResult;
      }

      return handlerResult;
   }

});

Button.getDefaultOptions = function () {
   return {
      showHeader: true,
      filter: {},
      style: 'secondary',
      viewMode: 'button',
      size: 'm',
      iconStyle: 'secondary',
      transparent: true,
      lazyItemsLoad: false
   };
};

Button._theme = ['Controls/dropdown'];

export = Button;

/**
 * @event Controls/_dropdown/Button#menuItemActivate Происходит при выборе элемента из списка.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Выбранный элемент.
 * @remark Из обработчика события можно возвращать результат обработки. Если результат будет равен false, выпадающий список не закроется.
 * По умолчанию, когда выбран пункт с иерархией, выпадающий список закрывается.
 */

/*
 * @event Controls/_dropdown/Button#menuItemActivate Occurs when an item is selected from the list.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Event object.
 * @remark If the menu has items with hierarchy and item with hierarchy was selected, you can return processing result from event handler,
 * if result will equals false, dropdown will not close. By default dropdown will close, when item with hierarchy was selected.
 */