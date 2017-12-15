/**
 * Created by gersa_000 on 30.10.2016.
 */
define('SBIS3.CONTROLS/Storages/SBIS/SBISClientsGlobalConfigStorage',
   [
      'SBIS3.CONTROLS/Storages/SBIS/SBISStorageAdapter',
      'Core/ClientsGlobalConfig',
      'SBIS3.CONTROLS/Interfaces/IStorage'
   ],

   function(SBISStorageAdapter, ClientsGlobalConfig) {

      'use strict';

      /**
       * Класс для взаимодействия с параметрами глобальной конфигурации Клиента
       * В качестве основного хранилища выступает бизнес-логика.
       * Все операции отражаются на глобальном контексте.
       *
       * @author Герасимов Александр
       * @class SBIS3.CONTROLS/Storages/SBIS/SBISClientsGlobalConfigStorage
       * @mixes SBIS3.CONTROLS/Interfaces/IStorage
       * @public
       */

      return new SBISStorageAdapter({storage: ClientsGlobalConfig});
   });