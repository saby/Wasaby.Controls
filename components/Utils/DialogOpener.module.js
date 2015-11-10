/**
 * Created by is.protasov on 06.04.2015.
 */
define('js!SBIS3.CONTROLS.Utils.DialogOpener',[
   'js!SBIS3.CORE.DialogRecord'
], function (DialogRecord) {
   'use strict';
   var convertRecord = function(record) {
      var rec;
      if (record._raw.s && record._raw.d) {
         //TODO очень нужный метод
         var
            parser = new $ws.proto.ParserSBIS(),
            cfg = parser.readRecord(record._raw),
            pkValue;
         if (record._raw.d[0]) {
            pkValue = record._raw.d[0] instanceof Array ? record._raw.d[0][0] : record._raw.d[0];
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
      openFloatArea: function(dialogComponent, record, handlers, options){
         var oldRecord = convertRecord(record);
         if (!options){
            options = {};
         }
         var attachOptions = $ws.core.merge({
               template: dialogComponent,
               record: oldRecord,
               handlers: handlers,
               side:  'right',
               autoHide: false,
               isStack: true,
               isModal: false,
               parent: null,
               animationLength: 300,
               showDelay: 300,
               doNotLossFocus: true
            }, options);

         $ws.core.attachInstance('SBIS3.CORE.RecordFloatArea', attachOptions);
      },
      convertRecord: function(record) {
         return convertRecord(record);
      }
   };
});