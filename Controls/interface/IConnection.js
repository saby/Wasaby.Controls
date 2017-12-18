define('js!Controls/interface/IConnection', [
], function() {

   /**
    * Интерфейс для работы с источником данных.
    * Необходимо использовать в компонентах, использующих источники данных
    * @mixin Controls/interface/IConnection
    * @public
    */

   /**
    * @name Controls/interface/IConnection#connection
    * @cfg Объект, реализующий интерфейс IConnection (ISource) с помощью которого осуществляется доступ к хранилищу данных.
    * Используется для доступа к данным, когда сам контрол захочет их получить. Например в списке так то, в меню так то, в дереве так то.
    */

   /**
    * @name Controls/interface/IConnection#items
    * @cfg {Array} Список элементов коллекции, отображаемый в компоненте.
    * При задании только этой опции - это именно тот список который будет всегда отображаться в компоненте.
    * При использовании вместе с connection, items - задает начальное состояние списка. После взаимодействия с connection начинает использоваться набор возвращенный из connection
    */

   /**
    * @name Controls/interface/IConnection#itemTemplate
    * @cfg {Function} Шаблон для отображения элемента коллекции.
    */

   /**
    * @name Controls/interface/IConnection#keyProperty
    * @cfg {String} Имя свойства элемента, которое является идентификатором записи.
    */

   /**
    * @name Controls/interface/IConnection#displayProperty
    * @cfg {String} Имя свойства элемента, которое используется для отображения значения в шаблоне строки по умолчанию, когда не задана опция itemTemplate.
    */

});