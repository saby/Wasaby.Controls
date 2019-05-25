import Control = require('Core/Control')
import template = require('wml!Controls-demo/List/Tree/DeepTree')
import { Memory } from 'Types/source'

function getItem(id, cfg) {
    cfg = cfg || {};
    let item = {
        'id': `${id}`,
        'idInfo': `Row title with id ${id}`,
        'title': 'title' in cfg ? `${cfg.title}` : `Row title with id ${id}`
    };
    item['parent'] = 'parent' in cfg ? cfg.parent : null;
    item['nodeType'] = 'nodeType' in cfg ? cfg.nodeType : null;
    if ('group' in cfg) {
        item['group'] = cfg.group;
    }
    return item;
}


class DeepTree extends Control {
    
    protected _template: Function = template;
    
    private _viewSource = new Memory({
        idProperty: 'id',
        data: [
            getItem('1', {nodeType: true, title: 'PC', group: 'Gadgets'}),
            getItem('1_1', {nodeType: true, parent: '1', title: 'Accessories', group: 'Gadgets'}),
            getItem('1_1_1', {nodeType: false, parent: '1_1', title: 'Keyboards', group: 'Gadgets'}),
            getItem('1_1_1_1', {parent: '1_1_1', title: 'Logitech 12-43rs', group: 'Gadgets'}),
            getItem('1_1_1_2', {parent: '1_1_1', title: 'GEnius K3', group: 'Gadgets'}),
            getItem('1_1_1_3', {parent: '1_1_1', title: 'HP Bluetooth 4.0', group: 'Gadgets'}),
            getItem('1_1_1_4', {parent: '1_1_1', title: 'Logitech 15-3ams', group: 'Gadgets'}),
            getItem('1_1_2', {parent: '1_1', title: 'Apple mouse 2', group: 'Gadgets'}),
            getItem('1_1_3', {parent: '1_1', title: 'Apple mouse 3', group: 'Gadgets'}),
            getItem('1_2', {nodeType: false, parent: '1', title: 'Spare parts', group: 'Gadgets'}),
            getItem('1_2_1', {nodeType: true, parent: '1_2', title: 'Videochips', group: 'Gadgets'}),
            getItem('1_2_1_1', {nodeType: false, parent: '1_2_1', title: 'NVIDIA', group: 'Gadgets'}),
            getItem('1_2_1_1_1', {parent: '1_2_1_1', title: 'GForce 1050', group: 'Gadgets'}),
            getItem('1_2_1_1_2', {parent: '1_2_1_1', title: 'GForce 1060', group: 'Gadgets'}),
            getItem('1_2_1_1_3', {parent: '1_2_1_1', title: 'GForce 1070', group: 'Gadgets'}),
            getItem('1_2_1_1_4', {parent: '1_2_1_1', title: 'GForce 1080', group: 'Gadgets'}),
            getItem('1_2_1_2', {parent: '1_2_1', title: 'Asus 1070-ti', group: 'Gadgets'}),
            getItem('1_2_2', {parent: '1_2', title: 'Motherboard Gigabyte-2', group: 'Gadgets'}),
            getItem('1_2_3', {parent: '1_2', title: 'RAM Kingston 16 GB', group: 'Gadgets'}),
            getItem('1_2_4', {parent: '1_2', title: 'RAM Kingston 32 GB', group: 'Gadgets'}),
            getItem('1_3', {parent: '1', title: 'Mac PRO 2016', group: 'Gadgets'}),
            getItem('1_4', {parent: '1', title: 'Mac Mini 3', group: 'Gadgets'}),
            
            getItem('2', {nodeType: true, title: 'Tablets', group: 'Gadgets'}),
            getItem('3', {nodeType: false, title: 'Chairs', group: 'For home'}),
            getItem('4', {title: 'Sofas', group: 'For home'})
        ]
    });
    
    
    private _columns = [{displayProperty: 'title'}];
    
    private _header = [{title: 'Название'}];
    
    private _groupingKeyCallback(item) {
        return item.get('group');
    }
    
}

export = DeepTree;

