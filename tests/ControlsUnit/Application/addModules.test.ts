import { assert } from 'chai';
import { Head } from 'Application/Page';
import * as CApp from 'Controls/Application';

const module = {
    name: 'Module/File',
    path: '/Module/File.js'
};
describe('Controls/Application addModules', () => {
    beforeEach(() => {
        Head.getInstance()._elements = {};
    });

    it('addPrefetchModules', () => {
        CApp.addPrefetchModules([module.name]);
        const data = Head.getInstance().getData();
        assert.equal(data.length, 1);
        assert.equal(data[0][0], 'link');
        assert.equal(data[0][1].rel, 'prefetch');
        assert.include(data[0][1].href, module.path);
    });

    it('addPreloadModules', () => {
        CApp.addPreloadModules([module.name]);
        const data = Head.getInstance().getData();
        assert.equal(data.length, 1);
        assert.equal(data[0][0], 'link');
        assert.equal(data[0][1].rel, 'preload');
        assert.include(data[0][1].href, module.path);
    });
});
