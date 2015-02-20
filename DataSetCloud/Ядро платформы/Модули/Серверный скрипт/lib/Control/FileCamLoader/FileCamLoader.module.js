/**
 * Модуль 'Компонент загрузки изображения с камеры'.
 * Умеет загружать файлы на сервер
 * @description
 */
define('js!SBIS3.CORE.FileCamLoader', [
   'js!SBIS3.CORE.FileLoaderAbstract',
   'js!SBIS3.CORE.Dialog',
   'is!browser?js!SBIS3.ENGINE.HintManager',
   'is!browser?js!SBIS3.CORE.FileCamLoader/resources/canvasToBlob',
   'js!SBIS3.CORE.LoadingIndicator',
   'css!SBIS3.CORE.FileCamLoader'
], function(FileLoaderAbstract, Dialog, HintManager, toBlob) {

   'use strict';

   var CAB_VERSION = "2,4,0,0";
   var SHOW_HINT_DELAY = 2000;
   var WAIT_USER_MEDIA = 15000;
   var MESSAGES = {
      permissionDenied: 'К сожалению, вы запретили доступ к устройствам мультимедиа, что не позволяет вам использовать веб-камеру. ' +
                        'Попробуйте изменить настройки доступа к камере, нажав кнопку <img style="margin-bottom: -' + ($ws._const.browser.chrome ? '6' : '3') + 'px" src="' +
                        $ws.helpers.processImagePath('js!SBIS3.CORE.FileCamLoader/resources/images/' + ($ws._const.browser.chrome ? 'chrome' : 'firefox') + 'PermissionDenied.png') +
                        '" /> в адресной строке.',
      noCamera: 'К сожалению, к вашему компьютеру не подключена камера.',
      noMedia: 'Не удалось получить доступ к устройствам мультимедиа.'
   };

   function getHintConfig() {
      var
         config = {
            uniqueName: 'CameraGui_0',
            controlName: 'CameraGui',
            myClass: 'CameraGui__hint',
            text: 'Для получения изображения необходимо разрешить доступ к вашей камере'
         },
         hintPosition = {
            chrome: {
               top: '50px',
               left: '750px'
            },
            firefox: {
               top: '100px',
               left: '500px'
            }
         },
         arrowClass = {
            chrome: 'top-right',
            firefox: 'top-left'
         },
         setStyles = function (browser) {
            config.hintPosition = hintPosition[browser];
            config.arrowClass = arrowClass[browser];
         };
      setStyles($ws._const.browser.chrome ? 'chrome'  :'firefox');
      return config;
   }

   function showHint() {
      if (HintManager) {
         HintManager.addHint(getHintConfig());
         HintManager.showImmediatly('CameraGui', true);
      }
   }

   function hideHint() {
      if (HintManager) {
         HintManager.hide();
         HintManager.refreshState();
      }
   }

   function showConnectingIndicator(message) {
      $ws.single.Indicator.setMessage(message);
   }

   function hideConnectingIndicator() {
      $ws.single.Indicator.hide();
   }

   function connectionInnit(connection, localVideo) {
      try {
         connection.setLocalVideoWindow(localVideo);
         connection.createPeerConnection(jsToSafeArray([]), true);
         return true;
      } catch(e) {}

      return false;
   }

   function connectionClose(connection) {
      try {
         connection.deletePeerConnection();
      } catch (e) {}
      $('object#cameraConnection').remove();
      $('object#cameraVideo').remove();
   }

   function jsToSafeArray(array) {
      if (array instanceof Array){
         var dict = new ActiveXObject('Scripting.Dictionary');

         for (var i = 0, length = array.length; i < length; i++){
            dict.add(i, jsToSafeArray(array[i]));
         }

         return dict.Items();
      }
      return array;
   }

   function showDialog(opener, stream, callback) {
      // Получаем окошко, подписываемся на onClose
      showConnectingIndicator('Пожалуйста, подождите');
      new Dialog({
         template: 'js!SBIS3.CORE.CameraWindow',
         opener: opener,
         resizable: false,
         border: false,
         handlers: {
            onBeforeShow: function() {
               hideConnectingIndicator();
               var container = this.getContainer(),
                   loadButton = this.getChildControlByName('loadButton'),
                   photoButton = this.getChildControlByName('photoButton'),
                   localVideo = container.find('#FileCamLoader-CameraWindow__localVideo')[0];

               container.css({padding: 0, border: '1px solid black'});
               photoButton.subscribe('onActivated', function() {
                  if (localVideo.paused) {
                     photoButton.setImage('sprite:icon-24 icon-Photo icon-primary');
                     loadButton.hide();
                     localVideo.play();
                  } else {
                     photoButton.setImage('sprite:icon-24 icon-WebCamera icon-primary');
                     loadButton.show();
                     localVideo.pause();
                  }
               });

               localVideo.src = window.URL.createObjectURL(stream);
            },
            onAfterClose: function(event, result) {
               if (!result) {
                  stream.stop();
                  callback(false);
               } else {
                  var container = this.getContainer(),
                      localVideo = container.find('#FileCamLoader-CameraWindow__localVideo')[0],
                      canvas = container.find('#FileCamLoader-CameraWindow__canvas')[0],
                      ctx = canvas.getContext('2d');

                  canvas.width = localVideo.videoWidth;
                  canvas.height = localVideo.videoHeight;
                  ctx.translate(canvas.width, 0);
                  ctx.scale(-1, 1);
                  ctx.drawImage(localVideo, 0, 0);

                  stream.stop();

                  callback(toBlob(canvas.toDataURL('image/png')));
               }
            }
         }
      });
   }

   function showDialogPlugin(opener, connection, callback) {
      // Получаем окошко, подписываемся на onClose
      showConnectingIndicator('Пожалуйста, подождите');
      new Dialog({
         template: 'js!SBIS3.CORE.CameraWindow',
         opener: opener,
         resizable: false,
         border: false,
         handlers: {
            onBeforeShow: function() {
               hideConnectingIndicator();
               var container = this.getContainer(),
                   loadButton = this.getChildControlByName('loadButton'),
                   photoButton = this.getChildControlByName('photoButton'),
                   localVideo = container.find('.FileCamLoader-CameraWindow__localVideo__video'),
                   activeXVideo = $('object#cameraVideo')[0];

               // Теперь из body перетащим object сюда
               var parent = localVideo.parent()[0];
               localVideo.remove();
               localVideo = activeXVideo;
               parent.appendChild(localVideo);

               // Так как IE не умеет выводить поверх object никакие теги, то придется сместить видео на 40px ниже
               $(localVideo)
                  .addClass('FileCamLoader-CameraWindow__localVideo__video')
                  .css({height: '480px', width: '640px', 'margin-top': '40px'});

               container
                  .css({padding: 0, border: '1px solid black', height: '520px'})
                  .find('.FileCamLoader-CameraWindow__body')
                     .css('height', '520px');

               photoButton.subscribe('onActivated', function() {
                  if (localVideo.paused) {
                     photoButton.setImage('sprite:icon-24 icon-Photo icon-primary');
                     loadButton.hide();
                     localVideo.play();
                  } else {
                     photoButton.setImage('sprite:icon-24 icon-WebCamera icon-primary');
                     loadButton.show();
                     localVideo.pause();
                  }
               });
            },
            onAfterClose: function(event, result) {
               if (!result) {
                  connectionClose(connection);
                  callback(false);
               } else {
                  var container = this.getContainer(),
                      localVideo = container.find('.FileCamLoader-CameraWindow__localVideo__video')[0];

                  connectionClose(connection);

                  if ($ws._const.browser.isIE8 || $ws._const.browser.isIE9) {
                     callback(localVideo.grabFrameAsPNGFile());
                  } else {
                     // Попробуем отправить xhr запросом
                     callback(toBlob('data:image/png;base64,' + localVideo.grabFrameAsBase64PNG()), true);
                  }
               }
            }
         }
      });
   }

   /**
    * @class $ws.proto.FileCamLoader
    * @extends $ws.proto.FileLoaderAbstract
    * @control
    */
   $ws.proto.FileCamLoader = FileLoaderAbstract.extend(/** @lends $ws.proto.FileCamLoader.prototype */{
      $constructor: function() {
         this._container = $(); // контейнер не нужен!
         this._options.opener = this._options.opener || $ws.single.WindowManager.getActiveWindow();
         $ws.single.CommandDispatcher.declareCommand(this, 'load', this.getImage);
      },

      _processLocalStream: function(stream, callback) {
         if (!stream.getVideoTracks().length) { // нет камеры
            stream.stop();
            callback(MESSAGES['noMedia']);
         } else {
            callback(stream);
         }
      },

      _processLocalStreamError: function(error, callback) {
         var permissionDeniedHandler = function() {
               callback(MESSAGES['permissionDenied']);
            },
            devicesNotFoundHandler = function() {
               callback(MESSAGES['noCamera']);
            },
            unknownErrorHandler = function () {
               callback(MESSAGES['noMedia']);
            };

         if (error.name){ // chrome
            switch (error.name) {
               case 'PermissionDismissedError': // запрет
               case 'PermissionDeniedError':
                  permissionDeniedHandler();
                  break;
               case 'DevicesNotFoundError': // нет устройства
                  devicesNotFoundHandler();
                  break;
               default:
                  unknownErrorHandler();
            }
         }
         else { // firefox
            if (error === 'PERMISSION_DENIED') {
               permissionDeniedHandler();
            } else {
               unknownErrorHandler();
            }
         }
      },

      _initUserMedia: function(callback) {
         var self = this,
            constraints = {
               'audio': false,
               'video': true
            },
            commonProcess = function () {
               clearTimeout(timerShowHint);
               clearTimeout(timerWaitUserMedia);
               hideConnectingIndicator();
               hideHint();
            },
            timerShowHint,
            timerWaitUserMedia,
            waitUserMediaDone = false;

         // Получаем собственные данные
         navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
         if (!navigator.getUserMedia) {
            callback(MESSAGES['noMedia']);
            return;
         }

         showConnectingIndicator('Пожалуйста, подтвердите использование камеры');
         timerShowHint = setTimeout(function () {
            showHint();
         }, SHOW_HINT_DELAY);

         timerWaitUserMedia = setTimeout(function () {
            commonProcess();
            callback(MESSAGES['noMedia']);
            waitUserMediaDone = true;
         }, WAIT_USER_MEDIA);

         navigator.getUserMedia(constraints, function (stream) {
            if (!waitUserMediaDone) {
               commonProcess();
               self._processLocalStream(stream, callback);
            } else {
               stream.stop();
            }
         }, function (e) {
            if (!waitUserMediaDone) {
               commonProcess();
               self._processLocalStreamError(e, callback);
            }
         });
      },

      _postBlob: function(image) {
         image.name = 'imageFromCamera.png';
         image.lastModifiedDate = new Date();
         this._notify('onChange', this._curval = decodeURIComponent(image.name), image);

         this._xhrPost([image]);
      },

      _getImage: function() {
         var self = this,
             opener = this._options.opener;
         this._initUserMedia(function(result) {
            if (typeof result == 'string') {
               self._logError(result, 'FileCamLoader');
               $ws.helpers.alert(result, {}, opener);
            } else {
               // Вот тут и показываем окошко с видео
               showDialog(opener, result, function(image) {
                  if (image) {
                     // Значит картинку сохранили
                     self._postBlob(image);
                  } else {
                     self._log('Нет снимка для загрузки.', 'FileCamLoader');
                  }
               });
            }
         });
      },

      //////////////////////////////////////////
      /// Вся работа с плагином тут
      //////////////////////////////////////////

      _processLocalStreamPlugin: function(connection, callback) {
         if (!connection.haveLocalVideoSource) {
            connectionClose(connection);
            callback(MESSAGES['noCamera']);
         }
         else {
            callback(connection);
         }
      },

      _processLocalStreamErrorPlugin: function(connection, callback) {
         connectionClose(connection);
         callback(MESSAGES['noMedia']);
      },

      _initUserMediaPlugin: function(callback) {
         var self = this,
            commonProcess = function () {
               clearInterval(timerInit);
               hideConnectingIndicator();
            },
            timerInit,
            waitUserMediaDone = 0;

         showConnectingIndicator('Идет инициализация веб камеры...');

         var connection = $('<object id="cameraConnection" codebase="' + $ws._const.wsRoot + 'lib/Control/FileCamLoader/resources/iewebrtc.cab#Version=' + CAB_VERSION + '" classid="CLSID:D33F6834-B6C5-46D5-A094-E1D6CE8EE702">[Object not available! Did you forget to build and register the server?]</object>')[0],
             localVideoElement = $('<object id="cameraVideo" codebase="' + $ws._const.wsRoot + 'lib/Control/FileCamLoader/resources/iewebrtc.cab#Version=' + CAB_VERSION + '" classid="CLSID:B9579B0A-B9DA-4526-9655-FB9D2C5C31B6">[Object not available! Did you forget to build and register the server?]</object>')[0],
             body = $ws._const.$body;

         body.append(connection);
         body.append(localVideoElement);

         timerInit = setInterval(function() {
            if (connectionInnit(connection, localVideoElement)) {
               commonProcess();
               self._processLocalStreamPlugin(connection, callback);
            } else {
               if(++waitUserMediaDone >= (WAIT_USER_MEDIA / 1000)) {
                  commonProcess();
                  self._processLocalStreamErrorPlugin(connection, callback);
               }
            }
         }, 1000);
      },

      _getImagePlugin: function() {
         var self = this,
             opener = this._options.opener;
         this._initUserMediaPlugin(function(result) {
            if (typeof result == 'string') {
               self._logError(result, 'FileCamLoader');
               $ws.helpers.alert(result, {}, opener);
            } else {
               // Вот тут и показываем окошко с видео
               showDialogPlugin(opener, result, function(image, base64) {
                  if (image) {
                     if (base64) {
                        self._postBlob(image);
                     } else {
                        self._post(image);
                     }
                  }
               });
            }
         });
      },

      //////////////////////////////////////////
      /// Конец
      //////////////////////////////////////////

      getImage: function() {
         // В IE нет поддержки камеры
         if ($ws._const.browser.isIE) {
            this._getImagePlugin();
         } else {
            this._getImage();
         }
      }
   });

   return $ws.proto.FileCamLoader;

});