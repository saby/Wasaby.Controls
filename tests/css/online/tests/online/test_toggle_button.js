var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.ToggleButton Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_toggle_button_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('checked', function (actions) {
                actions.click(this.button);
            })
    });

    gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_toggle_button_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('primary', function (test) {

        test.setUrl('/regression_toggle_button_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('checked', function (actions) {
                actions.click(this.button);
            })
    });

    gemini.suite('disabled_primary', function (test) {

        test.setUrl('/regression_toggle_button_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setPrimary(true);
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('big', function (test) {

        test.setUrl('/regression_toggle_button_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('checked', function (actions) {
                actions.click(this.button);
            })
    });

    gemini.suite('disabled_big', function (test) {

        test.setUrl('/regression_toggle_button_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('primary_big', function (test) {

        test.setUrl('/regression_toggle_button_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('checked', function (actions) {
                actions.click(this.button);
            })
    });

    gemini.suite('disabled_primary_big', function (test) {

        test.setUrl('/regression_toggle_button_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setPrimary(true);
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('with_icon16', function (test) {

        test.setUrl('/regression_toggle_button_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('checked', function (actions) {
                actions.click(this.button);
            })
    });

    gemini.suite('disabled_with_icon16', function (test) {

        test.setUrl('/regression_toggle_button_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('with_icon24', function (test) {

        test.setUrl('/regression_toggle_button_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('checked', function (actions) {
                actions.click(this.button);
            })
    });

    gemini.suite('disabled_with_icon24', function (test) {

        test.setUrl('/regression_toggle_button_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('big_with_icon16', function (test) {

        test.setUrl('/regression_toggle_button_online_5.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('checked', function (actions) {
                actions.click(this.button);
            })
    });

    gemini.suite('disabled_big_with_icon16', function (test) {

        test.setUrl('/regression_toggle_button_online_5.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('big_with_icon24', function (test) {

        test.setUrl('/regression_toggle_button_online_6.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('checked', function (actions) {
                actions.click(this.button);
            })
    });

    gemini.suite('disabled_big_with_icon24', function (test) {

        test.setUrl('/regression_toggle_button_online_6.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
});