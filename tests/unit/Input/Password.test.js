define(
    [
        'Controls/Input/Password',
        'Core/vdom/Synchronizer/resources/SyntheticEvent'
    ],
    function(Password, SyntheticEvent) {
        describe('password', function() {
            var passw = new Password({});

            it('Клик на иконку "Показать', function () {
                passw._toggleVisibilityHandler();
                assert.isTrue(passw._passwordVisible);
            });

            it('Клик на иконку "Скрыть', function () {
                passw._toggleVisibilityHandler();
                assert.isFalse(passw._passwordVisible);
            });

        })
});