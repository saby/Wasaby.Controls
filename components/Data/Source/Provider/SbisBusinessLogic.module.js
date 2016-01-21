/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic', [
   'js!SBIS3.CONTROLS.Data.Source.Provider.IRpc',
   'js!SBIS3.CONTROLS.Data.Di'
], function (IRpc, Di) {
    'use strict';

    /**
     * JSON-RPC Провайдер для бизнес-логики СБиС
     * @class SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic
     * @extends $ws.proto.ClientBLObject
     * @mixes SBIS3.CONTROLS.Data.Source.Provider.IRpc
     */
    var SbisBusinessLogic = $ws.proto.ClientBLObject.extend([IRpc], {
       _moduleName: 'SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic',

        call: function(method, args) {
            return SbisBusinessLogic.superclass.call.call(
               this,
               method,
               args,
               $ws.proto.BLObject.RETURN_TYPE_ASIS
            );
        }
    });

   Di.register('source.provider.sbis-business-logic', SbisBusinessLogic);

   return SbisBusinessLogic;
});