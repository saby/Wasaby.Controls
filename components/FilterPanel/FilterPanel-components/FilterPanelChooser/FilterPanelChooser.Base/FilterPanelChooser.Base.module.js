define('js!SBIS3.CONTROLS.FilterPanelChooser.Base', [
    'js!SBIS3.CORE.CompoundControl',
    'js!SBIS3.CONTROLS.IFilterItem',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.Base'
], function(CompoundControl, IFilterItem, dotTplFn) {

    'use strict';

    /**
     * Базовый класс для редакторов, которые применяют для панели фильтра с набираемыми параметрами (см. {@link SBIS3.CONTROLS.FilterPanel}). Реализует выборку идентификаторов.
     *
     * <h2>Список платформенных редакторов</h2>
     *
     * От базового класса созданы следующие платформенные редакторы:
     * <ul>
     *     <li>{@link SBIS3.CONTROLS.FilterPanelChooser.List} - редактор в виде списка {@link SBIS3.CONTROLS.ListView};</li>
     *     <li>{@link SBIS3.CONTROLS.FilterPanelChooser.DictionaryList} - редактор в виде списка {@link SBIS3.CONTROLS.ListView} с возможность выбора записей из справочника;</li>
     *     <li>{@link SBIS3.CONTROLS.FilterPanelChooser.FavoritesList} - редактор в виде списка {@link SBIS3.CONTROLS.ListView} с возможность выбора записей из справочника и добавлением записей в избранное;</li>
     *     <li>{@link SBIS3.CONTROLS.FilterPanelChooser.FieldLink} - редактор в виде поля связи {@link SBIS3.CONTROLS.FieldLink};</li>
     *     <li>{@link SBIS3.CONTROLS.FilterPanelChooser.RadioGroup} - редактор в виде группы радиокнопок {@link SBIS3.CONTROLS.RadioGroup}.</li>
     * </ul>
     *
     * <h2>Создание пользовательского класса редактора</h2>
     *
     * При создании пользовательского редактора, вам следует наследоваться от этого класса или его наследников.
     * При этом вы обязаны учитывать, что в разметке редактора должен быть использован контрол со строго фиксированным именем.
     * Для каждого типа редактора имя обозначено в описании класса.
     *
     * @class SBIS3.CONTROLS.FilterPanelChooser.Base
     * @extends $ws.proto.CompoundControl
     * @author Сухоручкин Андрей Сергеевич
     *
     * @mixes SBIS3.CONTROLS.IFilterItem
     */

    var FilterPanelChooserBase = CompoundControl.extend([IFilterItem], /** @lends SBIS3.CONTROLS.FilterPanelChooser.Base.prototype */ {
        _dotTplFn: dotTplFn,
        $protected: {
            _options: {
                /**
                 * @cfg {String} Устанавливает шаблон компонента, с помощью которого осуществляется выбор фильтра.
                 */
                chooserTemplate: undefined,
                /**
                 * @cfg {Object} Конфигурация компонента, используемого для выборки данных
                 */
                properties: {
                },
                /**
                 * @cfg {Array.<Number>} Устанавливает набор идентификаторов элементов, которые будут выбраны для фильтра.
                 * @see setValue
                 * @see getValue
                 */
                value: []
            }
        },

        getValue: function() {
            return this._options.value;
        },

        setValue: function(value) {
            this._updateTextValue();
            this._options.value = value;
            this._notifyOnPropertyChanged('value');
        },

        _updateTextValue: function() {
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
