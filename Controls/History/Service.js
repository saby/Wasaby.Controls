define('Controls/History/Service', [
    'WS.Data/Entity/Abstract',
    'WS.Data/Entity/OptionsMixin',
    'WS.Data/Source/ISource',
    'WS.Data/Source/SbisService',
    'Controls/History/Constants'
], function (
    Abstract,
    OptionsMixin,
    ISource,
    SbisService,
    Constants
) {
    'use strict';

    /**
     * Source working with the service of InputHistory
     *
     * @class Controls/History/Service
     * @extends WS.Data/Entity/Abstract
     * @implements WS.Data/Source/ISource
     * @mixes WS.Data/Entity/OptionsMixin
     * @public
     * @example
     * <pre>
     *    new historyService({
     *              historyId: 'TEST_HISTORY_ID'
     *           })
     * </pre>
     * */
    var _private = {
        getHistoryDataSource: function (self) {
            if (!self._historyDataSource) {
                self._historyDataSource = new SbisService({
                    adapter: 'adapter.json',
                    endpoint: {
                        address: '/input-history/service/',
                        contract: 'InputHistory'
                    }
                });
            }
            return self._historyDataSource;
        },

        updateHistory: function(self, id) {
            _private.getHistoryDataSource(self).call('Add', {
                history_id: self._historyId,
                id: id,
                history_context: null
            });
        },

        updatePinned: function(self, id, meta) {
            _private.getHistoryDataSource(this).call('SetPin', {
                history_id: self._historyId,
                id: id,
                history_context: null,
                pin: !!meta['$_pinned']
            });
        }
    };

    var Service = Abstract.extend([ISource, OptionsMixin],{
        _historyDataSource: null,
        _historyId: null,
        _pinned: null,
        _frequent: null,

        constructor: function Memory(cfg) {
            if (!('historyId' in cfg)) {
                throw new Error('"historyId" not found in options.');
            }
            this._historyId = cfg.historyId;
        },

        update: function (data, meta) {
            var id = data.getId();

            if (meta.hasOwnProperty('$_pinned')) {
                _private.updatePinned(this, id, meta);
            }else {
                _private.updateHistory(this, id, meta);
            }
            return {};
        },

        query: function () {
            return _private.getHistoryDataSource(this).call('UnionIndexesList', {
                params: {
                    historyId: this._historyId,
                    pinned: {
                        count: this._pinned ? Constants.MAX_HISTORY : 0
                    },
                    frequent: {
                        count: this._frequent ? (Constants.MAX_HISTORY - Constants.MIN_RECENT) : 0
                    },
                    recent: {
                        count: Constants.MAX_HISTORY
                    }
                }
            });
        }
    });

    return Service;
});
