/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic', [
   'js!SBIS3.CONTROLS.Data.Source.Provider.IRpc'
], function (IRpc) {
    'use strict';

    /**
     * JSON-RPC Провайдер для бизнес-логики СБиС
     * @class SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic
     * @extends $ws.proto.ClientBLObject
     * @mixes SBIS3.CONTROLS.Data.Source.Provider.IRpc
     */
    var SbisBusinessLogic = $ws.proto.ClientBLObject.extend([IRpc], {
        call: function(method, args) {
            return SbisBusinessLogic.superclass.call.call(
               this,
               method,
               args,
               $ws.proto.BLObject.RETURN_TYPE_ASIS
            );
        }
    });

   return SbisBusinessLogic;
});