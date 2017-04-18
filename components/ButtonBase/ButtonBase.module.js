define('js!SBIS3.CONTROLS.ButtonBase', [
    'js!WS.Controls.ButtonBase',
    'Core/IoC'
], function(ButtonBase, IoC) {

    IoC.resolve('ILogger').info('Deprecated', 'Модуль SBIS3.CONTROLS.ButtonBase объявлен deprecated и будет удален в версии 3.7.5.200. Bместо этого используйте WS.Controls.ButtonBase');

    return ButtonBase;
});