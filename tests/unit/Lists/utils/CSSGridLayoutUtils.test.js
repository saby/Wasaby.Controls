/**
 * @author Новожилов Игорь Александрович
 */
/* global describe, it, assert */
define([
   'js!Controls/List/resources/utils/CSSGridLayoutUtils'
], function (CSSGridLayoutUtils) {
   'use strict';

   var E_NOT_MATCH_COLUMNS = 'Полученный шаблон колонок не соответствует ожидаемому';
   var E_NOT_MATCH_AUTO_COLUMNS = 'Полученная ширина авто-колонки не соответствует ожидаемой';

   describe('Controls/List/resources/utils/CSSGridLayoutUtils', function () {

      it('calcGridTemplateColumns - expand-px', function () {
         var E_WIDTH_IS_NUMBER = 'Ширина колонки указанная как число не расширяется постфиксом "px"';
         var cols = CSSGridLayoutUtils.calcGridTemplateColumns([
            10, '10'
         ]);

         assert.equal(cols[0], '10px', E_WIDTH_IS_NUMBER);

         assert.equal(cols[1], '10px', E_WIDTH_IS_NUMBER);
      });

      it('calcGridTemplateColumns - new Array', function () {
         var originCols = ['10px', '10%'];
         var resultCols = CSSGridLayoutUtils.calcGridTemplateColumns(originCols);

         assert.notEqual(originCols, resultCols, 'Итоговый массив колонок не является новым массивом');
      });

      it('calcGridTemplateColumns - 0 auto 2 static', function () {
         var cols = CSSGridLayoutUtils.calcGridTemplateColumns([
            '10px', '10%'
         ]);

         assert.equal(cols.join(' '),
            '10px 10%',
            E_NOT_MATCH_COLUMNS);
      });

      it('calcGridTemplateColumns - 1 auto 2 static', function () {
         var cols = CSSGridLayoutUtils.calcGridTemplateColumns([
            '10px', '10%', 'auto'
         ]);

         assert.equal(cols[2],
            'calc( ( 100% - 10px - 10% ) / 1 )',
            E_NOT_MATCH_AUTO_COLUMNS);

         assert.equal(cols.join(' '),
            '10px 10% calc( ( 100% - 10px - 10% ) / 1 )',
            E_NOT_MATCH_COLUMNS);
      });

      it('calcGridTemplateColumns - 2 auto 2 static', function () {
         var cols = CSSGridLayoutUtils.calcGridTemplateColumns([
            '10px', 'auto', '10%', 'auto'
         ]);

         assert.equal(cols[1],
            'calc( ( 100% - 10px - 10% ) / 2 )',
            E_NOT_MATCH_AUTO_COLUMNS);

         assert.equal(cols.join(' '),
            '10px calc( ( 100% - 10px - 10% ) / 2 ) 10% calc( ( 100% - 10px - 10% ) / 2 )',
            E_NOT_MATCH_COLUMNS);
      });

      it('calcGridTemplateColumns - 2 auto 0 static', function () {
         var cols = CSSGridLayoutUtils.calcGridTemplateColumns([
            'auto', 'auto'
         ]);

         assert.equal(cols[0],
            'calc( 100% / 2 )',
            E_NOT_MATCH_AUTO_COLUMNS);

         assert.equal(cols.join(' '),
            'calc( 100% / 2 ) calc( 100% / 2 )',
            E_NOT_MATCH_COLUMNS);
      });

      it('calcGridTemplateColumns - 1 auto 0 static', function () {
         var cols = CSSGridLayoutUtils.calcGridTemplateColumns([
            'auto'
         ]);

         assert.equal(cols[0],
            'calc( 100% / 1 )',
            E_NOT_MATCH_AUTO_COLUMNS);

         assert.equal(cols.join(' '),
            'calc( 100% / 1 )',
            E_NOT_MATCH_COLUMNS);
      });

   });
});