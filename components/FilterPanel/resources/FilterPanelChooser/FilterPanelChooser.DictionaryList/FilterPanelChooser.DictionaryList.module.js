define('js!SBIS3.CONTROLS.FilterPanelChooser.DictionaryList', [
    'js!SBIS3.CONTROLS.FilterPanelChooser.List',
    'Core/CommandDispatcher',
    'Core/core-functions',
    'Core/helpers/collection-helpers',
    'Core/core-instance',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.DictionaryList/resources/FilterPanelChooserDictionaryFooter',
    'js!SBIS3.CONTROLS.Action.SelectorAction'
], function(FilterPanelChooserList, CommandDispatcher, cFunctions, colHelpers, cInstance, footerTpl, SelectorAction) {

    'use strict';

    /**
     * Класс редактора "Список со справочником".
     * Применяется для панели фильтрации (см. {@link SBIS3.CONTROLS.OperationsPanel/FilterPanelItem.typedef FilterPanelItem}).
     * <br/>
     * Реализует выборку идентификаторов как из списка {@link SBIS3.CONTROLS.ListView}, так и из справочника (см. {@link dictionaryOptions}), вызов которого производится по кнопке "Все" под списком или командой {@link showDictionary}.
     * По умолчанию отображается 3 записи в списке. Чтобы подгрузить все, используйте кнопку "Ещё" под списком или команду {@link showFullList}.
     * <br/>
     * Чтобы изменить шаблон отображения кнопок "Все" и "Ещё", измените опцию {@link afterChooserWrapper}.
     * Если вы используете шаблон по умолчанию, то подпись кнопки "Все" можно изменить через опцию {@link captionFullList}.
     * @class SBIS3.CONTROLS.FilterPanelChooser.DictionaryList
     * @extends SBIS3.CONTROLS.FilterPanelChooser.List
     * @author Сухоручкин Андрей Сергеевич
     *
     * @demo SBIS3.CONTROLS.Demo.MyFilterView
     */

    var FilterPanelChooserDictionary = FilterPanelChooserList.extend(/** @lends SBIS3.CONTROLS.FilterPanelChooser.DictionaryList.prototype */ {
        $protected: {
            _options: {
                afterChooserWrapper: footerTpl,
                className: 'controls-FilterPanelChooser__dictionary',
                /**
                 * @typedef {Object} dictionaryOptions
                 * @property {String} template Компонент, на основе которого производится построение справочника.
                 * @property {String} selectionType Режим выбора записей. О типах записей вы можете прочитать в разделе <a href='https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy'>Иерархия</a>. Возможные значения:
                 * <ul>
                 *     <li>node - выбираются только записи типа "Узел" и "Скрытый узел".</li>
                 *     <li>leaf - выбираются только записи типа "Лист".</li>
                 *     <li>all - выбираются все типы записей.</li>
                 * </ul>
                 * @property {Object} componentOptions
                 * Группа опций, которые передаются в секцию <b>_options</b> компонента из опции template (см. {@link SBIS3.CONTROLS.OperationsPanel/FilterPanelItem.typedef FilterPanelItem}). На его основе строится справочник.
                 * Значения переданных опций можно использовать в дочерних компонентах справочника через инструкции шаблонизатора.
                 */
                /**
                 * @cfg {dictionaryOptions} Устанавливает конфигурацию справочника.
                 * @remark
                 * Открытие справочника происходит при клике по кнопке под списком или командой {@link showDictionary}.
                 */
                dictionaryOptions: {}
            },
            _selectorAction: undefined,
            _afterSelection: false
        },

        $constructor: function() {
            CommandDispatcher.declareCommand(this, 'showDictionary', this._showDictionary.bind(this))
        },

        init: function() {
            FilterPanelChooserDictionary.superclass.init.apply(this, arguments);
            this._getListView().subscribe('onSelectedItemsChange', this._selectedItemsChangeHandler.bind(this));
        },
        /**
         * Инициирует открытие справочника.
         * @param {Object} meta Мета-данные.
         * @command showDictionary
         */
        _showDictionary: function(meta) {
            meta = cFunctions.merge(cFunctions.clone(this._options.dictionaryOptions), meta || {});
            meta.multiselect = true;
            meta.selectedItems = this._getListView().getSelectedItems();
            this._getSelectorAction().execute(meta);
        },

        _selectedItemsChangeHandler: function(event, idArray, changed) {
            var
                item,
                items = this._getListView().getItems();
            if (this._afterSelection) {
                colHelpers.forEach(changed.removed, function(id) {
                    item = items.getRecordById(id);
                    if (item) {
                        items.remove(item);
                    }
                }, this);
            }
        },

        _toggleFullState: function(toggle) {
            FilterPanelChooserDictionary.superclass._toggleFullState.apply(this, arguments);
            this._getAllButton().setCaption('Ещё' + ' ' + (this._options.items.getCount() - 3));
        },

        _onExecutedHandler: function(event, meta, result) {
            var
                listView = this._getListView(),
                items = listView.getItems();
            if (cInstance.instanceOfModule(result, 'WS.Data/Collection/List')) {
                items.clear();
                items.assign(result);
                listView.setSelectedItemsAll();
                this._updateValue();
                this._toggleFullState(false);
                this._afterSelection = true;
            }
        },

        _getSelectorAction: function() {
            if (!this._selectorAction) {
                this._selectorAction = new SelectorAction({
                    mode: 'floatArea',
                    handlers: {
                        onExecuted: this._onExecutedHandler.bind(this)
                    }
                });
            }
            return this._selectorAction;
        }
    });

    return FilterPanelChooserDictionary;

});
