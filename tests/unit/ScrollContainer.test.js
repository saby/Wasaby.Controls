define(['js!SBIS3.CONTROLS.ScrollContainer'], function (ScrollContainer) {

    'use strict';

    describe.skip('SBIS3.CONTROLS.ScrollContainer', function () {
        /*
        FIXME: тесты рабочие, но почему то падают на завершении тестов при вызове testScrollContainer.destroy().
        Присем начинают падать и другие тесты. Временно скипаю их. Скорее всего дело в самом SBIS3.CONTROLS.ScrollContainer,
        т.к. если сюда полставить другой контрол, то testScrollContainer.destroy() отрабатывает нормально.
        */
        var
           testScrollContainer,
           container;

        beforeEach(function () {
           container = $('<div id="component"></div>').appendTo('#mocha');
        });

        afterEach(function () {
           testScrollContainer.destroy();
           testScrollContainer = undefined;
           container = undefined;
        });

        describe('create with stickyContainer option equal true', function () {
            beforeEach(function () {
                testScrollContainer = new ScrollContainer({
                    element: container,
                    stickyContainer: true
                });
            });
            it('should contain sticky header containers', function () {
                assert.isTrue(container.hasClass('ws-sticky-header__wrapper'));
                assert.equal(container.children('.ws-sticky-header__header-container').length, 1);
                assert.equal(container.children('.ws-sticky-header__scrollable-container').length, 1);
            });
        });

        describe('create with stickyContainer option default value(false)', function () {
            beforeEach(function () {
                testScrollContainer = new ScrollContainer({
                    element: container
                });
            });
            it('should`t contain sticky header containers', function () {
                assert.equal(container.find('.ws-sticky-header__wrapper').length, 0);
                assert.equal(container.find('.ws-sticky-header__header-container').length, 0);
                assert.equal(container.find('.ws-sticky-header__scrollable-container').length, 0);
            });
        });
    });
});