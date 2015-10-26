/* global define */
define('js!SBIS3.CONTROLS.ListControl.CommonHandlers', [], function() {
   'use strict';
   
   var CommonHandlers = {
      deleteRecords: function(hashArray) {
         var
            isArray = Array.isArray(hashArray),
            message = isArray && hashArray.length > 1 ? 'Удалить записи?' : 'Удалить текущую запись?',
            self = this;

         return $ws.helpers.question(message).addCallback(function(res) {
            if (!res) {
               return;
            }
            
            var hashes = isArray ? hashArray : [hashArray],
                projection = self.getItemsProjection();
            for (var i = 0; i < hashes.length; i++) {
               var collectionItem = projection.getByHash(hashes[i]),
                  item = collectionItem ? collectionItem.getContents() : undefined;
               if (!item) {
                  continue;
               }
               try {
                  if ($ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS.Data.Model')) {
                     item.remove();
                  }
                  self.getItems().remove(item);
               } catch (e) {
                  $ws.helpers.alert(e.message);
               }
            }
         });
      }
   };

   return CommonHandlers;
});
