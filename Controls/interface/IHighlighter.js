define('Controls/interface/IHighlighter', [
], function() {

   /**
    * Highlighting interface. Different types of highlighter can be used in a component:
    * search highlighter, validation highlighter, etc. Highlighter is used when rendering list items.
    *
    * @interface Controls/interface/IHighlighter
    * @public
    * @author Авраменко А.С.
    */

   /**
    * @typedef {Object} Highlighter
    */

   /**
    * @name Controls/interface/IHighlighter#highlighter
    * @cfg {Array.<Highlighter>} Array of highlighters.
    */
});
