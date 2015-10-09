/* global define, $ws */
define([], function () {
    'use strict';

    //TODO: выпилить этот модуль, когда $ws перейдет на AMD

    /**
     * Враппер стандартного объекта бизнес-логики.
     * Вынесен в отдельный модуль, чтобы его можно было mock-ать через Squire.
     * @extends $ws.proto.ClientBLObject
     */
    return $ws.proto.ClientBLObject.extend({
        /**
         * Вызов произвольного метода Бизнес-логики
         *
         * @param {String} method Имя вызываемеого метода
         * @param {Object} args Аргументы вызова
         * @returns {$ws.proto.Deferred} Асинхронный результат операции
         */
        callMethod: function(method, args) {
            return this.call(
               method,
               args,
               $ws.proto.BLObject.RETURN_TYPE_ASIS
            );
        }
    });
});