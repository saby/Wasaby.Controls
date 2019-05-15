define([
   'Controls/dragnDrop'
], function(dragnDrop) {
   'use strict';

   function crateEntity(itemsCount) {
      return new dragnDrop.ListItems({
         items: {
            length: itemsCount
         }
      });
   }

   var avatar = new dragnDrop.DraggingTemplate({entity: crateEntity(1)});

   describe('Controls.DragNDrop.DraggingTemplate', function() {
      it('itemsCount = 1', function() {
         avatar._beforeMount({entity: crateEntity(1)});
         assert.equal(avatar._itemsCount, undefined);
      });
      it('itemsCount > 1', function() {
         avatar._beforeMount({entity: crateEntity(2)});
         assert.equal(avatar._itemsCount, '2');
      });
      it('itemsCount = 999(max)', function() {
         avatar._beforeMount({entity: crateEntity(999)});
         assert.equal(avatar._itemsCount, '999');
      });
      it('itemsCount = 1000', function() {
         avatar._beforeMount({entity: crateEntity(1000)});
         assert.equal(avatar._itemsCount, '999+');
      });
   });
});
