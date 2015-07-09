define([], function () {
    'use strict';

    //TODO: выпилить этот модуль, когда $ws переведут на AMD

    /**
     * Враппер стандартного объекта бизнес-логики.
     * Вынесен в отдельный модуль, чтобы его можно было mock-ать через Squire.
     * @extends $ws.proto.ClientBLObject
     */
    return $ws.core.extend($ws.proto.ClientBLObject, {
        $constructor: function() {
        }
    });
});