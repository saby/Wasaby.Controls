var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.Button Online', function () {

    gemini.suite('default', function (test) {

        test.setUrl('/regression_button_online.html').setCaptureElements('#Button2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 2"]', 40000);
                this.button = find('[name="Button 2"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_default', function (test) {

        test.setUrl('/regression_button_online.html').setCaptureElements('#Button5')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 5"]', 40000);
                this.disabled = find('[name="Button 5"]');
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('primary', function (test) {

        test.setUrl('/regression_button_online.html').setCaptureElements('#Button2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 2"]', 40000);
                this.button = find('[name="Button 2"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 2').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_primary', function (test) {

        test.setUrl('/regression_button_online.html').setCaptureElements('#Button5')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 5"]', 40000);
                this.disabled = find('[name="Button 5"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 5').setPrimary(true);
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

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#Button38')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 38"]', 40000);
                this.button = find('[name="Button 38"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_big', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#Button38')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 38"]', 40000);
                this.disabled = find('[name="Button 38"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 38').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('primary_big', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#Button38')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 38"]', 40000);
                this.button = find('[name="Button 38"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 38').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_primary_big', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#Button38')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 38"]', 40000);
                this.disabled = find('[name="Button 38"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 38').setPrimary(true);
                    window.$ws.single.ControlStorage.getByName('Button 38').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('big_with_icon16', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#Button39')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 39"]', 40000);
                this.button = find('[name="Button 39"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_big_with_icon16', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#Button39')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 39"]', 40000);
                this.disabled = find('[name="Button 39"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 39').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('primary_button_big_with_icon16', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#Button39')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 39"]', 40000);
                this.button = find('[name="Button 39"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 39').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_primary_big_with_icon16', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#Button39')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 39"]', 40000);
                this.disabled = find('[name="Button 39"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 39').setPrimary(true);
                    window.$ws.single.ControlStorage.getByName('Button 39').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('big_with_icon24', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#Button40')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 40"]', 40000);
                this.button = find('[name="Button 40"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_big_with_icon24', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#Button40')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 40"]', 40000);
                this.disabled = find('[name="Button 40"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 40').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('primary_button_big_with_icon24', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#Button40')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 40"]', 40000);
                this.button = find('[name="Button 40"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 40').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('primary_disabled_button_big_with_icon24', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#Button40')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 40"]', 40000);
                this.disabled = find('[name="Button 40"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 40').setPrimary(true);
                    window.$ws.single.ControlStorage.getByName('Button 40').setEnabled(false);
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

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#Button41')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 41"]', 40000);
                this.button = find('[name="Button 41"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_big_with_icon32', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#Button41')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 41"]', 40000);
                this.disabled = find('[name="Button 41"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 41').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('primary_big_with_icon32', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#Button41')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 41"]', 40000);
                this.button = find('[name="Button 41"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 41').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.button);
            })

            .after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('primary_disabled_big_with_icon32', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#Button41')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 41"]', 40000);
                this.disabled = find('[name="Button 41"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 41').setPrimary(true);
                    window.$ws.single.ControlStorage.getByName('Button 41').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.wait(100);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled);
            })
    });

    gemini.suite('with_auto_width', function (test) {

        test.setUrl('/regression_button_online_2.html').setCaptureElements('#Button9')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 9"]', 40000);
                this.auto = find('[name="Button 9"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.auto);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.auto);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.auto);
            })
    });

    gemini.suite('disabled_with_auto_width', function (test) {

        test.setUrl('/regression_button_online_2.html').setCaptureElements('#Button12')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 12"]', 40000);
                this.disabled_auto = find('[name="Button 12"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled_auto);
            })
    });

    gemini.suite('primary_with_auto_width', function (test) {

        test.setUrl('/regression_button_online_2.html').setCaptureElements('#Button9')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 9"]', 40000);
                this.auto = find('[name="Button 9"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 9').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.auto);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.auto);
            })

            .after(function (actions) {
                actions.mouseUp(this.auto);
            })
    });

    gemini.suite('disabled_primary_with_auto_width', function (test) {

        test.setUrl('/regression_button_online_2.html').setCaptureElements('#Button12')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 12"]', 40000);
                this.disabled_auto = find('[name="Button 12"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 12').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled_auto);
            })
    });

    gemini.suite('with_dotted_text', function (test) {

        test.setUrl('/regression_button_online_4.html').setCaptureElements('#Button18')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 18"]', 40000);
                this.dotted = find('[name="Button 18"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.dotted);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.dotted);
            })

            .after(function (actions) {
                actions.mouseUp(this.dotted);
            })
    });

    gemini.suite('disabled_button_with_dotted_text', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#Button20')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 20"]', 40000);
                this.dotted = find('[name="Button 20"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.dotted);
            })
    });

    gemini.suite('primary_with_dotted_text', function (test) {

        test.setUrl('/regression_button_online_4.html').setCaptureElements('#Button18')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 18"]', 40000);
                this.dotted = find('[name="Button 18"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 18').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.dotted);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.dotted);
            })

            .after(function (actions) {
                actions.mouseUp(this.dotted);
            })
    });

    gemini.suite('primary_disabled_button_with_dotted_text', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#Button20')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 20"]', 40000);
                this.dotted = find('[name="Button 20"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 20').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.dotted);
            })
    });

    gemini.suite('with_fixed_width', function (test) {

        test.setUrl('/regression_button_online_2.html').setCaptureElements('#Button10')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 10"]', 40000);
                this.fixed = find('[name="Button 10"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.fixed);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.fixed);
            })

            .after(function (actions) {
                actions.mouseUp(this.fixed);
            })
    });

    gemini.suite('disabled_with_fixed_width', function (test) {

        test.setUrl('/regression_button_online_2.html').setCaptureElements('#Button13')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 13"]', 40000);
                this.disabled_fixed = find('[name="Button 13"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled_fixed);
            })
    });

    gemini.suite('primary_with_fixed_width', function (test) {

        test.setUrl('/regression_button_online_2.html').setCaptureElements('#Button10')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 10"]', 40000);
                this.fixed = find('[name="Button 10"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 10').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.fixed);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.fixed);
            })

            .after(function (actions) {
                actions.mouseUp(this.fixed);
            })
    });

    gemini.suite('disabled_primary_with_fixed_width', function (test) {

        test.setUrl('/regression_button_online_2.html').setCaptureElements('#Button13')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 13"]', 40000);
                this.disabled_fixed = find('[name="Button 13"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 13').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled_fixed);
            })
    });

    gemini.suite('with_icon16', function (test) {

        test.setUrl('/regression_button_online.html').setCaptureElements('#Button3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 3"]', 40000);
                this.icon16 = find('[name="Button 3"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon16);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.icon16);
            })

            .after(function (actions) {
                actions.mouseUp(this.icon16);
            })
    });

    gemini.suite('primary_with_icon16', function (test) {

        test.setUrl('/regression_button_online.html').setCaptureElements('#Button3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 3"]', 40000);
                this.icon16 = find('[name="Button 3"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 3').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon16);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.icon16);
            })

            .after(function (actions) {
                actions.mouseUp(this.icon16);
            })
    });

    gemini.suite('disabled_with_icon16', function (test) {

        test.setUrl('/regression_button_online.html').setCaptureElements('#Button6')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 6"]', 40000);
                this.disabled_icon16 = find('[name="Button 6"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled_icon16);
            })
    });

    gemini.suite('disabled_primarywith_icon16', function (test) {

        test.setUrl('/regression_button_online.html').setCaptureElements('#Button6')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 6"]', 40000);
                this.disabled_icon16 = find('[name="Button 6"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 6').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled_icon16);
            })
    });

    gemini.suite('with_icon24', function (test) {

        test.setUrl('/regression_button_online.html').setCaptureElements('#Button1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.icon24 = find('[name="Button 1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon24);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.icon24);
            })

            .after(function (actions) {
                actions.mouseUp(this.icon24);
            })
    });

    gemini.suite('primary_with_icon24', function (test) {

        test.setUrl('/regression_button_online.html').setCaptureElements('#Button1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 1"]', 40000);
                this.icon24 = find('[name="Button 1"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon24);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.icon24);
            })

            .after(function (actions) {
                actions.mouseUp(this.icon24);
            })
    });

    gemini.suite('disabled_with_icon24', function (test) {

        test.setUrl('/regression_button_online_2.html').setCaptureElements('#Button7')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 7"]', 40000);
                this.disabled_icon16 = find('[name="Button 7"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled_icon16);
            })
    });

    gemini.suite('disabled_primary_with_icon24', function (test) {

        test.setUrl('/regression_button_online_2.html').setCaptureElements('#Button7')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 7"]', 40000);
                this.disabled_icon16 = find('[name="Button 7"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 7').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled_icon16);
            })
    });

    gemini.suite('with_icon32', function (test) {

        test.setUrl('/regression_button_online.html').setCaptureElements('#Button4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 4"]', 40000);
                this.icon32 = find('[name="Button 4"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon32);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.icon32);
            })

            .after(function (actions) {
                actions.mouseUp(this.icon32);
            })
    });

    gemini.suite('primary_with_icon32', function (test) {

        test.setUrl('/regression_button_online.html').setCaptureElements('#Button4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 4"]', 40000);
                this.icon32 = find('[name="Button 4"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 4').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon32);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.icon32);
            })

            .after(function (actions) {
                actions.mouseUp(this.icon32);
            })
    });

    gemini.suite('disabled_with_icon32', function (test) {

        test.setUrl('/regression_button_online_2.html').setCaptureElements('#Button8')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 8"]', 40000);
                this.disabled_icon16 = find('[name="Button 8"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled_icon16);
            })
    });

    gemini.suite('disabled_primary_with_icon32', function (test) {

        test.setUrl('/regression_button_online_2.html').setCaptureElements('#Button8')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 8"]', 40000);
                this.disabled_icon16 = find('[name="Button 8"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 8').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.disabled_icon16);
            })
    });

    gemini.suite('with_multicolumn_text', function (test) {

        test.setUrl('/regression_button_online_4.html').setCaptureElements('#Button17')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 17"]', 40000);
                this.multicolumn = find('[name="Button 17"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.multicolumn);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.multicolumn);
            })

            .after(function (actions) {
                actions.mouseUp(this.multicolumn);
            })
    });

    gemini.suite('primary_with_multicolumn_text', function (test) {

        test.setUrl('/regression_button_online_4.html').setCaptureElements('#Button17')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 17"]', 40000);
                this.multicolumn = find('[name="Button 17"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 17').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.multicolumn);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.multicolumn);
            })

            .after(function (actions) {
                actions.mouseUp(this.multicolumn);
            })
    });

    gemini.suite('disabled_with_multicolumn_text', function (test) {

        test.setUrl('/regression_button_online_4.html').setCaptureElements('#Button19')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 19"]', 40000);
                this.multicolumn = find('[name="Button 19"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.multicolumn);
            })
    });

    gemini.suite('disabled_primary_with_multicolumn_text', function (test) {

        test.setUrl('/regression_button_online_4.html').setCaptureElements('#Button19')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 19"]', 40000);
                this.multicolumn = find('[name="Button 19"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 19').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.multicolumn);
            })
    });

    gemini.suite('with_empty_caption', function (test) {

        test.setUrl('/regression_button_online_10.html').setCaptureElements('#Button45')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 45"]', 40000);
                this.empty = find('[name="Button 45"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.empty);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.empty);
            })

            .after(function (actions) {
                actions.mouseUp(this.empty);
            })
    });

    gemini.suite('disabled_with_empty_caption', function (test) {

        test.setUrl('/regression_button_online_10.html').setCaptureElements('#Button45')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 45"]', 40000);
                this.empty = find('[name="Button 45"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 45').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.empty);
            })
    });

    gemini.suite('big_with_empty_caption', function (test) {

        test.setUrl('/regression_button_online_10.html').setCaptureElements('#Button46')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 46"]', 40000);
                this.empty = find('[name="Button 46"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.empty);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.empty);
            })

            .after(function (actions) {
                actions.mouseUp(this.empty);
            })
    });

    gemini.suite('disabled_big_with_empty_caption', function (test) {

        test.setUrl('/regression_button_online_10.html').setCaptureElements('#Button46')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Button 46"]', 40000);
                this.empty = find('[name="Button 46"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 46').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.empty);
            })
    });
});