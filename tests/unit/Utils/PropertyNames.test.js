define([
      'SBIS3.CONTROLS/Utils/ImportExport/PropertyNames'
   ],

   function (PropertyNames) {
      'use strict';

      if (typeof mocha !== 'undefined') {
         mocha.setup({/*ignoreLeaks:true,*/ globals: [/*'*',*/ '__extends', 'sharedBusDebug']});
      }

      var personCCTLD = {
         NamePerson123: 'John',
         agePerson: 35,
         _BodyPerson: {
            _heightPerson: 180,
            WeightPerson: 80
         },
         city_Person: 'Moscow'
      };

      var targetPersonCCTLD = {
         name_person123: 'John',
         age_person: 35,
         __body_person: {
            _height_person: 180,
            weight_person: 80
         },
         city__person: 'Moscow'
      };

      var personLDTCC = {
         name_person: 'John',
         name_person_123: '123',
         age_person: 35,
         body_person: {
            height_person: 180,
            weight_person: 80
         },
         city_person_123: 'Moscow'
      };

      var targetPersonLDTCC = {
         namePerson: 'John',
         namePerson123: '123',
         agePerson: 35,
         bodyPerson: {
            heightPerson: 180,
            weightPerson: 80
         },
         cityPerson123: 'Moscow'
      };

      describe('Проверка на существование методов', function () {
         var checkMethods = function (target, methodName, argsCount) {
            it('Проверка наличия метода ' + methodName, function () {
               assert.equal((methodName in target), true);
               assert.equal((typeof target[methodName]), 'function');
               assert.equal(target[methodName].length, argsCount);
            });
         };

         //набор значений - имя метода : количество аргументов метода
         var methods = {
            camelCaseToLowDash: 1,
            lowDashToCamelCase: 1
         };

         for (var method in methods) {
            var argsCount = methods[method];
            checkMethods(PropertyNames, method, argsCount);
         }
      });

      describe('PropertyNames: camelCaseToLowDash', function () {
         it('Приведение имён свойств к нижнему регистру с разделителем вида "_"', function () {
            var lowDashPerson = PropertyNames.camelCaseToLowDash(personCCTLD);
            assert.deepEqual(lowDashPerson, targetPersonCCTLD);
         });
      });

      describe('PropertyNames: lowDashToCamelCase', function () {
         it('Приведение имён свойств к верблюжей нотации', function () {
            var camelCasePerson = PropertyNames.lowDashToCamelCase(personLDTCC);
            assert.deepEqual(camelCasePerson, targetPersonLDTCC);
         });
      });
   }
);
