/**
 * Created by as.krasilnikov on 02.04.2018.
 */

      // Модуль, необходимый для работы окон/панелей в слое совместимости
      // В WS2/WS3 модулях нет возможности работать через события, чтобы вызвать методы по работе с окнами
      // т.к. хелперы/инстансы старых компонентов могут не лежать в верстке. (а если и лежат, то нет возможности общаться с Manager)
      export = {
         _manager: null,
         _container: null,
         _indicator: null,
         _popupHeaderTheme: undefined,
         setManager(manager) {
            this._manager = manager;
         },
         getManager() {
            return this._manager;
         },
         setContainer(container) {
            this._container = container;
         },
         setPopupHeaderTheme(themeName: string): void {
            this._popupHeaderTheme = themeName;
         },
         getPopupHeaderTheme(): string {
            return this._popupHeaderTheme;
         },

         // Регистрируем индикатор, лежащий в application.
         // Необходимо для того, чтобы старый индикатор на вдомной странице мог работать через новый компонент
         setIndicator(indicator) {
            this._indicator = indicator;
         },
         getIndicator() {
            return this._indicator;
         },
         getContainer() {
            return this._container;
         },

         popupUpdated(id) {
            return this._manager._eventHandler(null, 'popupUpdated', id);
         },

         /**
          * Найти popup
          */

         find() {
            return this._callManager('find', arguments);
         },

         /**
          * Удалить popup
          */

         remove() {
            return this._callManager('remove', arguments);
         },

         /**
          * Обновить popup
          */

         update() {
            return this._callManager('update', arguments);
         },

         updateOptionsAfterInitializing() {
            return this._callManager('updateOptionsAfterInitializing', arguments);
         },

         /**
          * Показать popup
          */

         show() {
            return this._callManager('show', arguments);
         },

         reindex() {
            return this._callManager('reindex', arguments);
         },

         isPopupCreating(id) {
            let item = this.find(id);

            // TODO заюзал константы напрямую, чтобы перенести BaseController в библиотку popupTemplate.
            // Надо разобраться с наследовниемю.
            // https://online.sbis.ru/opendoc.html?guid=983e303b-d56e-4072-84e9-8514f23efc0e
            return item && (item.popupState === 'initializing' || item.popupState === 'creating');
         },

         _callManager(methodName, args) {
            if (this._manager) {
               return this._manager[methodName].apply(this._manager, args || []);
            }
            return false;
         }
      };
