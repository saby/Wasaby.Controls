/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Format.FieldsFactory'
   ], function (FieldsFactory) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Format.FieldsFactory', function() {
         describe('.create()', function() {
            it('should throw an error if not simple object passed', function() {
               assert.throw(function () {
                  FieldsFactory.create();
               });
               assert.throw(function () {
                  FieldsFactory.create(null);
               });
               assert.throw(function () {
                  FieldsFactory.create(false);
               });
               assert.throw(function () {
                  FieldsFactory.create(true);
               });
               assert.throw(function () {
                  FieldsFactory.create(0);
               });
               assert.throw(function () {
                  FieldsFactory.create(1);
               });
               assert.throw(function () {
                  FieldsFactory.create('');
               });
               assert.throw(function () {
                  FieldsFactory.create([]);
               });
            });
            it('should throw an error for unknown type', function() {
               assert.throw(function () {
                  FieldsFactory.create({
                     type: 'a'
                  });
               });
            });
            it('should create boolean', function() {
               var field = FieldsFactory.create({
                  type: 'boolean'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.BooleanField'));
            });
            it('should create integer', function() {
               var field = FieldsFactory.create({
                  type: 'integer'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.IntegerField'));
            });
            it('should create real', function() {
               var field = FieldsFactory.create({
                  type: 'real'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.RealField'));
            });
            it('should create money', function() {
               var field = FieldsFactory.create({
                  type: 'money'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.MoneyField'));
            });
            it('should create string', function() {
               var field = FieldsFactory.create({
                  type: 'string'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.StringField'));
            });
            it('should create text', function() {
               var field = FieldsFactory.create({
                  type: 'text'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.TextField'));
            });
            it('should create xml', function() {
               var field = FieldsFactory.create({
                  type: 'xml'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.XmlField'));
            });
            it('should create datetime', function() {
               var field = FieldsFactory.create({
                  type: 'datetime'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.DateTimeField'));
            });
            it('should create date', function() {
               var field = FieldsFactory.create({
                  type: 'date'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.DateField'));
            });
            it('should create time', function() {
               var field = FieldsFactory.create({
                  type: 'time'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.TimeField'));
            });
            it('should create timeinterval', function() {
               var field = FieldsFactory.create({
                  type: 'timeinterval'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.TimeIntervalField'));
            });
            it('should create identity', function() {
               var field = FieldsFactory.create({
                  type: 'identity'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.IdentityField'));
            });
            it('should create enum', function() {
               var field = FieldsFactory.create({
                  type: 'enum'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.EnumField'));
            });
            it('should create flags', function() {
               var field = FieldsFactory.create({
                  type: 'flags'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.FlagsField'));
            });
            it('should create record', function() {
               var field = FieldsFactory.create({
                  type: 'record'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.RecordField'));
            });
            it('should create recordset', function() {
               var field = FieldsFactory.create({
                  type: 'recordset'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.RecordSetField'));
            });
            it('should create binary', function() {
               var field = FieldsFactory.create({
                  type: 'binary'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.BinaryField'));
            });
            it('should create uuid', function() {
               var field = FieldsFactory.create({
                  type: 'uuid'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.UuidField'));
            });
            it('should create rpcfile', function() {
               var field = FieldsFactory.create({
                  type: 'rpcfile'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.RpcFileField'));
            });
            it('should create hierarchy', function() {
               var field = FieldsFactory.create({
                  type: 'hierarchy'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.HierarchyField'));
            });
            it('should create object', function() {
               var field = FieldsFactory.create({
                  type: 'object'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.ObjectField'));
            });
            it('should create array', function() {
               var field = FieldsFactory.create({
                  type: 'array'
               });
               assert.isTrue($ws.helpers.instanceOfModule(field, 'SBIS3.CONTROLS.Data.Format.ArrayField'));
            });
         });
      });
   }
);
