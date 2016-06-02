var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.Button Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_button_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_button_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('filled_base', function (test) {

        test.setUrl('/regression_button_online_12.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_filled_base', function (test) {

        test.setUrl('/regression_button_online_12.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('primary_base', function (test) {

        test.setUrl('/regression_button_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_primary_base', function (test) {

        test.setUrl('/regression_button_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });

            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('big_base', function (test) {

        test.setUrl('/regression_button_online_5.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_big_base', function (test) {

        test.setUrl('/regression_button_online_5.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('filled_big_base', function (test) {

        test.setUrl('/regression_button_online_13.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_filled_big_base', function (test) {

        test.setUrl('/regression_button_online_13.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('primary_big_base', function (test) {

        test.setUrl('/regression_button_online_5.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });


    gemini.suite('disabled_primary_big_base', function (test) {

        test.setUrl('/regression_button_online_5.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('with_icon16', function (test) {

        test.setUrl('/regression_button_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_with_icon16', function (test) {

        test.setUrl('/regression_button_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('primary_with_icon16', function (test) {

        test.setUrl('/regression_button_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_primary_with_icon16', function (test) {

        test.setUrl('/regression_button_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('big_with_icon16', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_big_with_icon16', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('primary_big_with_icon16', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_primary_big_with_icon16', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('with_icon24', function (test) {

        test.setUrl('/regression_button_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_with_icon24', function (test) {

        test.setUrl('/regression_button_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('primary_with_icon24', function (test) {

        test.setUrl('/regression_button_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_primary_with_icon24', function (test) {

        test.setUrl('/regression_button_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('big_with_icon24', function (test) {

        test.setUrl('/regression_button_online_8.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_big_with_icon24', function (test) {

        test.setUrl('/regression_button_online_8.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('primary_big_with_icon24', function (test) {

        test.setUrl('/regression_button_online_8.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_primary_big_with_icon24', function (test) {

        test.setUrl('/regression_button_online_8.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('with_empty_caption', function (test) {

        test.setUrl('/regression_button_online_2.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_with_empty_caption', function (test) {

        test.setUrl('/regression_button_online_2.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('primary_with_empty_caption', function (test) {

        test.setUrl('/regression_button_online_2.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_primary_with_empty_caption', function (test) {

        test.setUrl('/regression_button_online_2.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('big_with_empty_caption', function (test) {

        test.setUrl('/regression_button_online_10.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_big_with_empty_caption', function (test) {

        test.setUrl('/regression_button_online_10.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('primary_big_with_empty_caption', function (test) {

        test.setUrl('/regression_button_online_10.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_primary_big_with_empty_caption', function (test) {

        test.setUrl('/regression_button_online_10.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('ellipsis', function (test) {

        test.setUrl('/regression_button_online_9.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_ellipsis', function (test) {

        test.setUrl('/regression_button_online_9.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('primary_ellipsis', function (test) {

        test.setUrl('/regression_button_online_9.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_primary_ellipsis', function (test) {

        test.setUrl('/regression_button_online_9.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('big_ellipsis', function (test) {

        test.setUrl('/regression_button_online_11.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_big_ellipsis', function (test) {

        test.setUrl('/regression_button_online_11.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('primary_big_ellipsis', function (test) {

        test.setUrl('/regression_button_online_11.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_primary_big_ellipsis', function (test) {

        test.setUrl('/regression_button_online_11.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.button = find('[name="Button 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
});