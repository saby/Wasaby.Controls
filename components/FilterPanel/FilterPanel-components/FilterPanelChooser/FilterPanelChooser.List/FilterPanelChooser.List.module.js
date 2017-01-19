define('js!SBIS3.CONTROLS.FilterPanelChooser.List', [
    'js!SBIS3.CONTROLS.FilterPanelChooser.Base',
    'Core/core-instance',
    'Core/core-functions',
    'Core/CommandDispatcher',
    'Core/helpers/collection-helpers',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.List',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.List/resources/ItemTpl',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.List/resources/FilterPanelChooserList',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.List/resources/FilterPanelChooserListFooter',
    'js!SBIS3.CONTROLS.Link',
    'js!SBIS3.CONTROLS.ListView'
], function(FilterPanelChooserBase, cInstance, cFunctions, CommandDispatcher, colHelpers, dotTplFn, itemTpl, chooserTpl, footerTpl) {
    var
        //TODO: выписана задача https://inside.tensor.ru/opendoc.html?guid=62947517-9859-4291-a899-42bacf350341 по которой
        //будет предоставлен функционал фильтрации на уровне проекции с учётом сортировки, и перебитие приватной опции
        //_getRecordsForRedraw у ListView можно будет удалить.
        getRecordsForRedraw = function(projection, cfg) {
            var records = cfg._getRecordsForRedrawSt.apply(this, arguments);
            if (cfg._showFullList === false) {
                records = records.slice(0, 3);
            }
            return records;
        },
        itemsSortMethod = function(first, second) {
            return second.collectionItem.get('count') - first.collectionItem.get('count');
        };
    'use strict';

    /**
     * Класс редактора "Список".
     * Применяется для панели фильтрации (см. {@link SBIS3.CONTROLS.OperationsPanel/FilterPanelItem.typedef FilterPanelItem}).
     * <br/>
     * Реализует выборку идентификаторов из списка {@link SBIS3.CONTROLS.ListView}.
     * <br/>
     * По умолчанию отображаются только 3 записи списка.
     * Чтобы подгрузить все записи, используют кнопку "Все", которая расположена под списком, или команду {@link showFullList}.
     * Шаблон кнопки "Все" устанавливают в опции {@link afterChooserWrapper}. При использовании шаблона по умолчанию, вы можете изменить подпись на кнопке через опцию {@link captionFullList}.
     * <br/>
     * @class SBIS3.CONTROLS.FilterPanelChooser.List
     * @extends SBIS3.CONTROLS.FilterPanelChooser.Base
     * @author Сухоручкин Андрей Сергеевич
     * @public
     *
     * @demo SBIS3.CONTROLS.Demo.MyFilterView
     */

    var FilterPanelChooserList = FilterPanelChooserBase.extend( /** @lends SBIS3.CONTROLS.FilterPanelChooser.List.prototype */ {
        _dotTplFn: dotTplFn,
        $protected: {
            _options: {
                _itemTpl: itemTpl,
                _getRecordsForRedraw: getRecordsForRedraw,
                _itemsSortMethod: itemsSortMethod,
                chooserTemplate: chooserTpl,
                /**
                 * @cfg {String} Устанавливает шаблон, отображаемый под списком.
                 * @remark
                 * Шаблон по умолчанию реализует кнопку "Все", клик по которой подгружает все записи списка.
                 * Шаблон должен быть реализован только на <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/component/xhtml/logicless-template/'>logicless-шаблонизаторе</a>
                 * @see captionFullList
                 * @see chooserTemplate
                 */
                afterChooserWrapper: footerTpl,
                /**
                 * @cfg {String} Устанавливает текст, отображаемый на кнопке под списком.
                 * @remark
                 * Кнопка реализована в шаблоне {@link afterChooserWrapper}. Клик по кнопке подгружает все записи списка.
                 * @see afterChooserWrapper
                 */
                captionFullList: 'Все',
                /**
                 * @cfg {String} Устанавливает поле, в котором лежит количественное значения наименования.
                 * @see idProperty
                 * @see displayProperty
                 */
                countField: 'count'
            },
            _listView: undefined
        },

        $constructor: function() {
            CommandDispatcher.declareCommand(this, 'showFullList', this._toggleFullState.bind(this));
        },

        init: function() {
            var listView;
            FilterPanelChooserList.superclass.init.apply(this, arguments);
            listView = this._getListView();
            listView._checkClickByTap = false;
            listView.subscribe('onItemClick', this._elemClickHandler.bind(this));
        },

        setValue: function(value) {
            this._setValue(value);
            this._updateView(value);
        },

        /*Определяем приватный _setValue, который зовёт setValue суперкласса (который меняет только данные), т.к. к изменению
          данных может приводить изменение визуального состояния, и в таком случае если звать setValue суперкласса
          мы заново будем проставлять визуальное состояние, которое уже находится в правильном состояние*/
        _setValue: function(value) {
            FilterPanelChooserList.superclass.setValue.apply(this, arguments);
        },

        _updateView: function(value) {
            this._getListView().setSelectedKeys(value);
            this._toggleAllButton();
        },

        _updateTextValue: function(newValue) {
            var
                self = this,
                textValue = '',
                viewItems = this._getListView().getItems();
            colHelpers.forEach(newValue, function(id, idx) {
                textValue += self._getItemTextByItemId(viewItems, id) + (idx < newValue.length - 1 ? ', ' : '');
            });
            this.setTextValue(textValue);
        },

        _getItemTextByItemId: function(items, id) {
            return items.getRecordById(id).get(this._options.displayProperty);
        },

        _elemClickHandler: function(e, id) {
            this._getListView().toggleItemsSelection([id]);
            this._updateValue();
        },

        _updateValue: function() {
            this._setValue(cFunctions.clone(this._getListView().getSelectedKeys()));
        },
        /**
         * Инициирует подгрузку всех записей списка.
         * @param {Boolean} toggle
         * @command showFullList
         */
        _toggleFullState: function(toggle) {
            this._getListView()._options._showFullList = toggle;
            this._getListView().redraw();
            this._toggleAllButton(toggle);
        },

        _toggleAllButton: function(toggle) {
            //Скрываем кнопку если показываются все записи (toggle = true) или показываем не все записи, но их меньше 4
            this._getAllButton().toggle(!(toggle || this._options.items.getCount() < 4));
        },

        _getAllButton: function() {
            if (!this._allButton) {
                this._allButton = this.getChildControlByName('controls-FilterPanelChooser__allButton');
            }
            return this._allButton;
        },

        _getListView: function() {
            if (!this._listView) {
                this._listView = this.getChildControlByName('controls-FilterPanelChooser__ListView');
            }
            return this._listView;
        }
    });
    return FilterPanelChooserList;

});
