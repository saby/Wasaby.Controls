define('js!SBIS3.CONTROLS.FilterPanelItem', [
   "Core/Context",
   "js!SBIS3.CONTROLS.CompoundControl",
   "tmpl!SBIS3.CONTROLS.FilterPanelItem"
], function (cContext, CompoundControl, dotTplFn) {
   /**
    * Миксин, задающий любому контролу поведение работы с набором фильтров.
    * Сейчас применяется для конфигурации фильтров на Панели фильтров (см. {@link SBIS3.CONTROLS.FilterPanel}).
    * @mixin SBIS3.CONTROLS.FilterPanelItem
    * @public
    * @author Авраменко Алексей Сергеевич
    */

   var
      CONTEXT_ITEM_FIELD = 'sbis3-controls-filter-item',
      ITEM_FILTER_ID = 'id',
      ITEM_FILTER_VALUE = 'value',
      ITEM_FILTER_TEXT_VALUE = 'textValue',

      FilterPanelItem = CompoundControl.extend(/**@lends SBIS3.CONTROLS.FilterPanelItem.prototype  */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            /**
             * @cfg {WS.Data/Entity/Record} Запись, описывающая конфигурацию фильтр.
             * @remark
             * Пример полей для записи, которая определяется миксином, описан в {@link SBIS3.CONTROLS.FilterPanel/FilterPanelItem.typedef}.
             */
            item: null
         }
      },

      $constructor: function() {
         this._prepareFilterContext();
      },

      _prepareFilterContext: function() {
         var
            ctx = this.getLinkedContext();
         ctx.subscribe('onFieldNameResolution', function (event, fieldName) {
            var
               item,
               path = fieldName.split(cContext.STRUCTURE_SEPARATOR);
            if (path[0] !== CONTEXT_ITEM_FIELD) {
               item = this.getValue(CONTEXT_ITEM_FIELD);
               if (item.get(ITEM_FILTER_ID) && (fieldName === ITEM_FILTER_VALUE || fieldName === ITEM_FILTER_TEXT_VALUE)) {
                  event.setResult(CONTEXT_ITEM_FIELD  + cContext.STRUCTURE_SEPARATOR + fieldName);
               }
            }
         });
         ctx.setValue(CONTEXT_ITEM_FIELD, this._options.item);
      }
   });

   return FilterPanelItem;

});