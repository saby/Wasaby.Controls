/**
 * Created by am.gerasimov on 13.04.2018.
 */
/**
 * Created by am.gerasimov on 13.12.2017.
 */
define('Controls-demo/Suggest/resources/SuggestTemplate', [
   'Core/Control',
   'wml!Controls-demo/Suggest/resources/SuggestTemplate',
   'Controls/list'
], function(Control, template) {
   
   'use strict';
   
   return Control.extend({
      _template: template,
      _itemActions: null,
      _beforeMount: function () {

         this._itemActions = [
            {
               id: 1,
               icon: 'icon-PhoneNull',
               title: 'phone'
            },
            {
               id: 2,
               icon: 'icon-EmptyMessage',
               title: 'message',
               parent: null,
               'parent@': true
            },
            {
               id: 6,
               title: 'call',
               parent: 2,
               'parent@': null
            },
            {
               id: 4,
               icon: 'icon-Erase',
               iconStyle: 'danger',
               title: 'delete pls',
               showType: 2
            }
         ];

      }
   });
   
});