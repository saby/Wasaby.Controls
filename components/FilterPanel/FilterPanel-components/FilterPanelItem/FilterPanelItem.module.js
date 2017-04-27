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

      // Правильно подписываться в контексте и устанавливать в него значение через modifyOptions, а не конструктор, т.к. контруктор срабатывает поздно, уже после шаблонизатора
      _modifyOptions: function() {
         var
            cfg = FilterPanelItem.superclass._modifyOptions.apply(this, arguments);
         this._prepareFilterContext(cfg);
         return cfg;
      },

      _prepareFilterContext: function(cfg) {
         var
            ctx = cfg.context;
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
         ctx.setValue(CONTEXT_ITEM_FIELD, cfg.item);
      }
   });

   return FilterPanelItem;

});