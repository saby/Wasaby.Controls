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
      
      var _private = {
         openPopup: function(self, opener, options) {
            opener.open({
               target: options.target,
               template: 'Controls/Container/Suggest/__PopupContent',
               opener: self,
               templateOptions: {
                  target: options.target,
                  filter: options.filter,
                  searchValue: options.searchValue,
                  content: options.content,
                  showContent: options.showContent
               }
            });
         }
      };
      
      var __PopupLayer = Control.extend({
         
         _template: template,
         
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
         }
         
      });
      
      return __PopupLayer;
   });

