/**
 * Created by am.gerasimov on 27.11.2017.
 */
define('Controls/Input/resources/SuggestController',
   [
      'Core/Abstract',
      'Core/moduleStubs',
      'Core/core-clone'
   ], function(Abstract, moduleStubs, cClone) {
   
      'use strict';
   
      var _private = {
         searchStart: function(self) {
            if (self._options.searchStartCallback) {
               self._options.searchStartCallback();
            }
         },
      
         searchEnd: function(self) {
            if (self._options.searchEndCallback) {
               self._options.searchEndCallback();
            }
         },

         /**
       * Search and show popup
       * @param self
       */
         showPopup: function(self) {
            _private.searchStart(self);
            _private.getSuggestPopupController(self).addCallback(function(suggestPopupController) {
               suggestPopupController.setSearchFilter(_private.getSearchFilter(self));
               suggestPopupController.setPopupOptions(_private.getPopupOptions(self));
               suggestPopupController.showPopup().addBoth(function(res) {
                  _private.searchEnd(self);
                  return res;
               });
               return suggestPopupController;
            });
         },
   
         /**
       * Abort search
       * @param self
       */
         hidePopup: function(self) {
            _private.getSuggestPopupController(self).addCallback(function(suggestPopupController) {
               suggestPopupController.hidePopup();
               _private.searchEnd(self);
               return suggestPopupController;
            });
         },
      
         getSearchFilter: function(self) {
            var filter = cClone(self._options.filter || {});
            filter[self._options.searchParam] = self._value;
            return filter;
         },
      
         needShowPopup: function(self) {
            return self._value.length >= self._options.minSearchLength;
         },
      
         onChangeValueHandler: function(self) {
            if (_private.needShowPopup(self)) {
               _private.showPopup(self);
            } else {
               _private.hidePopup(self);
            }
         },
      
         getPopupOptions: function(self) {
            var container = self._options.textComponent._container;
            return {
               target: container,
               componentOptions: {
                  width: container.offsetWidth,
                  template: self._options.suggestTemplate,
                  source: self._options.source,
                  showAllOpener: self._options.showAllOpener,
                  filter: _private.getSearchFilter(self, self._value),
                  emptyTemplate: self._options.emptyTemplate
               }
            };
         },
   
         getSuggestPopupController: function(self) {
         /* loading SuggestPopupController and preloading suggest template */
            return moduleStubs.require(['Controls/Input/resources/SuggestPopupController', self._options.suggestTemplate]).addCallback(function(result) {
               if (!self._suggestPopupController) {
                  self._suggestPopupController = new result[0]({
                     source: self._options.source,
                     searchDelay: self._options.searchDelay,
                     popupOpener: self._options.suggestOpener,
                     navigation: self._options.navigation,
                     selectCallback: self._options.selectCallback,
                     searchParam: self._options.searchParam,
                     emptyTemplate: self._options.emptyTemplate
                  });
               }
               return self._suggestPopupController;
            });
         },
      
         destroy: function(self) {
            if (self._suggestPopupController) {
               self._suggestPopupController.hidePopup();
               self._suggestPopupController = null;
            }
         }
      };
   
      var SuggestController = Abstract.extend({
      
         _value: '',
      
         constructor: function(options) {
            SuggestController.superclass.constructor.call(this, options);
            this._options = options;
         },
      
         search: function(searchValue) {
            this._value = searchValue;
            _private.onChangeValueHandler(this);
         },
         
         setEmptyTemplate: function(emptyTemplate) {
            this._options.emptyTemplate = emptyTemplate;
            if (this._suggestPopupController) {
               this._suggestPopupController.setEmptyTemplate(emptyTemplate);
            }
         },
      
         abort: function() {
            _private.hidePopup(this);
         },
      
         keyDown: function(event) {
            if (this._suggestPopupController) {
               this._suggestPopupController.keyDown(event);
            }
         },
      
         destroy: function() {
            _private.destroy(this);
            SuggestController.superclass.destroy.call(this);
         },
   
         _moduleName: 'Controls/Input/resources/SuggestController'
      });
   
      /** For test **/
      SuggestController._private = _private;
   
      return SuggestController;
   
   });
