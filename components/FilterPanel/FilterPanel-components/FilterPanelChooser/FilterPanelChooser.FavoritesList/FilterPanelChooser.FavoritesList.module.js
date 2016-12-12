define('js!SBIS3.CONTROLS.FilterPanelChooser.FavoritesList', [
    'js!SBIS3.CONTROLS.FilterPanelChooser.DictionaryList',
    'Core/core-functions',
    'Core/IoC',
    'js!WS.Data/Collection/RecordSet',
    'js!SBIS3.CONTROLS.ArraySimpleValuesUtil',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.FavoritesList/resources/FilterPanelChooserFavoritesHeader',
    'js!SBIS3.CONTROLS.FilterPanelBoolean'
], function(FilterPanelChooserDictionary, cFunctions, IoC, RecordSet, ArraySimpleUtil, headerTpl) {

    var favoritesIsChecked = function(value, favorites, keyField) {
        var result = true;
        favorites.each(function(item) {
            if (!ArraySimpleUtil.hasInArray(value, item.get(keyField))) {
                result = false;
            }
        });
        return result;
    };
    'use strict';

    /**
     * Класс редактора "Список с избранными записями".
     * Применяется для панели фильтрации (см. {@link SBIS3.CONTROLS.OperationsPanel/FilterPanelItem.typedef FilterPanelItem}).
     * <br/>
     * Реализует выборку идентификаторов как из списка {@link SBIS3.CONTROLS.ListView}, так и из справочника, вызов которого производится по кнопке "Все" под списком или командой {@link showDictionary}.
     * По умолчанию отображается 3 записи в списке. Чтобы подгрузить все, используйте кнопку "Ещё" под списком или команду {@link showFullList}.
     * <br/>
     * Чтобы изменить шаблон отображения кнопок "Все" и "Ещё", измените опцию {@link afterChooserWrapper}.
     * Если вы используете шаблон по умолчанию, то подпись кнопки "Все" можно изменить через опцию {@link captionFullList}.
     * <br/>
     * Также присутствует возможность создавать избранные записи. Выбор таких записей производится из справочника.
     * Для доступа к избранным записям, над списком отображается кнопка "Избранные". Шаблон кнопку устанавливают в опции {@link beforeChooserWrapper}.
     * @class SBIS3.CONTROLS.FilterPanelChooser.FavoritesList
     * @extends SBIS3.CONTROLS.FilterPanelChooser.DictionaryList
     * @author Сухоручкин Андрей Сергеевич
     *
     * @demo SBIS3.CONTROLS.Demo.MyFilterView
     */

    var FilterPanelChooserFavorites = FilterPanelChooserDictionary.extend(/** @lends SBIS3.CONTROLS.FilterPanelChooser.FavoritesList.prototype */ {
        $protected: {
            _options: {
                /**
                 * @cfg {String} Устанавливает шаблон, отображающий кнопку с числом избранных записей.
                 * @remark
                 * Шаблон должен быть реализован только на <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/component/xhtml/logicless-template/'>logicless-шаблонизаторе</a>
                 */
                beforeChooserWrapper: headerTpl,
                /**
                 * @cfg {WS.Data/Collection/RecordSet} Устанавливает набор избранных записей.
                 */
                favorites: undefined,
                /**
                 * @cfg {String}
                 */
                favoritesCount: undefined
            },
            _favoritesCheckBox: undefined
        },

        init: function() {
            FilterPanelChooserFavorites.superclass.init.apply(this, arguments);
            this._getFavoritesCheckBox().subscribe('onValueChange', this._onFavoritesCheckedChange.bind(this));
            //TODO: придрот. обработчик клика по надписи 'Избранное'
            $('.js-controls-CheckBox__caption', this._container).bind('click', this._clickFavoritesHandler.bind(this));
        },

        _modifyOptions: function() {
            var opts = FilterPanelChooserFavorites.superclass._modifyOptions.apply(this, arguments);
            if (Array.isArray(opts.favorites)) {
                IoC.resolve('ILogger').log('items', 'Array type option is deprecated. Use WS.Data/Collection/RecordSet.');
                opts.favorites = new RecordSet({
                    rawData: opts.favorites,
                    idProperty: opts.keyField
                });
            }
            opts.favoritesIsChecked = favoritesIsChecked(opts.value, opts.favorites, opts.keyField);
            return opts;
        },

        _updateView: function() {
            FilterPanelChooserFavorites.superclass._updateView.apply(this, arguments);
            this._getFavoritesCheckBox().setValue(favoritesIsChecked(this._options.value, this._options.favorites, this._options.keyField));
        },

        _getItemTextByItemId: function(items, id) {
            var item = items.getRecordById(id) || this._options.favorites.getRecordById(id);
            return item.get(this._options.displayField);
        },

        _clickFavoritesHandler: function(e) {
            this._showDictionary({componentOptions: { isFavorites: true }});
            e.stopPropagation();
        },

        _onFavoritesCheckedChange: function() {
            this._updateValue();
        },

        _updateValue: function() {
            var
                favoriteId,
                value = cFunctions.clone(this._getListView().getSelectedKeys());
            if (this._getFavoritesCheckBox().getValue()) {
                this._options.favorites.each(function(item) {
                    favoriteId = item.get(this._options.keyField);
                    if (!ArraySimpleUtil.hasInArray(value, favoriteId)) {
                        value.push(favoriteId);
                    }
                }, this);
            }
            this._setValue(value);
        },

        _getFavoritesCheckBox: function() {
            if (!this._favoritesCheckBox) {
                this._favoritesCheckBox = this.getChildControlByName('controls-FilterPanelChooser__favoritesCheckBox');
            }
            return this._favoritesCheckBox;
        }
    });

    return FilterPanelChooserFavorites;

});
