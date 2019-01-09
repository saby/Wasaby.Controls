/**
 * Created by am.gerasimov on 18.04.2018.
 */
define('Controls/Container/Suggest/__PopupLayer',
   [
      'Core/Control',
      'wml!Controls/Container/Suggest/__PopupLayer',
      'css!Controls/Container/Suggest/PopupLayer'
   ],

   function(Control, template) {

      'use strict';

      var POPUP_CLASS_NAME = 'controls-Suggest__suggestionsContainer_popup';

      var _private = {
         openPopup: function(self, opener, options) {
            opener.open({
               target: options.target,
               template: 'Controls/Container/Suggest/__PopupContent',
               opener: self,
               revertPositionStyle: true, // https://online.sbis.ru/opendoc.html?guid=9a71628a-26ae-4527-a52b-2ebf146b4ecd
               templateOptions: {
                  target: options.target,
                  filter: options.filter,
                  searchValue: options.searchValue,
                  content: options.content,
                  showContent: options.showContent
               }
            });
         },

         getPopupClassName: function(verAlign) {
            return POPUP_CLASS_NAME + '_' + verAlign;
         },

         setPopupOptions: function(self) {
            self._popupOptions = {
               autofocus: false,
               className: _private.getPopupClassName('bottom'),
               verticalAlign: {
                  side: 'bottom'
               },
               corner: {
                  vertical: 'bottom'
               },
               eventHandlers: {
                  onResult: self._onResult
               }
            };
         }
      };

      var __PopupLayer = Control.extend({

         _template: template,

         _beforeMount: function() {
            this._onResult = this._onResult.bind(this);
            _private.setPopupOptions(this);
         },

         _afterMount: function(options) {
            _private.openPopup(this, this._children.suggestPopup, options);
         },

         _afterUpdate: function(oldOptions) {
            if (this._options.searchValue !== oldOptions.searchValue ||
                this._options.filter !== oldOptions.filter ||
                this._options.showContent !== oldOptions.showContent ||
                this._options.showFooter !== oldOptions.showFooter ||
                this._options.misspellingCaption !== oldOptions.misspellingCaption) {
               _private.openPopup(this, this._children.suggestPopup, this._options);
            }
         },

         _onResult: function(position) {
            //fix suggest position after show
            this._popupOptions.verticalAlign = position.verticalAlign;
            this._popupOptions.horizontalAlign = position.horizontalAlign;
            this._popupOptions.corner = position.corner;
            this._popupOptions.className = _private.getPopupClassName(position.verticalAlign.side);
            this._popupOptions.locationStrategy = 'fixed';
         }

      });

      __PopupLayer._private = _private;

      return __PopupLayer;
   });

