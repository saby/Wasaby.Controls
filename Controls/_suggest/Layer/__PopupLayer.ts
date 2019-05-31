/**
 * Created by am.gerasimov on 18.04.2018.
 */

import Control = require('Core/Control');
import template = require('wml!Controls/_suggest/Layer/__PopupLayer');
import templateContent from './__PopupContent';
import {detection} from 'Env/Env';
import getZIndex = require('Controls/Utils/getZIndex');
import 'css!theme?Controls/suggest';

var POPUP_CLASS_NAME = 'controls-Suggest__suggestionsContainer_popup';

var _private = {
   openPopup: function(self, opener, options) {
      opener.open({
         target: options.target,
         template: templateContent,
         opener: self,
         actionOnScroll: detection.isMobileIOS ? 'none' : 'close',
         zIndex: getZIndex(self), // _vdomOnOldPage для слоя совместимости, уйдёт с удалением опции.
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
      this._popupOptions.fittingMode = 'fixed';
   }

});

__PopupLayer._private = _private;

export default __PopupLayer;
