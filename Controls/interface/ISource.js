define('Controls/interface/ISource', [
], function() {

   /**
    * Интерфейс для работы с источником данных.
    * Необходимо использовать в компонентах, использующих источники данных
    * @mixin Controls/interface/ISource
    * @public
    */

   /**
    * @name Controls/interface/ISource#source
    * @cfg Объект, реализующий интерфейс ISource (ISource) с помощью которого осуществляется доступ к данным.
    */

   /**
    * @name Controls/interface/ISource#itemTemplate
    * @cfg {Function} Шаблон для отображения элемента коллекции.
    */

   /**
    * @name Controls/interface/ISource#keyProperty
    * @cfg {String} Имя свойства элемента, которое является идентификатором записи.
    */

   /**
    * @name Controls/interface/ISource#itemTemplateProperty
    * @cfg {String} Имя свойства элемента, в котором содержится шаблон отображения этого элемента. При отсутствии шаблона в поле используется шаблон из опции itemTemplate
    */

});
