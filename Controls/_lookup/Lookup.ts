import Control = require('Core/Control');
import template = require('wml!Controls/_lookup/Lookup/Lookup');


/**
 * Контрол «lookup:Input» это поле ввода с автодополнением и выбором значения из справочника.
 * Может отображаться в однострочном и многострочном режиме.
 * Поддерживает одиночный и множественный выбор.
 * Здесь вы можете увидеть <a href="/materials/demo-ws4-engine-selector-lookup">демонстрационный пример</a>.
 * Если вы используете внутри подсказки поля ввода ссылку на открытие справочника - вам понадобиться {@link Controls/lookup:Link}.
 * Если вы хотите сделать динамичную подсказку поля ввода, которая будет меняться в зависимости от выбранной коллекции, используйте {@link Controls/lookup:PlaceholderChooser}.
 * Если вам нужен выбор из нескольких справочников, по одному значению из каждого, то вам подойдет {@link Controls/lookup:MultipleInput}.
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
 * The “lookup:Input” control is an input field with auto-completion and selection of a value from the directory.
 * Сan be displayed in single-line and multi-line mode.
 * Supports single and multiple selection.
 * Here you can see <a href="/materials/demo-ws4-engine-selector-lookup">demo-example</a>.
 * If you use the link to open the directory inside the tooltip of the input field, you will need {@link Controls/lookup:Link}.
 * If you want to make a dynamic placeholder of the input field, which will vary depending on the selected collection, use {@link Controls/lookup:PlaceholderChooser}.
 * If you need a choice of several directories, one value from each, then {@link Controls / lookup: MultipleInput} is suitable for you.
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
 * @remark
 * Дефолтное значение: false
 * Многострочный режим работает по автовысоте в зависимости от выбранных записей, количество отоброжаемых записей задается опцией "maxVisibleItems", остальные скрываются за счетчиком.
 * Актуально только при multiSelect: true.
 *
 * @example
 * WML:
 * <pre>
 *    <Controls.lookup:Input
 *       source="{{_source}}"
 *       keyProperty="id"
 *       searchParam="title"
 *       multiSelect="{{true}}"
 *       multiLine="{{true}}">
 *    </Controls.lookup:Input>
 * </pre>
 *
 * @see Controls/interface/ISelectedCollection#maxVisibleItems
 * @see Controls/interface/ISelectedCollection#multiSelect
 */
/*
 * @name Controls/_lookup/Lookup#multiLine
 * @cfg {Boolean} Determines then Lookup can be displayed in multi line mode.
 * @remark
 * Default: false
 * The multi-line mode works at auto-height depending on the selected records, the number of displayed records is set by the "maxVisibleItems" option, the rest are hidden behind the counter.
 * Only relevant with multiSelect: true.
 *
 * @example
 * WML:
 * <pre>
 *    <Controls.lookup:Input
 *       source="{{_source}}"
 *       keyProperty="id"
 *       searchParam="title"
 *       multiSelect="{{true}}"
 *       multiLine="{{true}}">
 *    </Controls.lookup:Input>
 * </pre>
 *
 * @see Controls/interface/ISelectedCollection#maxVisibleItems
 * @see Controls/interface/ISelectedCollection#multiSelect
 */

/**
 * @name Controls/_lookup/Lookup#comment
 * @cfg {String} Текст, который отображается в пустом поле комментария.
 * @remark
 * Актуально только в режиме единичного выбора.
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

