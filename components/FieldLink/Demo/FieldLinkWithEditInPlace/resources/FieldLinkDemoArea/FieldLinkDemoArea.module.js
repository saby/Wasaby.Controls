define('js!SBIS3.CONTROLS.Demo.FieldLinkDemoArea', [
   'js!SBIS3.CONTROLS.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.FieldLinkDemoArea',
   'js!SBIS3.CONTROLS.DataGridView',
   'js!SBIS3.CONTROLS.Demo.FieldLinkDemoMemory',
   'js!SBIS3.CONTROLS.Data.Model',
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
   'css!SBIS3.CONTROLS.Demo.FieldLinkDemoArea',
   'js!SBIS3.CONTROLS.FieldLink'
], function(CompoundControl, dotTplFn, DataGridView, FieldLinkDemoMemory, Model, SbisAdapter) {
   /**
    * SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace
    * @class SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            dataSet: null
         }
      },

      $constructor: function() {
         $ws.single.CommandDispatcher.declareCommand(this, 'addWorkPlaceField', this._addWorkPlaceField.bind(this));
      },

      setDataSet: function(dataSet) {
         this._options.dataSet = dataSet;
         this.rebuildMarkup();
      },

      getDataSet: function() {
         return this._options.dataSet;
      },

      getCompanyDataSource: function() {
         this.setDataSource(new FieldLinkDemoMemory({
            data: {
               _type: 'recordset',
               d: [
                  [0, 'ООО Тензор'],
                  [1, 'ОАО РЖД'],
                  [2, 'Правительство РФ'],
                  [3, 'НПО Весёлый шарик'],
                  [4, 'ОАО РЖД Ярославль']
               ],
               s: [
                  {n: 'Ид', t: 'ЧислоЦелое'},
                  {n: 'Название', t: 'Текст'}
               ]
            },
            idProperty: 'Ид',
            adapter: new SbisAdapter()
         }));
      },

      getRankDataSource: function() {
         this.setDataSource(new FieldLinkDemoMemory({
            data: {
               _type: 'recordset',
               d: [
                  [0, 'Инженер-программист'],
                  [1, 'Руководитель группы'],
                  [2, 'Менеджер'],
                  [3, 'Генерал армии'],
                  [4, 'Министр обороны'],
                  [5, 'Бухгалтер']
               ],
               s: [
                  {n: 'Ид', t: 'ЧислоЦелое'},
                  {n: 'Название', t: 'Текст'}
               ]
            },
            idProperty: 'Ид',
            adapter: new SbisAdapter()
         }));
      },

      _addWorkPlaceField: function(type) {
         var isCompany = type === 'company';
         var
            record = new Model({
               data: {
                  _type: 'record',
                  d: [
                     new Date().getTime(),
                     {
                        _type: 'record',
                        d: [
                           isCompany ? 'Компания' : 'Должность',
                           {
                              _type: isCompany ? 'recordset' : 'record',
                              d: [],
                              s: isCompany ? [
                                 {n: 'Ид', t: 'ЧислоЦелое'},
                                 {n: 'Название', t: 'Текст'}
                                 ] :
                                 []
                           },
                           ''
                        ],
                        s: [
                           {n: 'Описание', t: 'Текст'},
                           {n: 'СвязанныеЗаписи', t: isCompany ? 'Выборка' : 'Запись'},
                           {n: 'Дополнение', t: 'Текст'}
                        ]
                     }
                  ],
                  s: [
                     {n: 'Ид', t: 'ЧислоЦелое'},
                     {n: 'ПолеИнформации', t: 'Запись'}
                  ]
               },
               adapter: new SbisAdapter()
            });
         this.getDataSet().add(record);
         this.rebuildMarkup();
      },

      sendAddCompany: function() {
         this.sendCommand('addWorkPlaceField', 'company');
      },

      sendAddPost: function() {
         this.sendCommand('addWorkPlaceField', 'post');
      }

   });
   return moduleClass;
});