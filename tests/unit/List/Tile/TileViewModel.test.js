define(['Controls/List/TileView/TileViewModel', 'WS.Data/Collection/RecordSet'], function(TileViewModel, RecordSet) {
   'use strict';

   describe('Controls/List/TileView/TileViewModel', function() {
      var
         tileViewModel = new TileViewModel({
            tileMode: 'static',
            itemsHeight: 300,
            imageProperty: 'image',
            keyProperty: 'id',
            items: new RecordSet({
               rawData: [{
                  'id': 1
               }, {
                  'id': 2
               }],
               idProperty: 'id'
            })
         });

      it('constructor', function() {
         assert.equal(tileViewModel.getTileMode(), 'static');
         assert.equal(tileViewModel.getItemsHeight(), 300);
      });

      it('getCurrent', function() {
         var cur = tileViewModel.getCurrent();
         assert.equal(cur.tileMode, 'static');
         assert.equal(cur.itemsHeight, 300);
         assert.equal(cur.imageProperty, 'image');
      });

      it('setTileMode', function() {
         tileViewModel.setTileMode('dynamic');
         assert.equal(tileViewModel.getTileMode(), 'dynamic');
      });

      it('setItemsHeight', function() {
         tileViewModel.setItemsHeight(200);
         assert.equal(tileViewModel.getItemsHeight(), 200);
      });

      it('setHoveredItem', function() {
         tileViewModel.setHoveredItem({key: 1});
         assert.equal(tileViewModel.getHoveredItem().key, 1);
      });

      it('setActiveItem', function() {
         tileViewModel.setHoveredItem({key: 1});
         tileViewModel.setActiveItem(null);
         assert.equal(tileViewModel.getHoveredItem(), null);
         tileViewModel.setHoveredItem({key: 2});
         tileViewModel.setActiveItem({key: 3});
         assert.equal(tileViewModel.getHoveredItem().key, 2);
      });
   });
});
