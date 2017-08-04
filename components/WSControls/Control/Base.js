/**
 * Created by dv.zuev on 02.06.2017.
 */
define('js!WSControls/Control/Base',
   ['Core/Control',
      'Core/IoC'],

   function (control, IoC) {

      'use strict';
      IoC.resolve('ILogger').error('Deprecated', 'Модуль WSControls/Control/Base объявлен deprecated и будет удален на днях. Bместо этого используйте Core/Control');
      return control;

   });