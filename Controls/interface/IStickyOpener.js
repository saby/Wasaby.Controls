define('Controls/interface/IStickyOpener', [], function() {

   /**
    * Interface for opener.
    *
    * @interface Controls/interface/IStickyOpener
    * @public
    */

   /**
    * @typedef {Object} VerticalAlignEnum
    * @variant top The popup is displayed at the top relative to the plot point.
    * @variant bottom The popup is displayed at the bottom relative to the plot point.
    */
   /**
    * @typedef {Object} VerticalAlign
    * @property {VerticalAlignEnum} side Type of vertical alignment
    * @property {Number} offset Sets vertical indentation in pixels relative to the point where the popup is drawn.
    */

   /**
    * @typedef {Object} HorizontalAlignEnum
    * @variant right The popup is displayed at the right relative to the plot point.
    * @variant left The popup is displayed at the left relative to the plot point.
    */
   /**
    * @typedef {Object} HorizontalAlign
    * @property {HorizontalAlignEnum} side Type of horizontal alignment
    * @property {Number} offset Sets horizontal indentation in pixels relative to the point where the popup is drawn.
    */

   /**
    * @typedef {Object} cornerVerticalEnum
    * @variant top Positioning to the top of the target
    * @variant bottom Positioning to the bottom of the target
    */
   /**
    * @typedef {Object} cornerHorizontalEnum
    * @variant left Positioning to the left of the target
    * @variant right Positioning to the right of the target
    */

   /**
    * @typedef {Object} CornerEnum
    * @property {cornerVerticalEnum} vertical Angle of vertical positioning.
    * @property {cornerHorizontalEnum} horizontal Angle of horizontal positioning.
    */


   /**
    * @name Controls/interface/IStickyOpener#popupOptions.verticalAlign
    * @cfg {VerticalAlign} Sets the vertical alignment of the popup.
    */

   /**
    * @name Controls/interface/IStickyOpener#popupOptions.locationStrategy
    * @cfg {String} A method of adjusting the popup panel to the free space next to the target.
    * @variant fixed the popup bar does not move relative to the target.
    * @variant fixedCorner the popup panel container is limited to the edge of the screen if it does not fit into the screen.
    * @variant auto
    */

   /**
    * @name Controls/interface/IStickyOpener#popupOptions.horizontalAlign
    * @cfg {HorizontalAlign} Sets the horizontal alignment of the popup.
    */

   /**
    * @name Controls/interface/IStickyOpener#popupOptions.corner
    * @cfg {HorizontalAlign} Sets the popup build point
    */

   /**
    * @name Controls/interface/IStickyOpener#targetTracking
    * @cfg {Boolean} Popup follows the target
    */

   /**
    * @name Controls/interface/IStickyOpener#closeOnTargetScroll
    * @cfg {Boolean} Close popup on scroll
    */
});
