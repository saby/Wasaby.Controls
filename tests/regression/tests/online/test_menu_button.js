var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.MenuButton Online', function () {

    gemini.suite('disabled_default', function (test) {

        test.setUrl('/regression_button_online_3.html').setCaptureElements('#MenuButton5')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 5"]', 40000);
                this.button = find('[name="MenuButton 5"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('disabled_primary_default', function (test) {

        test.setUrl('/regression_button_online_3.html').setCaptureElements('#MenuButton5')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 5"]', 40000);
                this.button = find('[name="MenuButton 5"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 5').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('disabled_with_icon16', function (test) {

        test.setUrl('/regression_button_online_4.html').setCaptureElements('#MenuButton6')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 6"]', 40000);
                this.icon16 = find('[name="MenuButton 6"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon16);
            })
    });

    gemini.suite('disabled_primary_with_icon16', function (test) {

        test.setUrl('/regression_button_online_4.html').setCaptureElements('#MenuButton6')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 6"]', 40000);
                this.icon16 = find('[name="MenuButton 6"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 6').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon16);
            })
    });

    gemini.suite('disabled_with_icon16_and_multicolomn_text', function (test) {

        test.setUrl('/regression_button_online_9.html').setCaptureElements('#MenuButton30')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 30"]', 40000);
                this.icon16 = find('[name="MenuButton 30"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon16);
            })
    });

    gemini.suite('disabled_primary_with_icon16_and_multicolomn_text', function (test) {

        test.setUrl('/regression_button_online_9.html').setCaptureElements('#MenuButton30')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 30"]', 40000);
                this.icon16 = find('[name="MenuButton 30"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 30').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon16);
            })
    });

    gemini.suite('disabled_with_icon24', function (test) {

        test.setUrl('/regression_button_online_4.html').setCaptureElements('#MenuButton7')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 7"]', 40000);
                this.icon24 = find('[name="MenuButton 7"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon24);
            })
    });

    gemini.suite('disabled_primary_with_icon24', function (test) {

        test.setUrl('/regression_button_online_4.html').setCaptureElements('#MenuButton7')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 7"]', 40000);
                this.icon24 = find('[name="MenuButton 7"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 7').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon24);
            })
    });

    gemini.suite('disabled_with_icon24_and_multicolomn_text', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#MenuButton31')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 31"]', 40000);
                this.icon24 = find('[name="MenuButton 31"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon24);
            })
    });

    gemini.suite('disabled_primary_with_icon24_and_multicolomn_text', function (test) {

        test.setUrl('/regression_button_online_7.html').setCaptureElements('#MenuButton31')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 31"]', 40000);
                this.icon24 = find('[name="MenuButton 31"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 31').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon24);
            })
    });

    gemini.suite('disabled_with_icon32', function (test) {

        test.setUrl('/regression_button_online_4.html').setCaptureElements('#MenuButton8')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 8"]', 40000);
                this.icon32 = find('[name="MenuButton 8"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon32);
            })
    });

    gemini.suite('disabled_primary_with_icon32', function (test) {

        test.setUrl('/regression_button_online_4.html').setCaptureElements('#MenuButton8')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 8"]', 40000);
                this.icon32 = find('[name="MenuButton 8"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 8').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon32);
            })
    });

    gemini.suite('disabled_with_icon32_and_multicolomn_text', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#MenuButton32')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 32"]', 40000);
                this.icon32 = find('[name="MenuButton 32"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon32);
            })
    });

    gemini.suite('disabled_primary_with_icon32_and_multicolomn_text', function (test) {

        test.setUrl('/regression_button_online_6.html').setCaptureElements('#MenuButton32')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 32"]', 40000);
                this.icon32 = find('[name="MenuButton 32"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 32').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon32);
            })
    });

    gemini.suite('disabled_and_multicolomn_text', function (test) {

        test.setUrl('/regression_button_online_5.html').setCaptureElements('#MenuButton29')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 29"]', 40000);
                this.button = find('[name="MenuButton 29"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('disabled_primary_and_multicolomn_text', function (test) {

        test.setUrl('/regression_button_online_5.html').setCaptureElements('#MenuButton29')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 29"]', 40000);
                this.button = find('[name="MenuButton 29"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 29').setPrimary(true);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('default', function (test) {

        test.setUrl('/regression_button_online_3.html').setCaptureElements('#MenuButton1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
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

    gemini.suite('default_item', function (test) {

        test.setUrl('/regression_button_online_3.html').setCaptureElements('#MenuButton1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
                actions.click(this.button);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.item1);
            })

            .after(function (actions) {
                actions.mouseUp(this.item1);
            })
    });

    gemini.suite('primary_default', function (test) {

        test.setUrl('/regression_button_online_3.html').setCaptureElements('#MenuButton1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setPrimary(true);
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

    gemini.suite('primary_default_item', function (test) {

        test.setUrl('/regression_button_online_3.html').setCaptureElements('#MenuButton1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setPrimary(true);
                });
                actions.click(this.button);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.item1);
            })

            .after(function (actions) {
                actions.mouseUp(this.item1);
            })
    });

    gemini.suite('with_icon16', function (test) {

        test.setUrl('/regression_button_online_3.html').setCaptureElements('#MenuButton2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 2"]', 40000);
                this.icon16 = find('[name="MenuButton 2"]');
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

    gemini.suite('with_icon16_item', function (test) {

        test.setUrl('/regression_button_online_3.html').setCaptureElements('#MenuButton2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 2"]', 40000);
                this.icon16 = find('[name="MenuButton 2"]');
                actions.click(this.icon16);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })
    });

    gemini.suite('primary_with_icon16', function (test) {

        test.setUrl('/regression_button_online_3.html').setCaptureElements('#MenuButton2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 2"]', 40000);
                this.icon16 = find('[name="MenuButton 2"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 2').setPrimary(true);
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

    gemini.suite('primary_with_icon16_item', function (test) {

        test.setUrl('/regression_button_online_3.html').setCaptureElements('#MenuButton2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 2"]', 40000);
                this.icon16 = find('[name="MenuButton 2"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 2').setPrimary(true);
                });
                actions.click(this.icon16);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })
    });

    gemini.suite('with_icon16_and_multicolomn_text', function (test) {

        test.setUrl('/regression_button_online_5.html').setCaptureElements('#MenuButton26')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 26"]', 40000);
                this.icon16 = find('[name="MenuButton 26"]');
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

    gemini.suite('with_icon16_and_multicolomn_text_item', function (test) {

        test.setUrl('/regression_button_online_5.html').setCaptureElements('#MenuButton26')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 26"]', 40000);
                this.icon16 = find('[name="MenuButton 26"]');
                actions.click(this.icon16);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })
    });

    gemini.suite('primary_with_icon16_and_multicolomn_text', function (test) {

        test.setUrl('/regression_button_online_5.html').setCaptureElements('#MenuButton26')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 26"]', 40000);
                this.icon16 = find('[name="MenuButton 26"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 26').setPrimary(true);
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

    gemini.suite('primary_with_icon16_and_multicolomn_text_item', function (test) {

        test.setUrl('/regression_button_online_5.html').setCaptureElements('#MenuButton26')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 26"]', 40000);
                this.icon16 = find('[name="MenuButton 26"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 26').setPrimary(true);
                });
                actions.click(this.icon16);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })
    });

    gemini.suite('with_icon24', function (test) {

        test.setUrl('/regression_button_online_8.html').setCaptureElements('#MenuButton3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 3"]', 40000);
                this.icon24 = find('[name="MenuButton 3"]');
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

    gemini.suite('with_icon24_item', function (test) {

        test.setUrl('/regression_button_online_8.html').setCaptureElements('#MenuButton3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 3"]', 40000);
                this.icon24 = find('[name="MenuButton 3"]');
                actions.click(this.icon24);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })
    });

    gemini.suite('primary_with_icon24', function (test) {

        test.setUrl('/regression_button_online_8.html').setCaptureElements('#MenuButton3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 3"]', 40000);
                this.icon24 = find('[name="MenuButton 3"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 3').setPrimary(true);
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

    gemini.suite('primary_with_icon24_item', function (test) {

        test.setUrl('/regression_button_online_8.html').setCaptureElements('#MenuButton3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 3"]', 40000);
                this.icon24 = find('[name="MenuButton 3"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 3').setPrimary(true);
                });
                actions.click(this.icon24);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })
    });

    gemini.suite('with_icon24_and_multicolomn_text', function (test) {

        test.setUrl('/regression_button_online_9.html').setCaptureElements('#MenuButton27')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 27"]', 40000);
                this.icon24 = find('[name="MenuButton 27"]');
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

    gemini.suite('with_icon24_and_multicolomn_text_item', function (test) {

        test.setUrl('/regression_button_online_9.html').setCaptureElements('#MenuButton27')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 27"]', 40000);
                this.icon24 = find('[name="MenuButton 27"]');
                actions.click(this.icon24);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })
    });

    gemini.suite('primary_with_icon24_and_multicolomn_text', function (test) {

        test.setUrl('/regression_button_online_9.html').setCaptureElements('#MenuButton27')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 27"]', 40000);
                this.icon24 = find('[name="MenuButton 27"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 27').setPrimary(true);
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

    gemini.suite('primary_with_icon24_and_multicolomn_text_item', function (test) {

        test.setUrl('/regression_button_online_9.html').setCaptureElements('#MenuButton27')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 27"]', 40000);
                this.icon24 = find('[name="MenuButton 27"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 27').setPrimary(true);
                });
                actions.click(this.icon24);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })
    });

    gemini.suite('with_icon32', function (test) {

        test.setUrl('/regression_button_online_8.html').setCaptureElements('#MenuButton4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 4"]', 40000);
                this.icon32 = find('[name="MenuButton 4"]');
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

    gemini.suite('with_icon32_item', function (test) {

        test.setUrl('/regression_button_online_8.html').setCaptureElements('#MenuButton4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 4"]', 40000);
                this.icon32 = find('[name="MenuButton 4"]');
                actions.click(this.icon32);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })
    });

    gemini.suite('primary_with_icon32', function (test) {

        test.setUrl('/regression_button_online_8.html').setCaptureElements('#MenuButton4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 4"]', 40000);
                this.icon32 = find('[name="MenuButton 4"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 4').setPrimary(true);
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

    gemini.suite('primary_with_icon32_item', function (test) {

        test.setUrl('/regression_button_online_8.html').setCaptureElements('#MenuButton4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 4"]', 40000);
                this.icon32 = find('[name="MenuButton 4"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 4').setPrimary(true);
                });
                actions.click(this.icon32);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })
    });

    gemini.suite('with_icon32_and_multicolomn_text', function (test) {

        test.setUrl('/regression_button_online_9.html').setCaptureElements('#MenuButton28')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 28"]', 40000);
                this.icon32 = find('[name="MenuButton 28"]');
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

    gemini.suite('with_icon32_and_multicolomn_text_item', function (test) {

        test.setUrl('/regression_button_online_9.html').setCaptureElements('#MenuButton28')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 28"]', 40000);
                this.icon32 = find('[name="MenuButton 28"]');
                actions.click(this.icon32);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })
    });

    gemini.suite('primary_with_icon32_and_multicolomn_text', function (test) {

        test.setUrl('/regression_button_online_9.html').setCaptureElements('#MenuButton28')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 28"]', 40000);
                this.icon32 = find('[name="MenuButton 28"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 28').setPrimary(true);
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

    gemini.suite('primary_with_icon32_and_multicolomn_text_item', function (test) {

        test.setUrl('/regression_button_online_9.html').setCaptureElements('#MenuButton28')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 28"]', 40000);
                this.icon32 = find('[name="MenuButton 28"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 28').setPrimary(true);
                });
                actions.click(this.icon32);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })
    });

    gemini.suite('with_multicolomn_text', function (test) {

        test.setUrl('/regression_button_online_5.html').setCaptureElements('#MenuButton25')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 25"]', 40000);
                this.button = find('[name="MenuButton 25"]');
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

    gemini.suite('with_multicolomn_text_item', function (test) {

        test.setUrl('/regression_button_online_5.html').setCaptureElements('#MenuButton25')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 25"]', 40000);
                this.button = find('[name="MenuButton 25"]');
                actions.click(this.button);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.item1);
            })

            .after(function (actions) {
                actions.mouseUp(this.item1);
            })
    });

    gemini.suite('primary_with_multicolomn_text', function (test) {

        test.setUrl('/regression_button_online_5.html').setCaptureElements('#MenuButton25')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 25"]', 40000);
                this.button = find('[name="MenuButton 25"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 25').setPrimary(true);
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

    gemini.suite('primary_with_multicolomn_text_item', function (test) {

        test.setUrl('/regression_button_online_5.html').setCaptureElements('#MenuButton25')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 25"]', 40000);
                this.button = find('[name="MenuButton 25"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 25').setPrimary(true);
                });
                actions.click(this.button);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.item1);
            })

            .after(function (actions) {
                actions.mouseUp(this.item1);
            })
    });

    gemini.suite('without_menu', function (test) {

        test.setUrl('/regression_button_online_12.html').setCaptureElements('#MenuButton21')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 21"]', 40000);
                this.button = find('[name="MenuButton 21"]');
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

    gemini.suite('primary_without_menu', function (test) {

        test.setUrl('/regression_button_online_12.html').setCaptureElements('#MenuButton21')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 21"]', 40000);
                this.button = find('[name="MenuButton 21"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 21').setPrimary(true);
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

    gemini.suite('disabled_without_menu', function (test) {

        test.setUrl('/regression_button_online_12.html').setCaptureElements('#MenuButton21')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 21"]', 40000);
                this.button = find('[name="MenuButton 21"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 21').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('disabled_primary_without_menu', function (test) {

        test.setUrl('/regression_button_online_12.html').setCaptureElements('#MenuButton21')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 21"]', 40000);
                this.button = find('[name="MenuButton 21"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 21').setPrimary(true);
                    window.$ws.single.ControlStorage.getByName('MenuButton 21').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
});