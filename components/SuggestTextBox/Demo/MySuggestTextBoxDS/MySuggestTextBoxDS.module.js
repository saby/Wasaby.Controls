define('js!SBIS3.CONTROLS.Demo.MySuggestTextBoxDS', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.MySuggestTextBox',
   'css!SBIS3.CONTROLS.Demo.MySuggestTextBox',
   'js!SBIS3.CONTROLS.SuggestTextBox',
   'js!SBIS3.CONTROLS.Data.Source.Memory'
], function (CompoundControl, dotTplFn, cssFn, SuggestTextBox, StaticSource) {
   /**
    * SBIS3.CONTROLS.Demo.MySuggestTextBoxDS
    * @class SBIS3.CONTROLS.Demo.MySuggestTextBoxDS
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MySuggestTextBoxDS.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {}
      },
      $constructor: function () {
      },

      init: function () {
         moduleClass.superclass.init.call(this);

         this.getChildControlByName('TextBoxLastName').getList().addCallback(function (list) {
            var dataSource = new StaticSource({
               data: [{
                  'Ид': 1,
                  'Фамилия': 'Иванов',
                  'Имя': 'Иван',
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
                  'Имя': 'Иван',
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
               }],
               idProperty: 'Ид'
            });

            list.setDataSource(dataSource);
         });
      }
   });
   return moduleClass;
});
