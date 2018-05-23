define('SBIS3.CONTROLS/Filter/Panel/components/Chooser/DictionaryList', [
    'SBIS3.CONTROLS/Filter/Panel/components/Chooser/List',
    'Core/CommandDispatcher',
    'Core/core-clone',
    'Core/core-merge',
    'WS.Data/Format/Format',
    'WS.Data/Format/Field',
    'Core/core-instance',
    'WS.Data/Entity/Model',
    'WS.Data/Collection/RecordSet',
    'tmpl!SBIS3.CONTROLS/Filter/Panel/components/Chooser/DictionaryList/resources/FilterPanelChooserDictionaryFooter',
    'SBIS3.CONTROLS/Action/SelectorAction',
    'css!SBIS3.CONTROLS/Filter/Panel/components/Chooser/DictionaryList/FilterPanelChooser-DictionaryList'
], function(FilterPanelChooserList, CommandDispatcher, coreClone, coreMerge, Format, FormatField, cInstance, Model, RecordSet, footerTpl, SelectorAction) {

    'use strict';

    /**
     * Класс редактора "Список со справочником".
     * Применяется для панели фильтра с набираемыми параметрами (см. {@link SBIS3.CONTROLS/Filter/FilterPanel}).
     * Реализует выборку идентификаторов как из списка {@link SBIS3.CONTROLS/ListView}, так и из справочника (см. {@link dictionaryOptions}), вызов которого производится по кнопке "Ещё" под списком или командой {@link showDictionary}.
     *
     * <h2>Особенности отображения редактора</h2>
     * По умолчанию отображается 3 записи в списке.
     * Чтобы подгрузить все, используйте кнопку "Все" под списком или команду {@link showFullList}.
     * Чтобы открыть справочник и произвести выбор записей, используйте кнопку "Ещё" или команду {@link showDictionary}.
     *
     * <h2>Конфигурация редактора</h2>
     * Чтобы изменить конфигурацию редактора, используют подопцию *properties* (см. {@link https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/Filter/FilterPanel/typedefs/FilterPanelItem/}) в {@link SBIS3.CONTROLS/Filter/FilterPanel#items}.
     * По умолчанию для списка вы можете переопределить следующие опции: {@link SBIS3.CONTROLS/Mixins/ItemsControlMixin#idProperty}, {@link SBIS3.CONTROLS/Mixins/ItemsControlMixin#displayProperty}, {@link SBIS3.CONTROLS/Mixins/ItemsControlMixin#items} и {@link SBIS3.CONTROLS/Mixins/MultiSelectable#selectedKeys}.
     * Опции, для которых конфигурация фиксирована: {@link SBIS3.CONTROLS/ListView#multiselect}=true, {@link SBIS3.CONTROLS/ListView#itemsDragNDrop}=false и {@link  SBIS3.CONTROLS/ListView#itemsActions}=&#91;&#93;.
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
     * Особенность: контрол, который будет отображать список записей, должен иметь фиксированное имя в опции {@link Lib/Control/Control#name} - "controls-FilterPanelChooser__ListView".
     *
     *
     * @class SBIS3.CONTROLS/Filter/Panel/components/Chooser/DictionaryList
     * @extends SBIS3.CONTROLS/Filter/Panel/components/Chooser/List
     * @author Сухоручкин А.С.
     * @public
     *
     * @demo Examples/FilterPanel/FilterPanelSimple/FilterPanelSimple
     */

    var FilterPanelChooserDictionary = FilterPanelChooserList.extend(/** @lends SBIS3.CONTROLS/Filter/Panel/components/Chooser/DictionaryList.prototype */ {
        $protected: {
            _options: {
                _afterChooserWrapper: footerTpl,
                className: 'controls-FilterPanelChooser__dictionary',
                /**
                 * @typedef {Object} dictionaryOptions
                 * @property {String} template Компонент, на основе которого производится построение справочника.
                 * @property {String} selectionType Режим выбора записей. О типах записей вы можете прочитать в разделе <a href='/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy'>Иерархия</a>. Возможные значения:
                 * <ul>
                 *     <li>node - выбираются только записи типа "Узел" и "Скрытый узел".</li>
                 *     <li>leaf - выбираются только записи типа "Лист".</li>
                 *     <li>all - выбираются все типы записей.</li>
                 * </ul>
                 * @property {Object} componentOptions
                 * Группа опций, которые передаются в секцию <b>_options</b> компонента из опции template (см. {@link SBIS3.CONTROLS/FilterPanelItem.typedef FilterPanelItem}). На его основе строится справочник.
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
            meta = coreMerge(coreClone(this._options.dictionaryOptions), meta || {});
            meta.multiselect = true;
            meta.selectedItems = this._getListView().getSelectedItems();
            this._getSelectorAction().execute(meta);
        },

        _selectedItemsChangeHandler: function(event, idArray, changed) {
            var
                item,
                items = this._getListView().getItems();
            items.setEventRaising(false, true);
            changed.removed.forEach(function(id) {
                item = items.getRecordById(id);
                if (item) {
                    items.remove(item);
                }
            });
            items.setEventRaising(true, true);
            this._getListView().redraw();
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

       _removeItemsFromDefault: function() {
          var
             id, self = this,
             keysForRemove = [],
             items = this._getListView().getItems(),
             idProperty = items.getIdProperty();

          items.each(function(item) {
             id = item.get(idProperty);
             if (self._options.value.indexOf(id) === -1) {
                keysForRemove.push(id);
             }
          });
          keysForRemove.forEach(function(key) {
             items.remove(items.getRecordById(key));
          }, this);
       },

        _toggleAllButton: function() {
            FilterPanelChooserDictionary.superclass._toggleAllButton.apply(this, arguments);
            this._getAllButton().setCaption('Ещё' + ' ' + (this._getListView().getItems().getCount() - 3));
        },

       _createRecordWithAdapter: function(sourceRecord, adapter) {
          var
             format = this._getRecordFormat(),
             result = new Model({
                adapter: adapter,
                format: format
             }),
             name;
          format.each(function(field) {
             name = field.getName();
             result.set(name, sourceRecord.get(name));
          });

          return result;
       },

       _getRecordFormat: function() {
          //Для отображения записей в панеле фильтров, нужны только эти 3 поля, нет смысла тянуть все поля, которые
          //возвращаются из SelectorAction.
          return new Format({
             items: [
                new FormatField({name: this._options.properties.idProperty}),
                new FormatField({name: this._options.properties.displayProperty}),
                new FormatField({name: this._options.countField})
             ]
          });
       },

        _onExecutedHandler: function(event, meta, result) {
            var
                listView = this._getListView(),
                items = listView.getItems();
            if (cInstance.instanceOfModule(result, 'WS.Data/Collection/List')) {
                items.setEventRaising(false, true);
                items.clear();
                if (result.getCount()) {
                    items.assign(result);
                }
                items.setEventRaising(true, true);
                listView.setSelectedItemsAll();
                this._updateValue();
                //Дозаполним набор отображаемых элементов из набора дефолтных
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
