/**
 * Created by dv.zuev on 18.01.2018.
 */
/**
 * Created by dv.zuev on 17.01.2018.
 *
 * Вставляем в tmpl:
 * <Controls:Container:EventCatcher:Controller event="scroll" on:scroll="myScrollCallback()" />
 */
define('js!Controls/Container/EventCatcher/Controller',
   [
      'Core/Control',
      'js!WS.Data/Type/descriptor'
   ],
   function(Control, types) {

      'use strict';

      var EventCatcherController = Control.extend({
         _listner: null,
         _afterMount: function(){
            this._notify("register", [this._options.event, this, this.callback], {bubbling:true});
         },
         _beforeUnmount: function(){
            this._notify("unregister", [this._options.event, this], {bubbling:true});
         },
         callback: function(){
            this._notify(this._options.event, arguments);
         }
      });

      EventCatcherController.getOptionTypes = function() {
         return {
            event: types(String).required()
         };
      };

      return EventCatcherController;
   }
);
