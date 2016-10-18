gemini.suite('SBIS3.CONTROLS.MenuIcon Carry', function () {
	
	gemini.suite('with_icon16', function (test) {

        test.setUrl('/regression_menu_icon_carry.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="MenuIcon 1"]';
				this.item_1 = '[data-id="1"]';
				this.item_2 = '[data-id="2"]';
                this.text_box = '[sbisname="TextBox 1"] input';
                
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
                    window.$ws.single.ControlStorage.getByName('MenuIcon 1').setEnabled(false);
                });
            });
    });
	
	gemini.suite('page_sides', function (test) {

        test.setUrl('/regression_menu_icon_carry.html').setCaptureElements('html')

            .before(function (actions) {
                
				this.button = '[name="MenuIcon 1"]';
                this.text_box = '[sbisname="TextBox 1"] input';
				this.item_1 = '[data-id="1"]';
				this.item_2 = '[data-id="2"]';
                
				actions.waitForElementToShow('[name="MenuIcon 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 5000);
            })

            .capture('right_side', function (actions) {
                actions.executeJS(function (window) {
					var offset = document.body.clientWidth - $('[sbisname="MenuIcon 1"]').width()
                    window.$('[sbisname="MenuIcon 1"]').offset({'left': offset});
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
                    window.$('[sbisname="MenuIcon 1"]').offset({'top': 650});
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
					var offset = document.body.clientWidth - $('[sbisname="MenuIcon 1"]').width()
                    window.$('[sbisname="MenuIcon 1"]').offset({'left': 10});
                });
				actions.mouseMove(this.text_box);
            })
			
			.capture('bottom_side_and_opened_menu', function (actions) {
                actions.click(this.button);
				actions.waitForElementToShow(this.item_1, 5000);
				actions.waitForElementToShow(this.item_2, 5000);
            })
    });

	gemini.suite('with_scroll', function (test) {

        test.setUrl('/regression_menu_icon_carry_23.html').setCaptureElements('html')

            .before(function (actions) {
                
				this.button = '[name="MenuIcon 1"]';
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
	
	
	gemini.suite('with_icon16_and_half_items_have_icon16', function (test) {

        test.setUrl('/regression_menu_icon_carry_4.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="MenuIcon 1"]';
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
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_2);
            })
    });

	gemini.suite('round_border_with_icon16', function (test) {

        test.setUrl('/regression_menu_icon_carry_7.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[name="MenuIcon 1"]';
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
                    window.$ws.single.ControlStorage.getByName('MenuIcon 1').setEnabled(false);
                });
            })			
    });
			
	gemini.suite('round_border_with_icon16_and_half_items_have_icon16', function (test) {

        test.setUrl('/regression_menu_icon_carry_10.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[name="MenuIcon 1"]';
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
	
	gemini.suite('with_icon24', function (test) {

        test.setUrl('/regression_menu_icon_carry_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[name="MenuIcon 1"]';
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
                    window.$ws.single.ControlStorage.getByName('MenuIcon 1').setEnabled(false);
                });
            })
    });

	gemini.suite('with_icon24_and_half_items_have_icon24', function (test) {

        test.setUrl('/regression_menu_icon_carry_6.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[name="MenuIcon 1"]';               
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
    });

	gemini.suite('round_border_with_icon24', function (test) {

        test.setUrl('/regression_menu_icon_carry_8.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[name="MenuIcon 1"]';               
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
    });
	
	gemini.suite('with_icon16_with_submenu', function (test) {

        test.setUrl('/regression_menu_icon_carry_17.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[name="MenuIcon 1"]';               
				this.text_box = '[sbisname="TextBox 1"] input';
				this.item_1 = '[data-id="1"]';
				this.item_2 = '[data-id="2"]';
				this.item_3 = '[data-id="3"]';
				this.child_arrow = '.controls-Menu__hasChild';
                
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
				actions.waitForElementToShow(this.child_arrow, 5000);
            })
			
			.capture('submenu_opened', function (actions) {
                actions.mouseMove(this.item_1);
				actions.waitForElementToShow(this.item_3, 5000);
            })					
    });
		
	gemini.suite('page_sides_with_submenu', function (test) {

        test.setUrl('/regression_menu_icon_carry_17.html').setCaptureElements('html')

            .before(function (actions) {
				
				this.button = '[name="MenuIcon 1"]';               
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
					var offset = document.body.clientWidth - $('[sbisname="MenuIcon 1"]').width()
                    window.$('[sbisname="MenuIcon 1"]').offset({'left': offset});
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
                    window.$('[sbisname="MenuIcon 1"]').offset({'top': 650});
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
					var offset = document.body.clientWidth - $('[sbisname="MenuIcon 1"]').width()
                    window.$('[sbisname="MenuIcon 1"]').offset({'left': 10});
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
});