define('Controls/interface/IOpenerOwner', [], function() {

   /**
    * Interface for controls that has opener. Opener means control that initiates opening of current control. It needs for mechanism of focuses.
    * For detailed information, refer <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ws4/focus/'>Mechanism of focuses</a>.
    *+
    * @interface Controls/interface/IOpenerOwner
    * @public
    * @author Шипин А.А.
    */

   /**
    * @name Controls/interface/IOpenerOwner#opener
    * @cfg {Core/Control} Control that opens current control expended by IHasOpener interface.
    */

});
