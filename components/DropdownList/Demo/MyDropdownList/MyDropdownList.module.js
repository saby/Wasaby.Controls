/**
 * Created by ad.chistyakova on 11.09.2015.
 */
define('js!SBIS3.CONTROLS.Demo.MyDropdownList',
      [
         'js!SBIS3.CORE.CompoundControl',
         'js!SBIS3.CONTROLS.DropdownList',
         'html!SBIS3.CONTROLS.Demo.MyDropdownList',
         'html!SBIS3.CONTROLS.Demo.MyDropdownList/MyDropdownListItem',
         'css!SBIS3.CONTROLS.Demo.MyDropdownList'
      ],

      function(CompoundControl, DropdownList, dotTplFn, dotHeadTemplate) {
         'use strict';
         var MyDropdownList = CompoundControl.extend([],{
            $protected: {
               _dotTplFn: dotTplFn,
               _options: {
                  firstTemplate: dotHeadTemplate,
                  data: [
                     {
                        key : 0,
                        title : 'Заголовок'
                     },
                     {
                        key : 1,
                        title : 'Один'
                     },
                     {
                        key : 2,
                        title : 'Два'
                     },
                     {
                        key : 3,
                        title : 'Три'
                     },
                     {
                        key : 4,
                        title : 'Четыре'
                     },
                     {
                        key : 5,
                        title : 'Пять'
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
            }
         });
         return MyDropdownList;
      });
