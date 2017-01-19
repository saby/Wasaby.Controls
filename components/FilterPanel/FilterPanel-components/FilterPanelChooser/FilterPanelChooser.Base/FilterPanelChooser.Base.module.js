define('js!SBIS3.CONTROLS.FilterPanelChooser.Base', [
    'js!SBIS3.CORE.CompoundControl',
    'js!SBIS3.CONTROLS.IFilterItem',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.Base',
    'js!SBIS3.CONTROLS.Utils.TemplateUtil',
    'Core/IoC',
    'js!WS.Data/Collection/RecordSet'
], function(CompoundControl, IFilterItem, dotTplFn, TemplateUtil, IoC, RecordSet) {

    'use strict';

    /**
     * Базовый класс для редакторов, которые применяют для панели фильтрации (см. {@link SBIS3.CONTROLS.OperationsPanel/FilterPanelItem.typedef FilterPanelItem}). Реализует выборку идентификаторов.
     * <br/>
     * От данного класса созданы следующие платформенные редакторы:
     * <ul>
     *     <li>{@link SBIS3.CONTROLS.FilterPanelChooser.List} - редактор в виде списка {@link SBIS3.CONTROLS.ListView};</li>
     *     <li>{@link SBIS3.CONTROLS.FilterPanelChooser.DictionaryList} - редактор в виде списка {@link SBIS3.CONTROLS.ListView} с возможность выбора записей из справочника;</li>
     *     <li>{@link SBIS3.CONTROLS.FilterPanelChooser.FavoritesList} - редактор в виде списка {@link SBIS3.CONTROLS.ListView} с возможность выбора записей из справочника и добавлением записей в избранное.</li>
     * </ul>
     * <br/>
     * При создании пользовательского редактора, вам следует наследоваться от этого класса.
     * @class SBIS3.CONTROLS.FilterPanelChooser.Base
     * @extends SBIS3.CONTROLS.CompoundControl
     * @author Сухоручкин Андрей Сергеевич
     *
     * @mixes SBIS3.CONTROLS.IFilterItem
     */

    var FilterPanelChooserBase = CompoundControl.extend([IFilterItem], /** @lends SBIS3.CONTROLS.FilterPanelChooser.Base.prototype */ {
        _dotTplFn: dotTplFn,
        $protected: {
            _options: {
                _defaultTemplate: '',
                /**
                 * @cfg {String} Шаблон компонента, используемого для выборки данных.
                 */
                template: '',
                /**
                 * @cfg {Object} Конфигурация компонента, используемого для выборки данных
                 */
                properties: {
                },
                /**
                 * @cfg {WS.Data/Collection/RecordSet} Устанавливает набор элементов, из которых будет производиться выбор.
                 * @remark
                 * Обязательны для конфигурации опции {@link idProperty} и {@link displayProperty}.
                 * @see idProperty
                 * @see displayProperty
                 **/
                items: [],
                /**
                 * @cfg {Array.<Number>} Устанавливает набор идентификаторов элементов, которые будут выбраны для фильтра.
                 * @see setValue
                 * @see getValue
                 */
                value: [],
                /**
                 * @cfg {String} Устанавливает поле первичного ключа (см. {@link items}).
                 * @see displayProperty
                 */
                idProperty: 'id',
                /**
                 * @cfg {String} Устанавливает поле отображения (см. {@link items}).
                 * @see idProperty
                 */
                displayProperty: 'title',
                /**
                 * @cfg {String} Устанавливает шаблон редактора.
                 * @remark
                 * Шаблон должен быть реализован только на <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/component/xhtml/logicless-template/'>logicless-шаблонизаторе</a>
                 */
                chooserTemplate: undefined
            }
        },

        _modifyOptions: function() {
            var
               opts = FilterPanelChooserBase.superclass._modifyOptions.apply(this, arguments);
            if (opts.keyField) {
                IoC.resolve('ILogger').log('FilterPanelChooserBase', 'Опция keyField является устаревшей, используйте idProperty');
                opts.idProperty = opts.keyField;
            }
            if (opts.displayField) {
                IoC.resolve('ILogger').log('FilterPanelChooserBase', 'Опция displayField является устаревшей, используйте displayProperty');
                opts.displayProperty = opts.displayField;
            }
            if (Array.isArray(opts.items)) {
                IoC.resolve('ILogger').log('items', 'Array type option is deprecated. Use WS.Data/Collection/RecordSet.');
                opts.items = new RecordSet({
                    rawData: opts.items,
                    idProperty: opts.idProperty
                });
            }
            opts._template = opts.template ? TemplateUtil.prepareTemplate(opts.template) : opts._defaultTemplate;
            return opts;
        },

        getValue: function() {
            return this._options.value;
        },

        setValue: function(value) {
            this._updateTextValue(value);
            this._options.value = value;
            this._notifyOnPropertyChanged('value');
        },

        _updateTextValue: function(newValue) {
        },

        getTextValue: function() {
            return this._options.textValue;
        },

        setTextValue: function(textValue) {
            if (textValue !== this._options.textValue) {
                this._options.textValue = textValue;
                this._notifyOnPropertyChanged('textValue');
            }
        }

    });

    return FilterPanelChooserBase;

});
