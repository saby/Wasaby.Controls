define(['Controls/List/TreeTileView/TreeTileViewModel', 'WS.Data/Collection/RecordSet'], function(TreeTileViewModel, RecordSet) {
   'use strict';

   describe('Controls/List/TreeTileView/TreeTileViewModel', function() {
      var
         treeTileViewModel = new TreeTileViewModel({
            tileMode: 'static',
            itemsHeight: 300,
            imageProperty: 'image',
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'parent@',
            items: new RecordSet({
               rawData: [{
                  'id': 1,
                  'parent': null,
                  'parent@': true
               }, {
                  'id': 2,
                  'parent': null,
                  'parent@': null
               }],
               idProperty: 'id'
            })
         });

      it('constructor', function() {
         assert.equal(treeTileViewModel.getTileMode(), 'static');
         assert.equal(treeTileViewModel.getItemsHeight(), 300);
      });

      it('getCurrent', function() {
         var cur;
         treeTileViewModel.setHoveredItem({
            key: 2,
            position: 'string with style'
         });
         cur = treeTileViewModel.getCurrent();

         assert.equal(cur.tileMode, 'static');
         assert.equal(cur.itemsHeight, 300);
         assert.equal(cur.imageProperty, 'image');
         assert.isFalse(!!cur.isHovered);
         assert.isFalse(!!cur.hasSeparator);

         treeTileViewModel.goToNext();
         cur = treeTileViewModel.getCurrent();
         assert.isTrue(!!cur.isHovered);
         assert.isTrue(!!cur.hasSeparator);
         assert.equal(cur.position, 'string with style');
      });

      it('setTileMode', function() {
         var ver = treeTileViewModel._version;
         treeTileViewModel.setTileMode('dynamic');
         assert.equal(treeTileViewModel.getTileMode(), 'dynamic');
         assert.notEqual(ver, treeTileViewModel._version);
      });

      it('setItemsHeight', function() {
         var ver = treeTileViewModel._version;
         treeTileViewModel.setItemsHeight(200);
         assert.equal(treeTileViewModel.getItemsHeight(), 200);
         assert.notEqual(ver, treeTileViewModel._version);
      });

      it('setHoveredItem', function() {
         var ver = treeTileViewModel._version;
         treeTileViewModel.setHoveredItem({key: 1});
         assert.equal(treeTileViewModel.getHoveredItem().key, 1);
         assert.notEqual(ver, treeTileViewModel._version);
      });

      it('setActiveItem', function() {
         treeTileViewModel.setHoveredItem({key: 1});
         treeTileViewModel.setActiveItem(null);
         assert.equal(treeTileViewModel.getHoveredItem(), null);
         treeTileViewModel.setHoveredItem({key: 2});
         treeTileViewModel.setActiveItem({key: 3});
         assert.equal(treeTileViewModel.getHoveredItem().key, 2);
      });

      it('setRoot', function() {
         treeTileViewModel.setHoveredItem({key: 1});
         treeTileViewModel.setRoot('root');
         assert.equal(treeTileViewModel.getHoveredItem(), null);
      });

      it('getTileItemData', function() {
         var tileItemData = treeTileViewModel.getTileItemData();
         assert.deepEqual(tileItemData, {
            defaultFolderWidth: 250,
            defaultItemWidth: 250,
            imageProperty: 'image',
            itemCompressionCoefficient: 0.7,
            itemsHeight: 200,
            tileMode: 'dynamic'
         });
      });
   });
});
