var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.Switcher Online', function () {

    gemini.suite('default', function (test) {

        test.setUrl('/regression_switcher_online.html').setCaptureElements('#Switcher2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Switcher 2"]', 40000);
                this.switcher = find('[name="Switcher 2"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.switcher);
            })

            .capture('turn on', function (actions) {
                actions.click(this.switcher);
                actions.wait(500);
            })

            .capture('hovered turn on', function (actions) {
                actions.mouseMove(this.switcher);
            })
    });

    gemini.suite('disabled_off', function (test) {

        test.setUrl('/regression_switcher_online.html').setCaptureElements('#Switcher2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Switcher 2"]', 40000);
                this.switcher = find('[name="Switcher 2"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Switcher 2').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.switcher);
            })
    });

    gemini.suite('disabled_on', function (test) {

        test.setUrl('/regression_switcher_online.html').setCaptureElements('#Switcher2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Switcher 2"]', 40000);
                this.switcher = find('[name="Switcher 2"]');
                actions.click(this.switcher);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Switcher 2').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.switcher);
            })
    });
});