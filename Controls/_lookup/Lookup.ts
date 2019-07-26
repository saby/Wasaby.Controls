import Control = require('Core/Control');
import template = require('wml!Controls/_lookup/Lookup/Lookup');


/**
 * Контрол «Lookup» позволяет выбрать значение из справочника или предложить список возможных значений в автодополнении.
 * Может отображаться в однострочном и многострочном режиме.
 * Поддерживает одиночный и множественный выбор.
 * Здесь вы можете увидеть <a href="/materials/demo-ws4-engine-selector-lookup">демонстрационный пример</a>.
 * Смотрите так же {@link Controls/lookup:Link метка для Lookup} и {@link Controls/lookup:PlaceholderChooser}.
 *
 * @class Controls/_lookup/Lookup
 * @extends Core/Control
 * @mixes Controls/_interface/ILookup
 * @mixes Controls/interface/ISelectedCollection
 * @mixes Controls/interface/ISelectorDialog
 * @mixes Controls/interface/ISuggest
 * @mixes Controls/interface/ISearch
 * @mixes Controls/_interface/ISource
 * @mixes Controls/interface/IFilter
 * @mixes Controls/interface/INavigation
 * @mixes Controls/_interface/IMultiSelectable
 * @mixes Controls/_interface/ISorting
 * @mixes Controls/interface/IInputBase
 * @mixes Controls/interface/IInputText
 * @mixes Controls/_lookup/BaseLookupView/LookupStyles
 * @control
 * @public
 * @author Капустин И.А.
 * @demo Controls-demo/Input/Lookup/LookupPropertyGrid
 */
/*
 * The Lookup control allows you to select a value from a dialog or suggest containing a list of possible values.
 * Сan be displayed in single-line and multi-line mode.
 * Supports single and multiple selection.
 * Here you can see <a href="/materials/demo-ws4-engine-selector-lookup">demo-example</a>.
 * See also {@link Controls/lookup:Link label for Lookup} and {@link Controls/lookup:PlaceholderChooser}.
 *
 * @class Controls/_lookup/Lookup
 * @extends Core/Control
 * @mixes Controls/_interface/ILookup
 * @mixes Controls/interface/ISelectedCollection
 * @mixes Controls/interface/ISelectorDialog
 * @mixes Controls/interface/ISuggest
 * @mixes Controls/interface/ISearch
 * @mixes Controls/_interface/ISource
 * @mixes Controls/interface/IFilter
 * @mixes Controls/interface/INavigation
 * @mixes Controls/_interface/IMultiSelectable
 * @mixes Controls/_interface/ISorting
 * @mixes Controls/interface/IInputBase
 * @mixes Controls/interface/IInputText
 * @mixes Controls/_lookup/BaseLookupView/LookupStyles
 * @control
 * @public
 * @author Капустин И.А.
 * @demo Controls-demo/Input/Lookup/LookupPropertyGrid
 */

/**
 * @name Controls/_lookup/Lookup#multiLine
 * @cfg {Boolean} Определяет, отображать ли Lookup в многострочном режиме.
 */
/*
 * @name Controls/_lookup/Lookup#multiLine
 * @cfg {Boolean} Determines then Lookup can be displayed in multi line mode.
 */

/**
 * @name Controls/_lookup/Lookup#comment
 * @cfg {String} Текст, который отображается в пустом поле комментария.
 * @remark
 * Актуально только в режиме еденичного выбора.
 * Если значение не задано, то поле с комментарием отображено не будет.
 */
/*
 * @name Controls/_lookup/Lookup#comment
 * @cfg {String} The text that is displayed in the empty comment box.
 * @remark
 * Actual only in the mode of single choice.
 * If the value is not specified, the comment field will not be displayed.
 */

var Lookup = Control.extend({
   _template: template,

   showSelector: function (popupOptions) {
      return this._children.controller.showSelector(popupOptions);
   }
});

export = Lookup;

