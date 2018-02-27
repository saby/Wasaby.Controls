define(
   [
      'Controls/Input/Mask/FormatBuilder'
   ],
   function(FormatBuilder) {

      'use strict';

      describe('Controls.Input.Mask.FormatBuilder', function() {
         var result;

         describe('_private.escapeRegSpecialChars', function() {
            it('Test_01', function() {
               result = FormatBuilder._private.escapeRegSpecialChars('');
               assert.equal(result, '');
            });
            it('Test_02', function() {
               result = FormatBuilder._private.escapeRegSpecialChars('123456789');
               assert.equal(result, '123456789');
            });
            it('Test_03', function() {
               result = FormatBuilder._private.escapeRegSpecialChars('1(2)3{4}5+6.7*8[9]');
               assert.equal(result, '1\\(2\\)3\\{4\\}5\\+6\\.7\\*8\\[9\\]');
            });
         });

         describe('_private.getMaskKeysString', function() {
            it('Test_01', function() {
               result = FormatBuilder._private.getMaskKeysString({});
               assert.equal(result, '');
            });
            it('Test_02', function() {
               result = FormatBuilder._private.getMaskKeysString({
                  'd': '[0-9]'
               });
               assert.equal(result, 'd');
            });
            it('Test_03', function() {
               result = FormatBuilder._private.getMaskKeysString({
                  'L': '[А-ЯA-ZЁ]',
                  'l': '[а-яa-zё]',
                  'd': '[0-9]',
                  'x': '[А-ЯA-Zа-яa-z0-9ёЁ]'
               });
               assert.equal(result, 'Lldx');
            });
         });

         describe('_private.getReplacingKeyAsValue', function() {
            it('Test_01', function() {
               result = FormatBuilder._private.getReplacingKeyAsValue({
                  'L': '[А-ЯA-ZЁ]',
                  'l': '[а-яa-zё]',
                  'd': '[0-9]',
                  'x': '[А-ЯA-Zа-яa-z0-9ёЁ]'
               }, 'd');
               assert.equal(result, '[0-9]?');
            });
         });

         describe('_private.getRegExpSearchingMaskChar', function() {
            it('Test_01', function() {
               result = FormatBuilder._private.getRegExpSearchingMaskChar('', '', '');
               assert.deepEqual(result, /(;$)|\\(\(\?:|\||\))|([])(?:\\({.*?}|.))?|(([])|([]))|(.)/g);
            });
            it('Test_02', function() {
               result = FormatBuilder._private.getRegExpSearchingMaskChar('d', '(', ')');
               assert.deepEqual(result, /(;$)|\\(\(\?:|\||\))|([d])(?:\\({.*?}|.))?|(([\(])|([\)]))|(.)/g);
            });
            it('Test_03', function() {
               result = FormatBuilder._private.getRegExpSearchingMaskChar('Lldx', '', '');
               assert.deepEqual(result, /(;$)|\\(\(\?:|\||\))|([Lldx])(?:\\({.*?}|.))?|(([])|([]))|(.)/g);
            });
            it('Test_04', function() {
               result = FormatBuilder._private.getRegExpSearchingMaskChar('', '(', ')');
               assert.deepEqual(result, /(;$)|\\(\(\?:|\||\))|([])(?:\\({.*?}|.))?|(([\(])|([\)]))|(.)/g);
            });
         });

         describe.skip('getFormat', function() {
            var
               masks = [
                  'dd.dd.dd',
                  '+7(ddd)ddd-dd-dd'
               ],
               formatMaskChars = {
                  'd': '[0-9]'
               },
               replacers = [
                  '',
                  ' '
               ];
            it('Test_01', function() {
               result = FormatBuilder.getFormat(masks[0], formatMaskChars, replacers[0]);
               assert.deepEqual(result, {
                  searchingGroups: '([0-9])?([0-9])?(\\.)?([0-9])?([0-9])?(\\.)?([0-9])?([0-9])?',
                  delimiterGroups: {
                     2: {
                        value: '.',
                        type: 'single'
                     },
                     5: {
                        value: '.',
                        type: 'single'
                     }
                  }
               });
            });
            it('Test_02', function() {
               result = FormatBuilder.getFormat(masks[0], formatMaskChars, replacers[1]);
               assert.deepEqual(result, {
                  searchingGroups: '((?:[0-9]| ))((?:[0-9]| ))(\\.)?((?:[0-9]| ))((?:[0-9]| ))(\\.)?((?:[0-9]| ))((?:[0-9]| ))',
                  delimiterGroups: {
                     2: {
                        value: '.',
                        type: 'single'
                     },
                     5: {
                        value: '.',
                        type: 'single'
                     }
                  }
               });
            });
            it('Test_03', function() {
               result = FormatBuilder.getFormat(masks[1], formatMaskChars, replacers[0]);
               assert.deepEqual(result, {
                  searchingGroups: '(\\+7)?(\\()?([0-9])?([0-9])?([0-9])?(\\))?([0-9])?([0-9])?([0-9])?(-)?([0-9])?([0-9])?(-)?([0-9])?([0-9])?',
                  delimiterGroups: {
                     0: {
                        value: '+7',
                        type: 'single'
                     },
                     1: {
                        value: '(',
                        type: 'pair'
                     },
                     5: {
                        value: ')',
                        type: 'pair'
                     },
                     9: {
                        value: '-',
                        type: 'single'
                     },
                     12: {
                        value: '-',
                        type: 'single'
                     }
                  }
               });
            });
            it('Test_04', function() {
               result = FormatBuilder.getFormat(masks[1], formatMaskChars, replacers[1]);
               assert.deepEqual(result, {
                  searchingGroups: '(\\+7)?(\\()?((?:[0-9]| ))((?:[0-9]| ))((?:[0-9]| ))(\\))?((?:[0-9]| ))((?:[0-9]| ))((?:[0-9]| ))(-)?((?:[0-9]| ))((?:[0-9]| ))(-)?((?:[0-9]| ))((?:[0-9]| ))',
                  delimiterGroups: {
                     0: {
                        value: '+7',
                        type: 'single'
                     },
                     1: {
                        value: '(',
                        type: 'pair'
                     },
                     5: {
                        value: ')',
                        type: 'pair'
                     },
                     9: {
                        value: '-',
                        type: 'single'
                     },
                     12: {
                        value: '-',
                        type: 'single'
                     }
                  }
               });
            });
         });
      });
   }
);