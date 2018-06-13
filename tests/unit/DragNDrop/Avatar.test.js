define([
   'Controls/DragNDrop/Avatar',
   'Controls/DragNDrop/Entity/List/Items'
], function(Avatar, Entity) {
   'use strict';

   function crateEntity(itemsCount) {
      return new Entity({
         items: {
            length: itemsCount
         }
      });
   }

   var avatar = new Avatar({entity: crateEntity(1)});

   describe('Controls.DragNDrop.Avatar', function() {
      it('default mainText', function() {
         avatar._beforeMount({entity: crateEntity()});
         assert.equal(avatar._mainText, 'Запись реестра');
      });
      it('default logo', function() {
         avatar._beforeMount({entity: crateEntity()});
         assert.equal(avatar._logo, 'icon-DocumentUnknownType');
      });
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
