define('Controls/Input/interface/IInputTag', [
], function() {

   /**
    * Interface for input tags (colored indicators in the right top corner).
    *
    * @interface Controls/Input/interface/IInputTag
    * @public
    */

   /**
    * @name Controls/Input/interface/IInputTag#tagStyle
    * @cfg {String} Tag style (colored indicator).
    * @variant primary
    * @variant done
    * @variant attention
    * @variant error
    * @variant info
    */

   /**
    * @event Controls/Input/interface/IInputTag#tagClick Occurs when input tag was clicked.
    */

   /**
    * @event Controls/Input/interface/IInputTag#tagHover Occurs when mouse enters tag area.
    */
});
