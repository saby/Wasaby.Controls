/**
 * @author Быканов А.А.
 */
define('js!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace', // Устанавливаем имя, по которому демо-компонент будет доступен в других компонентах
   [ // Массив зависимостей компонента
      'js!SBIS3.CORE.CompoundControl', // Подключаем базовый компонент, от которого далее будем наследовать свой демо-компонент
      'html!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace', // Подключаем вёрстку демо-компонента
      'js!SBIS3.CONTROLS.Demo.FieldLinkMemorySource', // Подключаем источника данных, созданный специально для этого демо-примера
      'js!WS.Data/Adapter/Sbis', // Подключаем адаптер источника данных
      'Core/helpers/fast-control-helpers',
      'js!SBIS3.CONTROLS.DataGridView', // Подключаем представление данных
      'css!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace', // Подключаем файл CSS-файл демо-компонента
      'js!SBIS3.CONTROLS.TextBox', // Подключаем поле ввода
      'js!SBIS3.CONTROLS.Demo.FieldLinkDemoArea', // Подключаем компонент, созданный специально для демо-примера
      'js!SBIS3.CORE.CoreValidators', // Подключаем класс для работы с валидаторами
      'html!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace/resources/cellWorkPlace', // Подключаем шаблон отображения ячейки, которая соответствует колонке "Место работы"
      'html!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace/resources/cellFIO', // Подключаем шаблон отображения ячейки, которая соответствует колонке "ФИО"
      'html!SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace/resources/cellID' // Подключаем шаблон отображения ячейки, которая соответствует колонке "ИД"
   ],
   function( // Подключенные в массиве зависимостей файлы будут доступны в следующих переменных
      CompoundControl, // В эту переменную импортируется класс CompoundControl из файла CompoundControl.module.js
      dotTplFn, // В эту переменную импортируется вёрстка демо-компонента из файла FieldLinkWithEditInPlace.xhtml
      FieldLinkMemorySource, // В эту переменную импортируется класс для работы с источником данных демо-компонента
      SbisStrategy, // В эту переменную импортируется класс для работы с адаптером источника данных
      fcHelpers
   ){
      var moduleClass = CompoundControl.extend({ // Наследуемся от базового компонента
         _dotTplFn: dotTplFn, // Устанавливаем шаблон, по которому будет построен демо-компонент
         init: function () { // Инициализация компонента, здесь все дочерние компоненты готовы к использованию
            moduleClass.superclass.init.call(this); // Обязательная конструкция, чтобы корректно работал указатель this
            this.getChildControlByName('DemoDataGrid').setDataSource(this._createDataGridSource()); // Устанавливаем источник данных для представления данных
            fcHelpers.message('Начните редактирование записи, чтобы увидеть поле связи для колонки "Место работы".');
         },
         // Метод, который формирует статический источник по переданным данным в формате JSON-RPC
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
                  s: [
                     {n: 'Ид', t: 'ЧислоЦелое'},
                     {n: 'ФИО', t: 'Текст'},
                     {n: 'ИнформацияПоСотруднику', t: 'Выборка'}
                  ]
               },
               idProperty: 'Ид', // Устанавливаем поле первичного ключа
               adapter: new SbisStrategy() // Устанавливаем адаптер источника данных
            });
         }
      });
      return moduleClass;
   }
);