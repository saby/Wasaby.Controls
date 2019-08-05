import Control = require('Core/Control');
import template = require('wml!Controls/_lookup/Button/SelectorButton');


/**
 * Кнопка-ссылка с заданным текстом, при клике на которую открывается окно выбора.
 * Здесь вы можете увидеть <a href="/materials/demo-ws4-engine-selector-button">демонстрационный пример</a>.
 *
 * @class Controls/_lookup/Button
 * @extends Core/Control
 * @mixes Controls/_interface/ILookup
 * @mixes Controls/_interface/ICaption
 * @mixes Controls/interface/ISelectedCollection
 * @mixes Controls/interface/ISelectorDialog
 * @mixes Controls/interface/IFilter
 * @mixes Controls/_interface/IMultiSelectable
 * @mixes Controls/_interface/ISource
 * @mixes Controls/_lookup/Button/SelectorButtonStyles
 * @control
 * @public
 * @author Капустин И.А.
 * @demo Controls-demo/Buttons/SelectorButtonPG
 */
/*
 * Button link with the specified text, on clicking on which a selection window opens.
 * Here you can see <a href="/materials/demo-ws4-engine-selector-button">demo-example</a>.
 *
 * @class Controls/_lookup/Button
 * @extends Core/Control
 * @mixes Controls/_interface/ICaption
 * @mixes Controls/interface/ISelectedCollection
 * @mixes Controls/interface/ISelectorDialog
 * @mixes Controls/interface/IFilter
 * @mixes Controls/_interface/IMultiSelectable
 * @mixes Controls/_interface/ISource
 * @mixes Controls/_lookup/Button/SelectorButtonStyles
 * @control
 * @public
 * @author Kapustin I.A.
 * @demo Controls-demo/Buttons/SelectorButtonPG
 */

var Button = Control.extend({
   _template: template,

   showSelector: function (popupOptions) {
      return this._children.controller.showSelector(popupOptions);
   }
});

export = Button;

/**
 * @name Controls/_lookup/Button#style
 * @cfg {Enum} Стиль отображения кнопки.
 * @remark
 * {@link Controls/_interface/IButton#style Возможные значения.}
 */
/*
 * @name Controls/_lookup/Button#style
 * @cfg {Enum} Button display style.
 * @remark
 * {@link Controls/_interface/IButton#style Possible Values.}
 */
