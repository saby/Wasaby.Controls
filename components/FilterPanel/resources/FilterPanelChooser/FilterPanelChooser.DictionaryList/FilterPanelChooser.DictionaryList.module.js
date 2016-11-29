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
     * @author Крайнов Дмитрий Олегович
     * @class SBIS3.CONTROLS.FilterPanelChooser.DictionaryList
     * @extends SBIS3.CONTROLS.FilterPanelChooser.List
     */

    var FilterPanelChooserDictionary = FilterPanelChooserList.extend(/** @lends SBIS3.CONTROLS.FilterPanelChooser.DictionaryList.prototype */ {
        $protected: {
            _options: {
                afterChooserWrapper: footerTpl,
                className: 'controls-FilterPanelChooser__dictionary',
                /**
                 * @typedef {String} selectionTypeDef Режим выбора.
                 * @variant node выбираются только узлы
                 * @variant leaf выбираются только листья
                 * @variant all выбираются все записи
                 * @typedef {Object} dictionaryOptions
                 * @property {String} template Компонент, на основе которого организован справочник.
                 * @property {selectionTypeDef} selectionType
                 * @property {Object} componentOptions
                 * Группа опций, которые передаются в секцию _options компонента из опции template. На его основе строится справочник.
                 * Значения переданных опций можно использовать в дочерних компонентах справочника через инструкции шаблонизатора.
                 **/
                /**
                 * @cfg {dictionaryOptions} Устанавливает настройки справочника.
                 **/
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
