import Control = require('Core/Control');
import template = require('wml!Controls/_lookup/Button/SelectorButton');


/**
 * Кнопка-ссылка с заданным текстом, при клике на которую открывается окно выбора.
 * <a href="/materials/demo-ws4-engine-selector-button">Демо-пример</a>.
 *
 * @class Controls/_lookup/Button
 * @mixes Controls/_interface/ICaption
 * @mixes Controls/interface/ISelectedCollection
 * @mixes Controls/interface/ISelectorDialog
 * @mixes Controls/interface/IFilter
 * @mixes Controls/_interface/IMultiSelectable
 * @mixes Controls/_interface/ISource
 * @mixes Controls/_lookup/Button/SelectorButtonStyles
 * @extends Core/Control
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
 * @author Капустин И.А.
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
 * @variant primary
 * @variant success
 * @variant warning
 * @variant danger
 * @variant info
 * @variant secondary
 * @variant default
 * @default secondary
 */

/*
 * @name Controls/_lookup/Button#style
 * @cfg {Enum} Button display style.
 * @variant primary
 * @variant success
 * @variant warning
 * @variant danger
 * @variant info
 * @variant secondary
 * @variant default
 * @default secondary
 */
