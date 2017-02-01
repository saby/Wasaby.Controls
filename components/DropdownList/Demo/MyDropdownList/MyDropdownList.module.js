/**
 * Created by ad.chistyakova on 11.09.2015.
 */
define('js!SBIS3.CONTROLS.Demo.MyDropdownList',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.DropdownList',
      'html!SBIS3.CONTROLS.Demo.MyDropdownList',
      'html!SBIS3.CONTROLS.Demo.MyDropdownList/resources/MyDropdownListItem',
      'Core/core-functions',
      'js!WS.Data/Types/Enum',
      'i18n!SBIS3.CONTROLS.Demo.MyDropdownList',
      'css!SBIS3.CONTROLS.Demo.MyDropdownList',
      'html!SBIS3.CONTROLS.Demo.MyDropdownList/resources/MyDropdownListIconHead',
      'html!SBIS3.CONTROLS.Demo.MyDropdownList/resources/MyDropdownListIconItem'
   ],
   function(CompoundControl, DropdownList, dotTplFn, itemTpl, cFunctions, Enum) {
      'use strict';
      var MyDropdownList = CompoundControl.extend([], {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               firstTemplate: itemTpl,
               data: [{
                  key : 0,
                  title : rk('Заголовок'),
                  icon: 'icon-16 icon-Admin icon-primary'
               },{
                  key : 1,
                  title : rk('Один'),
                  icon: 'icon-16 icon-Archive icon-primary'
               },{
                  key : 2,
                  title : rk('Два'),
                  icon: 'icon-16 icon-Bell icon-primary'
               },{
                  key : 3,
                  title : rk('Три'),
                  icon: 'icon-16 icon-Bold icon-primary'
               },{
                  key : 4,
                  title : rk('Четыре'),
                  icon: 'icon-16 icon-Check icon-primary'
               },{
                  key : "5",
                  title : rk('Пять'),
                  icon: 'icon-16 icon-Colorize icon-primary'
               }]
            }
         },

         $constructor: function(){
         },

         init: function () {
            var context = this.getLinkedContext();

            context.subscribe('onFieldsChanged', function() {
               var filter = this.getValue('filter');
               this.setValueSelf('filterJSON', JSON.stringify(filter));
               //this.setValueSelf('filterDescrJSON', JSON.stringify(filterDescr));
            });
            this.getContext().setValue('filter', {});
            MyDropdownList.superclass.init.apply(this, arguments);
            this.getChildControlByName('DropdownList1').setItems(this._options.data);
            this.getChildControlByName('DropdownList2').setItems(this._options.data);
            this.getChildControlByName('DropdownList3').setItems(this._getDataForHierarchy());
            this.getChildControlByName('DropdownList4').setItems(this._options.data);
            this.getChildControlByName('DropdownList5').setItems(this._getBigData());
            this.getChildControlByName('DropdownList6').setItems(this._options.data);
            this.getChildControlByName('DropdownList7').setItems(this._options.data);
            this.getChildControlByName('DropdownList8').setItems(this._getEnumData());
         },

         _getBigData: function() {
            var data = cFunctions.clone(this._options.data);
            for (var i = 6; i < 100; i++) {
               data.push({
                  key : i,
                  title : 'Текст' + i,
                  icon: 'icon-16 icon-Colorize icon-primary'
               })
            }
            return data;
         },

         _getDataForHierarchy: function() {
            var data = cFunctions.clone(this._options.data);
            data.splice(3, 0, {
                  key: 21,
                  title: rk('п.1'),
                  icon: 'icon-16 icon-Bell icon-primary',
                  parent: 2
               },{
                  key: 22,
                  title: rk('п.2'),
                  icon: 'icon-16 icon-Bell icon-primary',
                  parent: 2
               }
            );
            data.splice(6, 0, {
                  key: 31,
                  title: rk('п.100'),
                  icon: 'icon-16 icon-Bell icon-primary',
                  parent: 3
               }
            );
            return data;
         },
         _getEnumData: function () {
            return new Enum({
               dictionary: ['Enum 1', 'Enum 2', 'Enum 3', 'Enum 4'],
               index: 2
            });
         }
      });
      return MyDropdownList;
   }
);
