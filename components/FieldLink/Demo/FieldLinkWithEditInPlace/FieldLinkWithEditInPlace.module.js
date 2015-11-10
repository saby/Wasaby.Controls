define('js!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace',
   'js!SBIS3.CONTROLS.DataGridView',
   'js!SBIS3.CONTROLS.StaticSource',
   'js!SBIS3.CONTROLS.Demo.FieldLinkDataSource',
   'js!SBIS3.CONTROLS.DataSet',
   'js!SBIS3.CONTROLS.SbisJSONStrategy',
   'css!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace',
   'js!SBIS3.CONTROLS.TextBox',
   'js!SBIS3.CONTROLS.FieldLink',
   'js!SBIS3.CORE.CoreValidators',
   'html!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace/resources/cellWorkPlace',
   'html!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace/resources/cellFIO',
   'html!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace/resources/cellID'
], function (CompoundControl, dotTplFn, DataGridView, StaticSource, FieldLinkDataSource, DataSet, SbisStrategy) {
   /**
    * SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace
    * @class SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {}
      },

      init: function () {
         var
            dataGrid;
         moduleClass.superclass.init.call(this);
         dataGrid = this.getChildControlByName('DemoDataGrid');
         dataGrid.setDataSource(this._createDataGridSource());
      },

      _createDataGridSource: function () {
         return new FieldLinkDataSource({
            data: {
               _type: 'recordset',
               d: [
                  [1, 'Иванов Федор Иванович',
                     {
                        _type: 'record',
                        d: [
                           {
                              _type: 'recordset',
                              d: [
                                 [0, 'ООО Тензор'],
                                 [1, 'ОАО РЖД']
                              ],
                              s: [
                                 {n: 'Ид', t: 'ЧислоЦелое'},
                                 {n: 'Название', t: 'Текст'}
                              ],
                              keyField: 'Ид'
                           },
                           {
                              _type: 'recordset',
                              d: [
                                 [0, 'Инженер-программист'],
                                 [1, 'Руководитель группы']
                              ],
                              s: [
                                 {n: 'Ид', t: 'ЧислоЦелое'},
                                 {n: 'Название', t: 'Текст'}
                              ],
                              keyField: 'Ид'
                           }
                        ],
                        s: [
                           {n: 'Компания', t: 'Выборка'},
                           {n: 'Должность', t: 'Выборка'}
                        ]
                     }
                  ],
                  [2, 'Прыткова Ирина Борисовна',
                     {
                        _type: 'record',
                        d: [
                           {
                              _type: 'recordset',
                              d: [
                                 [0, 'ООО Тензор']
                              ],
                              s: [
                                 {n: 'Ид', t: 'ЧислоЦелое'},
                                 {n: 'Название', t: 'Текст'}
                              ],
                              keyField: 'Ид'
                           },
                           {
                              _type: 'recordset',
                              d: [
                                 [2, 'Менеджер']
                              ],
                              s: [
                                 {n: 'Ид', t: 'ЧислоЦелое'},
                                 {n: 'Название', t: 'Текст'}
                              ],
                              keyField: 'Ид'
                           }
                        ],
                        s: [
                           {n: 'Компания', t: 'Выборка'},
                           {n: 'Должность', t: 'Выборка'}
                        ]
                     }
                  ],
                  [3, 'Шойгу Сергей Кужугетович',
                     {
                        _type: 'record',
                        d: [
                           {
                              _type: 'recordset',
                              d: [
                                 [2, 'Правительство РФ']
                              ],
                              s: [
                                 {n: 'Ид', t: 'ЧислоЦелое'},
                                 {n: 'Название', t: 'Текст'}
                              ],
                              keyField: 'Ид'
                           },
                           {
                              _type: 'recordset',
                              d: [
                                 [3, 'Генерал армии'],
                                 [4, 'Министр обороны']
                              ],
                              s: [
                                 {n: 'Ид', t: 'ЧислоЦелое'},
                                 {n: 'Название', t: 'Текст'}
                              ],
                              keyField: 'Ид'
                           }
                        ],
                        s: [
                           {n: 'Компания', t: 'Выборка'},
                           {n: 'Должность', t: 'Выборка'}
                        ]
                     }
                  ]
               ],
               s: [{n: 'Ид', t: 'ЧислоЦелое'},
                  {n: 'ФИО', t: 'Текст'},
                  {n: 'МестоРаботы', t: 'Запись'}]
            },
            keyField: 'Ид',
            strategy: new SbisStrategy()
         });
      },

      initFiledLink1: function () {
         this.setDataSource(new StaticSource({
            data: {
               _type: 'recordset',
               d: [
                  [0, 'ООО Тензор'],
                  [1, 'ОАО РЖД'],
                  [2, 'Правительство РФ'],
                  [3, 'НПО Весёлый шарик']
               ],
               s: [
                  {n: 'Ид', t: 'ЧислоЦелое'},
                  {n: 'Название', t: 'Текст'}
               ]
            },
            keyField: 'Ид',
            strategy: new SbisStrategy()
         }));
         this.setDataSourceFilter(retTrue);
      },

      initFiledLink2: function () {
         this.setDataSource(new StaticSource({
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
            keyField: 'Ид',
            strategy: new SbisStrategy()
         }));
         this.setDataSourceFilter(retTrue);
      },
      initFiledLink3: function () {
         this.setDataSource(new StaticSource({
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
            keyField: 'Ид',
            strategy: new SbisStrategy()
         }));
         this.setDataSourceFilter(retTrue);
         this.setSelectedKeys([1,2,3]);
      }
   });
   return moduleClass;
});