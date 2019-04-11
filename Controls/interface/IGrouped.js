define('Controls/interface/IGrouped', [
], function() {

   /**
    * Interface for components implementing item grouping.
    *
    * @interface Controls/interface/IGrouped
    * @public
    * @author Авраменко А.С.
    */

   /**
    * @name Controls/interface/IGrouped#groupingKeyCallback
    * @cfg {Function} groupingKeyCallback Function that returns group identifier for a given item.
    * <a href="/materials/demo-ws4-list-group">Example</a>.
    */

   /**
    * @name Controls/interface/IGrouped#groupTemplate
    * @cfg {Function} groupTemplate Group template.
    * <a href="/materials/demo-ws4-list-group">Example</a>.
    * @remark
    * Base groupTemplate for Controls.list:View: "Controls/list:GroupTemplate".
    * Group template supports these parameters:
    * <ul>
    *    <li>separatorVisibility {Boolean} - The presence of a horizontal line - separator.</li>
    *    <li>expanderVisibility {Boolean} - The presence of a group expander.</li>
    *    <li>textAlign {String} - Group text horizontal alignment. Supported values: 'left' and 'right'. By default using center text alignment.</li>
    *    <li>rightTemplate {Function} - Template of group right part. May be using for rendering totals.</li>
    * </ul>
    * @example
    * Using custom parameters for group rendering in Controls.list:View without expander and with left text alignment:
    * <pre>
    *    <Controls.list:View
    *       <groupTemplate>
    *          <ws:partial template="Controls/list:GroupTemplate" expanderVisibility="{{ false }}" textAlign="left" />
    *       </groupTemplate>
    *    </Controls.list:View>
    * </pre>
    */

   /**
    * @name Controls/interface/IGrouped#collapsedGroups
    * @cfg {Array} collapsedGroups List of collapsed group identifiers. Identifiers of groups are obtained as a result of calling the groupingKeyCallback.
    * <a href="/materials/demo-ws4-list-group">Example</a>.
    */

   /**
    * @name Controls/interface/IGrouped#groupHistoryId
    * @cfg {String} groupHistoryId Unique id for save to history a list of identifiers collapsed groups.
    */

   /**
    * @event Controls/interface/IGrouped#groupExpanded Occurs after group expansion.
    * <a href="/materials/demo-ws4-list-group">Example</a>.
    */

   /**
    * @event Controls/interface/IGrouped#groupCollapsed Occurs after group collapse.
    * <a href="/materials/demo-ws4-list-group">Example</a>.
    */

});
