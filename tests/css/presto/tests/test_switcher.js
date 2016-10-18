/*
var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.Switcher Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_switcher_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Switcher 1"]', 40000);
                this.switcher = find('[name="Switcher 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.input);
				actions.click(this.input);
            })

            .capture('state_on', function (actions) {
                actions.click(this.switcher);
            })
    });

    gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_switcher_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Switcher 1"]', 40000);
                this.switcher = find('[name="Switcher 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Switcher 1').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.input);
				actions.click(this.input);
            })

            .capture('disabled_and_state_on', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Switcher 1').setEnabled(true);
                });
                actions.click(this.switcher);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Switcher 1').setEnabled(false);
                });
            })
    });
});*/