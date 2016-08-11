define('js!SBIS3.Demo.MySwitcherDouble', // Имя демо-компонента, по которому он будет доступен для использования
   [ // Массив зависимостей компонента
      'js!SBIS3.CORE.CompoundControl', // Подключаем файл, в котором содержится базовый класс для наследования контрола
      'html!SBIS3.Demo.MySwitcherDouble', // Подключаем вёрстку для демо-компонента
      'css!SBIS3.Demo.MySwitcherDouble', // Подключаем CSS-стили для демо-компонента
      'js!SBIS3.CONTROLS.SwitcherDouble' // Подключаем контрол "Двухпозиционный переключатель"
   ],
   function( // Подключенные в массиве зависимостей файлы будут доступны в следующих переменных
      CompoundControl, // В эту переменную импортируется базовый класс для наследования из файла CompoundControl.module.js
      dotTplFn // В эту переменную импортируется вёрстку демо-компонента из файла MySwitcherDouble.xhtml
   ) {
      var moduleClass = CompoundControl.extend({ // Наследуемся от базового компонента
         _dotTplFn: dotTplFn, // Устанавливаем шаблон, по которому будет построен демо-компонент
         init: function() { // Инициализация компонента, здесь все дочерние компоненты готовы к использованию
            moduleClass.superclass.init.call(this); // Обязательная конструкция - вызов функции init у родительского класса
         }
      });
      return moduleClass;
   }
);