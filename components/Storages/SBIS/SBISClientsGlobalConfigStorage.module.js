/**
 * Created by gersa_000 on 30.10.2016.
 */
define('js!SBIS3.CONTROLS.SBISClientsGlobalConfigStorage',
   [
      'js!SBIS3.CONTROLS.SBISStorageAdapter',
      'Core/ClientsGlobalConfig'
   ],

   function(SBISStorageAdapter, IStorage, ClientsGlobalConfig) {

      'use strict';

      /**
       * Класс для взаимодействия с параметрами глобальной конфигурации Клиента
       * В качестве основного хранилища выступает бизнес-логика.
       * Все операции отражаются на глобальном контексте.
       *
       * @author Герасимов Александр
       * @class SBIS3.CONTROLS.SBISClientsGlobalConfigStorage
       * @mixes SBIS3.CONTROLS.IStorage
       * @singleton
       * @public
       */

      return new SBISStorageAdapter({storage: ClientsGlobalConfig});
   });