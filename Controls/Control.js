define('js!Controls/Control', [
], function() {

   /**
    * Базовый класс компонента
    * @class Core/Control
    * @control
    * @public
    */



   /**
    * @name Controls/Control#enabled
    * @cfg {Boolean} Значение, указывающее, может ли элемент управления реагировать на взаимодействие пользователя.
    */

   /**
    * Перевести фокус на компонент.
    * @function Controls/Control#focus
    */

   /**
    * Увести фокус с компонента. Фокус будет переведен на body.
    * @function Controls/Control#blur
    */


   /**
    * Перед отрисовкой контрола, перед mount контрола в DOM
    * Выполняется как на клиенте, так и на сервере. Здесь мы можем скорректировать наше состояние
    * в зависимости от параметров конструктора, которые были сохранены в _options
    * Вызывается один раз в течение жизненного цикла
    * На этом методе заканчивается управление жизненным циклом компонента на сервере.
    * После выполнения шаблонизации контрол будет разрушен и будет вызван _beforeDestroy
    * @function Controls/Control#_beforeMount
    * @param {Object} options
    * @param {Object} receivedState
    * @private
    */

   /**
    * После отрисовки контрола. Выполняется на клиенте после синхронизации VDom с реальным Dom
    * Здесь мы можем впервые обратиться к DOMу, сделать какие-то асинхронные операции,
    * и при необходимости запланировать перерисовку
    * Вызывается один раз в течение жизненного цикла
    * Вызывается только на клиенте
    * @function Controls/Control#_afterMount
    * @private
    */

   /**
    * Точка входа перед шаблонизацией. _beforeUpdate точка применения новых
    * опций для компонента. Здесь мы можем понять измененные опции и как-то повлиять на состяние
    * Вызывается множество раз за жизненный цикл
    * Вызывается только на клиенте
    * @function Controls/Control#_beforeUpdate
    * @param {Object} newOptions - предыдущие опции компонента
    * @private
    */

   /**
    * Точка завершения шаблонизации и синхронизации. Здесь доступен DOM и
    * объект this._children
    * Здесь мы можем выполнить асинхронные операции, потрогать DOM
    * Вызывается каждый раз после шаблонизации после _beforeUpdate
    * Вызывается только на клиенте
    * @function Controls/Control#_afterUpdate
    * @param {Object} oldOptions
    * @private
    */

   /**
    * Точка перед разрушением. Точка, когда компонент жив.
    * Здесь нужно разрушить объекты, которые были созданы в _applyOptions
    * Вызывается и на клиенте и на сервере
    * @function Controls/Control#_beforeUnmount
    * @private
    */


   /**
    * Принудительный вызов обновления шаблона
    * @function Controls/Control#_forceUpdate
    * @private
    */

   /**
    * @event Controls/Control#focus Происходит при переходе фокуса на компонент.
    */

   /**
    * @event Controls/Control#blur Происходит при уходе фокуса с компонента.
    */

   /**
    * @event Controls/Control#focusIn Происходит при переходе фокуса на дочерний компонент.
    */

   /**
    * @event Controls/Control#focusOut Происходит при уходе фокуса с дочернего компонента.
    */

});