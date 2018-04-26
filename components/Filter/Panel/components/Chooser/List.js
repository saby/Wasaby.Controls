define('SBIS3.CONTROLS/Filter/Panel/components/Chooser/List', [
    'SBIS3.CONTROLS/Filter/Panel/components/Chooser/BaseList',
    'Core/core-merge',
    'Core/CommandDispatcher',
    'WS.Data/Functor/Compute',
    'tmpl!SBIS3.CONTROLS/Filter/Panel/components/Chooser/List/FilterPanelChooser.List',
    'tmpl!SBIS3.CONTROLS/Filter/Panel/components/Chooser/List/resources/ItemContentTpl',
    'tmpl!SBIS3.CONTROLS/Filter/Panel/components/Chooser/List/resources/ItemTemplate',
    'tmpl!SBIS3.CONTROLS/Filter/Panel/components/Chooser/List/resources/FilterPanelChooserList',
    'tmpl!SBIS3.CONTROLS/Filter/Panel/components/Chooser/List/resources/FilterPanelChooserListFooter',
    'SBIS3.CONTROLS/Link',
    'SBIS3.CONTROLS/ListView',
    'css!SBIS3.CONTROLS/Filter/Panel/components/Chooser/List/FilterPanelChooser-List'
], function(FilterPanelChooserBaseList, coreMerge, CommandDispatcher, ComputeFunctor, dotTplFn, itemContentTpl, itemTemplate, chooserTpl, footerTpl) {
    var
        itemsFilterMethod = function(model, index, proj, projIndex) {
            return this.showFullList || projIndex < 3;
        },
        itemsSortMethod = new ComputeFunctor(function(first, second) {
            return second.collectionItem.get('count') - first.collectionItem.get('count');
        }, ['count']);
    'use strict';

    /**
     * Класс редактора "Список".
     * Применяется для панели фильтра с набираемыми параметрами (см. {@link SBIS3.CONTROLS/Filter/FilterPanel}).
     * Реализует выборку идентификаторов из списка {@link SBIS3.CONTROLS/ListView}.
     *
     * <h2>Особенности отображения редактора</h2>
     * По умолчанию отображаются только 3 записи списка.
     * Чтобы получить доступ ко всем записям списка, используйте кнопку "Все".
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
     * <h2>Создание пользовательского редактора</h2>
     * Вы можете создать собственный класс редактора, на основе класса редактора "Список".
     * Особенность: контрол, который будет отображать список записей, должен иметь фиксированное имя в опции {@link Lib/Control/Control#name} - "controls-FilterPanelChooser__ListView".
     *
     * @class SBIS3.CONTROLS/Filter/Panel/components/Chooser/List
     * @extends SBIS3.CONTROLS/Filter/Panel/components/Chooser/BaseList
     * @author Сухоручкин А.С.
     * @public
     *
     * @demo Examples/FilterPanel/FilterPanelSimple/FilterPanelSimple
     */

    var FilterPanelChooserList = FilterPanelChooserBaseList.extend( /** @lends SBIS3.CONTROLS/Filter/Panel/components/Chooser/List.prototype */ {
        _dotTplFn: dotTplFn,
        $protected: {
            _options: {
                _itemsFilterMethod: itemsFilterMethod,
                _itemsSortMethod: itemsSortMethod,
                _itemContentTpl: itemContentTpl,
                chooserTemplate: chooserTpl,
                _afterChooserWrapper: footerTpl,
                /**
                 * @cfg {String} Устанавливает текст, отображаемый на кнопке под списком.
                 */
                captionFullList: 'Все',
                /**
                 * @cfg {String} Устанавливает поле, в котором лежит количественное значения наименования.
                 */
                countField: 'count',
                /**
                 * @cfg {Boolean} Показывать весь набор элементов.
                 */
                showFullList: false
            },
            _allButton: undefined
        },

        $constructor: function() {
            CommandDispatcher.declareCommand(this, 'showFullList', this._toggleFullState.bind(this));
        },

        _prepareProperties: function(options) {
            var props = FilterPanelChooserList.superclass._prepareProperties.apply(this, arguments);
            //необходимо забиндить фильтр на опции, чтобы в фильтре иметь доступ к опции showFullList, т.к. фильтрация
            //зависит от значения этой опции.
            options._itemsFilterMethod = options._itemsFilterMethod.bind(options);
            return coreMerge(props, {
                itemsSortMethod: options._itemsSortMethod,
                itemsFilterMethod: options._itemsFilterMethod,
                /*Сейчас признак мультивыбранности записи не рисуется на сервере, из-за этого происходит лютое моргание.
                * Как временное решение, пока ListView сам не начнёт рисовать мультивыбранность на сервере, нарисуем её сами.*/
                itemTpl: itemTemplate
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
            var filter = toggle ? null : this._options._itemsFilterMethod;
            this._options.showFullList = toggle;
            this._getListView().setItemsFilterMethod(filter);
            this._toggleAllButton();
        },

        _toggleAllButton: function() {
            var listView = this._getListView();
            //Скрываем кнопку если показываются все записи (showFullList = true) или показываем не все записи, но их меньше 4
            this._getAllButton().toggle(!(this._options.showFullList || listView.getItems().getCount() < 4));
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
