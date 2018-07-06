define([
   'File/Attach/Option/Getter',
   'File/Attach/Option/GetterLazy',
   'Core/Deferred',
   'File/ResourceGetter/Base',
   'File/Attach/Option/Getters/FileSystem',
   'File/Attach/Option/Getters/PhotoCam',
   'File/Attach/Option/Getters/DropArea',
   'optional!SbisFile/Attach/Option/Getters/Clipboard',
   'optional!SbisFile/Attach/Option/Getters/Dialogs',
   'optional!SbisFile/Attach/Option/Getters/FileChooser',
   'optional!SbisFile/Attach/Option/Getters/Scanner'
], function (Getter, GetterLazy, Deferred, ResourceGetter,
             FileSystem, PhotoCam, DropArea, Clipboard, Dialogs, FileChooser, Scanner
) {
   'use strict';
   var options = [FileSystem, PhotoCam, DropArea, Clipboard, Dialogs, FileChooser, Scanner];
   var optionsTypes = [
       'FileSystem', 'PhotoCam', 'DropArea', 'ClipboardGetter',
       'DialogsGetter', 'FileChooser', 'ScannerGetter'
   ];
   describe('File/Attach/Option/ResourceGetter', function () {
       options.forEach(function(Option, index) {
           describe('File/Attach/Option/ResourceGetter#' + optionsTypes[index], function () {
               if (!Option) {
                   return; // Не подтянулся модуль SbisFile
               }
               it('static .getType()', function () {
                   assert.isFunction(Option.getType);
               });
               it('static .getType(): string', function () {
                   assert.isString(Option.getType());
               });
               it('static .getType() return current value', function () {
                   assert.equal(Option.getType(), optionsTypes[index]);
               });
               var param = {
                   element: typeof document === 'undefined'? 'div': document.createElement('div'),
                   maxSize: 10,
                   extensions: ['png', 'xml']
               };
               var option = new Option(param);
               if (option instanceof Getter) {
                   it('.getGetter(): File/ResourceGetter/Base', function () {
                       assert.instanceOf(option.getGetter(), ResourceGetter);
                   });
                   return;
               }
               if (option instanceof GetterLazy) {
                   it('.getType(): string', function () {
                       assert.isString(option.getType());
                   });
                   it('.getType() return current value', function () {
                       assert.equal(option.getType(), optionsTypes[index]);
                   });
                   it('.getLink(): string', function () {
                       assert.isString(option.getLink());
                   });
                   it('.getOptions(): object', function () {
                       assert.isObject(option.getOptions());
                   });
                   it('.getOptions() return current value', function () {
                       assert.equal(option.getOptions(), param);
                   });

               }
           });
       });
   });
});
