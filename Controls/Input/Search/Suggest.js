define('Controls/Input/Search/Suggest',
   [
      'Core/Control',
      'wml!Controls/Input/Search/Suggest',
      'Types/entity',
      'Controls/search'
   ],
   function(Control, template, entity) {
      
      'use strict';
   
      /**
       * Search input that suggests options as you are typing.
       *
       * @class Controls/Input/Suggest
       * @extends Controls/input:Text
       * @mixes Controls/interface/ISearch
       * @mixes Controls/interface/ISource
       * @mixes Controls/interface/IFilter
       * @mixes Controls/interface/ISuggest
       * @mixes Controls/interface/INavigation
       * @demo Controls-demo/Input/Search/Suggest/SuggestPG
       * @control
       * @public
       * @category Input
       */
   
   
      var Suggest = Control.extend({
         
         _template: template,
         _suggestState: false,
         _markedKeyChanged: false,
         
         _changeValueHandler: function(event, value) {
            this._notify('valueChanged', [value]);
         },
         
         _choose: function(event, item) {
            this.activate();
            this._notify('choose', [item]);
            this._notify('valueChanged', [item.get(this._options.displayProperty) || '']);
         },
         
         _close: function() {
            /* need clear text on close button click (by standart http://axure.tensor.ru/standarts/v7/строка_поиска__версия_01_.html).
               Notify event only if value is not empty, because event listeners expect, that the value is really changed */
            if (this._options.value) {
               this._notify('valueChanged', ['']);
            }
         },
         
         _beforeUpdate: function(newOptions) {
            if (this._options.suggestState !== newOptions.suggestState) {
               this._suggestState = newOptions.suggestState;
            }
         },
   
         _suggestStateChanged: function(event, value) {
            /**
             * Всплытие будет удалено по задаче.
             * https://online.sbis.ru/opendoc.html?guid=2dbbc7f1-2e81-4a76-89ef-4a30af713fec
             */
            this._notify('suggestStateChanged', [value], {bubbling: true});
         },
   
         _deactivated: function() {
            /**
             * Всплытие будет удалено по задаче.
             * https://online.sbis.ru/opendoc.html?guid=2dbbc7f1-2e81-4a76-89ef-4a30af713fec
             */
            this._suggestState = false;
            this._notify('suggestStateChanged', [false], {bubbling: true});
         },
   
         _suggestMarkedKeyChanged: function(event, key) {
            this._markedKeyChanged = key !== null;
         },
   
         _searchClick: function() {
            /* the search should not fire an event if marked key in suggstions list was changed,
               because enter should activate marked item */
            if (!this._markedKeyChanged) {
               this._notify('searchClick');
            }
         },
         
         _resetClick: function() {
            this._notify('resetClick');
         }
         
      });
   
      Suggest.getOptionTypes = function() {
         return {
            displayProperty: entity.descriptor(String).required(),
            suggestTemplate: entity.descriptor(Object).required(),
            searchParam: entity.descriptor(String).required()
         };
      };
   
      Suggest.getDefaultOptions = function() {
         return {
            minSearchLength: 3,
            suggestState: false
         };
      };
      
      return Suggest;
   }
);
