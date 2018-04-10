define('SBIS3.CONTROLS/Button/ButtonGroup/ButtonBase', [
    'SBIS3.CONTROLS/WSControls/Buttons/ButtonBase',
    'Core/IoC'
], function(ButtonBase, IoC) {

    IoC.resolve('ILogger').info('Deprecated', 'Модуль SBIS3.CONTROLS/Button/ButtonGroup/ButtonBase объявлен deprecated и будет удален в версии 3.7.5.200. Bместо этого используйте WSControls/Buttons/ButtonBase');

    return ButtonBase;
});
