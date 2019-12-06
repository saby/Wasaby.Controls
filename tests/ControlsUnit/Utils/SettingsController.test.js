define([
   'Controls/Application/SettingsController'
], function (SettingsController) {
   'use strict';

   describe('PropStorageUtil', function() {
      var mockedSettingsController = {
         storage: {
            '1': {
               firstProp: 1,
               secondProp: 2,
               thirdProp: 3
            },
            '2': {
               firstProp: 1,
               secondProp: 2,
               thirdProp: 3
            }
         },
         getSettings: function(propStorageIds) {
            var result = {};
            return new Promise((resolve) => {
               propStorageIds.forEach((id) => {
                  result[id] = this.storage[id];
               });
               resolve(result);
            });
         },
         setSettings: function(config) {
            for (let id in config) {
               if (config.hasOwnProperty(id)) {
                  for (let prop in config[id]) {
                     if (config.hasOwnProperty(id)) {
                        this.storage[id][prop] = config[id][prop];
                     }
                  }
               }
            }
         }
      };
      beforeEach(() => {
         SettingsController.setController(mockedSettingsController);
      });
      describe('check loaded data format', function() {
         it('one value', function(done) {
            SettingsController.loadSavedConfig('1', ['firstProp']).then((result) => {
               assert.deepEqual(result, {firstProp: 1});
               done();
            });
         });
         it('many values', function(done) {
            SettingsController.loadSavedConfig('1', ['firstProp', 'thirdProp']).then((result) => {
               assert.deepEqual(result, {firstProp: 1, thirdProp: 3});
               done();
            });
         });
      });
      describe('saving data', function() {
         it('one value', function(done) {
            SettingsController.saveConfig('2', ['fourthProp'], {fourthProp: 4});
            SettingsController.loadSavedConfig('2', ['fourthProp']).then((result) => {
               assert.deepEqual(result, {fourthProp: 4});
               done();
            });
         });
         it('many values', function(done) {
            SettingsController.saveConfig('2', ['firstProp', 'fourthProp'], {firstProp: 10, fourthProp: 40});
            SettingsController.loadSavedConfig('2').then((result) => {
               assert.deepEqual(result, {
                  firstProp: 10,
                  secondProp: 2,
                  thirdProp: 3,
                  fourthProp: 40
               });
               done();
            });
         });
      });
   });
});

