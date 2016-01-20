define('js!SBIS3.CONTROLS.SuggestList', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.DataBindMixin',
   'js!SBIS3.CONTROLS.DSMixin',
   'js!SBIS3.CONTROLS.Selectable',
   'html!SBIS3.CONTROLS.SuggestList'
], function (CompoundControl, DataBindMixin, DSMixin, Selectable, dotTplFn) {
   'use strict';

   /**
    * Простой список для автодополнения
    * @class SBIS3.CONTROLS.SuggestList
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS.DataBindMixin
    * @mixes SBIS3.CONTROLS.DSMixin
    * @mixes SBIS3.CONTROLS.Selectable
    * @control
    * @author Алексей Мальцев
    */
   var SuggestList = CompoundControl.extend([DataBindMixin, DSMixin, Selectable], /** @lends SBIS3.CONTROLS.SuggestList.prototype */{
      $protected: {
         _dotTplFn: dotTplFn,

         _options: {
            /**
             * @cfg {String} Сообщение об отсутствии данных
             * <wiTag group="Данные">
             * Текст сообщения, отображающиегося вместо результатов поиска в случае отсутсвия совпадений
             * @translatable
             */
            emptyMessage: 'Не найдено',

            /**
             * @cfg {Array} Поля записей, отображаемые в списке
             * <wiTag group="Данные">
             * Название полей записи, выводимых в списке через запятую.
             * <pre>
             *    itemFields: ['ФИО', 'Должность']
             * </pre>
             * @group Data
             */
            itemFields: [],

            /**
             * @cfg {String} Шаблон отображения каждого элемента коллекции
             * @example
             * <pre>
             *     <option name="itemTemplate">
             *         <div data-key="{{=it.item.getKey()}}" class="controls-SuggestList__item js-controls-SuggestList__item">
             *             {{=it.displayField}}
             *         </div>
             *     </option>
             * </pre>
             * @TextMultiline
             */
            itemTemplate: ''
         }
      },

      _onClickHandler: function (e) {
         this.setSelectedKey(
            $(e.target)
               .closest('.controls-SuggestList__item')
               .attr('data-id')
         );
      },

      _getItemsContainer: function () {
         if (this._itemsContainer === undefined) {
            this._itemsContainer = this._container.find('.controls-SuggestList__itemsContainer');
         }

         return this._itemsContainer;
      },

      _drawItems: function (records) {
         SuggestList.superclass._drawItems.apply(this, arguments);

         if (!records || !records.length) {
            this._getItemsContainer().append(
               $('<div/>')
                  .addClass('controls-SuggestList__empty')
                  .html(this._options.emptyMessage)
            );
         }
      },

      _drawItemsCallback: function () {
         this._drawSelectedItem(this._options.selectedIndex);
      },

      _addItemAttributes: function (container) {
         SuggestList.superclass._addItemAttributes.apply(this, arguments);

         container
            .addClass('controls-SuggestList__item')
            .addClass('js-controls-SuggestList__item');
      },

      _getItemTemplate: function (item) {
         var
            filter = this.getFilter();
         if (this._options.itemTemplate) {
            return doT.template(this._options.itemTemplate)({
               item: item,
               filter: filter
            });
         } else {
            var filterValues = [];
            if (this._options.itemFields.length) {
               for (var fieldIndex = 0; fieldIndex < this._options.itemFields.length; fieldIndex++) {
                  filterValues.push(
                     item.get(this._options.itemFields[fieldIndex])
                  );
               }
            } else {
               for (var field in filter) {
                  if (filter.hasOwnProperty(field)) {
                     filterValues.push(
                        item.get(field)
                     );
                  }
               }
            }

            return '<div>' + filterValues.join(', ') + '</div>';
         }
      },

      _drawSelectedItem: function (key) {
         this._getItemsContainer()
            .find('.controls-SuggestList__item__selected')
            .removeClass('controls-SuggestList__item__selected');

         if (key !== undefined && key !== null) {
            this._getItemsContainer()
               .find('.controls-SuggestList__item[data-id="' + key + '"]')
               .addClass('controls-SuggestList__item__selected');
         }

      },

      reload: function () {
         this._getItemsContainer().find('.controls-SuggestList__empty').remove();

         return SuggestList.superclass.reload.apply(this, arguments);
      },

      //TODO: заглушка
      /**
       * @noShow
       * @returns {$ws.proto.Deferred}
       */
      reviveComponents: function () {
         return $ws.proto.Deferred.success();
      }
   });

   return SuggestList;
});
