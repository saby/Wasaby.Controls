/**
 * @author Быканов А.А.
 */
define('js!SBIS3.CONTROLS.Demo.FieldLinkDemo', // Устанавливаем имя, по которому демо-компонент будет доступен в других компонентах
   [ // Массив зависимостей компонента
      'js!SBIS3.CORE.CompoundControl', // Подключаем базовый класс, от которого далее будем наследоваться
      'html!SBIS3.CONTROLS.Demo.FieldLinkDemo', // Подключаем вёрстку демо-компонента
      'js!WS.Data/Source/Memory', // Подключаем класс для работы со статическим источником данных
      'Core/helpers/fast-control-helpers',
      'css!SBIS3.CONTROLS.Demo.FieldLinkDemo', // Подключаем CSS-файл демо-компонента
      'js!SBIS3.CONTROLS.FieldLink', // Подключаем контрол поля связи
      'js!SBIS3.CONTROLS.DataGridView', // Подключаем контрол табличного представления данных, используется для построения автодополнения
      'js!WS.Data/Collection/List',
      'js!SBIS3.CONTROLS.FieldLink.Link',
      'js!SBIS3.CONTROLS.Link',
      'js!SBIS3.CONTROLS.Action.SelectorAction',
      'js!SBIS3.CONTROLS.SuggestView'
   ],
   function( // Подключенные в массиве зависимостей файлы будут доступны в следующих переменных
      CompoundControl, // В эту переменную импортируется класс CompoundControl из файла CompoundControl.module.js
      dotTplFn, // В эту переменную импортируется вёрстка демо-компонента из файла FieldLinkDemo.xhtml
      Memory, // В эту переменную импортируется класс для работы со статическим источником данных
      fcHelpers
   ){
      var FieldLinkDemo = CompoundControl.extend({ // Наследуемся от базового компонента
         _dotTplFn: dotTplFn, // Устанавливаем шаблон, по которому будет построен демо-компонент
         init: function() { // Инициализация компонента, здесь все дочерние компоненты готовы к использованию
            FieldLinkDemo.superclass.init.apply(this, arguments); // Обязательная конструкция, чтобы корректно работал указатель this
            var myData = [ // Создаём "сырые" данные, из которых потом будет создан статический источник
                   {'Ид': 1, 'Название': 'Инженер-программист'},
                   {'Ид': 2, 'Название': 'Руководитель группы'},
                   {'Ид': 3, 'Название': 'Менеджер'},
                   {'Ид': 4, 'Название': 'Тестировщик'},
                   {'Ид': 5, 'Название': 'Технолог'},
                   {'Ид': 6, 'Название': 'Бухгалтер'},
                   {'Ид': 7, 'Название': 'Менеджер'},
                   {'Ид': 8, 'Название': 'Менеджер'},
                   {'Ид': 9, 'Название': 'Менеджер'},
                   {'Ид': 10, 'Название': 'Менеджер'},
                   {'Ид': 11, 'Название': 'Менеджер'},
                   {'Ид': 12, 'Название': 'Менеджер'},
                   {'Ид': 13, 'Название': 'Менеджер'},
                   {'Ид': 14, 'Название': 'Менеджер'},
                   {'Ид': 15, 'Название': 'Менеджер'},
                   {'Ид': 16, 'Название': 'Менеджер'}
                ],
                dataSource = new Memory({ // Производим инициализацию статического источника данных
                   data: myData, // Передаём наши данные в качестве исходных для будущих записей
                   idProperty: 'Ид' // Устанавливаем поле первичного ключа
                });
            this.getChildControlByName('FieldLinkMultiSelect').setDataSource(dataSource); // Устанавливаем источник данных для контрола
            this.getChildControlByName('FieldLinkMultiSelect1').setDataSource(dataSource);
            this.getChildControlByName('FieldLinkMultiSelect2').setDataSource(dataSource);
            this.getChildControlByName('FieldLinkMultiSelect3').setDataSource(dataSource);
            this.getChildControlByName('FieldLinkMultiSelect4').setDataSource(dataSource);
            fcHelpers.message('Поле связи в режиме множественного выбора значений. <br/>Выбор можно производить как через диалог, так и через автодополнение.');
         }
      });
      

      return FieldLinkDemo;
   }
);
