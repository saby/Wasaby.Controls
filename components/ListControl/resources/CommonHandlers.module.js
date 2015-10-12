/* global define */
define('js!SBIS3.CONTROLS.ListControl.CommonHandlers', [], function() {
   'use strict';
   
   var CommonHandlers = {
      deleteRecords: function(hashArray) {
         var
            isArray = Array.isArray(hashArray),
            message = isArray && hashArray.length !== 1 ? "Удалить записи?" : "Удалить текущую запись?",
            self = this;

         return $ws.helpers.question(message).addCallback(function(res) {
            if(!res) {
               return;
            }
            
            var hashes = isArray ? hashArray : [hashArray],
                items = self.getItems();
            for (var i = 0; i < hashes.length; i++) {
               var item = items.getByHash(hashes[i]),
                   contents = item.getContents();

               try {
                  if ($ws.helpers.instanceOfModule(contents, 'SBIS3.CONTROLS.Data.Model')) {
                     contents.remove();
                  }
                  items.remove(item);
               } catch (e) {
                  console.error(e);
               }
            }
         })
      }
   };

   return CommonHandlers;
});
