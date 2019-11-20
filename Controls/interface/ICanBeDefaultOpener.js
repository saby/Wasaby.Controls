/* eslint-disable */
define('Controls/interface/ICanBeDefaultOpener', [], function() {

   /**
    * Интерфейс для контролов, которые инициируют открытие других контролов.
    * Необходим для работы с фокусами.
    * Подробнее читайте в статье <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ui-library/focus/'>"Работа с фокусами"</a>.
    *
    * @interface Controls/interface/ICanBeDefaultOpener
    * @public
    * @author Шипин А.А.
    */

   /*
    * Interface for controls that can be default opener.
    * Opener means control that initiates opening of current control. It needs for mechanism of focuses.
    * For detailed information, refer <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ui-library/focus/'>Mechanism of focuses</a>.
    *
    * @interface Controls/interface/ICanBeDefaultOpener
    * @public
    * @author Шипин А.А.
    */    

   /**
    * @name Controls/interface/ICanBeDefaultOpener#isDefaultOpener
    * @cfg {Boolean} В значении true контрол работает как опенер по умолчанию.
    */

   /*
    * @name Controls/interface/ICanBeDefaultOpener#isDefaultOpener
    * @cfg {Boolean} Flag means that control is default opener.
    * If isDefaultOpener is equals true for current control, child control that is expanded by IHasOpener interface
    * and has not custom opener will get current control as opener.
    */

});
