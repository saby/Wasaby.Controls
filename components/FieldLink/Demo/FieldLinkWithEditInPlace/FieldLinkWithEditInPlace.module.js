define('js!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace',
   'js!SBIS3.CONTROLS.DataGridView',
   'js!SBIS3.CONTROLS.Demo.FieldLinkMemorySource',
   'js!SBIS3.CONTROLS.DataSet',
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
   'css!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace',
   'js!SBIS3.CONTROLS.TextBox',
   'js!SBIS3.CONTROLS.Demo.FieldLinkDemoArea',
   'js!SBIS3.CORE.CoreValidators',
   'html!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace/resources/cellWorkPlace',
   'html!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace/resources/cellFIO',
   'html!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace/resources/cellID'
], function (CompoundControl, dotTplFn, DataGridView, FieldLinkMemorySource, DataSet, SbisStrategy) {
   /**
    * SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace
    * @class SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _dataGrid: null
      },

      $constructor: function() {
         $ws.single.CommandDispatcher.declareCommand(this, 'addItem', this._addItem.bind(this));
      },

      init: function () {
         moduleClass.superclass.init.call(this);
         this._dataGrid = this.getChildControlByName('DemoDataGrid');
         this._dataGrid.setDataSource(this._createDataGridSource());
         /*this._dataGrid.sendCommand('addItem');*/
      },

      _addItem: function() {
         return this._dataGrid.sendCommand('addItem');
      },

      sendAddItem: function() {
         return this.sendCommand('addItem');
      },

      _createDataGridSource: function () {
         return new FieldLinkMemorySource({
            data: {
               _type: 'recordset',
               d: [
                  [1, 'Иванов Федор Иванович',
                     {
                        _type: 'recordset',
                        d: [
                           [1, {
                              _type: 'record',
                              d: [
                                 'Компания',
                                 {
                                    _type: 'recordset',
                                    d: [
                                       [0, 'ООО Тензор'],
                                       [1, 'ОАО РЖД']
                                    ],
                                    s: [
                                       {n: 'Ид', t: 'ЧислоЦелое'},
                                       {n: 'Название', t: 'Текст'}
                                    ]
                                 },
                                 'дополнение11'
                              ],
                              s: [
                                 {n: 'Описание', t: 'Текст'},
                                 {n: 'СвязанныеЗаписи', t: 'Выборка'},
                                 {n: 'Дополнение', t: 'Текст'}
                              ]
                           }],
                           [2, {
                              _type: 'record',
                              d: [
                                 'Должность',
                                 {
                                    _type: 'record',
                                    d: [0, 'Программист'],
                                    s: [
                                       {n: 'Ид', t: 'ЧислоЦелое'},
                                       {n: 'Название', t: 'Текст'}
                                    ]
                                 },
                                 'дополнение 12'
                              ],
                              s: [
                                 {n: 'Описание', t: 'Текст'},
                                 {n: 'СвязанныеЗаписи', t: 'Запись'},
                                 {n: 'Дополнение', t: 'Текст'}
                              ]
                           }]
                        ],
                        s: [
                           {n: 'Ид', t: 'ЧислоЦелое'},
                           {n: 'ПолеИнформации', t: 'Запись'}
                        ]
                     }
                  ],
                  [2, 'Прыткова Ирина Борисовна',
                     {
                        _type: 'recordset',
                        d: [
                           [1, {
                              _type: 'record',
                              d: [
                                 'Компания',
                                 {
                                    _type: 'recordset',
                                    d: [
                                       [0, 'ООО Тензор']
                                    ],
                                    s: [
                                       {n: 'Ид', t: 'ЧислоЦелое'},
                                       {n: 'Название', t: 'Текст'}
                                    ]
                                 },
                                 'дополнение 21'
                              ],
                              s: [
                                 {n: 'Описание', t: 'Текст'},
                                 {n: 'СвязанныеЗаписи', t: 'Выборка'},
                                 {n: 'Дополнение', t: 'Текст'}
                              ]
                           }],
                           [2, {
                              _type: 'record',
                              d: [
                                 'Должность',
                                 {
                                    _type: 'record',
                                    d: [2, 'Менеджер'],
                                    s: [
                                       {n: 'Ид', t: 'ЧислоЦелое'},
                                       {n: 'Название', t: 'Текст'}
                                    ]
                                 },
                                 'дополнение 22'
                              ],
                              s: [
                                 {n: 'Описание', t: 'Текст'},
                                 {n: 'СвязанныеЗаписи', t: 'Запись'},
                                 {n: 'Дополнение', t: 'Текст'}
                              ]
                           }]
                        ],
                        s: [
                           {n: 'Ид', t: 'ЧислоЦелое'},
                           {n: 'ПолеИнформации', t: 'Запись'}
                        ]
                     }
                  ],
                  [3, 'Шойгу Сергей Кужугетович',
                     {
                        _type: 'recordset',
                        d: [
                           [1, {
                              _type: 'record',
                              d: [
                                 'Компания',
                                 {
                                    _type: 'recordset',
                                    d: [
                                       [2, 'Правительство РФ']
                                    ],
                                    s: [
                                       {n: 'Ид', t: 'ЧислоЦелое'},
                                       {n: 'Название', t: 'Текст'}
                                    ]
                                 },
                                 'дополнение 31'
                              ],
                              s: [
                                 {n: 'Описание', t: 'Текст'},
                                 {n: 'СвязанныеЗаписи', t: 'Выборка'},
                                 {n: 'Дополнение', t: 'Текст'}
                              ]
                           }],
                           [2, {
                              _type: 'record',
                              d: [
                                 'Должность',
                                 {
                                    _type: 'record',
                                    d: [3, 'Генерал армии'],
                                    s: [
                                       {n: 'Ид', t: 'ЧислоЦелое'},
                                       {n: 'Название', t: 'Текст'}
                                    ]
                                 },
                                 'дополнение 32'
                              ],
                              s: [
                                 {n: 'Описание', t: 'Текст'},
                                 {n: 'СвязанныеЗаписи', t: 'Запись'},
                                 {n: 'Дополнение', t: 'Текст'}
                              ]
                           }]
                        ],
                        s: [
                           {n: 'Ид', t: 'ЧислоЦелое'},
                           {n: 'ПолеИнформации', t: 'Запись'}
                        ]
                     }
                  ]
               ],
               s: [{n: 'Ид', t: 'ЧислоЦелое'},
                  {n: 'ФИО', t: 'Текст'},
                  {n: 'ИнформацияПоСотруднику', t: 'Выборка'}]
            },
            idProperty: 'Ид',
            adapter: new SbisStrategy()
         });
      }
   });
   return moduleClass;
});