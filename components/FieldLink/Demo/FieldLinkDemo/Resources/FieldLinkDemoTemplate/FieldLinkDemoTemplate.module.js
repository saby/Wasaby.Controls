/**
 * @author Быканов А.А.
 */
define('js!SBIS3.CONTROLS.Demo.FieldLinkDemoTemplate', // Устанавливаем имя, по которому диалог выбора будет доступен для использования в других компонентах
   [ // Массив зависимостей компонента
      'js!SBIS3.CORE.CompoundControl', // Подключаем базовый класс, от которого далее будем наследоваться
      'html!SBIS3.CONTROLS.Demo.FieldLinkDemoTemplate', // Подключаем вёрстку диалога выбора
      'js!SBIS3.CONTROLS.Data.Adapter.Sbis', // Подключаем класс адаптера, который предназначен для работы с данными в формате JSON-RPC
      'js!SBIS3.CONTROLS.Data.Source.Memory', // Подключаем класс для работы со статическим испточником данных
      'js!SBIS3.CONTROLS.DataGridView', // Подключаем класс представления данных
      'js!SBIS3.CONTROLS.Button', // Подключаем класс кнопки
      'css!SBIS3.CONTROLS.Demo.FieldLinkDemoTemplate' // Подключаем CSS-файл
   ],
   function( // Подключенные в массиве зависимостей файлы будут доступны в следующих переменных
      CompoundControl, // В эту переменную импортируется класс CompoundControl из файла CompoundControl.module.js
      dotTplFn, // В эту переменную импортируется вёрстка диалога выбора из файла FieldLinkDemoTemplate.xhtml
      AdapterSbis, // В эту переменную импортируется класс для работы с данными в формате JSON-RPC
      StaticSource // В эту переменную импортируется класс для работы со статическим источником данных
   ){
      var moduleClass = CompoundControl.extend(/{
         _dotTplFn: dotTplFn, // Устанавливаем шаблон, по которому будет построена вёрстку диалога выбора
         init: function() { // Инициализация компонента, здесь все дочерние компоненты готовы к использованию
            moduleClass.superclass.init.call(this); // Обязательная конструкция, чтобы корректно работал указатель this
            var self = this, // Сохраняем указатель, бедт использован в обработчике кнопки
                dataGrid = this.getChildControlByName('Таблица'), // Получаем экземпляр класс представления данных
                dataSource = new StaticSource({ // Производим инициализацию статического источника данных
                   data: { // Устанавливаем "сырые" данные, передаём их в формате JSON-RPC
                      _type: 'recordset',
                      d: [
                         [1, 'Инженер-программист'],
                         [2, 'Руководитель группы'],
                         [3, 'Менеджер'],
                         [4, 'Тестировщик'],
                         [5, ''],
                         [6, 'Бухгалтер']
                      ],
                      s: [
                         {n: 'Ид', t: 'ЧислоЦелое'},
                         {n: 'Название', t: 'Текст'}
                      ]
                    },
                    idProperty: 'Ид', // Устанавливаем поле первичного ключа
                    adapter: new AdapterSbis() // Устанавливаем адаптер для обработки "сырых" данных
                });
            dataGrid.setDataSource(dataSource); // Устанавливаем представлению данных источник
            this.getChildControlByName('SelectButton').subscribe('onActivated', function() { // Создаём обработчик на клик по кнопке
               self.sendCommand('close', dataGrid.getSelectedKeys()); // Отправляем команду и передаём набор выбранных ключей для режима множественного выбора значений
            });
         }
      });
      return moduleClass;
   }
);
