/**
 * Created by am.gerasimov on 18.04.2018.
 */
define('Controls/Container/Suggest/List',
   [
      'Core/Control',
      'tmpl!Controls/Container/Suggest/List/List',
      'Core/core-clone',
      'Controls/Container/List'
   ],
   
   function(Control, template, clone) {
      
      /**
       * Container for list inside Suggest.
       *
       * @class Controls/Container/Suggest/List
       * @extends Core/Control
       * @author Герасимов Александр
       * @control
       * @public
       */
      
      'use strict';
      
      var List = Control.extend({
         
         _template: template,
         
         _beforeMount: function(options) {
            if (options.dialogMode) {
               var navigation = clone(options.navigation);
               navigation.view = 'infinity';
               this._navigation = navigation;
            } else {
               this._navigation = options.navigation;
            }
         }
         
      });
      
      return List;
   });

