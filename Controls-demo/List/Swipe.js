/**
 * Created by kraynovdo on 31.01.2018.
 */
define('Controls-demo/List/Swipe', [
   'Core/Control',
   'tmpl!Controls-demo/List/Swipe/Swipe',
   'WS.Data/Source/Memory',
   'WS.Data/Collection/RecordSet',
   'css!Controls-demo/List/Swipe/Swipe'
], function(BaseControl,
   template,
   MemorySource,
   RecordSet

) {
   'use strict';
   var showType = {

      //show only in Menu
      MENU: 0,

      //show in Menu and Toolbar
      MENU_TOOLBAR: 1,

      //show only in Toolbar
      TOOLBAR: 2
   };
   
   var srcData = [
         {
            id: 1
         },
         {
            id: 2
         },
         {
            id: 3
         }
      ],
      _actionsArrays = {
         1: [
            {
               id: 1,
               title: 'one actions without image',
               showType: showType.TOOLBAR,
               handler: function(item) {
                  console.log('one phone Click ', item);
               }
            }
         ],
         2: [
            {
               id: 1,
               icon: 'icon-primary icon-PhoneNull',
               title: 'phone',
               showType: showType.MENU_TOOLBAR,
               handler: function(item) {
                  console.log('action phone Click ', item);
               }
            },
            {
               id: 2,
               showType: showType.MENU_TOOLBAR,
               icon: 'icon-primary icon-EmptyMessage',
               title: 'message',
               handler: function() {
                  alert('Message Click');
               }
            }
         ],
         3: [
            {
               id: 1,
               icon: 'icon-primary icon-PhoneNull',
               title: 'phone',
               showType: showType.MENU_TOOLBAR,
               handler: function(item) {
                  console.log('action phone Click ', item);
               }
            },
            {
               id: 2,
               icon: 'icon-primary icon-EmptyMessage',
               title: 'message',
               showType: showType.MENU_TOOLBAR,
               handler: function() {
                  alert('Message Click');
               }
            },
            {
               id: 3,
               icon: 'icon-primary icon-Profile',
               title: 'profile',
               showType: showType.MENU_TOOLBAR,
               handler: function() {
                  console.log('action profile Click');
               }
            }
         ],
         4: [
            {
               id: 1,
               icon: 'icon-primary icon-PhoneNull',
               title: 'phone',
               handler: function(item) {
                  console.log('action phone Click ', item);
               }
            },
            {
               id: 2,
               icon: 'icon-primary icon-EmptyMessage',
               title: 'message',
               handler: function() {
                  alert('Message Click');
               }
            },
            {
               id: 3,
               icon: 'icon-primary icon-Profile',
               title: 'profile',
               showType: showType.MENU_TOOLBAR,
               handler: function() {
                  console.log('action profile Click');
               }
            },
            {
               id: 4,
               icon: 'icon-Erase',
               iconStyle: 'error',
               title: 'delete pls',
               showType: showType.TOOLBAR,
               handler: function() {
                  console.log('action delete Click');
               }
            }
         ],
         5: [
            {
               id: 5,
               title: 'прочитано',
               icon: 'icon-primary icon-CbPlus',
               showType: showType.TOOLBAR,
               handler: function() {
                  console.log('action read Click');
               }
            },
            {
               id: 1,
               icon: 'icon-primary icon-PhoneNull',
               title: 'phone',
               handler: function(item) {
                  console.log('action phone Click ', item);
               }
            },
            {
               id: 2,
               icon: 'icon-primary icon-EmptyMessage',
               title: 'message',
               handler: function() {
                  alert('Message Click');
               }
            },
            {
               id: 3,
               icon: 'icon-primary icon-Profile',
               title: 'profile',
               showType: showType.MENU_TOOLBAR,
               handler: function() {
                  console.log('action profile Click');
               }
            },
            {
               id: 4,
               icon: 'icon-Erase',
               iconStyle: 'error',
               title: 'delete pls',
               showType: showType.TOOLBAR,
               handler: function() {
                  console.log('action delete Click');
               }
            }
         ],
         6: [

            {
               id: 1,
               icon: 'icon-primary icon-PhoneNull',
               title: 'phone',
               handler: function(item) {
                  console.log('action phone Click ', item);
               }
            },
            {
               id: 2,
               icon: 'icon-primary icon-EmptyMessage',
               title: 'message',
               handler: function() {
                  alert('Message Click');
               }
            },
            {
               id: 3,
               icon: 'icon-primary icon-Profile',
               title: 'profile',
               showType: showType.MENU_TOOLBAR,
               handler: function() {
                  console.log('action profile Click');
               }
            },
            {
               id: 4,
               icon: 'icon-Erase',
               iconStyle: 'error',
               title: 'delete pls',
               handler: function() {
                  console.log('action delete Click');
               }
            }, {
               id: 5,
               title: 'прочитано',
               icon: 'icon-primary icon-CbPlus',
               showType: showType.TOOLBAR,
               handler: function() {
                  console.log('action read Click');
               }
            },
         
            {
               id: 6,
               icon: 'icon-Lightning icon-error',
               title: 'шестая кнопочка',
               showType: showType.TOOLBAR,
               handler: function() {
                  console.log('action delete Click');
               }
            }
         ],
         7: [

            {
               id: 1,
               icon: 'icon-primary icon-PhoneNull',
               title: 'phone',
               handler: function(item) {
                  console.log('action phone Click ', item);
               }
            },
            {
               id: 2,
               title: 'messagemessagemessagemessagemessagemessage',
               handler: function() {
                  alert('Message Click');
               }
            },
            {
               id: 3,
               icon: 'icon-primary icon-Profile',
               title: 'profile',
               handler: function() {
                  console.log('action profile Click');
               }
            },
            {
               id: 4,
               icon: 'icon-Erase',
               iconStyle: 'error',
               title: 'delete pls',
               handler: function() {
                  console.log('action delete Click');
               }
            },
      
            {
               id: 5,
               icon: 'icon-Lightning icon-error',
               title: 'шестая кнопочка',
               showType: showType.TOOLBAR,
               handler: function() {
                  console.log('action delete Click');
               }
            }, {
               id: 6,
               title: 'прочитано',

               showType: showType.TOOLBAR,
               handler: function() {
                  console.log('action read Click');
               }
            },
         
            {
               id: 7,
               icon: 'icon-Pack icon-error',
               title: 'Седьмая кнопочка',
               showType: showType.TOOLBAR,
               handler: function() {
                  console.log('action delete Click');
               }
            }
         ],
         8: [

            {
               id: 1,
               icon: 'icon-primary icon-PhoneNull',
               title: 'phone',
               handler: function(item) {
                  console.log('action phone Click ', item);
               }
            },
            {
               id: 2,
               icon: 'icon-primary icon-EmptyMessage',
               title: 'message',
               handler: function() {
                  alert('Message Click');
               }
            },
            {
               id: 3,
               icon: 'icon-primary icon-Profile',
               title: 'profile',
               handler: function() {
                  console.log('action profile Click');
               }
            },
            {
               id: 4,
               icon: 'icon-Erase',
               iconStyle: 'error',
               title: 'delete pls',
               handler: function() {
                  console.log('action delete Click');
               }
            }, {
               id: 5,
               title: 'прочитано',
               icon: 'icon-primary icon-CbPlus',
               handler: function() {
                  console.log('action read Click');
               }
            },
            
            {
               id: 6,
               icon: 'icon-Lightning icon-error',
               title: 'шестая кнопочка',
               showType: showType.TOOLBAR,
               handler: function() {
                  console.log('action delete Click');
               }
            },
            {
               id: 7,
               title: '777 кнопочка',
               showType: showType.TOOLBAR,
               handler: function() {
                  console.log('action delete Click');
               }
            },
            {
               id: 8,
               icon: 'icon-PhoneGetManually icon-error',
               title: '8888я кнопочка',
               showType: showType.TOOLBAR,
               handler: function() {
                  console.log('action delete Click');
               }
            }
         ]
      };

   var ModuleClass = BaseControl.extend(
      {
         _actions: [1, 2, 3, 4, 5, 6, 7, 8],
         _heightS: [37, 38, 44, 52, 72, 73, 75, 85, 92, 107, 108, 109, 110, 120, 133, 134, 157, 158, 169, 170, 181, 182, 184, 223, 224, 263, 264, 303, 304, 350, 400, 500, 600 ],
         _height: 37,
         _itemActions: _actionsArrays[5],
         _template: template,
         _onActionClick: function(event, action, item) {
            console.log(arguments);
         },
         _contentClick: function() {
            console.log(arguments);
         },

         constructor: function() {
            ModuleClass.superclass.constructor.apply(this, arguments);

            //this._onActClick = this._onActClick.bind(this);
            this._viewSource = new MemorySource({
               idProperty: 'id',
               data: srcData
            });

         },
         _onHeightClick: function(event, height) {
            this._height = height;
            this._forceUpdate();
         },
         _onActClick: function(event, act) {
            this._itemActions = _actionsArrays[act];
         }
      });
   return ModuleClass;
});
