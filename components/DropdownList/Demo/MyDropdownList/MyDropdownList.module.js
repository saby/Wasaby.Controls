/**
 * Created by ad.chistyakova on 11.09.2015.
 */
define('js!SBIS3.CONTROLS.Demo.MyDropdownList',
      [
         'js!SBIS3.CORE.CompoundControl',
         'js!SBIS3.CONTROLS.DropdownList',
         'html!SBIS3.CONTROLS.Demo.MyDropdownList',
         'html!SBIS3.CONTROLS.Demo.MyDropdownList/MyDropdownListItem',
         'i18n!SBIS3.CONTROLS.Demo.MyDropdownList',
         'css!SBIS3.CONTROLS.Demo.MyDropdownList',
         'html!SBIS3.CONTROLS.Demo.MyDropdownList/MyDropdownList_IconHead',
         'html!SBIS3.CONTROLS.Demo.MyDropdownList/MyDropdownList_IconItem'
      ],

      function(CompoundControl, DropdownList, dotTplFn, itemTpl, rk) {
         'use strict';
         var MyDropdownList = CompoundControl.extend([],{
            $protected: {
               _dotTplFn: dotTplFn,
               _options: {
                  firstTemplate: itemTpl,
                  data: [
                     {
                        key : 0,
                        title : rk('Заголовок'),
                        icon: 'icon-16 icon-Admin icon-primary'
                     },
                     {
                        key : 1,
                        title : rk('Один'),
                        icon: 'icon-16 icon-Archive icon-primary'
                     },
                     {
                        key : 2,
                        title : rk('Два'),
                        icon: 'icon-16 icon-Bell icon-primary'
                     },
                     {
                        key : 3,
                        title : rk('Три'),
                        icon: 'icon-16 icon-Bold icon-primary'
                     },
                     {
                        key : 4,
                        title : rk('Четыре'),
                        icon: 'icon-16 icon-Check icon-primary'
                     },
                     {
                        key : 5,
                        title : rk('Пять'),
                        icon: 'icon-16 icon-Colorize icon-primary'
                     }
                  ]
               }
            },
            $constructor: function(){
            },
            init: function () {
               var context = this.getLinkedContext();

               context.subscribe('onFieldsChanged', function() {
                  var
                        filter = this.getValue('filter');
                  this.setValueSelf('filterJSON', JSON.stringify(filter));
                  //this.setValueSelf('filterDescrJSON', JSON.stringify(filterDescr));
               });
               this.getContext().setValue('filter', {});
               MyDropdownList.superclass.init.apply(this, arguments);
               this.getChildControlByName('DropdownList1').setItems(this._options.data);
               this.getChildControlByName('DropdownList2').setItems(this._options.data);
               this.getChildControlByName('DropdownList3').setItems(this._options.data);
               this.getChildControlByName('DropdownList4').setItems(this._options.data);
//               this.getChildControlByName('DropdownList5').setItems(this._options.data);
//               this.getChildControlByName('DropdownList6').setItems(this._options.data);
               this.getChildControlByName('DropdownList7').setItems(this._options.data);
            }
         });
         return MyDropdownList;
      });
