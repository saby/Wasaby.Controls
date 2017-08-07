define('js!WSControls/VDOM/Main/Main', [
      'Core/Control',
      'tmpl!WSControls/VDOM/Main/Main',
      'js!WSControls/VDOM/TodoModel',
      'js!WS.Data/Collection/ObservableList',
      'js!WS.Data/Chain',
      'css!WSControls/VDOM/Main/base',
      'css!WSControls/VDOM/Main/index'
   ],
   function(Control, MainTpl, TODO, ObservableList, Chain) {

      'use strict';

      //Мы держим курс на приведение стандартов разработки к стандартам JavaScript.
      //ws.core.extend будет заменен на ES6 extends.
      //Соответственно $protected/_options и мерж иерархических опций будут упразднены.
      //Для безопасной и быстрой работы на прототипе можно будет объявлять только примитивы и функции.
      //Ответственность за клонирование сложных объектов в конструкторе ложиться на плечи разработчика.
      var Main = Control.extend({
         _template: MainTpl,
         iWantVDOM: true,
         step: 'one step',
         _filter: 'all', //Синтаксический сахар для объявления начального значения свойства. Объявлено свойством только для автоматической перерисовки при изменении значения
         //Синтаксический сахар для объявления свойств через Object.defineProperty
         //Установка значения свойства, объявленного в этом блоке запланирует перерисовку шаблона
         _list: null,
         //Конструктор стал изоморфным.
         //Компоненты будут создаваться на сервере, ничего не зная о своем окружении.
         //Эта технология упрощает тестирование: мы можем внедрить состояние в тестовый инстанс контрола
         //и тестировать изменение состояния, вызывая публичные методы и эмулируя пользовательские события.
         constructor: function(cfg) {

            this._list = cfg._list || new ObservableList({ items: [] });
            if (cfg.arrItems) {
               for(var i=0;i<cfg.arrItems.length;i++){
                  this._list.add(new TODO({
                     rawData: {
                        title: cfg.arrItems[i]
                     }
                  }));
               }
            }
            Main.superclass.constructor.call(this, cfg);
            //Мы должны быть готовы к тому, что при оживлении компонента в браузере
            //он уже когда-то был оживлен и построен на сервере.
            //После построения компонента на сервере, его состояние сериализуется
            //и в браузере в конструктор компонента приходит восстановленная копия состояния
         },
         //Блок обработчиков пользовательских событий. 
         //Обработчики не появляются в публичном API компонента.
         //Подписка производится из шаблона с помощью специального синтаксиса
         //<button on-click="{{ 'clearCompleted'|event }}" class="clear-completed">Clear completed</button>
         //подписки одинаково работают как для компонентов, так и для HTML-элементов
         //мы специально не поддерживаем двухсторонний data binding для нативных HTML-элементов
         //т.к. это создает дополнительные сложности в платформенном механизме
         //Система делаяется для компонентой разработки ПО, и вместо input-в разработчики должны использовать 
         //компоненты на базе TextBoxBase, при этом платформенная реализация TextBoxBase анализирует каждый введенный символ.
         //Двухсторонний data binding для свойств платформенных компонентов будет доступен.
         onCreateItem: function (event) {
            //Автотесты в FireFox не умеют отправлять событие keypress с event  у которого указано свойство key
            //Поэтому используем свойство keyCode и сравнение с кодом клавиши 'enter' - с числом 13.
            if (event.nativeEvent.keyCode === 13) {
               var value = event.target.value;
               if(value.trim()){
                  this._list.add(new TODO({
                     rawData: {
                        title: value
                     }
                  }));
                  this._save();
                  event.target.value = '';
               }
            }
         },
         //Для свойств title и completed можно было бы настроить двухсторонний data-binding
         //Но т.к. задача требует обязательного сохранения изменений, после каждого действия пользователей
         //от обработчиков событий не избавиться.
         //Поэтому в конкретном случае отказались от двухстороннего data-binding, чтобы решение было более понятным, без "магии"
         //Пример настройки TodoItem с двухсторонним data-binding можно посмотреть в файле TodoItem.js
         onEditItem: function(event, title, todo) {
            todo.set('title', title);
            this._save();
         },
         onRemoveItem: function(event, todo){
            //можно использовать мутирующие и не мутирующие алгоритмы
            //отрисовка будет работать одинаково в обоих случаях
            this._list.remove(todo);                                  //модифицируем существующий список
            //this._list = filter(this._list, item => item !== todo); //или создаем новый, если для решения задачи это будет удобнее
            this._save();
         },
         onToggleCompleted: function(event, completed, todo){
            todo.set('completed', completed);
            this._save();
         },
         onToggleCompletedAll: function (event) {
            var needCompleted = this.activeCount() > 0;

            this._list.each(function(item){ item.set('completed', needCompleted)});
            this._save();
         },
         onChangeFilter: function (event, filter) {
            this._filter = filter;
            this._save();
         },
         clearCompleted: function () {
            //можно заменить на мутабельный алгоритм
            this._list.assign(Chain(this._list).filter(function(item){return item.get('completed') != true}).toArray());
            this._save();
         },
         filteredList: function () {
            var self = this;
            return Chain(this._list).filter(function(item) {
               switch (self._filter) {
                  case 'active':
                     return item.get('completed') === false;
                  case 'completed':
                     return item.get('completed') === true;
                  case 'all':
                     return true;
               }
               throw new Error('Incorrect filter type')
            }).toArray();
         },
         activeCount: function () {
            return Chain(this._list).reduce(function(count, item) {
               return item.get('completed') ? count : count + 1
            }, 0);
         },
         completedCount: function () {
            return this._list.getCount() - this.activeCount();
         },
         _save: function(){
            //Сохраняем данные в LocalStorage. Пока не реализованно, чтобы было проще и быстрей отлаживаться
            //JSON.stringify(this._list.toArray());
            this._setDirty();
         }
      });

      return Main;
});