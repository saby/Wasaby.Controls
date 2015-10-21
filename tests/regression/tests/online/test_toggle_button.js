var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.ToggleButton Online', function () {
    
    gemini.suite('with_icon32', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#ToggleButton4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 4"]', 40000);
                this.button = find('[name="ToggleButton 4"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('clicked', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })

            .capture('clicked off', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })
    });

    gemini.suite('primary_with_icon32', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#ToggleButton4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 4"]', 40000);
                this.button = find('[name="ToggleButton 4"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 4').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('clicked', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })

            .capture('clicked off', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })
    });

    gemini.suite('with_icon24', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#ToggleButton3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 3"]', 40000);
                this.button = find('[name="ToggleButton 3"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('clicked', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })

            .capture('clicked off', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })
    });

    gemini.suite('primary_with_icon24', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#ToggleButton3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 3"]', 40000);
                this.button = find('[name="ToggleButton 3"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 3').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('clicked', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })

            .capture('clicked off', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })
    });

    gemini.suite('with_icon16', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#ToggleButton2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 2"]', 40000);
                this.button = find('[name="ToggleButton 2"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('clicked', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })

            .capture('clicked off', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })
    });

    gemini.suite('primary_with_icon16', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#ToggleButton2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 2"]', 40000);
                this.button = find('[name="ToggleButton 2"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 2').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('clicked', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })

            .capture('clicked off', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })
    });

    gemini.suite('default', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#ToggleButton1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('clicked', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })

            .capture('clicked off', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })
    });

    gemini.suite('primary', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#ToggleButton1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.button = find('[name="ToggleButton 1"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('clicked', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })

            .capture('clicked off', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })
    });

    gemini.suite('disabled_with_icon32', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#ToggleButton4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 4"]', 40000);
                this.disabled = find('[name="ToggleButton 4"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 4').setEnabled(false);
                    window.$ws.single.ControlStorage.getByName('ToggleButton 4').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('disabled_primary_with_icon32', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#ToggleButton4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 4"]', 40000);
                this.disabled = find('[name="ToggleButton 4"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 4').setEnabled(false);
                    window.$ws.single.ControlStorage.getByName('ToggleButton 4').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('disabled_with_icon24', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#ToggleButton3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 3"]', 40000);
                this.disabled = find('[name="ToggleButton 3"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 3').setEnabled(false);
                    window.$ws.single.ControlStorage.getByName('ToggleButton 3').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('disabled_primary_with_icon24', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#ToggleButton3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 3"]', 40000);
                this.disabled = find('[name="ToggleButton 3"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 3').setEnabled(false);
                    window.$ws.single.ControlStorage.getByName('ToggleButton 3').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('disabled_with_icon16', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#ToggleButton2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 2"]', 40000);
                this.disabled = find('[name="ToggleButton 2"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 2').setEnabled(false);
                    window.$ws.single.ControlStorage.getByName('ToggleButton 2').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('disabled_primary_with_icon16', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#ToggleButton2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 2"]', 40000);
                this.disabled = find('[name="ToggleButton 2"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 2').setEnabled(false);
                    window.$ws.single.ControlStorage.getByName('ToggleButton 2').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('disabled_default', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#ToggleButton1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.disabled = find('[name="ToggleButton 1"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setEnabled(false);
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('disabled_primary', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#ToggleButton1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 1"]', 40000);
                this.disabled = find('[name="ToggleButton 1"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setEnabled(false);
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('big', function (test) {

        test.setUrl('/regression_button_online_10.html').setCaptureElements('#ToggleButton10')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 10"]', 40000);
                this.button = find('[name="ToggleButton 10"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('clicked', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })

            .capture('clicked off', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })
    });

    gemini.suite('primary_big', function (test) {

        test.setUrl('/regression_button_online_10.html').setCaptureElements('#ToggleButton10')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 10"]', 40000);
                this.button = find('[name="ToggleButton 10"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 10').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('clicked', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })

            .capture('clicked off', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })
    });

    gemini.suite('disabled_big', function (test) {

        test.setUrl('/regression_button_online_10.html').setCaptureElements('#ToggleButton10')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 10"]', 40000);
                this.disabled = find('[name="ToggleButton 10"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 10').setEnabled(false);
                    window.$ws.single.ControlStorage.getByName('ToggleButton 10').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('disabled_primary_big', function (test) {

        test.setUrl('/regression_button_online_10.html').setCaptureElements('#ToggleButton10')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 10"]', 40000);
                this.disabled = find('[name="ToggleButton 10"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 10').setEnabled(false);
                    window.$ws.single.ControlStorage.getByName('ToggleButton 10').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('big_with_icon32', function (test) {

        test.setUrl('/regression_button_online_11.html').setCaptureElements('#ToggleButton13')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 13"]', 40000);
                this.button = find('[name="ToggleButton 13"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('clicked', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })

            .capture('clicked off', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })
    });

    gemini.suite('primary_big_with_icon32', function (test) {

        test.setUrl('/regression_button_online_11.html').setCaptureElements('#ToggleButton13')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 13"]', 40000);
                this.button = find('[name="ToggleButton 13"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 13').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('clicked', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })

            .capture('clicked off', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })
    });

    gemini.suite('big_with_icon24', function (test) {

        test.setUrl('/regression_button_online_11.html').setCaptureElements('#ToggleButton12')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 12"]', 40000);
                this.button = find('[name="ToggleButton 12"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('clicked', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })

            .capture('clicked off', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })
    });

    gemini.suite('primary_big_with_icon24', function (test) {

        test.setUrl('/regression_button_online_11.html').setCaptureElements('#ToggleButton12')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 12"]', 40000);
                this.button = find('[name="ToggleButton 12"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 12').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('clicked', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })

            .capture('clicked off', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })
    });

    gemini.suite('big_with_icon16', function (test) {

        test.setUrl('/regression_button_online_11.html').setCaptureElements('#ToggleButton11')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 11"]', 40000);
                this.button = find('[name="ToggleButton 11"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('clicked', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })

            .capture('clicked off', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })
    });

    gemini.suite('primary_big_with_icon16', function (test) {

        test.setUrl('/regression_button_online_11.html').setCaptureElements('#ToggleButton11')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 11"]', 40000);
                this.button = find('[name="ToggleButton 11"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 11').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('clicked', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })

            .capture('clicked off', function (actions) {
                actions.click(this.button);
                actions.wait(500);
            })
    });



    gemini.suite('disabled_big_with_icon32', function (test) {

        test.setUrl('/regression_button_online_11.html').setCaptureElements('#ToggleButton13')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 13"]', 40000);
                this.disabled = find('[name="ToggleButton 13"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 13').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('disabled_primary_big_with_icon32', function (test) {

        test.setUrl('/regression_button_online_11.html').setCaptureElements('#ToggleButton13')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 13"]', 40000);
                this.disabled = find('[name="ToggleButton 13"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 13').setEnabled(false);
                    window.$ws.single.ControlStorage.getByName('ToggleButton 13').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('disabled_big_with_icon24', function (test) {

        test.setUrl('/regression_button_online_11.html').setCaptureElements('#ToggleButton12')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 12"]', 40000);
                this.disabled = find('[name="ToggleButton 12"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 12').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('disabled_primary_big_with_icon24', function (test) {

        test.setUrl('/regression_button_online_11.html').setCaptureElements('#ToggleButton12')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 12"]', 40000);
                this.disabled = find('[name="ToggleButton 12"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 12').setEnabled(false);
                    window.$ws.single.ControlStorage.getByName('ToggleButton 12').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('disabled_big_with_icon16', function (test) {

        test.setUrl('/regression_button_online_11.html').setCaptureElements('#ToggleButton11')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 11"]', 40000);
                this.disabled = find('[name="ToggleButton 11"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 11').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('disabled_primary_big_with_icon16', function (test) {

        test.setUrl('/regression_button_online_11.html').setCaptureElements('#ToggleButton11')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ToggleButton 11"]', 40000);
                this.disabled = find('[name="ToggleButton 11"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 11').setEnabled(false);
                    window.$ws.single.ControlStorage.getByName('ToggleButton 11').setPrimary(true);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });
});