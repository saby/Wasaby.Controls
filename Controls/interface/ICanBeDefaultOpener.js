define('Controls/interface/ICanBeDefaultOpener', [], function() {

   /**
    * Interface for controls what can be default opener.
    *
    * @interface Controls/interface/ICanBeDefaultOpener
    * @public
    */

   /**
    * @name Controls/interface/ICanBeDefaultOpener#isDefaultOpener
    * @cfg {Boolean} Flag means that control is default opener.
    * If isDefaultOpener is equals true for current control, child control that is expanded by IHasOpener interface
    * and has not custom opener will get current control as opener.
    */

});
