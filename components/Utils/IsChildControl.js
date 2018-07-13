define('SBIS3.CONTROLS/Utils/IsChildControl', function() {

    /**
     * Метод проверяет, является ли один контрол дочерним для другого.
     * @param {Lib/Control/Control} parent потенциальный родитель.
     * @param {Lib/Control/Control} child  потенциальный ребёнок
     * @returns {Boolean} Признак того, что элемент является дочерним.
     */
    //MOVE_TO ШИПИН
    return function(parent, child) {
        while (child && child !== parent) {
            child = child.getParent && child.getParent() || child.getOpener && child.getOpener();
        }
        return child === parent;
    };
});