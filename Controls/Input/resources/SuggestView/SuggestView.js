define('Controls/Input/resources/SuggestView/SuggestView',
   [
      'Core/Control',
      'tmpl!Controls/Input/resources/SuggestView/SuggestView',
      'Core/moduleStubs',
      'css!Controls/Input/resources/SuggestView/SuggestView'
   ], function(Control, template, moduleStubs) {
      
      'use strict';
      
      var _private = {
         getMarkedKey: function(items, idProperty, index) {
            var item = items && items.at(index || 0);
            return item ? item.get(idProperty) : null;
         },
         
         getOptionsForShowAll: function(self) {
            return {
               templateOptions: {
                  filter: self._options.filter
               }
            };
         }
      };
      
      var SuggestView = Control.extend({
         _template: template,
         
         constructor: function(opt) {
            SuggestView.superclass.constructor.call(this, opt);
            this._markedKey =  _private.getMarkedKey(opt.items, opt.idProperty, opt.selectedIndex);
         },
         
         _onItemClickHandler: function(event, item) {
            this._notify('sendResult', [item], {bubbling: true});
            this._notify('close', [], {bubbling: true});
         },
         
         _showAllClick: function() {
            var self = this;
            
            //loading showAll templates
            moduleStubs.require(['Controls/Input/resources/SuggestShowAll/SuggestShowAll', 'Controls/Popup/Templates/Dialog/DialogTemplate']).addCallback(function(res) {
               self._options.showAllOpener.open(_private.getOptionsForShowAll(self));
               return res;
            });
            this._notify('close', [], {bubbling: true});
         },
         
         _beforeUpdate: function(newOptions) {
            SuggestView.superclass._beforeUpdate.call(this, newOptions);
            this._markedKey =  _private.getMarkedKey(newOptions.items, newOptions.idProperty, newOptions.selectedIndex);
         }
      });
      
      SuggestView._private = _private;
      return SuggestView;
   });
