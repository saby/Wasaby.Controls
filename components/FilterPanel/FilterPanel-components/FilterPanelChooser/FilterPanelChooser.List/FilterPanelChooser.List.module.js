define('js!SBIS3.CONTROLS.FilterPanelChooser.List', [
    'js!SBIS3.CONTROLS.FilterPanelChooser.BaseList',
    'Core/core-instance',
    'Core/core-functions',
    'Core/CommandDispatcher',
    'Core/helpers/collection-helpers',
    'js!WS.Data/Functor/Compute',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.List',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.List/resources/ItemContentTpl',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.List/resources/ItemTemplate',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.List/resources/FilterPanelChooserList',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.List/resources/FilterPanelChooserListFooter',
    'js!SBIS3.CONTROLS.Link',
    'js!SBIS3.CONTROLS.ListView',
    'css!SBIS3.CONTROLS.FilterPanelChooser.List'
], function(FilterPanelChooserBaseList, cInstance, cFunctions, CommandDispatcher, colHelpers, ComputeFunctor, dotTplFn, itemContentTpl, itemTemplate, chooserTpl, footerTpl) {
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
        itemsSortMethod = new ComputeFunctor(function(first, second) {
            return second.collectionItem.get('count') - first.collectionItem.get('count');
        }, ['count']);
    'use strict';

    /**
     * Класс редактора "Список".
     * Применяется для панели фильтра с набираемыми параметрами (см. {@link SBIS3.CONTROLS.FilterPanel}).
     * Реализует выборку идентификаторов из списка {@link SBIS3.CONTROLS.ListView}.
     *
     * <h2>Особенности отображения редактора</h2>
     * По умолчанию отображаются только 3 записи списка.
     * Чтобы получить доступ ко всем записям списка, используйте кнопку "Все".
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
     * <h2>Создание пользовательского редактора</h2>
     * Вы можете создать собственный класс редактора, на основе класса редактора "Список".
     * Особенность: контрол, который будет отображать список записей, должен иметь фиксированное имя в опции {@link $ws.proto.Control#name} - "controls-FilterPanelChooser__ListView".
     *
     * @class SBIS3.CONTROLS.FilterPanelChooser.List
     * @extends SBIS3.CONTROLS.FilterPanelChooser.BaseList
     * @author Сухоручкин Андрей Сергеевич
     * @public
     *
     * @demo SBIS3.CONTROLS.Demo.MyFilterView
     */

    var FilterPanelChooserList = FilterPanelChooserBaseList.extend( /** @lends SBIS3.CONTROLS.FilterPanelChooser.List.prototype */ {
        _dotTplFn: dotTplFn,
        $protected: {
            _options: {
                _itemContentTpl: itemContentTpl,
                _chooserTemplate: chooserTpl,
                _afterChooserWrapper: footerTpl,
                /**
                 * @cfg {String} Устанавливает текст, отображаемый на кнопке под списком.
                 */
                captionFullList: 'Все',
                /**
                 * @cfg {String} Устанавливает поле, в котором лежит количественное значения наименования.
                 */
                countField: 'count'
            },
            _allButton: undefined
        },

        $constructor: function() {
            CommandDispatcher.declareCommand(this, 'showFullList', this._toggleFullState.bind(this));
        },

        _prepareProperties: function() {
            var opts = FilterPanelChooserList.superclass._prepareProperties.apply(this, arguments);
            return cFunctions.merge(opts, {
                itemsSortMethod: itemsSortMethod,
                /*Сейчас признак мультивыбранности записи не рисуется на сервере, из-за этого происходит лютое моргание.
                * Как временное решение, пока ListView сам не начнёт рисовать мультивыбранность на сервере, нарисуем её сами.*/
                itemTpl: itemTemplate,
                _getRecordsForRedraw: getRecordsForRedraw,
                _showFullList: false
            });
        },

        _updateView: function() {
            FilterPanelChooserList.superclass._updateView.apply(this, arguments);
        },
        /**
         * Инициирует подгрузку всех записей списка.
         * @param {Boolean} toggle
         * @command showFullList
         */
        _toggleFullState: function(toggle) {
            this._getListView()._options._showFullList = toggle;
            this._getListView().redraw();
            this._toggleAllButton();
        },

        _toggleAllButton: function() {
            var listView = this._getListView();
            //Скрываем кнопку если показываются все записи (showFullList = true) или показываем не все записи, но их меньше 4
            this._getAllButton().toggle(!(listView._options._showFullList || listView.getItems().getCount() < 4));
        },

        _getAllButton: function() {
            if (!this._allButton) {
                this._allButton = this.getChildControlByName('controls-FilterPanelChooser__allButton');
            }
            return this._allButton;
        }
    });
    return FilterPanelChooserList;

});
