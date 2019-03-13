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
            this._scales = [
               10,
               10,
               10,
               10,
               10,
               10,
               10,
               5,
               5,
               5,
               5,
               6,
               7,
               ]
            this._datas = [
               [{value: 0, className: '', title: ''}],               
               [{value: 3, className: '', title: ''}],
               [{value: 53, className: '', title: ''}],
               [{value: 100, className: '', title: ''}],

               [{value: 0, className: '', title: ''}, 
                  {value: 30, className: '', title: ''}],

               [{value: 20, className: '', title: ''},
                  {value: 80, className: '', title: ''}],

               [{value: 40, className: '', title: ''},
                  {value: 12, className: '', title: ''}],

               [{value: 35, className: '', title: ''},
                  {value: 40, className: '', title: ''}],

               [{value: 30, className: '', title: ''},
                  {value: 70, className: '', title: ''}],

               [{value: 10, className: '', title: ''},
                  {value: 30, className: '', title: ''},
                  {value: 50, className: '', title: ''}], 

               [{value: 25, className: '', title: ''},
                  {value: 25, className: '', title: ''},
                  {value: 25, className: '', title: ''}], 

               [{value: 34, className: '', title: ''},
                  {value: 33, className: '', title: ''},
                  {value: 33, className: '', title: ''}], 

               [{value: 20, className: '', title: ''},
                  {value: 30, className: '', title: ''},
                  {value: 3, className: '', title: ''},
                  {value: 47, className: 'controls-StateIndicator__emptySector', title: ''}],
            ];
         },
         _mouseLeaveHandler: function(){
             this._notify('closeInfoBox', [], {bubbling: true});
         },
         _mouseEnterHandler: function(e, _item){
         	var config = {
              target: _item,
              position: 'tl',
              template: popupTemplate,
              templateOptions: {data: this._datas[_item.parentElement.parentElement.getAttribute("index")]}
         	};
         	this._notify('openInfoBox', [config], {bubbling: true});
         }
      });
   return Index;
});
