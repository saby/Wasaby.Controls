/**
 * Child control for Two Way Bind demo.
 */
define('WSTest/Hooks/HookTest',
   [
      'SBIS3.CONTROLS/Button',
      'tmpl!WSTest/Hooks/HookTest'
   ],
   function (
      Button,
      template)
   {
      'use strict';

      return Button.extend( {
         _template: template,
         checkHooks: [],

         _beforeMount: function(options, receivedState){
            this.checkHooks.push('beforeMount');
         },

         _afterMount: function () {
            this.checkHooks.push('afterMount');
         },

         _beforeUpdate: function(newOptions){
            this.checkHooks.push('beforeUpdate');
         },

         _shouldUpdate: function(newOptions) {
            this.checkHooks.push('shouldUpdate');
            return true;
         },

         _afterUpdate: function(oldOptions){
            this.checkHooks.push('afterUpdate');
         },

         _beforeUnmount: function(){
            this.checkHooks.push('beforeUnmount');
         },

         myFunc: function (event) {
            this._notify('onChangeChildText', event.target.value);
         }
      });
   });
