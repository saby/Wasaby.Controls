define('js!Controls/Input/Suggest',
   [
      'Core/Control',
      'js!Controls/Input/Text',
      'tmpl!Controls/Input/Suggest',
      'Core/core-merge',
      'js!WS.Data/Type/descriptor',
      'js!Controls/Input/resources/SuggestController'
   ],
   function(Control, Text, template, cMerge, types, SuggestController) {
   
      /**
       * Поле ввода с автодополнением
       * @class Controls/Input/Suggest
       * @extends Controls/Input/Text
       * @mixes Controls/interface/IDataSource
       * @mixes Controls/Input/interface/ISearch
       * @control
       * @public
       * @category Input
       */
      /**
       * @name Controls/Input/Suggest#clerable
       * @cfg {Boolean} Скрыть крестик удаления значения
       */
      /**
       * @name Controls/Input/Suggest#suggestTemplateName
       * @cfg {String} Имя шаблона списка
       */
      /**
       * @name Controls/Input/Suggest#showEmptySuggest
       * @cfg {Boolean} Показывать ли выпадающий блок, при пустом списке
       */
      /**
       * @name Controls/Input/Suggest#searchParam
       * @cfg {string} Устанавливает имя параметра, который будет передан при вызове метода БЛ
       */
      /**
       * @name Controls/Input/Suggest#filter
       * @cfg {Object} Настройки фильтра
       */
   
      'use strict';
      
      var Suggest = Control.extend({
   
         _template: template,
         _controlName: 'Controls/Input/Suggest',
         // <editor-fold desc="handlers">
         
         _clearValue: function() {
            this._value = '';
         },
         
         _changeValueHandler: function(event, value) {
            this._value = value;
         },
         
         // </editor-fold>
   
         // <editor-fold desc="LifeCycle">
         
         constructor: function(cfg) {
            this._value = cfg.value;
            Suggest.superclass.constructor.call(this, cfg);
         },
   
         _afterMount: function() {
            var suggestController = new SuggestController({
               suggestTemplate: this._options.suggestTemplate,
               dataSource: this._options.dataSource,
               searchDelay: this._options.searchDelay,
               filter: this._options.filter,
               minSearchLength: this._options.minSearchLength,
               searchParam: this._options.searchParam,
               textComponent: this._childControls[0]
            });
   
            this.once('onDestroy', function() {
               suggestController.destroy();
            });
         },
   
         _beforeUpdate: function(newOptions) {
            this._value = newOptions.value;
         }
         
         // </editor-fold>
         
      });
   
   
      // <editor-fold desc="OptionsDesc">
      var textOptionTypes = Text.getOptionTypes;
      Suggest.getOptionTypes = function() {
         return cMerge(textOptionTypes(), {
            searchDelay: types(Number),
            minSearchLength: types(Number),
            filter: types(Object),
            searchParam: types(String),
            clearable: types(Boolean)
         });
      };
   
      var textDefaultOptions = Text.getDefaultOptions;
      Suggest.getDefaultOptions = function() {
         return cMerge(textDefaultOptions(), {
            searchDelay: 500,
            minSearchLength: 3,
            clearable: true
         });
      };
      // </editor-fold>
      
      return Suggest;
   }
);