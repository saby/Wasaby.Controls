define('Controls/Input/interface/IInputPlaceholder', [
], function() {

   /**
    * Interface for input placeholder.
    *
    * @interface Controls/Input/interface/IInputPlaceholder
    * @public
    */

   /**
    * @name Controls/Input/interface/IInputPlaceholder#placeholder
    * @cfg {String|Function} Field placeholder.
    * @default None
    * @remark Renders placeholder in the field when it is empty. We do not use native HTML placeholders and render placeholder as div overlayed on top of the field to allow the use of custom templates.
    * @example
    * In this example, we create a text field with simple text placeholder.
    * <pre>
    *    <Controls.Input.Text placeholder="Enter your name" />
    * </pre>
    * In this example, we render a custom template in field's placeholder. We put a Button in the placeholder that user can click on to open the list to pick from.
    * <pre>
    *    <Controls.Input.Text>
    *        <ws:placeholder>
    *           <span>Enter your name or <Controls.Button caption="choose from the list" on:click="openListHandler()"/></span>
    *        </ws:placeholer>
         </Controls.Input.Text>
    * </pre>
    * @see Documentaion: Inputs
    */

});
