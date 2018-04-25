define('SBIS3.CONTROLS/Filter/Panel/components/PanelItem', [
   'Core/Context',
   'SBIS3.CONTROLS/CompoundControl',
   'tmpl!SBIS3.CONTROLS/Filter/Panel/components/PanelItem/FilterPanelItem',
   'tmpl!SBIS3.CONTROLS/Filter/Panel/components/PanelItem/resources/FilterPanelItemSpoilerRightPartTitleTemplate',
   'SBIS3.CONTROLS/Button/IconButton',
   'css!SBIS3.CONTROLS/Filter/Panel/resources/FilterPanelButton'
], function (cContext, CompoundControl, dotTplFn) {
   /**
    * Миксин, задающий любому контролу поведение работы с набором фильтров.
    * Сейчас применяется для конфигурации фильтров на Панели фильтров (см. {@link SBIS3.CONTROLS/Filter/FilterPanel}).
    * @mixin SBIS3.CONTROLS/Filter/Panel/components/PanelItem
    * @public
    * @author Авраменко А.С.
    */

   var
      CONTEXT_ITEM_FIELD = 'sbis3-controls-filter-item',
      ITEM_FILTER_ID = 'id',
      ITEM_FILTER_VALUE = 'value',
      ITEM_FILTER_TEXT_VALUE = 'textValue',

      FilterPanelItem = CompoundControl.extend(/**@lends SBIS3.CONTROLS/Filter/Panel/components/PanelItem.prototype  */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            /**
             * @cfg {WS.Data/Entity/Record} Запись, описывающая конфигурацию фильтр.
             * @remark
             * Пример полей для записи, которая определяется миксином, описан в {@link SBIS3/CONTROLS/Filter/FilterPanel/typedefs/FilterPanelItem/}.
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

      init: function() {
         FilterPanelItem.superclass.init.apply(this, arguments);
         if (this._options.item.get('template') !== 'SBIS3.CONTROLS/Filter/Panel/components/Boolean') {
            // Называем компонент именно по ID, т.к. в дальнейшем ID может быть использован для определения конкретного фильтра
            this.getChildControlByName(this._options.item.getId()).subscribe('onExpandedChange', this._onExpandedChange.bind(this));
         }
      },

      _onExpandedChange: function(event, expanded) {
         this._options.item.set('expanded', expanded);
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
      },

      destroy: function() {
         this.getContext().contextDeferred.callback();
         FilterPanelItem.superclass.destroy.apply(this, arguments);
      }
   });

   return FilterPanelItem;

});