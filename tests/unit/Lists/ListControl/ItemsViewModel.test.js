/**
 * Created by kraynovdo on 17.11.2017.
 */
define([
   'js!Controls/List/ListControl/ItemsViewModel',
   'js!Controls/List/resources/utils/ItemsUtil'
], function(ItemsViewModel, ItemsUtil){
   describe('Controls.List.ListControl.ItemsViewModel', function () {
      var data, display;
      beforeEach(function() {
         data = [
            {
               id : 1,
               title : 'Первый',
               type: 1
            },
            {
               id : 2,
               title : 'Второй',
               type: 2
            },
            {
               id : 3,
               title : 'Третий',
               type: 2
            }
         ];

      });
      it('Display', function () {
         var cfg = {
            items: data,
            idProperty: 'id'
         };
         var iv = new ItemsViewModel(cfg);

         var disp = iv._display;
         assert.equal(data.length, disp.getCount(), 'Incorrect display\'s creating before mounting');

      });

      it('Enumeration', function () {
         var cfg = {
            items: data,
            idProperty: 'id'
         };

         var iv = new ItemsViewModel(cfg);



         assert.equal(0, iv._curIndex, 'Incorrect start enumeration index after constructor');

         iv._curIndex = 3;
         iv.reset();
         assert.equal(0, iv._curIndex, 'Incorrect current enumeration index after reset()');

         iv.goToNext();
         iv.goToNext();
         assert.equal(2, iv._curIndex, 'Incorrect current enumeration index after 2x_goToNext');

         var condResult = iv.isEnd();
         assert.isTrue(condResult, 'Incorrect condition value enumeration index after 2x_goToNext');
         iv.goToNext();
         condResult = iv.isEnd();
         assert.isFalse(condResult, 'Incorrect condition value enumeration index after 3x_goToNext');
      });

      it('Other', function () {
         var cfg = {
            items: data,
            idProperty: 'id',
            displayProperty: 'title'
         };

         var iv = new ItemsViewModel(cfg);

         var cur = iv.getCurrent();
         assert.equal('id', cur.idProperty, 'Incorrect field set on getCurrent()');
         assert.equal('title', cur.displayProperty, 'Incorrect field set on getCurrent()');
         assert.equal(0, cur.index, 'Incorrect field set on getCurrent()');
         assert.deepEqual(data[0], cur.item, 'Incorrect field set on getCurrent()');


      });
   })
});