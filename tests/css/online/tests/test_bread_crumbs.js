var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.BreadCrumbs Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_bread_crumbs_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.item4 = find('[data-id="4"]');
                this.item13 = find('[data-id="13"]');
                this.home = find('.icon-Home3');
                this.title = find('.controls-BreadCrumbs__title');
                actions.click(this.item4);
                actions.click(this.item13)
            })

            .capture('plain')

            .capture('hovered_home', function (actions) {
                actions.mouseMove(this.home);
            })

            .capture('hovered_title', function (actions) {
                actions.mouseMove(this.title);
            })
    });
	
	gemini.suite('disabled', function (test) {

        test.setUrl('/regression_bread_crumbs_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.item4 = find('[data-id="4"]');
                this.item13 = find('[data-id="13"]');
                this.item21 = find('[data-id="21"]');
                this.item22 = find('[data-id="22"]');
                this.home = find('.icon-Home3');
                this.title = find('.controls-BreadCrumbs__title');
                this.dots = find('.controls-BreadCrumbs__dots');
                this.dot_item1 = find('.controls-BreadCrumbs .controls-MenuItem:nth-child(1)')
                actions.click(this.item4);
                actions.click(this.item13);
                actions.click(this.item21);
                actions.click(this.item22)
            })

            .capture('plain', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('BreadCrumbs 55').setEnabled(false);
                });
			})
			
			.capture('hovered_home_icon', function (actions) {
				actions.mouseMove(this.home);
			})
			
			.capture('hovered_text', function (actions) {
				actions.mouseMove(this.title);
			})
    });
	
	gemini.suite('no_home_icons_on_load', function (test) {

        test.setUrl('/regression_bread_crumbs_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                actions.waitForElementToShow('[data-id="4"]', 2000);
            })

            .capture('plain')
    });

    gemini.suite('small_items', function (test) {

        test.setUrl('/regression_bread_crumbs_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.item4 = find('[data-id="4"]');
                this.item13 = find('[data-id="13"]');
                this.home = find('.icon-Home3');
                this.title = find('.controls-BreadCrumbs__title');
                actions.click(this.item4);
                actions.click(this.item13)
            })

            .capture('plain')

            .capture('hovered_home', function (actions) {
                actions.mouseMove(this.home);
            })

            .capture('hovered_title', function (actions) {
                actions.mouseMove(this.title);
            })
    });

    gemini.suite('dots', function (test) {

        test.setUrl('/regression_bread_crumbs_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.item4 = find('[data-id="4"]');
                this.item13 = find('[data-id="13"]');
                this.item21 = find('[data-id="21"]');
                this.item22 = find('[data-id="22"]');
                this.home = find('.icon-Home3');
                this.title = find('.controls-BreadCrumbs__title');
                this.dots = find('.controls-BreadCrumbs__dots');
                this.dot_item1 = find('.controls-BreadCrumbs .controls-MenuItem:nth-child(1)')
                actions.click(this.item4);
                actions.click(this.item13);
                actions.click(this.item21);
                actions.click(this.item22)
            })

            .capture('plain')

            .capture('hovered_dot_item', function (actions) {
                actions.click(this.dots);
                actions.mouseMove(this.dot_item1);
            })
    });
	
	gemini.suite('have_titles', function (test) {

        test.setUrl('/regression_engine_browser_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="browserView"]', 40000);
                this.view = find('[sbisname="browserView"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('into_folder', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').setCurrentRoot(33);
					window.$ws.single.ControlStorage.getByName('browserView').reload();
                });
				actions.waitForElementToShow('[sbisname="BackButton-caption"]', 1000);
            })
			
			.capture('opened_dots', function (actions, find) {
                this.dots = find('.controls-BreadCrumbs__dots');
				actions.click(this.dots);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(1)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(2)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(3)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(3) .controls-BreadCrumbs__hierWrapper:nth-child(2)', 1000);
            })
    });
	
	gemini.suite('have_titles_and_height_24', function (test) {

        test.setUrl('/regression_engine_browser_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="browserView"]', 40000);
                this.view = find('[sbisname="browserView"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('into_folder', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').setCurrentRoot(33);
					window.$ws.single.ControlStorage.getByName('browserView').reload();
                });
				actions.waitForElementToShow('[sbisname="BackButton-caption"]', 1000);
            })
			
			.capture('opened_dots', function (actions, find) {
                this.dots = find('.controls-BreadCrumbs__dots');
				actions.click(this.dots);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(1)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(2)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(3)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(3) .controls-BreadCrumbs__hierWrapper:nth-child(2)', 1000);
            })
    });
	
	gemini.suite('have_titles_and_height_25', function (test) {

        test.setUrl('/regression_engine_browser_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="browserView"]', 40000);
                this.view = find('[sbisname="browserView"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('into_folder', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').setCurrentRoot(33);
					window.$ws.single.ControlStorage.getByName('browserView').reload();
                });
				actions.waitForElementToShow('[sbisname="BackButton-caption"]', 1000);
            })
			
			.capture('opened_dots', function (actions, find) {
                this.dots = find('.controls-BreadCrumbs__dots');
				actions.click(this.dots);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(1)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(2)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(3)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(3) .controls-BreadCrumbs__hierWrapper:nth-child(2)', 1000);
            })
    });
	
	gemini.suite('have_no_titles', function (test) {

        test.setUrl('/regression_engine_browser_online_5.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="browserView"]', 40000);
                this.view = find('[sbisname="browserView"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('into_folder', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').setCurrentRoot(33);
					window.$ws.single.ControlStorage.getByName('browserView').reload();
                });
				actions.waitForElementToShow('[sbisname="BackButton-caption"]', 1000);
            })
			
			.capture('opened_dots', function (actions, find) {
                this.dots = find('.controls-BreadCrumbs__dots');
				actions.click(this.dots);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(1)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(2)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(3)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(3) .controls-BreadCrumbs__hierWrapper:nth-child(2)', 1000);
            })
    });
	
	gemini.suite('have_notitles_and_height_24', function (test) {

        test.setUrl('/regression_engine_browser_online_6.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="browserView"]', 40000);
                this.view = find('[sbisname="browserView"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('into_folder', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').setCurrentRoot(33);
					window.$ws.single.ControlStorage.getByName('browserView').reload();
                });
				actions.waitForElementToShow('[sbisname="BackButton-caption"]', 1000);
            })
			
			.capture('opened_dots', function (actions, find) {
                this.dots = find('.controls-BreadCrumbs__dots');
				actions.click(this.dots);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(1)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(2)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(3)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(3) .controls-BreadCrumbs__hierWrapper:nth-child(2)', 1000);
            })
    });
	
	gemini.suite('have_notitles_and_height_25', function (test) {

        test.setUrl('/regression_engine_browser_online_7.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="browserView"]', 40000);
                this.view = find('[sbisname="browserView"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('into_folder', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').setCurrentRoot(33);
					window.$ws.single.ControlStorage.getByName('browserView').reload();
                });
				actions.waitForElementToShow('[sbisname="BackButton-caption"]', 1000);
            })
			
			.capture('opened_dots', function (actions, find) {
                this.dots = find('.controls-BreadCrumbs__dots');
				actions.click(this.dots);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(1)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(2)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(3)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(3) .controls-BreadCrumbs__hierWrapper:nth-child(2)', 1000);
            })
    });
});