/**
 * Created by ad.chistyakova on 11.09.2015.
 */
define('js!SBIS3.CONTROLS.Demo.MyDropdownList',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.DropdownList',
      'js!SBIS3.CONTROLS.Demo.FilterButtonMain',
      'html!SBIS3.CONTROLS.Demo.MyDropdownList',
      'js!SBIS3.CONTROLS.DataGridView',
      'css!SBIS3.CONTROLS.Demo.MyDropdownList'
   ],

   function(CompoundControl, DropdownList, FilterButtonMainDemo, dotTplFn) {
      'use strict';
      var MyDropdownList = CompoundControl.extend([],{
         $protected: {
            _dotTplFn: dotTplFn,
            _options: {
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
            this.getChildControlByName('DropdownList').setItems(this._options.data);
         }
      });
      return MyDropdownList;
   });
