/**
 * Created by kraynovdo on 24.05.2018.
 */
/**
 * Created by kraynovdo on 16.11.2017.
 */
import cExtend = require('Core/core-simpleExtend');
import entity = require('Types/entity');

/**
 *
 * @author Авраменко А.С.
 * @private
 */
var BaseViewModel = cExtend.extend([entity.ObservableMixin.prototype, entity.VersionableMixin], {
    constructor: function (cfg) {
        this._options = cfg;
    },

    _isCachedItemData: function(itemKey) {
        throw new Error(`BaseViewModel#_isCachedItemData is not implemented for ${this._moduleName}`);
    },
    _getCachedItemData: function(itemKey) {
        throw new Error(`BaseViewModel#_getCachedItemData is not implemented for ${this._moduleName}`);
    },
    _setCachedItemData: function(itemKey, cache) {
        throw new Error(`BaseViewModel#_setCachedItemData is not implemented for ${this._moduleName}`);
    },
    _resetCachedItemData: function(itemKey) {
        throw new Error(`BaseViewModel#_resetCachedItemData is not implemented for ${this._moduleName}`);
    },

    destroy: function () {
        entity.ObservableMixin.prototype.destroy.apply(this, arguments);
        this._options = null;
    }
});

export = BaseViewModel;
