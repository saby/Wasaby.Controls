gemini.suite('SBIS3.CONTROLS.MenuButton Carry', function () {
	
    gemini.suite('base', function (test) {

        test.setUrl('/regression_menu_button_carry.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="MenuButton 1"]';
                this.text_box = '[sbisname="TextBox 1"] input';
				this.item_1 = '[data-id="1"]';
				this.item_2 = '[data-id="2"]';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.text_box, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow(this.item_1, 5000);
				actions.waitForElementToShow(this.item_2, 5000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
			
			.capture('disabled', function (actions) {
				actions.click(this.text_box);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })
    });

	gemini.suite('right_side', function (test) {

        test.setUrl('/regression_menu_button_carry.html').setCaptureElements('html')

            .before(function (actions) {
                
				this.button = '[name="MenuButton 1"]';
                this.text_box = '[sbisname="TextBox 1"] input';
				this.item_1 = '[data-id="1"]';
				this.item_2 = '[data-id="2"]';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.text_box, 5000);
            })

            .capture('right_side', function (actions) {
                actions.executeJS(function (window) {
					var offset = document.body.clientWidth - $('[sbisname="MenuButton 1"]').width()
                    window.$('[sbisname="MenuButton 1"]').offset({'left': offset});
                });
				actions.mouseMove(this.text_box);
            })
			
			.capture('right_side_and_opened_menu', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow(this.item_1, 5000);
				actions.waitForElementToShow(this.item_2, 5000);
            })
			
			.capture('bottom_right_side', function (actions) {
                actions.click(this.text_box);
				actions.executeJS(function (window) {
                    window.$('[sbisname="MenuButton 1"]').offset({'top': 630});
                });
				actions.mouseMove(this.text_box);
            })
			
			.capture('bottom_right_side_and_opened_menu', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow(this.item_1, 5000);
				actions.waitForElementToShow(this.item_2, 5000);
            })
			
			.capture('bottom_side', function (actions) {
                actions.click(this.text_box);
                actions.executeJS(function (window) {
					var offset = document.body.clientWidth - $('[sbisname="MenuButton 1"]').width()
                    window.$('[sbisname="MenuButton 1"]').offset({'left': 10});
                });
				actions.mouseMove(this.text_box);
            })
			
			.capture('bottom_side_and_opened_menu', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow(this.item_1, 5000);
				actions.waitForElementToShow(this.item_2, 5000);
            })
    });
	
	gemini.suite('base_and_half_items_have_icon16', function (test) {

        test.setUrl('/regression_menu_button_carry_8.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="MenuButton 1"]';
                this.text_box = '[sbisname="TextBox 1"] input';
				this.item_1 = '[data-id="1"]';
				this.item_2 = '[data-id="2"]';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.text_box, 5000);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow(this.item_1, 5000);
				actions.waitForElementToShow(this.item_2, 5000);
            })
    });	
	
	gemini.suite('base_and_half_items_have_icon24', function (test) {

        test.setUrl('/regression_menu_button_carry_10.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="MenuButton 1"]';
                this.text_box = '[sbisname="TextBox 1"] input';
				this.item_1 = '[data-id="1"]';
				this.item_2 = '[data-id="2"]';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.text_box, 5000);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow(this.item_1, 5000);
				actions.waitForElementToShow(this.item_2, 5000);
            })
    });

	gemini.suite('with_icon16', function (test) {

        test.setUrl('/regression_menu_button_carry_3.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="MenuButton 1"]';
                this.text_box = '[sbisname="TextBox 1"] input';
				this.item_1 = '[data-id="1"]';
				this.item_2 = '[data-id="2"]';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.text_box, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow(this.item_1, 5000);
				actions.waitForElementToShow(this.item_2, 5000);
            })
			
			.capture('disabled', function (actions) {
				actions.click(this.text_box);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })
    });	

	gemini.suite('with_icon24', function (test) {

        test.setUrl('/regression_menu_button_carry_5.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="MenuButton 1"]';
                this.text_box = '[sbisname="TextBox 1"] input';
				this.item_1 = '[data-id="1"]';
				this.item_2 = '[data-id="2"]';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.text_box, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);
                });
            })
    });
	
	gemini.suite('with_icon24_and_half_items_have_icon24', function (test) {

        test.setUrl('/regression_menu_button_carry_14.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[name="MenuButton 1"]';
                this.text_box = '[sbisname="TextBox 1"] input';
				this.item_1 = '[data-id="1"]';
				this.item_2 = '[data-id="2"]';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.text_box, 5000);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow(this.item_1, 5000);
				actions.waitForElementToShow(this.item_2, 5000);
            })
    });

	gemini.suite('base_with_submenu', function (test) {

        test.setUrl('/regression_menu_button_carry_15.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[name="MenuButton 1"]';
                this.text_box = '[sbisname="TextBox 1"] input';
				this.item_1 = '[data-id="1"]';
				this.item_2 = '[data-id="2"]';
				this.item_3 = '[data-id="2"]';
				this.arrow = '.controls-Menu__hasChild';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.text_box, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.text_box);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow(this.item_1, 5000);
				actions.waitForElementToShow(this.item_2, 5000);
				actions.waitForElementToShow(this.arrow, 5000);
            })
			
			.capture('submenu_opened', function (actions) {
                actions.mouseMove(this.item_1);
				actions.waitForElementToShow(this.item_3, 5000);
            })
    });
    
	gemini.suite('page_sides_with_submenu', function (test) {

        test.setUrl('/regression_menu_button_carry_15.html').setCaptureElements('html')

            .before(function (actions) {
				
				this.button = '[name="MenuButton 1"]';               
				this.text_box = '[sbisname="TextBox 1"] input';
				this.item_1 = '[data-id="1"]';
				this.item_2 = '[data-id="2"]';
				this.item_3 = '[data-id="3"]';
				this.child_arrow = '.controls-Menu__hasChild';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.text_box, 5000);
            })

            .capture('right_side', function (actions) {
                actions.executeJS(function (window) {
					var offset = document.body.clientWidth - $('[sbisname="MenuButton 1"]').width()
                    window.$('[sbisname="MenuButton 1"]').offset({'left': offset});
                });
				actions.mouseMove(this.text_box);
            })
			
			.capture('right_side_and_opened_menu', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow(this.item_1, 5000);
				actions.waitForElementToShow(this.item_2, 5000);
				actions.waitForElementToShow(this.child_arrow, 5000);
				actions.mouseMove(this.item_1);
				actions.waitForElementToShow(this.item_3, 5000);
            })
			
			.capture('bottom_right_side', function (actions) {
                actions.click(this.text_box);
				actions.executeJS(function (window) {
                    window.$('[sbisname="MenuButton 1"]').offset({'top': 630});
                });
				actions.mouseMove(this.text_box);
            })
			
			.capture('bottom_right_side_and_opened_menu', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow(this.item_1, 5000);
				actions.waitForElementToShow(this.item_2, 5000);
				actions.waitForElementToShow(this.child_arrow, 5000);
				actions.mouseMove(this.item_1);
				actions.waitForElementToShow(this.item_3, 5000);
            })
			
			.capture('bottom_side', function (actions) {
                actions.click(this.text_box);
                actions.executeJS(function (window) {
					var offset = document.body.clientWidth - $('[sbisname="MenuButton 1"]').width()
                    window.$('[sbisname="MenuButton 1"]').offset({'left': 10});
                });
				actions.mouseMove(this.text_box);
            })
			
			.capture('bottom_side_and_opened_menu', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow(this.item_1, 5000);
				actions.waitForElementToShow(this.item_2, 5000);
				actions.waitForElementToShow(this.child_arrow, 5000);
				actions.mouseMove(this.item_1);
				actions.waitForElementToShow(this.item_3, 5000);
            })
    });

	gemini.suite('with_submenu_and_half_items_have_icon16', function (test) {

        test.setUrl('/regression_menu_button_carry_17.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[name="MenuButton 1"]';               
				this.text_box = '[sbisname="TextBox 1"] input';
				this.item_1 = '[data-id="1"]';
				this.item_2 = '[data-id="2"]';
				this.item_3 = '[data-id="3"]';
				this.child_arrow = '.controls-Menu__hasChild';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.text_box, 5000);
            })

			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow(this.item_1, 5000);
				actions.waitForElementToShow(this.item_2, 5000);
				actions.waitForElementToShow(this.child_arrow, 5000);
            })
			
			.capture('submenu_opened', function (actions) {
                actions.mouseMove(this.item_1);
				actions.waitForElementToShow(this.item_3, 5000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_3);
            })
    });

	gemini.suite('with_picker_class_name', function (test) {

        test.setUrl('/regression_menu_button_carry_23.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[name="MenuButton 1"]';               
				this.text_box = '[sbisname="TextBox 1"] input';
				this.item_1 = '[data-id="1"]';
				this.item_2 = '[data-id="2"]';
				this.item_3 = '[data-id="3"]';
				this.child_arrow = '.controls-Menu__hasChild';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.text_box, 5000);
            })
			
			.capture('menu_opened', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow(this.item_1, 5000);
				actions.waitForElementToShow(this.item_2, 5000);
            })
    });
});