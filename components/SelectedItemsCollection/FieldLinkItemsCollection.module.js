/**
 * Created by am.gerasimov on 06.10.2015.
 */
define('js!SBIS3.CONTROLS.FieldLinkItemsCollection', [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.DSMixin',
      'html!SBIS3.CONTROLS.FieldLinkItemsCollection/itemTpl'
   ],
   function(CompoundControl, DSMixin, itemTpl) {

      'use strict';

      /**
       * Контрол, отображающий набор элементов с крестиком удаления.
       * @class SBIS3.CONTROLS.FieldLinkItemsCollection
       * @extends SBIS3.CORE.CompoundControl
       */

      var FieldLinkItemsCollection =  CompoundControl.extend([DSMixin], {
         $protected: {
            _options: {
               /**
                * Шаблон отображения элемента
                */
               itemTemplate: itemTpl,
               /**
                * Отображаемое поле для записи
                */
               displayField: 'title'
            }
         },

         $constructor: function() {
            this._publish('onCrossClick', 'onDrawItem')
         },


         init: function() {
            FieldLinkItemsCollection.superclass.init.apply(this, arguments);
            /* Проинициализируем DataSet */
            this.reload();

            this._container.bind('mouseup', this._crossClickHandler.bind(this));
         },
         /**
          * Отрисовывает элемент коллекции
          * @param item
          * @private
          */

         _buildTplArgs: function(item) {
            return {
               item: item,
               displayField: this._options.displayField
            }
         },


         _getItemTemplate: function() {
            return this._options.itemTemplate;
         },

         _appendItemTemplate:function(item, targetContainer, itemInstance) {
            var res = this._notify('onDrawItem', itemInstance);

            if(res !== false) {
               FieldLinkItemsCollection.superclass._appendItemTemplate.apply(this, arguments);
            }
         },


         /**
          * Обработчик клика на крестик
          * @param e
          * @private
          */
         _crossClickHandler: function(e) {
            var $target = $(e.target),
               itemContainer;

            if ($target.hasClass('controls-FieldLink__linkItem-cross')) {
               itemContainer = $(e.target).closest('.controls-ListView__item');

               if (itemContainer.length) {
                  this._notify('onCrossClick', itemContainer.data('id'));
               }
            }
         }
      });

      return FieldLinkItemsCollection;

   });
