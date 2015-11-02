/**
 * Created by am.gerasimov on 19.10.2015.
 */
define('js!SBIS3.CONTROLS.Demo.FieldLinkDemoTemplate', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.FieldLinkDemoTemplate',
   'js!SBIS3.CONTROLS.ArrayStrategy',
   'js!SBIS3.CONTROLS.StaticSource',
   'js!SBIS3.CONTROLS.DataGridView',
   'js!SBIS3.CONTROLS.Button'
], function (CompoundControl, dotTplFn, ArrayStrategy, StaticSource) {
   /**
    * SBIS3.CONTROLS.Demo.MySuggestTextBoxDS
    * @class SBIS3.CONTROLS.Demo.MySuggestTextBoxDS
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyDataGridView.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {

         }
      },
      $constructor: function() {
      },

      init: function() {
         moduleClass.superclass.init.call(this);
         var self = this;
         var dataGrid = this.getChildControlByName('Таблица');
         var dataSource = new StaticSource({
            data: [{
               'Ид': 1,
               'Фамилия': 'Иванов',
               'Имя': 'Иваныч',
               'Отчество': 'Иванович',
               'Должность': 'Инженер'
            }, {
               'Ид': 2,
               'Фамилия': 'Иванов',
               'Имя': 'Федор',
               'Отчество': 'Иванович',
               'Должность': 'Директор'
            }, {
               'Ид': 3,
               'Фамилия': 'Иванова',
               'Имя': 'Федора',
               'Отчество': 'Сергеевна',
               'Должность': 'Инженер'
            }, {
               'Ид': 4,
               'Фамилия': 'Петров',
               'Имя': 'Ваня',
               'Отчество': 'Андреевич',
               'Должность': 'Директор'
            }, {
               'Ид': 5,
               'Фамилия': 'Сидоров',
               'Имя': 'Михаил',
               'Отчество': 'Петрович',
               'Должность': 'Карапуз'
            }, {
               'Ид': 6,
               'Фамилия': 'Яковлев',
               'Имя': 'Иван',
               'Отчество': 'Викторович',
               'Должность': 'Директор'
            }, {
               'Ид': 7,
               'Фамилия': 'Арбузнов',
               'Имя': 'Иванко',
               'Отчество': 'Яковлевич',
               'Должность': 'Маркетолог'
            },
               {
                  'Ид': 8,
                  'Фамилия': 'Она',
                  'Имя': 'Онаа',
                  'Отчество': 'Онановна',
                  'Должность': 'Фрезеровщик'
               },
               {
                  'Ид': 9,
                  'Фамилия': 'Он',
                  'Имя': 'Онн',
                  'Отчество': 'Онович',
                  'Должность': 'Сантехник'
               },
               {
                  'Ид': 10,
                  'Фамилия': 'Кто-то',
                  'Имя': 'Кто-тото',
                  'Отчество': 'Кто-тович',
                  'Должность': 'Уборщик'
               },
               {
                  'Ид': 11,
                  'Фамилия': 'Новиков',
                  'Имя': 'Дмитрий',
                  'Отчество': 'Александрович',
                  'Должность': 'Программист'
               },
               {
                  'Ид': 12,
                  'Фамилия': 'Александров',
                  'Имя': 'Александр',
                  'Отчество': 'Александрович',
                  'Должность': 'Программист'
               }
            ],
            keyField: 'Имя',
            strategy: new ArrayStrategy()
         });

         dataGrid.setDataSource(dataSource);
         this.getChildControlByName('SelectButton').subscribe('onActivated', function() {
            self.sendCommand('close', dataGrid.getSelectedKeys());
         })
      }
   });
   return moduleClass;
});
