define([
   'Controls/_itemActions/Utils'
], function(
   SwipeUtils
) {
   describe('Controls.List.Swipe.SwipeUtils', function()
   {
      it('getActualActions', function(){
         let actions = [
            {
               id: 1,
               icon: 'icon-PhoneNull'
            },
            {
               id: 2,
               icon: 'icon-Erase'
            },
            {
               id: 3,
               icon: 'icon-EmptyMessage',
               parent: 1
            },
            {
               id: 4,
               icon: 'icon-PhoneNull',
               parent: 1
            },
            {
               id: 5,
               icon: 'icon-Erase',
               showType: 2
            },
            {
               id: 6,
               icon: 'icon-EmptyMessage',
               showType: 0
            }
         ];
         let actual = [
            {
               id: 5,
               icon: 'icon-Erase',
               showType: 2
            },
            {
               id: 1,
               icon: 'icon-PhoneNull'
            },
            {
               id: 2,
               icon: 'icon-Erase'
            },
            {
               id: 6,
               icon: 'icon-EmptyMessage',
               showType: 0
            }
         ];
         let result = SwipeUtils.getActualActions(actions);
         assert.deepEqual(actual, result);
      });
   });
});
