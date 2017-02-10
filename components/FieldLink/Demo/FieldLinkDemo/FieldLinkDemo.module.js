/**
 * @author Быканов А.А.
 */
define('js!SBIS3.CONTROLS.Demo.FieldLinkDemo', // Устанавливаем имя, по которому демо-компонент будет доступен в других компонентах

    // Массив зависимостей компонента
   [

      // Подключаем базовый класс, от которого далее будем наследоваться
      'js!SBIS3.CORE.CompoundControl',

      // Подключаем вёрстку демо-компонента
      'html!SBIS3.CONTROLS.Demo.FieldLinkDemo',

      // Подключаем класс для работы со статическим источником данных
      'js!WS.Data/Source/Memory',
      'Core/helpers/fast-control-helpers',

      // Подключаем CSS-файл демо-компонента
      'css!SBIS3.CONTROLS.Demo.FieldLinkDemo',

      // Подключаем контрол поля связи
      'js!SBIS3.CONTROLS.FieldLink',

      // Подключаем контрол табличного представления данных, используется для построения автодополнения
      'js!SBIS3.CONTROLS.DataGridView',
      'js!WS.Data/Collection/List',
      'js!SBIS3.CONTROLS.FieldLink.Link',
      'js!SBIS3.CONTROLS.Link',
      'js!SBIS3.CONTROLS.Action.SelectorAction',
      'js!SBIS3.CONTROLS.SuggestView'
   ],

   // Подключенные в массиве зависимостей файлы будут доступны в следующих переменных
   function(

      // В эту переменную импортируется класс CompoundControl из файла CompoundControl.module.js
      CompoundControl,

      // В эту переменную импортируется вёрстка демо-компонента из файла FieldLinkDemo.xhtml
      dotTplFn,

      // В эту переменную импортируется класс для работы со статическим источником данных
      Memory,
      fcHelpers
   ) {
      // Наследуемся от базового компонента
      var FieldLinkDemo = CompoundControl.extend({

         // Устанавливаем шаблон, по которому будет построен демо-компонент
         _dotTplFn: dotTplFn,

         // Инициализация компонента, здесь все дочерние компоненты готовы к использованию
         init: function() {

            // Обязательная конструкция, чтобы корректно работал указатель this
            FieldLinkDemo.superclass.init.apply(this, arguments);

            // Создаём "сырые" данные, из которых потом будет создан статический источник
            var myData = [
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

                // Производим инициализацию статического источника данных
                dataSource = new Memory({
                   data: myData,
                   idProperty: 'Ид'
                });

            // Устанавливаем источник данных для контрола
            this.getChildControlByName('FieldLinkMultiSelect').setDataSource(dataSource);
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
