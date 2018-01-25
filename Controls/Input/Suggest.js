define('Controls/Input/Suggest',
   [
      'Core/Control',
      'tmpl!Controls/Input/Suggest/Suggest',
      'js!WS.Data/Type/descriptor',
      'Controls/Input/resources/SuggestController',
      'Controls/Input/resources/InputRender/SimpleViewModel',
      'Controls/Popup/Opener/Sticky',
      'Controls/Popup/Opener/Stack',
      'css!Controls/Input/Suggest/Suggest'
   ],
   function(Control, template, types, SuggestController, SimpleViewModel) {
      
      /**
       * Поле ввода с автодополнением
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
         onSearchStart: function(self) {
            self._searching = true;
            self._forceUpdate();
         },
         
         onSearchEnd: function(self) {
            self._searching = false;
            self._forceUpdate();
         },
         
         closePopup: function(self) {
            self._children.suggestPopupOpener.close();
         },
         
         needCloseOnFocusOutPopup: function(self, focusedControl) {
            return focusedControl !== self && focusedControl !== self._children.suggestText;
         },
   
         needCloseOnFocusOut: function(self) {
            return !self._popupFocused;
         },
         
         onFocusOutHandler: function(self) {
            _private.closePopup(self);
            //FIXME Для правильной работы валидации. костыль. сейчас событие focusOut стреляет, когда фокус уходит на саггест,
            //из-за этого некорректно запускается валидация.
            self._notify('componentFocusOut');
         }
      };
      
      var Suggest = Control.extend({
         
         _template: template,
         _controlName: 'Controls/Input/Suggest',
         _popupFocused: false,
         
         // <editor-fold desc="LifeCycle">
         
         constructor: function(options) {
            Suggest.superclass.constructor.call(this, options);
            this._selectHandler = this._selectHandler.bind(this);
            this._popupFocusIn = this._popupFocusIn.bind(this);
            this._popupFocusOut = this._popupFocusOut.bind(this);
            this._simpleViewModel = new SimpleViewModel();
         },
         
         _afterMount: function() {
            this._suggestController = new SuggestController({
               suggestTemplate: this._options.suggestTemplate,
               suggestOpener: this._children.suggestPopupOpener,
               showAllOpener: this._children.showAllOpener,
               dataSource: this._options.dataSource,
               filter: this._options.filter,
               minSearchLength: this._options.minSearchLength,
               searchDelay: this._options.searchDelay,
               searchParam: this._options.searchParam,
               navigation: this._options.navigation,
               textComponent: this._children.suggestText,
               selectCallback: this._selectHandler,
               searchStartCallback: _private.onSearchStart.bind(this, this),
               searchEndCallback: _private.onSearchEnd.bind(this, this)
            });
         },
         
         destroy: function() {
            if (this._suggestController) {
               this._suggestController.destroy();
               this._suggestController = null;
            }
            Suggest.superclass.destroy.call(this);
         },
         
         // </editor-fold>
         
         
         // <editor-fold desc="handlers">
         
         _changeValueHandler: function(event, value) {
            this._suggestController.setValue(value);
            this._notify('valueChanged', [value]);
         },
         
         _selectHandler: function(item) {
            this._notify('select', [item]);
            this._notify('valueChanged', [item.get(this._options.displayProperty)]);
         },
         
         _clearClick: function() {
            this._notify('valueChanged', '');
         },
         
         _keyDownHandler: function(event) {
            this._suggestController.keyDown(event);
         },
   
         _popupFocusIn: function() {
            this._popupFocused = true;
         },
   
         _popupFocusOut: function(focusObj) {
            this._popupFocused = false;
            
            /* close, if focus moved outside */
            if (_private.needCloseOnFocusOutPopup(this, focusObj.to)) {
               _private.onFocusOutHandler(this);
            }
         },
         
         _focusOut: function() {
            var self = this;
            
            /* best way to check focus, because focusOut event is fired first. */
            requestAnimationFrame(function() {
               /* close, if focus moved not to popup */
               if (_private.needCloseOnFocusOut(self)) {
                  _private.onFocusOutHandler(self);
               }
            });
         }
         
         // </editor-fold>
         
      });
      
      
      // <editor-fold desc="OptionsDesc">
      Suggest.getOptionTypes = function() {
         return {
            searchDelay: types(Number),
            minSearchLength: types(Number),
            filter: types(Object),
            searchParam: types(String).required(),
            displayProperty: types(String).required()
         };
      };
      
      Suggest.getDefaultOptions = function() {
         return {
            searchDelay: 500,
            minSearchLength: 3
         };
      };
      // </editor-fold>
   
      Suggest._private = _private;
      return Suggest;
   }
);