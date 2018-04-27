/**
 * Created by kraynovdo on 31.01.2018.
 */
define('Controls-demo/List/ItemActions', [
   'Core/Control',
   'tmpl!Controls-demo/List/ItemActions/ItemActions',
   'WS.Data/Source/Memory',
   'WS.Data/Collection/RecordSet',
   'css!Controls-demo/List/ItemActions/ItemActions'
], function(BaseControl,
   template,
   MemorySource,
   RecordSet

) {
   'use strict';

   var srcData = [
         {
            id: 1,
            title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1',
            description: 'Другое название 1'
         },
         {
            id: 2,
            title: 'Notebooks 2',
            description: 'Описание вот такое'
         },
         {
            id: 3,
            title: 'Smartphones 3 ',
            description: 'Хватит страдать'

         }
      ],
      _firstItemActionsArray = [
         {
            id: 5,
            title: 'прочитано',
            additional: true,
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
            main: true,
            handler: function() {
               console.log('action profile Click');
            }
         },
         {
            id: 4,
            icon: 'icon-Erase icon-error',
            title: 'delete pls',
            additional: true,
            handler: function() {
               console.log('action delete Click');
            }
         }
      ];

   var ModuleClass = BaseControl.extend(
      {
         __lastClicked: false,
         _showAction: function(action, item) {
            if (item.get('id') === 2) {
               if (action.id === 2 || action.id === 3) {
                  return false;
               } else {
                  return true;
               }

            }
            if (action.id === 5) {
               return false;
            }
            if (item.get('id') === 4) {
               return false;
            }

            return true;
         },
         _itemActions: _firstItemActionsArray,
         _template: template,
         _onActionClick: function(event, action, item) {
            console.log(arguments);
            this.__lastClicked = action.title;
         },
         _contentClick: function() {
            console.log(arguments);
         },

         constructor: function() {
            ModuleClass.superclass.constructor.apply(this, arguments);
            var
               srcMore = [];
            for (var i = 0; i < 7; i++) {
               srcMore.push({
                  id: i,
                  title: 'number #' + i,
                  description: 'пожалейте разрабочиков ' + i
               });
            }
            this._viewSource = new MemorySource({
               keyProperty: 'id',
               data: srcData
            });
            this._viewSource2 = new MemorySource({
               keyProperty: 'id',
               data: srcMore
            });
         },
         changeSource: function() {
            var
               srcMore = [];
            for (var i = 0; i < 4; i++) {
               srcMore.push({
                  id: i,
                  title: 'Новые ресурсы №' + i,
                  description: 'в цикле задаю я ' + i
               });
            }
            this._viewSource = new MemorySource({
               keyProperty: 'id',
               data: srcMore
            });
         }
      });
   return ModuleClass;
});
