define('js!SBIS3.CONTROLS.FilterPanelChooser.FavoritesList', [
    'js!SBIS3.CONTROLS.FilterPanelChooser.DictionaryList',
    'Core/core-functions',
    'Core/IoC',
    'js!WS.Data/Collection/RecordSet',
    'js!SBIS3.CONTROLS.ArraySimpleValuesUtil',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.FavoritesList',
    'tmpl!SBIS3.CONTROLS.FilterPanelChooser.FavoritesList/resources/FilterPanelChooserFavoritesHeader',
    'js!SBIS3.CONTROLS.FilterPanelBoolean',
    'css!SBIS3.CONTROLS.FilterPanelChooser.FavoritesList'
], function(FilterPanelChooserDictionary, cFunctions, IoC, RecordSet, ArraySimpleUtil, dotTplFn, headerTpl) {

    var favoritesIsChecked = function(value, favorites) {
        var
            result = true,
            idProperty = favorites.getIdProperty();
        favorites.each(function(item) {
            if (!ArraySimpleUtil.hasInArray(value, item.get(idProperty))) {
                result = false;
            }
        });
        return result;
    };
    'use strict';

    /**
     * Класс редактора "Список с избранными записями".
     * Применяется для панели фильтра с набираемыми параметрами (см. {@link SBIS3.CONTROLS.FilterPanel}).
     * Реализует выборку идентификаторов как из списка {@link SBIS3.CONTROLS.ListView}, так и из справочника, вызов которого производится по кнопке "Ещё" под списком или командой {@link showDictionary}.
     * <br/>
     * Особенностью данного редактора является возможность добавлять записи в число избранных.
     * Список избранных отображается в справочнике в отдельной вкладке, а также перед списком появляется кнопка "Избранные (N)", где N - число избранных записей.
     * Клик по кнопке открывает в справочнике вкладку "Избранные".
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
     * Вы можете создать собственный класс редактора, на основе класса редактора "Список с избранными записями".
     * Особенность: контрол, который будет отображать список записей, должен иметь фиксированное имя в опции {@link $ws.proto.Control#name} - "controls-FilterPanelChooser__ListView".
     *
     * <h2>Избранные записи</h2>
     * Число избранных записей устанавливают в опции {@link favorites}.
     * Шаблон, который отображает кнопку с числом избранных записей, устанавливают в опции {@link beforeChooserWrapper}.
     * Клик по кнопке открывает в справочнике вкладку "Избранные".
     * По умолчанию для отображения используется класс редактора {@link SBIS3.CONTROLS.FilterPanelBoolean}, для которого фиксировано имя - "controls-FilterPanelChooser__favoritesCheckBox".
     *
     * @class SBIS3.CONTROLS.FilterPanelChooser.FavoritesList
     * @extends SBIS3.CONTROLS.FilterPanelChooser.DictionaryList
     * @author Сухоручкин Андрей Сергеевич
     * @public
     *
     * @demo SBIS3.CONTROLS.Demo.MyFilterView
     */

    var FilterPanelChooserFavorites = FilterPanelChooserDictionary.extend(/** @lends SBIS3.CONTROLS.FilterPanelChooser.FavoritesList.prototype */ {
        _dotTplFn: dotTplFn,
        $protected: {
            _options: {
                _beforeChooserWrapper: headerTpl,
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
            this._getFavoritesCheckBox().subscribe('onValueChange', this._updateValue.bind(this));
            //TODO: придрот. обработчик клика по надписи 'Избранное'
            $('.js-controls-CheckBox__caption', this._container).bind('click', this._clickFavoritesHandler.bind(this));
        },

        _modifyOptions: function() {
            var opts = FilterPanelChooserFavorites.superclass._modifyOptions.apply(this, arguments);
            opts.favorites = opts.favorites || new RecordSet();
            opts.favoritesIsChecked = favoritesIsChecked(opts.value, opts.favorites);
            return opts;
        },

        _updateView: function() {
            FilterPanelChooserFavorites.superclass._updateView.apply(this, arguments);
            this._getFavoritesCheckBox().setValue(favoritesIsChecked(this._options.value, this._options.favorites));
        },

        _clickFavoritesHandler: function(e) {
            this._showDictionary({componentOptions: { isFavorites: true }});
            e.stopPropagation();
        },

        _updateTextValue: function() {
            var
                idProperty,
                listView = this._getListView(),
                textValue = listView.getTextValue();
            if (this._getFavoritesCheckBox().getValue()) {
                idProperty = this._options.favorites.getIdProperty();
                this._options.favorites.each(function(item) {
                    if (!ArraySimpleUtil.hasInArray(listView.getSelectedKeys(), item.get(idProperty))) {
                        textValue = textValue + (textValue ? ', ' : '') + item.get(this._options.properties.displayProperty);
                    }
                }, this);
            }
            this.setTextValue(textValue);
        },

        _updateValue: function() {
            var
                favoriteId,
                idProperty,
                value = cFunctions.clone(this._getListView().getSelectedKeys());
            if (this._getFavoritesCheckBox().getValue()) {
                idProperty = this._options.favorites.getIdProperty();
                this._options.favorites.each(function(item) {
                    favoriteId = item.get(idProperty);
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
