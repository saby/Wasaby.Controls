/**
 * @author Быканов А.А.
 */
define('js!SBIS3.DOCS.ShowAllDictionary', // Устанавливаем имя, по которому демо-компонент будет доступен в других компонентах
   [ // Массив зависимостей компонента
      'js!SBIS3.CORE.CompoundControl', // Подключаем базовый класс, от которого далее будем наследоваться
      'html!SBIS3.DOCS.ShowAllDictionary', // Подключаем вёрстку демо-компонента
      'js!WS.Data/Source/SbisService', // Подключаем класс для работы с источником данных в виде бизнес-логики
      'js!SBIS3.CONTROLS.Button', // Подключаем компонент-кнопка, используется для подтверждения выбранных записей
      'js!SBIS3.CONTROLS.DataGridView', // Подключаем контрол для отображения записей с колонками
      'css!SBIS3.DOCS.ShowAllDictionary' // Подключаем файл с CSS-стилями
   ],
   function( // Подключенные в массиве зависимостей файлы будут доступны в следующих переменных
      CompoundControl,  // В эту переменную импортируется класс CompoundControl из файла CompoundControl.module.js
      dotTplFn, // В эту переменную импортируется вёрстка демо-компонента из файла ShowAllDictionary.xhtml
      SbisService // В эту переменную импортируется класс для работы с источником данных в виде бизнес-логики
   ){
      var moduleClass = CompoundControl.extend({ // Наследуемся от базового компонента
         _dotTplFn: dotTplFn, // Устанавливаем шаблон, по которому будет построен демо-компонент
         $protected: {
            _options: {
               width: '500px', // Устанавливаем ширину диалога, в котором отображается справочник
               getItems: false
            }
         },
         init: function() { // Инициализация компонента, здесь все дочерние компоненты готовы к использованию
            moduleClass.superclass.init.call(this); // Обязательная конструкция - вызов родительского init
            var self = this, // Сохраняем указатель на компонент 
                dataSource = new SbisService({ // Производим инициализацию источника данных в виде бизнес-логики
                   endpoint: 'ТелефонныйСправочник3', // Устанавливаем объект бизнес-логики, методы которого будем использовать для работы с таблицей БД
                   idProperty: '@ТелефонныйСправочник3', // Устанавливаем поле первичного ключа
                   binding: {
                      query: 'СписокФИО' // Устанавливаем списочный метод для запроса данных
                   }
                }),
                dataGridView = this.getChildControlByName('myView'); // Получаем экземпляр класса представления данных
            dataGridView.setDataSource(dataSource); // Устанавливаем источник данных для контрола
            /* Следующая конструкция производит проверку признака, по которому устанавливается необходимость отображения кнопки подтверждения выбора записей
            для режима множественного выбора записей. Значение опции устанавливается в конфигурациях справочников поля связи. */
            if (this._options.showSelectButton) {
               this.getChildControlByName('SelectButton').subscribe('onActivated', function() { // Создаём обработчик нажатия на кнопку
                  if (this._options.getItems) { // Проверяем признак: что возвращать при выборе записей
                     self.sendCommand('close', dataGridView.getSelectedItems()); // Отправляем команду и передаём параметр - список ключей выбранных записей
                  } else {
                     self.sendCommand('close', dataGridView.getSelectedKeys()); // Отправляем команду и передаём параметр - список выбранных записей
                  }   
               });
            }
         }
      });
      moduleClass.title = 'Сотрудники';
      moduleClass.dimensions = {
         'resizable': false,
         'width': 400
      };
      return moduleClass;
   }
);