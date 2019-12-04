import rk = require('i18n!Controls_localization');
import Control = require('Core/Control');
import tmpl = require('wml!Controls/_form/Crud/Crud');
import Env = require('Env/Env');

let CRUD = Control.extend({
    _template: tmpl,
    showLoadingIndicator: false,

    _afterMount(cfg) {
        if (!cfg.dataSource) {
            Env.IoC.resolve('ILogger').error('Crud', 'Необходимо задать опцию dataSource');
        } else {
            this._dataSource = cfg.dataSource;
        }
    },

    create(initValues) {
        let def = this._dataSource.create(initValues);

        this._notify('registerPending', [def, {showLoadingIndicator: this._options.showLoadingIndicator}], {bubbling: true});

        let self = this;
        def.addCallback(function(record) {
            self._notify('createSuccessed', [record]);
            return record;
        });
        def.addErrback(function(e) {
            self._notify('createFailed', [e]);
            return e;
        });

        return def;
    },
    read(key, readMetaData) {
        const def = this._dataSource.read(key, readMetaData);
        const id = this._indicatorId;
        const message = rk('Пожалуйста, подождите…');
        this._indicatorId = this._notify('showIndicator', [{id, message}], {bubbling: true});

        def.addCallback((record) => {
            this._notify('readSuccessed', [record]);
            this._notify('hideIndicator', [this._indicatorId], {bubbling: true});
            return record;
        });
        def.addErrback((e: Error) => {
            this._notify('readFailed', [e]);
            this._notify('hideIndicator', [this._indicatorId], {bubbling: true});
            return e;
        });

        return def;
    },

    update(record, isNewRecord) {
        let def;
        if (record.isChanged() || isNewRecord) {
            def = this._dataSource.update(record);

            this._notify('registerPending', [def, {showLoadingIndicator: this._options.showLoadingIndicator}], {bubbling: true});

            let self = this;
            def.addCallback(function(key) {
                self._notify('updateSuccessed', [record, key]);
                return key;
            });

            def.addErrback(function(e) {
                self._notify('updateFailed', [e, record]);
                return e;
            });
        } else {
            def = null;
        }
        return def;
    },

    delete(record, destroyMeta) {
        let def = this._dataSource.destroy(record.getId(), destroyMeta);

        this._notify('registerPending', [def, {showLoadingIndicator: this._options.showLoadingIndicator}], {bubbling: true});

        let self = this;
        def.addCallback(function() {
            self._notify('deleteSuccessed', [record]);
        });
        def.addErrback(function(e) {
            self._notify('deleteFailed', [e]);
            return e;
        });

        return def;
    }
});

export = CRUD;

