define('Controls-demo/StateIndicator/StandartStateIndicatorDemo', [
   'Core/Control',
   'wml!Controls-demo/StateIndicator/StandartStateIndicatorDemo',
   'wml!Controls-demo/StateIndicator/template/template',    
   'css!Controls-demo/StateIndicator/StandartStateIndicatorDemo',
], function(Control, template, popupTemplate) {
   'use strict';
   var Index = Control.extend(
      {
         _template: template,
         _states: null,

         constructor: function(){
            Index.superclass.constructor.apply(this,arguments);
            this._states = [
               [0],
               [3],
               [53],
               [100],
               [0,30],
               [20,80],
               [40,12],
               [35,40],
               [30,70],
               [10,0,50],
               [25,25,25],
               [34,33,33],
               [20,30,3,47]
            ];
         },

         _mouseHandler: function(e, _item, _data){
         	var config = {
              target: _item,
              message: _data,
              position: 'tl',
              template: popupTemplate,
              templateOptions: {state: this._states[_item.parentElement.parentElement.getAttribute("index")], data: _data}
         	};
         	this._notify('openInfoBox', [config], {bubbling: true});
         }
      });
   return Index;
});
