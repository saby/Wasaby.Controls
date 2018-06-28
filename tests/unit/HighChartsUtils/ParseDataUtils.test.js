define([
   'Controls/HighCharts/resources/ParseDataUtil',
   'WS.Data/Collection/RecordSet'
], function(ParseDataUtil, RecordSet) {
   describe('Controls.HighCharts.resources.ParseDataUtil', function() {
      function labelsFormatterFunc() {
         return 1;
      }

      let wsAxisInstance = [{
            title: 'Default Title',
            gridLineWidth: 125,
            labelsFormatter: labelsFormatterFunc,
            staggerLines: 2,
            step: 3,
            lineWidth: 4,
            allowDecimals: true,
            min: 2,
            max: 10,
            linkedTo: 2,
            opposite: true,
            sourceField: 'fruits'
         }],
         wsAxisInstance2 = [{
            type: 'yAxis',
            title: 'Default Title',
            gridLineWidth: 125,
            labelsFormatter: labelsFormatterFunc,
            staggerLines: 2,
            step: 3,
            lineWidth: 4,
            allowDecimals: true,
            min: 2,
            max: 10,
            linkedTo: 2,
            opposite: true,
            sourceField: 'fruits'
         }],
         wsAxisInstanceNoTitle = [{
         }],
         wsSeriesInstance = [{
            sourceFieldX: 'title',
            sourceFieldY: 'value',
            color: 'red',
            xAxis: 2,
            yAxis: 2
         }],
         highChartsData = new RecordSet({
            rawData: [
               {
                  title: 'hello',
                  value: 5,
                  fruits: 'Apple'
               }
            ]
         }),
         wsSeriesInstance2 = [{
            sourceFieldY: 'value',
            type: 'pie',
            sourceField_3: 'color'
         }],
         wsSeriesInstance3 = [{
            sourceFieldY: 'value',
            type: 'pie'
         }];
      highChartsData2 = new RecordSet({
         rawData: [
            {
               value: 5,
               color: 'orange'
            }
         ]
      });

      describe('parseAxisCommon', () => {
         it('Title text exist test', () => {
            let result = ParseDataUtil.parseAxisCommon(wsAxisInstance);
            assert.equal(result.xAxis[0].title.text, wsAxisInstance[0].title);
         });
         it('Grid line width exist text', () => {
            let result = ParseDataUtil.parseAxisCommon(wsAxisInstance);
            assert.equal(result.xAxis[0].gridLineWidth, wsAxisInstance[0].gridLineWidth);
         });
         it('LabelsFormatter exist test', () => {
            let result = ParseDataUtil.parseAxisCommon(wsAxisInstance);
            assert.equal(result.xAxis[0].labels.formatter, wsAxisInstance[0].labelsFormatter);
         });
         it('Stagger lines exist test', () => {
            let result = ParseDataUtil.parseAxisCommon(wsAxisInstance);
            assert.equal(result.xAxis[0].labels.staggerLines, wsAxisInstance[0].staggerLines);
         });
         it('Step exist test', () => {
            let result = ParseDataUtil.parseAxisCommon(wsAxisInstance);
            assert.equal(result.xAxis[0].labels.step, wsAxisInstance[0].step);
         });
         it('Line width exist test', () => {
            let result = ParseDataUtil.parseAxisCommon(wsAxisInstance);
            assert.equal(result.xAxis[0].lineWidth, wsAxisInstance[0].lineWidth);
         });
         it('Allow decimals exist test', () => {
            let result = ParseDataUtil.parseAxisCommon(wsAxisInstance);
            assert.equal(result.xAxis[0].allowDecimals, wsAxisInstance[0].allowDecimals);
         });
         it('Minimal value exist test', () => {
            let result = ParseDataUtil.parseAxisCommon(wsAxisInstance);
            assert.equal(result.xAxis[0].min, wsAxisInstance[0].min);
         });
         it('Maximal value exist test', () => {
            let result = ParseDataUtil.parseAxisCommon(wsAxisInstance);
            assert.equal(result.xAxis[0].max, wsAxisInstance[0].max);
         });
         it('Linked to exist test', () => {
            let result = ParseDataUtil.parseAxisCommon(wsAxisInstance);
            assert.equal(result.xAxis[0].linkedTo, wsAxisInstance[0].linkedTo);
         });
         it('Opposite exist test', () => {
            let result = ParseDataUtil.parseAxisCommon(wsAxisInstance);
            assert.equal(result.xAxis[0].opposite, wsAxisInstance[0].opposite);
         });
         it('Source field exist test', () => {
            let result = ParseDataUtil.parseAxisCommon(wsAxisInstance);
            assert.equal(result.xAxis[0].sourceField, wsAxisInstance[0].sourceField);
         });
         it('No title test', () => {
            let result = ParseDataUtil.parseAxisCommon(wsAxisInstanceNoTitle);
            assert.equal(result.xAxis[0].title.text, '');
         });
         it('yAxis type test', () => {
            let result = ParseDataUtil.parseAxisCommon(wsAxisInstance2);
            assert.notEqual(result.yAxis, undefined);
         });
      });
      describe('recordSetParseAxis', () => {
         it('Category exist', () => {
            let
               tmpResult = ParseDataUtil.parseAxisCommon(wsAxisInstance),
               result = ParseDataUtil.recordSetParseAxis(tmpResult.xAxis, tmpResult.yAxis, highChartsData);
            assert.notEqual(result.xAxis[0].categories, undefined);
         });
      });
      describe('recordSetParse', () => {
         it('Default chart create test', () => {
            let result = ParseDataUtil.recordSetParse(wsSeriesInstance, highChartsData);
            assert.equal(result[0].type, wsSeriesInstance[0].type);
         });
         it('Color exist test', () => {
            let result = ParseDataUtil.recordSetParse(wsSeriesInstance, highChartsData);
            assert.equal(result[0].color, wsSeriesInstance[0].color);
         });
         it('xAxis exist test', () => {
            let result = ParseDataUtil.recordSetParse(wsSeriesInstance, highChartsData);
            assert.equal(result[0].xAxis, wsSeriesInstance[0].xAxis);
         });
         it('yAxis exist test', () => {
            let result = ParseDataUtil.recordSetParse(wsSeriesInstance, highChartsData);
            assert.equal(result[0].yAxis, wsSeriesInstance[0].yAxis);
         });
         it('SourceField Y & SourceField X exist test', () => {
            let result = ParseDataUtil.recordSetParse(wsSeriesInstance, highChartsData);
            assert.equal(result[0].data[0][1], highChartsData.at(0).get('value'));
         });
         it('SourceField X exist test', () => {
            let result = ParseDataUtil.recordSetParse(wsSeriesInstance, highChartsData);
            assert.equal(result[0].data[0][0], highChartsData.at(0).get('title'));
         });
         it('Only SourceField Y exist test', () => {
            let result = ParseDataUtil.recordSetParse(wsSeriesInstance2, highChartsData2);
            assert.equal(result[0].data[0][0], highChartsData2.at(0).get('value'));
         });
         it('Pie type of chart & color test', () => {
            let result = ParseDataUtil.recordSetParse(wsSeriesInstance2, highChartsData2);
            assert.equal(result[0].color, highChartsData2.at(0).get('color'));
         });
         it('Pie type of chart & no color test', () => {
            let result = ParseDataUtil.recordSetParse(wsSeriesInstance3, highChartsData2);
            assert.equal(result[0].color, undefined);
         });
      });
   });
});
