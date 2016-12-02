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
     * @author Крайнов Дмитрий Олегович
     * @class SBIS3.CONTROLS.FilterPanelChooser.FavoritesList
     * @extends SBIS3.CONTROLS.FilterPanelChooser.DictionaryList
     */

    var FilterPanelChooserFavorites = FilterPanelChooserDictionary.extend(/** @lends SBIS3.CONTROLS.FilterPanelChooser.FavoritesList.prototype */ {
        $protected: {
            _options: {
                beforeChooserWrapper: headerTpl,
                /**
                * @cfg {WS.Data/Collection/RecordSet} Набор избранных записей.
                **/
                favorites: undefined,
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
