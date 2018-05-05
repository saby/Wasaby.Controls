define('Controls/Input/Suggest',
   [
      'Core/Control',
      'tmpl!Controls/Input/Suggest/Suggest',
      'tmpl!Controls/Input/resources/Suggest/empty',
      'tmpl!Controls/Input/resources/Suggest/footer',
      'WS.Data/Type/descriptor',
      'Controls/Input/resources/InputRender/BaseViewModel',
      'Controls/Container/Search/SearchContextField',
      'Controls/Container/Filter/FilterContextField',
      'css!Controls/Input/Suggest/Suggest',
      'Controls/Popup/Opener/Stack',
      'Controls/Container/Search'
   ],
   function(Control, template, emptyTemplate, footerTemplate, types, BaseViewModel, SearchContextField, FilterContextField) {
      
      /**
       * Input that suggests options as you are typing.
       *
       * @class Controls/Input/Suggest
       * @extends Controls/Input/Text
       * @mixes Controls/Input/interface/ISearch
       * @mixes Controls/interface/ISource
       * @mixes Controls/interface/IFilter
       * @mixes Controls/Input/interface/ISuggest
       * @mixes Controls/interface/INavigation
       * @control
       * @public
       * @category Input
       */
      
      'use strict';
      
      var _private = {
         initViewModel: function(self, options) {
            self._simpleViewModel = new BaseViewModel({
               value: options.value
            });
         }
      };
      
      var Suggest = Control.extend({
         
         _template: template,
         
         //context value
         _searchMode: false,
         _searchResult: null,
         
         // <editor-fold desc="LifeCycle">
         
         constructor: function(options) {
            Suggest.superclass.constructor.call(this, options);
            
            this._searchResult = {};
            this._searchStart = this._searchStart.bind(this);
            this._searchEnd = this._searchEnd.bind(this);
            
            _private.initViewModel(this, options || {});
         },
         
         _beforeUpdate: function(newOptions) {
            this._simpleViewModel.updateOptions({
               value: newOptions.value
            });
         },
   
         _getChildContext: function() {
            return {
               searchLayoutField: new SearchContextField(this._searchValue),
               filterLayoutField: new FilterContextField({})
            };
         },
         
         // </editor-fold>
         
         
         // <editor-fold desc="handlers">
         
         _changeValueHandler: function(event, value) {
            this._isOpen = this._active && value.length >= this._options.minSearchLength;
            this._searchValue = value;
            this._select = this._select.bind(this);
            this._notify('valueChanged', [value]);
         },
         
         _deactivated: function() {
            this._isOpen = false;
         },
         
         _select: function(event, item) {
            item = item || event;
            
            /* move focus to input after select, because focus will be lost after closing popup  */
            this.activate();
            this._isOpen = false;
            this._notify('choose', [item]);
            this._notify('valueChanged', [item.get(this._options.displayProperty)]);
         },
         
         _clearClick: function() {
            /* move focus to input after clear text, because focus will be lost after hiding cross  */
            this.activate();
            this._isOpen = false;
            this._notify('valueChanged', ['']);
         },
   
         _searchStart: function() {
            if (!this._searching) {
               this._searching = true;
               this._forceUpdate();
            }
         },
   
         _searchEnd: function(result) {
            this._searching = false;
            this._searchResult = result || {};
            
            if ((!result || !result.data.getCount()) && !this._options.emptyTemplate) {
               this._isOpen = false;
            }
            
            this._forceUpdate();
         },
   
         _showAllClick: function() {
            var self = this;
   
            //loading showAll templates
            requirejs(['Controls/Input/resources/Suggest/Dialog'], function() {
               self._children.stackOpener.open({});
            });
            this._isOpen = false;
         },
         
         /* По стандарту все выпадающие списки закрываются при скроле.
          Мы не можем понять, что вызвало изменение положения элемента, ресайз или скролл,
          поэтому при ресайзе тоже закрываем.
          + у опенера сейчас отсутствует возможность обновить popup,
          кроме как вызвать его показ ещё раз */
         _resize: function(syntheticEvent, event) {
            /* событие resize могут вызывать компоненты при изменении своего размера,
             но нам интересен только resize у window, поэтому проверяем */
            if (event.target === window) {
               _private.closePopup(this);
            }
         }
         
         // </editor-fold>
         
      });
      
      
      // <editor-fold desc="OptionsDesc">
      Suggest.getOptionTypes = function() {
         return {
            displayProperty: types(String).required(),
            suggestTemplate: types(Array).required()
         };
      };
   
      Suggest.getDefaultOptions = function() {
         return {
            emptyTemplate: emptyTemplate,
            footerTemplate: footerTemplate
         };
      };
      
      // </editor-fold>
      
      Suggest._private = _private;
      return Suggest;
   }
);
