/**
 * Created by am.gerasimov on 25.12.2017.
 */
define('js!Controls/Input/resources/SuggestShowAll/SuggestShowAll',
   [
      'Core/Control',
      'tmpl!Controls/Input/resources/SuggestShowAll/SuggestShowAll',
      'css!Controls/Input/resources/SuggestShowAll/SuggestShowAll'
   ], function(Control, template) {
      
      'use strict';
      
      var SuggestShowAll = Control.extend({
         _template: template,
         
         _onItemClickHandler: function(event, item) {
            this._notify('sendResult', item);
            this._notify('close');
         }
      });
      
      return SuggestShowAll;
   });