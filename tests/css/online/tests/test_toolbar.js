gemini.suite('SBIS3.CONTROLS.Toolbar Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_toolbar_online.html').setCaptureElements('.capture')

            .before(function (actions) {
                
                this.data = '[sbisname="MyToolbar"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.item_1 = '.controls-ToolBar__itemsContainer [data-id="3"]';
				this.menu = '.controls-ToolBar__menuIcon';
				this.menu_close = '.controls-PopupMixin__closeButton';
				this.menu_item2 = '.controls-MenuItem[data-id="2"]';
				this.menu_item3 = '.controls-MenuItem[data-id="3"]';
				this.menu_item10 = '.controls-MenuItem[data-id="10"]';
				this.menu_item9 = '.controls-MenuItem[data-id="9"] .controls-MenuItem__text';
				this.menu_item6 = '.controls-MenuItem[data-id="6"] .controls-MenuItem__text';
				
				actions.waitForElementToShow(this.data, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
				actions.click(this.input);
            })

            .capture('hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
			
			.capture('hovered_menu_button', function (actions) {
                actions.mouseMove(this.menu);
            })
			
			.capture('opened_menu', function (actions) {
                actions.click(this.menu);
				actions.waitForElementToShow(this.menu_item2, 5000);
				actions.waitForElementToShow(this.menu_item3, 5000);
				actions.mouseMove(this.input);
            })
			
			.capture('hovered_close_menu', function (actions) {
                actions.mouseMove(this.menu_close);
            })
			
			.capture('hovered_menu_item9', function (actions) {
                actions.mouseMove(this.menu_item9);
				actions.waitForElementToShow(this.menu_item10, 5000);
            })
			
			.capture('hovered_menu_item9_2', function (actions) {
                actions.mouseMove(this.menu_item6);
            })
			
			.capture('disabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('MyToolbar').setEnabled(false);
                });
				actions.click(this.input);
            })

            .capture('disabled_and_hovered_item', function (actions) {
                actions.mouseMove(this.item_1);
            })
			
			.capture('disabled_and_hovered_menu_button', function (actions) {
                actions.mouseMove(this.menu);
            })
    });
	
	gemini.suite('with_link', function (test) {

        test.setUrl('/regression_toolbar_online_2.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.data = '[sbisname="Toolbar 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.data, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
				actions.click(this.input);
            })
    });
	
	gemini.suite('not_menu_button', function (test) {

        test.setUrl('/regression_toolbar_online_3.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.data = '[sbisname="Toolbar 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.data, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
				actions.click(this.input);
            })
    });
});