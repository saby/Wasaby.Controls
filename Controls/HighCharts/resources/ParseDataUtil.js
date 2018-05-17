define('Controls/HighCharts/resources/ParseDataUtil', ['Core/ILogger'], function(ILogger) {
   return {
      parseAxisCommon: function(wsAxis) {
         var
            axisArr = [],
            xAxisArr = [],
            yAxisArr = [];


         for (var i = 0; i < wsAxis.length; i++) {
            axisArr[i] = {};

            //Merge options from wsAxis to control options
            if (wsAxis[i].title !== undefined) {
               axisArr[i].title = axisArr[i].title || {};
               axisArr[i].title.text = wsAxis[i].title;
            } else {
               axisArr[i].title = axisArr[i].title || {};
               axisArr[i].title.text = '';
            }
            if (wsAxis[i].gridLineWidth !== undefined) {
               axisArr[i].gridLineWidth = wsAxis[i].gridLineWidth;
            }
            if (wsAxis[i].labelsFormatter !== undefined) {
               axisArr[i].labels = axisArr[i].labels || {};
               axisArr[i].labels.formatter = wsAxis[i].labelsFormatter;
            }
            if (wsAxis[i].staggerLines !== undefined) {
               axisArr[i].labels = axisArr[i].labels || {};
               axisArr[i].labels.staggerLines = parseInt(wsAxis[i].staggerLines, 10);
            }
            if (wsAxis[i].step !== undefined) {
               axisArr[i].labels = axisArr[i].labels || {};
               axisArr[i].labels.step = parseInt(wsAxis[i].step, 10);
            }
            if (wsAxis[i].lineWidth !== undefined) {
               axisArr[i].lineWidth = parseInt(wsAxis[i].lineWidth, 10);
            }
            if (wsAxis[i].allowDecimals !== undefined) {
               axisArr[i].allowDecimals = wsAxis[i].allowDecimals;
            }
            if (wsAxis[i].min !== undefined) {
               axisArr[i].min = parseInt(wsAxis[i].min, 10);
            }
            if (wsAxis[i].max !== undefined) {
               axisArr[i].max = parseInt(wsAxis[i].max, 10);
            }
            if (wsAxis[i].linkedTo !== undefined) {
               axisArr[i].linkedTo = parseInt(wsAxis[i].linkedTo, 10);
            }
            if (wsAxis[i].opposite) {
               axisArr[i].opposite = true;
            }

            if (wsAxis[i].sourceField !== undefined) {
               axisArr[i].sourceField = wsAxis[i].sourceField;
            }

            //Write down type to split to two arrays
            if (wsAxis[i].type == 'yAxis') {
               axisArr[i].type = 'yAxis';
            } else {
               axisArr[i].type = 'xAxis';
            }

            //Put default options
            axisArr[i].tickmarkPlacement = 'on';
         }

         //Split array of axis for xAxis and yAxis arrays
         for (i = 0; i < axisArr.length; i++) {
            if (axisArr[i].type == 'yAxis') {
               yAxisArr.push(axisArr[i]);
            } else {
               xAxisArr.push(axisArr[i]);
            }
            delete axisArr[i].type;
         }

         return {
            xAxis: xAxisArr.length ? xAxisArr : null,
            yAxis: yAxisArr.length ? yAxisArr : null
         };
      },

      recordSetParseAxis: function(xAxisOpts, yAxisOpts, recordSet) {
         var iterate = function(axis, rec) {
            if (axis) {
               for (var i = 0; i < axis.length; i++) {
                  if (axis[i].sourceField) {
                     if (!axis[i].categories) {
                        axis[i].categories = [];
                     }
                     axis[i].categories.push(rec.get(axis[i].sourceField));
                  }
               }
            }
         };
         recordSet.each(function(rec) {
            iterate(xAxisOpts, rec);
            iterate(yAxisOpts, rec);
         });

         return {
            xAxis: xAxisOpts,
            yAxis: yAxisOpts
         };
      },
      recordSetParse: function(wsSeries, recordSet) {
         var resultArr = [];


         recordSet.each(function(rec) {

            for (var i = 0; i < wsSeries.length; i++) {
               if (!resultArr[i]) {
                  resultArr[i] = {
                     'data': [],
                     'type': wsSeries[i].type,
                     'name': wsSeries[i].name ? wsSeries[i].name : 'График' + i
                  };
               }
               if (wsSeries[i].color) {
                  resultArr[i].color = wsSeries[i].color;
               }
               if (wsSeries[i].xAxis !== undefined) {
                  resultArr[i].xAxis = parseInt(wsSeries[i].xAxis, 10);
               }
               if (wsSeries[i].yAxis !== undefined) {
                  resultArr[i].yAxis = parseInt(wsSeries[i].yAxis, 10);
               }

               if (wsSeries[i].sourceFieldY) {
                  if (wsSeries[i].sourceFieldX) {
                     resultArr[i].data.push([
                        rec.get(wsSeries[i].sourceFieldX),
                        rec.get(wsSeries[i].sourceFieldY)
                     ]);
                  } else {
                     resultArr[i].data.push([rec.get(wsSeries[i].sourceFieldY)]);
                  }
               }

               if (wsSeries[i].type == 'pie') {
                  if (wsSeries[i].sourceField_3) {
                     resultArr[i].color = rec.get(wsSeries[i].sourceField_3);
                  }
               }

               if ((wsSeries[i].type == 'areasplinerange') || (wsSeries[i].type == 'arearange')) {
                  var lastDataElement = resultArr[i].data[resultArr[i].data.length - 1];
                  if (wsSeries[i].sourceField_3 && lastDataElement.length == 2) {
                     lastDataElement.splice(2, 0, rec.get(wsSeries[i]).sourceField_3);
                  } else {
                     ILogger.error('HighCharts', 'You must terminate 3 fields of data for area chart');
                  }
               }

            }
         });
         return resultArr.length ? resultArr : null;
      }
   };
});
