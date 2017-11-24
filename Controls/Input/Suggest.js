define('js!Controls/Input/Suggest',
   [
      'js!Controls/Input/Text',
      'tmpl!Controls/Input/Suggest/afterFieldWrapper',
      'Core/Deferred',
      'Core/moduleStubs',
      'Core/core-merge',
      'js!WS.Data/Type/descriptor',
      'js!Controls/List/resources/utils/DataSourceUtil'
   ],
   function(Text, afterFieldWrapper, Deferred, mStubs, cMerge, types, DataSourceUtil) {
   
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
       * @name Controls/Input/Suggest#withoutCross
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
   
      function getSearchController() {
         var self = this;
         return mStubs.require('js!Controls/Input/Suggest/PopupSearchController').addCallback(function(res) {
            if (!self._searchController) {
               self._searchController = new res[0]({
                  dataSource: self._dataSource,
                  searchParam: self._searchParam,
                  searchDelay: self._searchDelay,
                  filter: self._filter,
                  popupTemplate: self._suggestTemplateName,
                  popupOpener: self
               });
            }
            return self._searchController;
         });
      }
      
      function search(textValue) {
         this._searching = true; //show loading Indicator
         getSearchController.call(this).addCallback(function(searchController) {
            searchController.search(textValue);
            return searchController;
         });
      }
      
      function abortSearch() {
         this._searching = false; //hide loading Indicator
         getSearchController.call(this).addCallback(function(searchController) {
            searchController.abort();
            return searchController;
         });
      }
      
      function onChangeValueHandler(event, text) {
         if (text.length >= this._options.searchStartCharacter) {
            search.call(this, text)
         } else {
            abortSearch.call(this);
         }
      }
      
      var Suggest = Text.extend({
         
         _controlName: 'Controls/Input/Suggest',
         _afterFieldWrapper: afterFieldWrapper,
   
         // <editor-fold desc="handlers">
         
         _clearTextClick: function(event) {
            this._inputHandler(event, '');
         },
         
         // </editor-fold>
   
         // <editor-fold desc="LifeCycle">
         
         constructor: function(cfg) {
            Suggest.superclass.constructor.call(this, cfg);
            
            this._dataSource = DataSourceUtil.prepareSource(cfg.dataSource);
            this._searchParam = cfg.searchParam;
            this._searchDelay = cfg.searchDelay;
            this._filter = cfg.filter;
            this._suggestTemplateName = cfg.suggestTemplateName;
            
            this.subscribe('onChangeValue', onChangeValueHandler.bind(this));
         },
   
         _beforeUnmount: function() {
            abortSearch.call(this);
            this._search = null;
            Suggest.superclass._beforeUnmount.call(this);
         }
         
         // </editor-fold>
         
      });
   
   
      // <editor-fold desc="OptionsDesc">
      var origOptionTypes = Suggest.getOptionTypes;
      Suggest.getOptionTypes = function() {
         return cMerge(origOptionTypes(), {
            searchDelay: types(Number),
            searchStartCharacter: types(Number),
            showEmptySuggest: types(Boolean),
            filter: types(Object),
            searchParam: types(String)
         });
      };
   
      var origDefaultOptions = Suggest.getDefaultOptions;
      Suggest.getDefaultOptions = function() {
         return cMerge(origDefaultOptions(), {
            searchDelay: 500,
            searchStartCharacter: 3,
            showEmptySuggest: true
         });
      };
      // </editor-fold>
      
      return Suggest;
   }
);