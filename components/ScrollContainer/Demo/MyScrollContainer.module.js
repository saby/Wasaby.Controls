define('js!SBIS3.CONTROLS.Demo.MyScrollContainer',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.MyScrollContainer',
      'js!WS.Data/Source/Memory',
      'js!SBIS3.CONTROLS.ScrollContainer',
      'js!SBIS3.CONTROLS.ListView',
      'css!SBIS3.CONTROLS.Demo.MyScrollContainer'
   ],
   function(CompoundControl, dotTplFn, MemorySource) {

      'use strict';

      /**
       * SBIS3.CONTROLS.Demo.MyScrollContainer
       * @class SBIS3.CONTROLS.Demo.MyScrollContainer
       * @extends SBIS3.CONTROLS.CompoundControl
       * @control
       */
      var MyScrollContainer = CompoundControl.extend({

         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               listConfig: {
                  infiniteScroll: 'down',
                  pageSize: 10
               }
            }
         },

         init: function() {
            MyScrollContainer.superclass.init.call(this);

            var
               items = [],
               source;

            for (var i = 1; i < 51; i++) {
               items.push({
                  id: i,
                  title: 'Элемент листа №' + i
               });
            }

            source = new MemorySource({
               data: items,
               idProperty: 'id'
            });

            this.getChildControlByName('listView').setDataSource(source);
         }
      });

      return MyScrollContainer;
   }

);