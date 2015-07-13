var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.IconButton Online', function () {
    
    gemini.suite('iconbutton16', function (test) {

        test.setUrl('/regression_iconbutton_online.html').setCaptureElements('#IconButton1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="IconButton 1"]', 40000);
                this.iconbutton = find('[name="IconButton 1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.iconbutton);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.iconbutton);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.iconbutton);
            })
    });

    gemini.suite('disabled_iconbutton16', function (test) {

        test.setUrl('/regression_iconbutton_online.html').setCaptureElements('#IconButton1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="IconButton 1"]', 40000);
                this.iconbutton = find('[name="IconButton 1"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('IconButton 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.iconbutton);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.iconbutton);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.iconbutton);
            })
    });

    gemini.suite('iconbutton24', function (test) {

        test.setUrl('/regression_iconbutton_online.html').setCaptureElements('#IconButton2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="IconButton 2"]', 40000);
                this.iconbutton = find('[name="IconButton 2"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.iconbutton);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.iconbutton);
            })

            .after(function (actions) {
                actions.mouseUp(this.iconbutton);
            })
    });

    gemini.suite('disabled_iconbutton24', function (test) {

        test.setUrl('/regression_iconbutton_online.html').setCaptureElements('#IconButton2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="IconButton 2"]', 40000);
                this.iconbutton = find('[name="IconButton 2"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('IconButton 2').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.iconbutton);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.iconbutton);
            })

            .after(function (actions) {
                actions.mouseUp(this.iconbutton);
            })
    });

    gemini.suite('iconbutton32', function (test) {

        test.setUrl('/regression_iconbutton_online.html').setCaptureElements('#IconButton3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="IconButton 3"]', 40000);
                this.iconbutton = find('[name="IconButton 3"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.iconbutton);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.iconbutton);
            })

            .after(function (actions) {
                actions.mouseUp(this.iconbutton);
            })
    });

    gemini.suite('disabled_iconbutton32', function (test) {

        test.setUrl('/regression_iconbutton_online.html').setCaptureElements('#IconButton3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="IconButton 3"]', 40000);
                this.iconbutton = find('[name="IconButton 3"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('IconButton 3').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.iconbutton);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.iconbutton);
            })

            .after(function (actions) {
                actions.mouseUp(this.iconbutton);
            })
    });

    gemini.suite('strange', function (test) {

        test.setUrl('/regression_iconbutton_online.html').setCaptureElements('#IconButton4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="IconButton 4"]', 40000);
                this.iconbutton = find('[name="IconButton 4"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.iconbutton);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.iconbutton);
            })

            .after(function (actions) {
                actions.mouseUp(this.iconbutton);
            })
    });

    gemini.suite('disabled_strange', function (test) {

        test.setUrl('/regression_iconbutton_online.html').setCaptureElements('#IconButton4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="IconButton 4"]', 40000);
                this.iconbutton = find('[name="IconButton 4"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('IconButton 4').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.iconbutton);
            })
    });
});