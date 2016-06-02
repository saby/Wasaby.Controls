var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.Toolbar Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_toolbar_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="MyToolbar"]', 40000);
                this.data = find('[sbisname="MyToolbar"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
				this.item_1 = find('.controls-ToolBar__itemsContainer [data-id="3"]');
				this.menu = find('.controls-ToolBar__menuIcon');
				this.menu_close = find('.controls-PopupMixin__closeButton');
				this.menu_item = find('.controls-MenuItem[data-id="9"] .controls-MenuItem__text');
				this.menu_item2 = find('.controls-MenuItem[data-id="6"] .controls-MenuItem__text');
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
				actions.waitForElementToShow('.controls-MenuItem[data-id="2"]', 2000);
				actions.waitForElementToShow('.controls-MenuItem[data-id="3"]', 2000);
				actions.mouseMove(this.input);
            })
			
			.capture('hovered_close_menu', function (actions) {
                actions.mouseMove(this.menu_close);
            })
			
			.capture('hovered_menu_item', function (actions) {
                actions.mouseMove(this.menu_item);
				actions.waitForElementToShow('.controls-MenuItem[data-id="10"]', 2000);
            })
			
			.capture('hovered_menu_item_2', function (actions) {
                actions.mouseMove(this.menu_item2);
				actions.wait(1000);
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
});