define('Controls/Selector/Tree/ItemAction',
   ['Controls/Utils/Toolbar'],
   
   function(Toolbar) {
      
      'use strict';
      
      return  {
         action: {
            id: 'selector.action',
            title: 'Выбрать',
            showType: Toolbar.showType.TOOLBAR,
            handler: function selectorActionHandler(item) {
               this._notify('selectorActionClick', [item], {bubbling: true});
            }
         },
   
         visibilityCallback: function(selectionType, nodeProperty) {
            return function selectorActionVisibilityCallback(action, item) {
               return item.get(nodeProperty);
            };
         }
      };
   });
