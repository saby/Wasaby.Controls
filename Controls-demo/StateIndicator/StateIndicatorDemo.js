define('Controls-demo/StateIndicator/StateIndicatorDemo', [
   'Core/Control',
   'wml!Controls-demo/StateIndicator/StateIndicatorDemo', 
   'wml!Controls-demo/StateIndicator/template/template',   
   'css!Controls-demo/StateIndicator/StateIndicatorDemo',
], function(Control, template, popupTemplate) {
   'use strict';


   function parseData(str){
      return JSON.parse(str);
   };
   function StringToNumArray(str) {
      return str.split(',').map(Number);
   };

   function StringToStrArray(str) {
      return str.split(',').map(String);
   };

   var Index = Control.extend(
      {
         _template: template,
         _popupTemplate: popupTemplate,
         _popupTemplateOptions: {},
         _item:'',
         _eventName: 'no event',
         _data: [],
         _valueStr: '',
         _value: [],
         _scale: 10,
         _titlesStr: '',
         _titles: [],
         _colorsStr: '',
         _colors: [],

         _beforeMount: function() {            
            this._data = [
               {value: 25, className: '', title: 'Выполнено'},
               {value: 36, className: '', title: 'В работе'},
               {value: 2, className: '', title: 'Не выполнено'}
            ];
            this._value = [25, 36, 2];
            this._valueStr = this._value.toString();
            this._colors = ['', '', ''];
            this._colorsStr = this._colors.toString();
            this._titles = ['Выполнено', 'В работе', 'Не выполнено'];
            this._titlesStr = this._titles.toString();
            this._popupTemplateOptions = {data: this._data};
         },
         changeScale: function(e, scale){
            this._scale = scale;
            this._eventName = 'ScaleChanged';
         },

         changeValues: function(e, state) {
            this._value = StringToNumArray(state);
            this._valueStr = this._value.toString();
            this._eventName = 'StateChanged';
            this._data = this._data.slice();
            for (var i = 0; i < this._value.length; i++){
               if (this._data[i] == undefined){
                  this._data.push({value: this._value[i], className:'', title: ''})
               }
               else{
                  this._data[i].value = this._value[i];
               }
            };

         },

         changeTitles: function(e, titles) {
            this._titles = StringToStrArray(titles);
            this._titlesStr = this._titles.toString();
            this._eventName = 'TitlesChanged';
            this._data = this._data.slice();
            for (var i = 0; i < this._titles.length; i++){
               if (this._data[i] == undefined){
                  this._data.push({value:0, className:'', title: this._titles[i]})
               }
               else{
                  this._data[i].title = this._titles[i];
               }
            };

         },

         changeColors: function(e, colors) {
            this._colors = StringToStrArray(colors);
            this._colorsStr = this._colors.toString();
            this._eventName = 'ColorsChanged';
            this._data = this._data.slice();
            for (var i = 0; i < this._colors.length; i++){
               if (this._data[i] == undefined){
                  this._data.push({value: 0, className: this._colors[i], title: ''})
               }
               else{
                  this._data[i].className = this._colors[i];
               }
            };
         },

         reset: function() {
            this._eventName = 'no event';
         },
         
         _mouseLeaveHandler: function(e){
            var t=e.nativeEvent.relatedTarget.classList.contains('legend');
            if (!t)
            this._notify('closeInfoBox', [], {bubbling: true});
         },
         _mouseEnterHandler: function(e, _item){ 
            var config = {
               className: 'legend',
               trigger: 'click',
               target: _item,
               position: 'tl',
               template: popupTemplate,
               templateOptions: {data: this._data}
            };
            this._notify('openInfoBox', [config], {bubbling: true});
         }

      });

   


   return Index;
});
