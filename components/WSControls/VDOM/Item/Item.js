define('js!WSControls/VDOM/Item/Item', [
   'Core/Control',
   'tmpl!WSControls/VDOM/Item/Item'
], function (Control, ItemTpl) {
   'use strict';

   //Компонент, который инкапсулирует внутри себя логику редактирования строки.
   //Теоретически можно было бы обойтись без него, тогда обработка событий на HTML-элементах
   //и навешивние класса editing переместилась бы в основной контроллер приложения.
   //Этот компонент создает дополнительный слой абстракции и ничего не знает о модели TodoModel
   //В разметке можно использовать двухсторонний data-binding для свойств title и completed
   //вместо обработчиков событий
   //
   // <ws:Todo.TodoItem
   //    title="{{ item.title|mutable }}"
   //    completed="{{ item.completed|mutable }}"
   //    onRemove="{{ 'onRemoveItem'|event:item }}"
   // />
   //
   // вместо
   //
   // <ws:Todo.TodoItem
   //    title="{{ item.title }}"
   //    completed="{{ item.completed }}"
   //    onEdit="{{ 'onEditItem'|event:item }}"
   //    onRemove="{{ 'onRemoveItem'|event:item }}"
   //    onToggle="{{ 'onToggleCompleted'|event:item }}"
   // />

   var Item = Control.extend( {
      _template: ItemTpl,
      _editing: false,
      iWantVDOM: true,
      completed: null,
      title: null,
      constructor: function (cfg) {
         Item.superclass.constructor.call(this, cfg);
         this._publish('onRemove', 'onToggle', 'onEdit');
      },
      onToggle: function (event) {
         this.completed = !this.completed;
         event.target.checked = false;
         this._notify('onToggle', this.completed, this.item);
      },
      onRemove: function (event) {
         this._notify('onRemove', this.item);
      },
      onStartEditing: function (event){
         this._startEdit();
      },
      onKeyPress: function (event) {
         if (event.nativeEvent.key === 'Enter') {
            this._completeEdit(event.target.value);
         }
      },
      onBlur: function (event) {
         this._completeEdit(event.target.value);
      },
      _applyOptions:function(){
         this.completed = this._options.completed;
         this.title = this._options.title;
         this.item = this._options.item;
      },
      _startEdit: function(){
         this._editing = true;
      },
      _completeEdit: function (value) {
         this._editing = false;
         this.title = value;
         this._notify('onEdit', value, this.item);
      }
   });
   
   return Item;
});
