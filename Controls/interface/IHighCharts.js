define('Controls/interface/IHighCharts', [], function () {

   /**
    * Interface for HighCharts
    * @mixin Controls/interface/IHighCharts
    * @public
    */

   /**
    * @name Controls/interface/IHighCharts#highChartOptions
    * @cfg {HighChartOptions} Full configuration for chart
    */

   /**
    * @function Controls/interface/IHighCharts#_drawChart Update chart by new config
    * @param {Object} config Options that were get on mount/update (to update chart you must create new Object with configuration)
    */

   /**
    * typedef {Object} HighChartOptions
    * @property {Chart} chart ChartOptions
    * @property {String[]} colors Array of using colors
    * @property {Credits} credits Option for HighCharts credits
    * @property {Legend} legend Option for Confignure legend of chart
    * @property {plotOptions} plotOptions Configuration for chart
    * @property {Title} title Configuration for title of chart
    * @property {Tooltip} tooltip Configuration for tooltip of chart
    * @property {xAxis} xAxis Configuration for axis X
    * @property {yAxis} yAxis Configuration for axis Y
    * @property {Object[]} series Data for chart
    */

   /**
    * typedef {Object} Chart
    * @property {chartType} type Type of chart
    * @property {Number} marginTop Top inner indent
    * @property {Number} marginRight Right inner indent
    * @property {Number} marginBottom Bottom inner indent
    * @property {Number} marginLeft Left inner indent
    * @property {Number} spacingTop Top outer indent
    * @property {Number} spacingRight Right outer indent
    * @property {Number} spacingBottom Bottom outer indent
    * @property {Number} spacingLeft Left outer indent
    */

   /**
    * typedef {Object} Credits
    * @property {Boolean} enabled Turn off/on credits of Highcharts.com
    */

   /**
    * typedef {Object} Legend
    * @property {Boolean} enabled Turn off/on the legend
    * @property {Number} width Width of the legend
    * @property {Number} height Height of the legend
    * @property {Number} x Horizontal offset
    * @property {Number} y Vertical offset
    * @property {Function} labelFormatter Rendering function of legend`s caption
    * @property {Align} align Align legend horizontally
    * @property {vAlign} verticalAlign Align legend vertically
    * @property {Layout} layout Positioning of elements
    * @property {Boolean} floating Position legend over the chart
    * @property {Number} margin Out indent from legend to chart(only without floating)
    * @property {Number} padding Inner indent
    * @property {Number} borderWidth Width of border
    * @property {Object.<string, number|string>} itemStyle Additional item`s CSS
    */

   /**
    * typedef {Object} plotOptions
    * @property {Column} column Configuration for columns
    * @property {Line} line Configuration for line
    * @property {Pie} pie Configuration for pie
    * @property {Series} series Configuration for series
    */

   /**
    * typedef {Object} Title
    * @property {Align} align Align title horizontally
    * @property {Boolean} floating Position title over the chart
    * @property {Number} margin Indents from title
    * @property {String} text Text of title
    * @property {Object.<string, number|string>} style Additional title CSS
    */

   /**
    * typedef {Object} Tooltip
    * @property {Boolean} enabled Turn off/on tooltips
    * @property {Boolean} shared General tooltip (all points with same X value highlights together)
    * @property {Function} formatter Rendering function for tooltips
    */

   /**
    * typedef {Object} xAxis
    * @property {Boolean} allowDecimals Turn off/on decimal values
    * @property {Number} gridLineWidth Width of grid lines
    * @property {Labels} labels Configuration for labels of marks on axis X
    * @property {Title} title Configuration for title(configure only text)
    * @property {Number} min Minimal value
    * @property {Number} max Maximum value
    */

   /**
    * typedef {Object} yAxis
    * @property {Boolean} allowDecimals Turn off/on decimal values
    * @property {Number} gridLineWidth Width of grid lines
    * @property {Labels} labels Configuration for labels of marks on axis X
    * @property {Number} lineWidth Width of line of axisY
    * @property {Title} title Configuration for title(configure only text)
    * @property {Number} staggerLines Quantity of lines for show off marks on axis X
    * @property {Number} step Step of caption for marks on axis X
    */

   /**
    * typedef {Object} chartType
    * @variant line Linear chart
    * @variant spline Linear smoothed chart
    * @variant pie Pie chart
    * @variant column Bar chart
    * @variant area Chart with area under
    * @variant areaspline Chart with smoothed area under
    * @variant scatter Dot chart
    * @variant arearange Interval chart
    * @variant aresplinerange Interval smoothed chart
    */

   /**
    * typedef {Object} Align
    * @variant center Align the legend to center
    * @variant left Align the legend to left
    * @variant right Align the legend to right
    */

   /**
    * typedef{Object} vAlign
    * @variant bottom Align the legend to bottom
    * @variant middle Align the legend to middle
    * @variant top Align the legend to top
    */

   /**
    * @typedef {Object} Layout
    * @variant horizontal Horizontal position of elements
    * @variant vertical Vertical position of elements
    */

   /**
    * typedef {Object} column
    * @property {dataLabels} dataLabels Configuration for captions
    * @property {Point} point Configuration for points
    * @property {typeStacking} stacking Configuration for stacking
    * @property {Number} borderWidth Width of line
    */

   /**
    * typedef {Object} dataLabels
    * @property {Number} distance Distance from chart to caption (for pie charts)
    * @property {Boolean} enabled Turn off/on captions of values
    * @property {String} color Color of captions
    * @property {String} format Format string
    * @property {Function} formatter Rendering function
    */

   /**
    * typedef {Object} Point
    * @property {Events} events Event handlers
    */

   /**
    * typedef {Object} Events
    * @property {Function} click Click on column event handler
    */

   /**
    * @typedef {Object} typeStacking
    * @variant null Missing
    * @variant normal By value
    */

   /**
    * typedef {Object} Line
    * @property {dataLables} dataLabels Configuration for captions
    * @property {Marker} marker Configuration for accentuate points
    * @property {Number} pointInterval Interval X of values (only if x is not defined)
    * @property {Boolean} connectEnds Turn off/on join beginning and ending of chart(only for polar charts)
    * @property {Boolean} connectNulls Turn off/on points with null value
    */

   /**
    * typedef {Object} Pie
    * @property {Boolean} Turn off/on accentuation sector by click
    * @property {dataLabels} dataLabels Configuration for captions
    * @property {Boolean} showInLegend Show series in legend
    */

   /**
    * typedef {Object} Marker
    * @property {Boolean} enabled Turn off/on accentuation of points
    * @property {Number} radius Radius of points
    * @property {Point} point Configuration for points
    */

   /**
    * typedef {Object} Series
    * @property {Boolean} animation Turn off/on animation of chart
    * @property {String} cursor Type of cursor
    * @property {dataLabels} dataLabels Configuration for captions
    * @property {Point} point Configuration for points
    */

   /**
    * typedef {Object} Labels
    * @property {Function} formatter Rendering functions for marks on axis X
    * @property {Number} staggerLines Quantity of lines for show off marks on axis X
    * @property {Number} step Step of caption for marks on axis X
    */

});