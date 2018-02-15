/**
 * Created by kraynovdo on 15.02.2018.
 */
/**
 * Created by dv.zuev on 17.01.2018.
 * Компонент слушает события "снизу". События register и сохраняет Emmitterы в списке
 * то есть, кто-то снизу сможет услышать события верхних компонентов через это отношение
 */
define('Controls/Layout/Scroll',
   [
      'Core/Control',
      'tmpl!Controls/Layout/Scroll/Scroll',
      'Controls/Event/Registrar',
      'WS.Data/Type/descriptor'
   ],
   function(Control, template, Registrar, types) {

      'use strict';

      var Scroll = Control.extend({
         _template: template,
         _scrollContainer: null,

         _beforeMount: function(){
            this._registrar = new Registrar({register: 'scroll'});
         },


         _scrollHandler: function() {
            this._registrar.start();
         },

         _registerIt: function(event, registerType, component, callback){
            this._registrar.register(event, registerType, component, callback);
         },
         _unRegisterIt: function(event, registerType, component){
            this._registrar.unregister(event, registerType, component, callback);
         },


         _beforeUnmount: function() {
            this._registrar.destroy();
         }



      });

      Scroll.getOptionTypes = function() {
         return {

         };
      };

      return Scroll;
   }
);
