export default {
    addZIndex(zIndex: number): void {
        let oldWindowManager;
        if (requirejs.defined('Core/WindowManager')) {
            oldWindowManager = requirejs('Core/WindowManager');
        }
        // Сообщим старому WM про текущий zindex открываемого вдомного окна
        // Так как старый WM всегда сам назначал zindex, приходится лезть в приватные св-ва
        if (oldWindowManager) {
            if (oldWindowManager._acquireIndex < zIndex) {
                oldWindowManager._acquireIndex = zIndex;
                oldWindowManager._acquiredIndexes.push(zIndex);
                oldWindowManager.setVisible(zIndex);
            }
            oldWindowManager._popupZIndex = oldWindowManager._popupZIndex || [];
            oldWindowManager._popupZIndex.push(zIndex);

            // 1. Делаю notify всегда, т.к. в setVisible нотифай делается через setTimeout, из-за чего
            // могут промаргивать окна которые высчитывают свой zindex относительно других.
            // 2. В старом WM могут храниться не только zindex'ы от окон, например старый listView сохраняет свой
            // z-index в менеджер. Но такой zindex не участвует в обходе по поиску максимального zindex'a окон.
            // В итоге получаем что открываемое стековое окно меньше по zindex чем WM._acquireIndex, из-за чего
            // проверка выше не проходит. Делаю нотифай вручную, чтобы старый notificationController знал про
            // актуальные zindex'ы окон на странице.
            oldWindowManager._notify('zIndexChanged', zIndex);
        }
    },
    removeZIndex(zIndex: number): void {
        let oldWindowManager;
        if (requirejs.defined('Core/WindowManager')) {
            oldWindowManager = requirejs('Core/WindowManager');
        }
        if (oldWindowManager) {
            oldWindowManager.releaseZIndex(zIndex);

            oldWindowManager._popupZIndex = oldWindowManager._popupZIndex || [];
            const zIndexPosition = oldWindowManager._popupZIndex.indexOf(zIndex);
            if (zIndexPosition >= 0) {
                oldWindowManager._popupZIndex.splice(zIndexPosition, 1);
            }
        }
    }
};
