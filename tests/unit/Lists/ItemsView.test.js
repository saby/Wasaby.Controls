/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'js!WSControls/Lists/ItemsView',
   'js!WSControls/Lists/resources/utils/ItemsUtil'
], function(ItemsView, ItemsUtil){
   describe('WSControls.Lists.ItemsView', function () {
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
         var iv = new ItemsView(cfg);
         iv._beforeMount(cfg);

         var disp = iv._display;
         assert.equal(data.length, disp.getCount(), 'Incorrect display\'s creating before mounting');

         iv = new ItemsView({});
         iv._beforeUpdate(cfg);
         disp = iv._display;
         assert.equal(data.length, disp.getCount(), 'Incorrect display\'s creating before updating');

         disp = iv._createDefaultDisplay(data, cfg);
         assert.equal(data.length, disp.getCount(), 'Incorrect display\'s creating by method _createDefaultDisplay');
      });
   })
});