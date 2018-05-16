define('Controls/Input/Suggest',
   [
      'Core/Control',
      'tmpl!Controls/Input/Suggest/Suggest',
      'WS.Data/Type/descriptor',
      'Controls/Input/resources/SuggestController',
      'Controls/Input/resources/InputRender/BaseViewModel',
      'Controls/Popup/Opener/Sticky',
      'Controls/Popup/Opener/Stack',
      'css!Controls/Input/Suggest/Suggest'
   ],
   function(Control, template, types, SuggestController, BaseViewModel) {
      
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
            self._suggestController.abort();

            //FIXME Для правильной работы валидации. костыль. сейчас событие focusOut стреляет, когда фокус уходит на саггест,
            //из-за этого некорректно запускается валидация.
            self._notify('componentFocusOut');
         },
         
         bindHandlers: function(self) {
            self._selectHandler = self._selectHandler.bind(self);
            self._popupFocusIn = self._popupFocusIn.bind(self);
            self._popupFocusOut = self._popupFocusOut.bind(self);
            self._popupClose = self._popupClose.bind(self);
         },
         
         initViewModel: function(self, options) {
            self._simpleViewModel = new BaseViewModel({
               value: options.value
            });
         },
         
         initSuggestController: function(self, options) {
            self._suggestController = new SuggestController({
               suggestOpener: self._children.suggestPopupOpener,
               showAllOpener: self._children.showAllOpener,
               textComponent: self._children.suggestText,
               
               suggestTemplate: options.suggestTemplate,
               emptyTemplate: options.emptyTemplate,
               source: options.source,
               filter: options.filter,
               minSearchLength: options.minSearchLength,
               searchDelay: options.searchDelay,
               searchParam: options.searchParam,
               navigation: options.navigation,
               
               selectCallback: self._selectHandler,
               searchStartCallback: _private.onSearchStart.bind(self, self),
               searchEndCallback: _private.onSearchEnd.bind(self, self)
            });
         }
      };
      
      var Suggest = Control.extend({
         
         _template: template,
         _popupFocused: false,
         
         // <editor-fold desc="LifeCycle">
         
         constructor: function(options) {
            Suggest.superclass.constructor.call(this, options);
            
            _private.bindHandlers(this);
            _private.initViewModel(this, options || {});
         },
   
         _afterMount: function() {
            _private.initSuggestController(this, this._options);
         },

         _beforeUpdate: function(newOptions) {
            this._simpleViewModel.updateOptions({
               value: newOptions.value
            });
            if (newOptions.emptyTemplate !== this._options.emptyTemplate && this._suggestController) {
               this._suggestController.setEmptyTemplate(newOptions.emptyTemplate);
            }
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
            this._suggestController.search(value);
            this._notify('valueChanged', [value]);
         },
         
         _selectHandler: function(item) {
            /* move focus to input after select, because focus will be lost after closing popup  */
            this.activate();
            this._notify('choose', [item]);
            this._notify('valueChanged', [item.get(this._options.displayProperty)]);
         },
         
         _clearClick: function() {
            /* move focus to input after clear text, because focus will be lost after hiding cross  */
            this.activate();
            this._suggestController.search('');
            this._notify('valueChanged', ['']);
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
   
         _popupClose: function() {
            /* FIXME До решения ошибок по фокусам https://online.sbis.ru/opendoc.html?guid=85911eb8-a6e7-4a0d-b454-c3e3a6d10acc */
            this._popupFocused = false;
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
