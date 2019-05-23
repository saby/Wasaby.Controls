import Control = require('Core/Control');
import entity = require('Types/entity');
import template = require('wml!Controls/_progress/Legend/Legend');

var Legend;
   /// <amd-module name="Controls/_progress/Legend" />
/**
 * Legend for StateIndicator
 * @class Controls/_progress/Legend
 * @author Колесов В.А.
 */
var Legend = Control.extend(
   {
      _template: template
   });

Legend.getDefaultOptions = function getDefaultOptions() {
   return {
      theme: "default",
      /**
       * @typedef {Object} IndicatorCategory
       * @property {Number} value=0 Percents of the corresponding category
       * @property {String} className='' Name of css class, that will be applied to sectors of this category. If not specified, default color will be used
       * @property {String} title='' category note
       */
      /**
       * @cfg {Array.<IndicatorCategory>} Array of indicator categories
       * <pre class="brush:html">
       *   <Controls.progress:Legend data="{{[{value: 10, className: '', title: 'done'}]]}}"/>
       * </pre>
       */
      data: [{value:0, className:'', title:''}],
   };
};

Legend.getOptionTypes = function getOptionTypes() {
   return {
      data: entity.descriptor(Array),
   };
};

Legend._theme = ['Controls/progress'];

export default Legend;


