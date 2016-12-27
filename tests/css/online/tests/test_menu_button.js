var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.MenuButton Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_menu_button_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });

	gemini.suite('right_side', function (test) {

        test.setUrl('/regression_menu_button_online.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
					var offset = document.body.clientWidth - $('[sbisname="MenuButton 1"]').width()
                    window.$('[sbisname="MenuButton 1"]').offset({'left': offset});
                });
				actions.mouseMove(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });
	
	gemini.suite('bottom_side', function (test) {

        test.setUrl('/regression_menu_button_online.html').skip('firefox').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
                    window.$('[sbisname="MenuButton 1"]').offset({'top': 850});
                });
				actions.mouseMove(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });
	/*
	gemini.suite('bottom_right_side', function (test) {

        test.setUrl('/regression_menu_button_online.html').skip('firefox').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
					var offset = document.body.clientWidth - $('[sbisname="MenuButton 1"]').width()
                    window.$('[sbisname="MenuButton 1"]').offset({'left': offset, 'top': 850});
                });
				actions.mouseMove(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });*/

	gemini.suite('with_scroll', function (test) {

        test.setUrl('/regression_menu_button_online_21.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="21"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });

    gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_menu_button_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 13"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('base_without_menu', function (test) {

        test.setUrl('/regression_menu_button_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('activated', function (actions) {
                actions.mouseDown(this.button);
            })
			
			.after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_base_without_menu', function (test) {

        test.setUrl('/regression_menu_button_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('base_with_items_icon16_full', function (test) {

        test.setUrl('/regression_menu_button_online_7.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });

    gemini.suite('disabled_base_with_items_icon16_full', function (test) {

        test.setUrl('/regression_menu_button_online_7.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 21"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('base_with_items_icon16_half', function (test) {

        test.setUrl('/regression_menu_button_online_8.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });

    gemini.suite('disabled_base_with_items_icon16_half', function (test) {

        test.setUrl('/regression_menu_button_online_8.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('base_with_items_icon24_full', function (test) {

        test.setUrl('/regression_menu_button_online_9.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });

    gemini.suite('disabled_base_with_items_icon24_full', function (test) {

        test.setUrl('/regression_menu_button_online_9.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('base_with_items_icon24_half', function (test) {

        test.setUrl('/regression_menu_button_online_10.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });

    gemini.suite('disabled_base_with_items_icon24_half', function (test) {

        test.setUrl('/regression_menu_button_online_10.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('with_icon16', function (test) {

        test.setUrl('/regression_menu_button_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });

    gemini.suite('disabled_with_icon16', function (test) {

        test.setUrl('/regression_menu_button_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('with_icon16_without_menu', function (test) {

        test.setUrl('/regression_menu_button_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.text_box = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('activated', function (actions) {
                actions.mouseDown(this.button);
            })
			
			.after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_with_icon16_without_menu', function (test) {

        test.setUrl('/regression_menu_button_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('with_icon16_with_items_icon16_full', function (test) {

        test.setUrl('/regression_menu_button_online_11.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });

    gemini.suite('disabled_with_icon16_with_items_icon16_full', function (test) {

        test.setUrl('/regression_menu_button_online_11.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('with_icon16_with_items_icon16_half', function (test) {

        test.setUrl('/regression_menu_button_online_12.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });

    gemini.suite('disabled_with_icon16_with_items_icon16_half', function (test) {

        test.setUrl('/regression_menu_button_online_12.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('with_icon24', function (test) {

        test.setUrl('/regression_menu_button_online_5.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });

    gemini.suite('disabled_with_icon24', function (test) {

        test.setUrl('/regression_menu_button_online_5.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('with_icon24_without_menu', function (test) {

        test.setUrl('/regression_menu_button_online_6.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('activated', function (actions) {
                actions.mouseDown(this.button);
            })
			
			.after(function (actions) {
                actions.mouseUp(this.button);
            })
    });

    gemini.suite('disabled_with_icon24_without_menu', function (test) {

        test.setUrl('/regression_menu_button_online_6.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('with_icon24_with_items_icon24_full', function (test) {

        test.setUrl('/regression_menu_button_online_13.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });

    gemini.suite('disabled_with_icon24_with_items_icon24_full', function (test) {

        test.setUrl('/regression_menu_button_online_13.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('with_icon24_with_items_icon24_half', function (test) {

        test.setUrl('/regression_menu_button_online_14.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });

    gemini.suite('disabled_with_icon24_with_items_icon24_half', function (test) {

        test.setUrl('/regression_menu_button_online_14.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('base_with_submenu', function (test) {

        test.setUrl('/regression_menu_button_online_15.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
				this.item_3 = find('[data-id="3"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('submenu_opened', function (actions) {
                actions.mouseMove(this.item_1);
				actions.waitForElementToShow('[data-id="3"]', 1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_3);
            })
    });
    /*
	gemini.suite('right_side_with_submenu', function (test) {

        test.setUrl('/regression_menu_button_online_15.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
				this.item_3 = find('[data-id="3"]');
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
					var offset = document.body.clientWidth - $('[sbisname="MenuButton 1"]').width()
                    window.$('[sbisname="MenuButton 1"]').offset({'left': offset});
                });
				actions.mouseMove(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('submenu_opened', function (actions) {
                actions.mouseMove(this.item_1);
				actions.waitForElementToShow('[data-id="3"]', 1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_3);
            })
    });*/
	
	gemini.suite('bottom_side_with_submenu', function (test) {

        test.setUrl('/regression_menu_button_online_15.html').skip('firefox').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
                    window.$('[sbisname="MenuButton 1"]').offset({'top': 850});
                });
				actions.mouseMove(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });
	/*
	gemini.suite('bottom_right_side_with_submenu', function (test) {

        test.setUrl('/regression_menu_button_online_15.html').skip('firefox').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
					var offset = document.body.clientWidth - $('[sbisname="MenuButton 1"]').width()
                    window.$('[sbisname="MenuButton 1"]').offset({'left': offset, 'top': 850});
                });
				actions.mouseMove(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });*/

    gemini.suite('disabled_base_with_submenu', function (test) {

        test.setUrl('/regression_menu_button_online_15.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('with_submenu_icon16_and_item_icon16_full', function (test) {

        test.setUrl('/regression_menu_button_online_16.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
				this.item_3 = find('[data-id="3"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('submenu_opened', function (actions) {
                actions.mouseMove(this.item_1);
				actions.waitForElementToShow('[data-id="3"]', 1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_3);
            })
    });

    gemini.suite('disabled_with_submenu_icon16_and_item_icon16_full', function (test) {

        test.setUrl('/regression_menu_button_online_16.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('with_submenu_icon16_and_item_icon16_half', function (test) {

        test.setUrl('/regression_menu_button_online_17.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
				this.item_3 = find('[data-id="3"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('submenu_opened', function (actions) {
                actions.mouseMove(this.item_1);
				actions.waitForElementToShow('[data-id="3"]', 1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_3);
            })
    });

    gemini.suite('disabled_with_submenu_icon16_and_item_icon16_half', function (test) {

        test.setUrl('/regression_menu_button_online_17.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	
	gemini.suite('with_submenu_icon24_and_item_icon24_full', function (test) {

        test.setUrl('/regression_menu_button_online_18.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
				this.item_3 = find('[data-id="3"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('submenu_opened', function (actions) {
                actions.mouseMove(this.item_1);
				actions.waitForElementToShow('[data-id="3"]', 1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_3);
            })
    });

    gemini.suite('disabled_with_submenu_icon24_and_item_icon24_full', function (test) {

        test.setUrl('/regression_menu_button_online_18.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('with_submenu_icon24_and_item_icon24_half', function (test) {

        test.setUrl('/regression_menu_button_online_19.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
				this.item_3 = find('[data-id="3"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('submenu_opened', function (actions) {
                actions.mouseMove(this.item_1);
				actions.waitForElementToShow('[data-id="3"]', 1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_3);
            })
    });

    gemini.suite('disabled_with_submenu_icon24_and_item_icon24_half', function (test) {

        test.setUrl('/regression_menu_button_online_19.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	
	gemini.suite('with_submenu_and_item_icon24_half', function (test) {

        test.setUrl('/regression_menu_button_online_20.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
				this.item_3 = find('[data-id="3"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('submenu_opened', function (actions) {
                actions.mouseMove(this.item_1);
				actions.waitForElementToShow('[data-id="3"]', 1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_3);
            })
    });

    gemini.suite('disabled_with_submenu_and_item_icon24_half', function (test) {

        test.setUrl('/regression_menu_button_online_20.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });
	/*
	gemini.suite('opened_menu_not_scrolling', function (test) {

        test.setUrl('/regression_menu_button_online_22.html').skip('firefox').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.scroll = find('[sbisname="MenuButton 1"] ~ span ~ button');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })		
			
			.capture('scroll_down', function (actions) {
                actions.click(this.scroll);
				actions.wait(1000);
				actions.waitForJSCondition(function(window){
					return window.$('[sbisname="MenuButton 1"]').offset().top === 8;
                }, 2000);
            })
    });*/
	
	gemini.suite('with_picker_class_name', function (test) {

        test.setUrl('/regression_menu_button_online_23.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MenuButton 1"]', 40000);
                this.button = find('[name="MenuButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.text_box = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('[data-id="1"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.wait(1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
    });
});