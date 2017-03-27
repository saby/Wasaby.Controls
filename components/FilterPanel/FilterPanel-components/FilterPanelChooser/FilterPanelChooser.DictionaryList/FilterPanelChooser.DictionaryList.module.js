define('js!SBIS3.CONTROLS.FilterPanelChooser.DictionaryList', [
    'js!SBIS3.CONTROLS.FilterPanelChooser.List',
    'Core/CommandDispatcher',
    'Core/core-functions',
    'Core/helpers/collection-helpers',
    'Core/core-instance',
    'js!WS.Data/Collection/RecordSet',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.DictionaryList/resources/FilterPanelChooserDictionaryFooter',
    'js!SBIS3.CONTROLS.Action.SelectorAction',
    'css!SBIS3.CONTROLS.FilterPanelChooser.DictionaryList'
], function(FilterPanelChooserList, CommandDispatcher, cFunctions, colHelpers, cInstance, RecordSet, footerTpl, SelectorAction) {

    'use strict';

    /**
     * Класс редактора "Список со справочником".
     * Применяется для панели фильтра с набираемыми параметрами (см. {@link SBIS3.CONTROLS.FilterPanel}).
     * Реализует выборку идентификаторов как из списка {@link SBIS3.CONTROLS.ListView}, так и из справочника (см. {@link dictionaryOptions}), вызов которого производится по кнопке "Ещё" под списком или командой {@link showDictionary}.
     *
     * <h2>Особенности отображения редактора</h2>
     * По умолчанию отображается 3 записи в списке.
     * Чтобы подгрузить все, используйте кнопку "Все" под списком или команду {@link showFullList}.
     * Чтобы открыть справочник и произвести выбор записей, используйте кнопку "Ещё" или команду {@link showDictionary}.
     *
     * <h2>Конфигурация редактора</h2>
     * Чтобы изменить конфигурацию редактора, используют подопцию *properties* (см. {@link SBIS3.CONTROLS.FilterPanel/FilterPanelItem.typedef}) в {@link SBIS3.CONTROLS.FilterPanel#items}.
     * По умолчанию для списка вы можете переопределить следующие опции: {@link SBIS3.CONTROLS.ItemsControlMixin#idProperty}, {@link SBIS3.CONTROLS.ItemsControlMixin#displayProperty}, {@link SBIS3.CONTROLS.ItemsControlMixin#items} и {@link SBIS3.CONTROLS.MultiSelectable#selectedKeys}.
     * Опции, для которых конфигурация фиксирована: {@link SBIS3.CONTROLS.ListView#multiselect}=true, {@link SBIS3.CONTROLS.ListView#itemsDragNDrop}=false и {@link  SBIS3.CONTROLS.ListView#itemsActions}=&#91;&#93;.
     *
     * <h2>Кнопка "Все"</h2>
     * Отображается под списком, когда записей списка больше 3.
     * Применяется, чтобы подгрузить все записи списка.
     * При клике по кнопке выполняется команда {@link showFullList}.
     * По умолчанию для кнопки установлено имя "controls-FilterPanelChooser__allButton".
     * Шаблон кнопки "Все" устанавливают в опции {@link afterChooserWrapper}.
     * При использовании шаблона по умолчанию, вы можете изменить подпись на кнопке через опцию {@link captionFullList}.
     *
     * <h2>Кнопка "Ещё"</h2>
     * Отображается всегда, под списком.
     * Применяется, чтобы открыть справочник с полным списком записей.
     * При клике по кнопке выполняется команда {@link showDictionary}.
     * По умолчанию для кнопки установлено имя "controls-FilterPanelChooser__dictionaryButton".
     * Шаблон кнопки "Ещё" устанавливают в опции {@link afterChooserWrapper}.
     *
     * <h2>Создание пользовательского редактора</h2>
     * Вы можете создать собственный класс редактора, на основе класса редактора "Список со справочником".
     * Особенность: контрол, который будет отображать список записей, должен иметь фиксированное имя в опции {@link $ws.proto.Control#name} - "controls-FilterPanelChooser__ListView".
     *
     *
     * @class SBIS3.CONTROLS.FilterPanelChooser.DictionaryList
     * @extends SBIS3.CONTROLS.FilterPanelChooser.List
     * @author Сухоручкин Андрей Сергеевич
     * @public
     *
     * @demo SBIS3.CONTROLS.Demo.MyFilterView
     */

    var FilterPanelChooserDictionary = FilterPanelChooserList.extend(/** @lends SBIS3.CONTROLS.FilterPanelChooser.DictionaryList.prototype */ {
        $protected: {
            _options: {
                _afterChooserWrapper: footerTpl,
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
                dictionaryOptions: {},
                defaultItems: undefined
            },
            _selectorAction: undefined
        },

        $constructor: function() {
            CommandDispatcher.declareCommand(this, 'showDictionary', this._showDictionary.bind(this))
        },

        _modifyOptions: function() {
            var
                opts = FilterPanelChooserDictionary.superclass._modifyOptions.apply(this, arguments);
            opts.defaultItems = opts.defaultItems || new RecordSet();
            return opts;
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
            colHelpers.forEach(changed.removed, function(id) {
                item = items.getRecordById(id);
                if (item) {
                    items.remove(item);
                }
            }, this);
            this._addItemsFromDefault();
            this._toggleAllButton();
        },

        _addItemsFromDefault: function() {
            var
                items = this._getListView().getItems(),
                defaultItems = this._options.defaultItems,
                idProperty = defaultItems.getIdProperty(),
                difference = defaultItems.getCount() - items.getCount();

            if (difference > 0) {
                defaultItems.each(function(item) {
                    if (difference > 0 && !items.getRecordById(item.get(idProperty))) {
                        items.add(item);
                        difference--;
                    }
                });
            }
        },

        _toggleAllButton: function() {
            FilterPanelChooserDictionary.superclass._toggleAllButton.apply(this, arguments);
            this._getAllButton().setCaption('Ещё' + ' ' + (this._getListView().getItems().getCount() - 3));
        },

        _onExecutedHandler: function(event, meta, result) {
            var
                listView = this._getListView(),
                items = listView.getItems();
            if (cInstance.instanceOfModule(result, 'WS.Data/Collection/List')) {
                items.clear();
                if (result.getCount()) {
                    items.setAdapter(result.at(0).getAdapter());
                    items.assign(result);
                }
                listView.setSelectedItemsAll();
                this._updateValue();
                this._addItemsFromDefault();
                this._toggleFullState(false);
            }
        },

        _getSelectorAction: function() {
            if (!this._selectorAction) {
                this._selectorAction = new SelectorAction({
                    mode: 'floatArea',
                    parent: this,
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
