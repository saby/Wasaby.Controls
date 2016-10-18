/*
var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.SwitcherDouble Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_switcher_double_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Switcher 1"]', 40000);
                this.switcher = find('[name="Switcher 1"] .controls-SwitcherDouble__toggle');
                this.unselected = find('.controls-SwitcherDouble__unselected');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.input);
				actions.click(this.input);
            })

            .capture('toggled', function (actions) {
                actions.click(this.switcher);
            })

            .capture('hovered_unselected', function (actions) {
                actions.mouseMove(this.unselected);
            })
    });

    gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_switcher_double_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Switcher 1"]', 40000);
                this.switcher = find('[name="Switcher 1"]');
                this.text = find('.controls-SwitcherDouble__text');
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

            .capture('hovered_text', function (actions) {
                actions.mouseMove(this.text);
            })
    });

    gemini.suite('vertical', function (test) {

        test.setUrl('/regression_switcher_double_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Switcher 1"]', 40000);
                this.switcher = find('[name="Switcher 1"] .controls-SwitcherDouble__toggle');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.input);
				actions.click(this.input);
            })

            .capture('toggled', function (actions) {
                actions.click(this.switcher);
            })
    });

    gemini.suite('disabled_vertical', function (test) {

        test.setUrl('/regression_switcher_double_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Switcher 1"]', 40000);
                this.switcher = find('[name="Switcher 1"]');
                this.text = find('.controls-SwitcherDouble__text');
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

            .capture('hovered_text', function (actions) {
                actions.mouseMove(this.text);
            })
    });

    gemini.suite('primary', function (test) {

        test.setUrl('/regression_switcher_double_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Switcher 1"]', 40000);
                this.switcher = find('[name="Switcher 1"]');
                this.unselected = find('.controls-SwitcherDouble__unselected');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain')

            .capture('hovered_unselected', function (actions) {
                actions.mouseMove(this.unselected);
            })
    });

    gemini.suite('disabled_primary', function (test) {

        test.setUrl('/regression_switcher_double_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Switcher 1"]', 40000);
                this.switcher = find('[name="Switcher 1"]');
                this.text = find('.controls-SwitcherDouble__text');
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

            .capture('hovered_text', function (actions) {
                actions.mouseMove(this.text);
            })
    });
});*/