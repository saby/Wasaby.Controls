/**
 * Created by am.gerasimov on 18.01.2017.
 */
define('js!SBIS3.CONTROLS.SBISUserConfigStorage',
   [
      'js!SBIS3.CONTROLS.SBISStorageAdapter',
      'Core/UserConfig',
      'js!SBIS3.CONTROLS.IStorage'
   ],

   function(SBISStorageAdapter, UserConfig) {

      'use strict';

      /**
       * Класс для взаимодействия с параметрами пользовательской конфигурации.
       * В качестве основного хранилища выступает бизнес-логика, т.е. в отличие от класса {@link $ws.single.MicroSession}
       * пользовательские настройки сохраняются не только в рамках одной сессии, а для конкретного пользователя в базе данных.
       * Для работы с методами данного класса нужна авторизация.
       * Все операции отражаются на глобальном контексте.
       *
       * @author Герасимов Александр
       * @class SBIS3.CONTROLS.SBISUserConfigStorage
       * @mixes SBIS3.CONTROLS.IStorage
       * @public
       */

      return new SBISStorageAdapter({storage: UserConfig});
   });