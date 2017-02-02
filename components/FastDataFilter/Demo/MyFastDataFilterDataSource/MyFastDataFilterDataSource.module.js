/**
 * Created by ad.chistyakova on 11.09.2015.
 */
define('js!SBIS3.CONTROLS.Demo.MyFastDataFilterDataSource',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.FastDataFilter',
      'js!SBIS3.CONTROLS.Demo.FilterButtonMain',
      'html!SBIS3.CONTROLS.Demo.MyFastDataFilterDataSource',
      'i18n!SBIS3.CONTROLS.Demo.MyFastDataFilter',
      'css!SBIS3.CONTROLS.Demo.MyFastDataFilter',
      'js!SBIS3.CONTROLS.FilterButton',
      'js!SBIS3.CONTROLS.Demo.FilterButtonFilterContent',
      'js!SBIS3.CONTROLS.DataGridView'
   ],

   function(CompoundControl, FastDataFilter, FilterButtonMainDemo, dotTplFn) {
      'use strict';
      var MyFastDataFilter = CompoundControl.extend([],{
         $protected: {
            _dotTplFn: dotTplFn,
            _options: {
               data: [{
                  idProperty : 'key',
                  displayProperty: 'title',
                  name: 'first',
                  multiselect : false,
                  className: 'controls-DropdownList__withoutCross',
                  dataSource: {
                     module: 'js!WS.Data/Source/Memory',
                     options: {
                        data: [{
                           key: 0,
                           title: rk('Заголовок')
                        },{
                           key: 1,
                           title: rk('Один')
                        },{
                           key: 2,
                           title: rk('Два')
                        },{
                           key: 3,
                           title: rk('Три')
                        },{
                           key: 4,
                           title: rk('Четыре')
                        },{
                           key: 5,
                           title: rk('Пять')
                        }]
                     }
                  }
               },{
                  idProperty : 'secondKey',
                  multiselect : true,
                  name: 'second',
                  displayProperty: 'user',
                  dataSource: {
                     module: 'js!WS.Data/Source/Memory',
                     options: {
                        data: [{
                           secondKey: 0,
                           user: rk('Все пользователи')
                        },{
                           secondKey: 1,
                           user: rk('Пушкин')
                        },{
                           secondKey: 2,
                           user: rk('Лермонтов')
                        },{
                           secondKey: 3,
                           user: rk('Толстой')
                        },{
                           secondKey: 4,
                           user: rk('Бродский')
                        }]
                     }
                  }
               },{
                  idProperty: 'key',
                  displayProperty: 'title',
                  name: 'selling',
                  multiselect: false,
                  dataSource: {
                     module: 'js!WS.Data/Source/Memory',
                     options: {
                        data: [{
                           key: 0,
                           title: rk('Не выбрано')
                        },{
                           key: 1,
                           title: rk('Все (для продажи и нет)')
                        },{
                           key: 2,
                           title: rk('Не для продажи')
                        },{
                           key: 3,
                           title: rk('Для продажи')
                        }]
                     }
                  }
               }]
            }
         },
         $constructor: function() {
            var context = this.getLinkedContext();

            context.subscribe('onFieldsChanged', function() {
               var filter = this.getValue('filter'),
                   filterDescr = this.getValue('filterDescr');
               this.setValueSelf('filterJSON', JSON.stringify(filter));
               this.setValueSelf('filterDescrJSON', JSON.stringify(filterDescr));
            });

            context.setValueSelf({
               filter: {
               },
               filterDescr: {
                  NDS: 'Не выбрано'
               }
            });
         },

         init: function () {
            MyFastDataFilter.superclass.init.apply(this, arguments);
            this.getChildControlByName('FastDataFilter').setItems(this._options.data);
            //this.getChildControlById('FilterButtonMain').
            //this.getChildControlByName('FastDataFilter').reload;
         }
      });
      return MyFastDataFilter;
   });
