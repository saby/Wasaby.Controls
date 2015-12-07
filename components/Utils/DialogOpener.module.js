/**
 * Created by is.protasov on 06.04.2015.
 */
define('js!SBIS3.CONTROLS.Utils.DialogOpener',[
   'js!SBIS3.CORE.DialogRecord'
], function (DialogRecord) {
   'use strict';
   var convertRecord = function(record) {
      var rec, raw = record.getRaw();
      if (raw.s && raw.d) {
         //TODO очень нужный метод
         var
            parser = new $ws.proto.ParserSBIS(),
            cfg = parser.readRecord(raw),
            pkValue;
         if (raw.d[0]) {
            pkValue = raw.d[0] instanceof Array ? raw.d[0][0] : raw.d[0];
         }
         rec = new $ws.proto.Record({
            colDef : cfg.columns,
            row : cfg.row,
            pkValue : pkValue
         })
      }
      return rec;
   };

   /**
    *
    */
   return {
      openCompatibleDialog: function(dialogComponent, record, handlers) {
         if (record) {
            var
               oldRecord = convertRecord(record);
            new DialogRecord({
               template: dialogComponent,
               record: oldRecord,
               handlers: handlers
            });
         }
      },
      convertRecord: function(record) {
         return convertRecord(record);
      }
   };
});