define('js!SBIS3.CONTROLS.Demo.MyTreeDataGridView', // Устанавливаем имя, по которому демо-компонент будет доступен в других компонентах
   [ // Массив зависимостей компонента
      'js!SBIS3.CORE.CompoundControl', // Подключаем базовый класс, от которого далее будем наследоваться
      'js!WS.Data/Source/Memory', // Подключаем класс для работы со статическим источником данных
      'js!SBIS3.CONTROLS.ComponentBinder', // Подключаем класс для связывания контролов
      'html!SBIS3.CONTROLS.Demo.MyTreeDataGridView', // Подключаем вёрстку демо-компонента
      'css!SBIS3.CONTROLS.Demo.MyTreeDataGridView', // Подключаем стили демо-компонента
      'js!SBIS3.CONTROLS.TreeDataGridView', // Подключаем контрол - ирерахический список с колонками
      'js!SBIS3.CONTROLS.BreadCrumbs', // Подключаем контрол - хлебные крошки
      'js!SBIS3.CONTROLS.BackButton' // Подключаем контрол - кнопка назад
   ],
   function( // Подключенные в массиве зависимостей файлы будут доступны в следующих переменных
       CompoundControl, // В эту переменную импортируется класс CompoundControl из файла CompoundControl.module.js
       StaticSource, // В эту переменную импортируется класс для работы со статическим источником данных
       ComponentBinder, // В эту переменную импортируется класс для связывания контролов
       dotTplFn // // В эту переменную импортируется вёрстка демо-компонента
   ){
      var moduleClass = CompoundControl.extend({ // Наследуемся от базового компонента
         _dotTplFn: dotTplFn, // Устанавливаем шаблон, по которому будет построен демо-компонент
         init: function() { // Инициализация компонента, здесь все дочерние компоненты готовы к использованию
            moduleClass.superclass.init.call(this); // Обязательная конструкция - вызов родительского init
            var items = [ // Создаём набор "сырых" данных в формате JSON
                  {'title': 'Первый',       'id':1,  'parent@': true },
                  {'title': 'Второй',       'id':2,  'parent@': true, 'parent' : 1 },
                  {'title': 'Третий',       'id':3,  'parent@': true, 'parent' : 2 },
                  {'title': 'Четвертый',    'id':4,  'parent@': null, 'parent' : 3 },
                  {'title': 'Пятый',        'id':5,  'parent@': null, 'parent' : 1 },
                  {'title': 'Шестой',       'id':6,  'parent@': true } ,
                  {'title': 'Седьмой',      'id':7,  'parent@': null, 'parent' : 6 },
                  {'title': 'Восьмой',      'id':8,  'parent@': null, 'parent' : 6 },
                  {'title': 'Девятый',      'id':9,  'parent@': null },
                  {'title': 'Десятый',      'id':10, 'parent@': null },
                  {'title': 'Одиннадцатый', 'id':11, 'parent@': null },
                  {'title': 'Двенадцатый',  'id':12, 'parent@': null }
               ],
               source = new StaticSource({ // Инициализация статического источника данных
                  data: items, // Передаём набор данных, по которому будет посмтроен набор записей
                  idProperty: 'id' // Устанавливаем поле первичного ключа для набора записей
               }),
               treeDataGridView = this.getChildControlByName('MyTreeDataGridView'), // Подключаем экземпляр класса иерархического списка
               breadCrumbs = this.getChildControlByName('MyBreadCrumbs'), // Подключаем экземпляр класса Хлебных крошек
               backButton = this.getChildControlByName('MyBackButton'), // Подключаем экземпляр класса кнопки Назад
               componentBinder = new ComponentBinder({ // Производим установку представления данных
                  view: treeDataGridView
               });
            componentBinder.bindBreadCrumbs(breadCrumbs, backButton, treeDataGridView); // Производим связывание Хлебных крошек, кнопки Назад и списка
            treeDataGridView.setDataSource(source); // Устанавливаем списку источник данных
         }
      });
      return moduleClass;
   }
);