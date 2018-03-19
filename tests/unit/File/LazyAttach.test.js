define([
   'Lib/File/Attach/LazyAttach',
   'Core/Deferred',
   'Lib/File/LocalFile',
   'Lib/File/LocalFileLink'
], function (LazyAttach, Deferred, LocalFile, LocalFileLink) {
   'use strict';

   describe('WS.Data/File/LazyAttach', function () {
      var attach = new LazyAttach();

      describe('.registerLazyGetter()\n   Ленивая регистрация экземпляра', function () {
         it('ScannerGetter', function () {
            attach.registerLazyGetter('ScannerGetter', 'SBIS3.Plugin/components/Extensions/Integration/FileGetter/ScannerGetter');
            var def = attach.choose('ScannerGetter');
            assert.isTrue(def.isSuccessful());
         });

         it('DialogsGetter', function () {
            attach.registerLazyGetter('DialogsGetter', 'SBIS3.Plugin/components/Extensions/Integration/FileGetter/DialogsGetter');
            var def = attach.choose('DialogsGetter');
            assert.isTrue(def.isSuccessful());
         });

         it('FileGetter', function () {
            attach.registerLazyGetter('FileGetter', 'SBIS3.Plugin/components/Extensions/Integration/FileGetter/FileGetter');
            var def = attach.choose('FileGetter');
            assert.isTrue(def.isSuccessful());
         });

         it('ClipboardGetter', function () {
            attach.registerLazyGetter('ClipboardGetter', 'SBIS3.Plugin/components/Extensions/Integration/FileGetter/ClipboardGetter');
            var def = attach.choose('ClipboardGetter');
            assert.isTrue(def.isSuccessful());
         });
      });

      describe('.registerLazySource()\n   Ленивая регистрация ISource для загрузки на ', function () {
         it('Бизнес-Логику через XHR запросы (BLXHR)', function () {
            attach.registerLazySource(LocalFile, 'WS.Data/Source/SbisFile');
            var def = attach.choose('FileGetter').addCallback(function () {
               attach.upload();
            });
            assert.isTrue(def.isSuccessful());
         });

         it('Бизнес-Логику через СБИС Плагин (BLPlugin)', function () {
            attach.registerLazySource(LocalFileLink, 'SBIS3.Plugin/components/Extensions/Integration/Source/BL_SbisPluginSource');
            var def = attach.choose('FileGetter').addCallback(function () {
               attach.upload();
            });
            assert.isTrue(def.isSuccessful());
         });

         it('FileTransfer через СБИС Плагин (FileTransferPlugin)', function () {
            attach.registerLazySource(LocalFileLink, 'SBIS3.Plugin/components/Extensions/Integration/Source/FileTransfer_SbisPluginSource');
            var def = attach.choose('FileGetter').addCallback(function () {
               attach.upload();
            });
            assert.isTrue(def.isSuccessful());
         });

         it('СБИС Диск через СБИС Плагин (SbisDiskPlugin)', function () {
            attach.registerLazySource(LocalFileLink, 'SBIS3.Plugin/components/Extensions/Integration/Source/SBISDisk_SbisPluginSource');
            var def = attach.choose('FileGetter').addCallback(function () {
               attach.upload();
            });
            assert.isTrue(def.isSuccessful());
         });

         it('СБИС Диск через Xhr - запрос (SbisDiskXHR)', function () {
            attach.registerLazySource(LocalFile, 'SbisDiskBase/Data/Source');
            var def = attach.choose('FileGetter').addCallback(function () {
               attach.upload();
            });
            assert.isTrue(def.isSuccessful());
         });
      });
   });
});
