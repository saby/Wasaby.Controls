define('Controls/HighChartsDS/Utils/ParseDataUtils', [], function() {
   return {
      parseAxisCommon: function(wsAxis) {
         var
            axisOpts = wsAxis,
            axisArr = [],
            xAxisArr = [],
            yAxisArr = [];


         for (var i = 0; i < axisOpts.length; i++) {
            axisArr[i] = {};

            /*прокидываем все опции*/
            if (axisOpts[i].title !== undefined) {
               axisArr[i].title = axisArr[i].title || {};
               axisArr[i].title.text = axisOpts[i].title;
            } else {
               axisArr[i].title = axisArr[i].title || {};
               axisArr[i].title.text = '';
            }
            if (axisOpts[i].gridLineWidth !== undefined) {
               axisArr[i].gridLineWidth = axisOpts[i].gridLineWidth;
            }
            if (axisOpts[i].labelsFormatter !== undefined) {
               axisArr[i].labels = axisArr[i].labels || {};
               axisArr[i].labels.formatter = axisOpts[i].labelsFormatter;
            }
            if (axisOpts[i].staggerLines !== undefined) {
               axisArr[i].labels = axisArr[i].labels || {};
               axisArr[i].labels.staggerLines = parseInt(axisOpts[i].staggerLines, 10);
            }
            if (axisOpts[i].step !== undefined) {
               axisArr[i].labels = axisArr[i].labels || {};
               axisArr[i].labels.step = parseInt(axisOpts[i].step, 10);
            }
            if (axisOpts[i].lineWidth !== undefined) {
               axisArr[i].lineWidth = parseInt(axisOpts[i].lineWidth, 10);
            }
            if (axisOpts[i].allowDecimals !== undefined) {
               axisArr[i].allowDecimals = axisOpts[i].allowDecimals;
            }
            if (axisOpts[i].min !== undefined) {
               axisArr[i].min = parseInt(axisOpts[i].min, 10);
            }
            if (axisOpts[i].max !== undefined) {
               axisArr[i].max = parseInt(axisOpts[i].max, 10);
            }
            if (axisOpts[i].linkedTo !== undefined) {
               axisArr[i].linkedTo = parseInt(axisOpts[i].linkedTo, 10);
            }
            if (axisOpts[i].opposite) {
               axisArr[i].opposite = true;
            }

            if (axisOpts[i].sourceField !== undefined) {
               axisArr[i].sourceField = axisOpts[i].sourceField;
            }

            /*прописываем тип, чтоб потом разделить на два массива*/
            if (axisOpts[i].type == 'yAxis') {
               axisArr[i].type = 'yAxis';
            } else {
               axisArr[i].type = 'xAxis';
            }

            /*опции которые задаем по умолчанию всегда*/
            axisArr[i].tickmarkPlacement = 'on';
         }


         /*разделяем массив осей на x и y*/
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
         var
            xAxis = xAxisOpts,
            yAxis = yAxisOpts,
            rs = recordSet;

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
         rs.each(function(rec) {
            iterate(xAxis, rec);
            iterate(yAxis, rec);
         });

         return {
            xAxis: xAxis,
            yAxis: yAxis
         };
      },
      recordSetParse: function(wsSeries, recordSet) {
         var
            seriesOpts = wsSeries,
            rs = recordSet,
            arr = [];


         rs.each(function(rec) {

            for (var i = 0; i < seriesOpts.length; i++) {
               if (!arr[i]) {
                  arr[i] = {
                     'data': [],
                     'type': seriesOpts[i].type,
                     'name': seriesOpts[i].name ? seriesOpts[i].name : 'График' + i
                  };
               }
               if (seriesOpts[i].color) {
                  arr[i].color = seriesOpts[i].color;
               }
               if (seriesOpts[i].xAxis !== undefined) {
                  arr[i].xAxis = parseInt(seriesOpts[i].xAxis, 10);
               }
               if (seriesOpts[i].yAxis !== undefined) {
                  arr[i].yAxis = parseInt(seriesOpts[i].yAxis, 10);
               }

               if (seriesOpts[i].sourceFieldY) {
                  if (seriesOpts[i].sourceFieldX) {
                     arr[i].data.push([
                        rec.get(seriesOpts[i].sourceFieldX),
                        rec.get(seriesOpts[i].sourceFieldY)
                     ]);
                  } else {
                     arr[i].data.push([rec.get(seriesOpts[i]).sourceFieldY]);
                  }
               }

               if (seriesOpts[i].type == 'pie') {
                  if (seriesOpts[i].sourceField_3) {
                     arr[i].color = rec.get(seriesOpts[i].sourceField_3);
                  }
               }

               if ((seriesOpts[i].type == 'areasplinerange') || (seriesOpts[i].type == 'arearange')) {
                  var lastDataElement = arr[i].data[arr[i].data.length - 1];
                  if (seriesOpts[i].sourceField_3 && lastDataElement.length == 2) {
                     lastDataElement.splice(2, rec.get(seriesOpts[i]).sourceField_3);
                  } else {
                     throw new Error(rk('Для графика-области надо определить 3 поля данных (ws-series.sourceField)'));
                  }
               }

            }
         });
         return arr.length ? arr : null;
      }
   };
});
