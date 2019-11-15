/* eslint-disable */
define('Controls/interface/IOpenerOwner', [], function() {

   /**
    * Интерфейс для контролов, имеющих <a href='/doc/platform/developmentapl/interface-development/ui-library/focus/#control-opener'>опенер</a>.
    * Более подробно информация изложена в документе <a href='/doc/platform/developmentapl/interface-development/ui-library/focus/'>Работа с фокусами</a>.
    *
    * @interface Controls/interface/IOpenerOwner
    * @public
    * @author Шипин А.А.
    */
   /*
    * Interface for controls that has opener. Opener means control that initiates opening of current control. It needs for mechanism of focuses.
    * For detailed information, refer <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ui-library/focus/'>Mechanism of focuses</a>.
    *
    * @interface Controls/interface/IOpenerOwner
    * @public
    * @author Шипин А.А.
    */

   /**
    * @name Controls/interface/IOpenerOwner#opener
    * @cfg {Core/Control} Контрол, который инициирует открытие текущего контрола, реализующий интерфейс IHasOpener.
    */
   /*
    * @name Controls/interface/IOpenerOwner#opener
    * @cfg {Core/Control} Control that opens current control expended by IHasOpener interface.
    */

});
