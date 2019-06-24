/**
 * Интерфейс для списков, в которых элементы отображаются в виде плитки.
 *
 * @interface Controls/_tile/interface/ITile
 * @public
 * @author Авраменко А.С.
 */

/*
 * Interface for lists in which items are displayed as tiles.
 *
 * @interface Controls/_tile/interface/ITile
 * @public
 * @author Авраменко А.С.
 */

/**
 * @name Controls/_tile/interface/ITile#tileHeight
 * @cfg {Number} Высота элементов, отображаемых в виде плитки.
 * @default 150
 * @remark Эта опция необходима для расчета размеров элементов при отрисовке на сервере.
 * Если установить высоту с помощью css, компонент не будет отображен корректно.
 * @example
 * В следующем примере показано, как установить высоту элементов - 200 пикселей.
 * <pre>
 *    <Controls._tile.Tile tileHeight="{{200}}"
 *                   source="{{_viewSource}}"
 *                   keyProperty="id"
 *                   parentProperty="Раздел"
 *                   nodeProperty="Раздел@"/>
 * </pre>
 */

/*
 * @name Controls/_tile/interface/ITile#tileHeight
 * @cfg {Number} The height of the tile items.
 * @default 150
 * @remark This option is required to calculate element sizes when rendering on the server.
 * If you set the height using css, the component cannot be displayed immediately in the correct state.
 * @example
 * The following example shows how to set the height of items to 200 pixels.
 * <pre>
 *    <Controls._tile.Tile tileHeight="{{200}}"
 *                   source="{{_viewSource}}"
 *                   keyProperty="id"
 *                   parentProperty="Раздел"
 *                   nodeProperty="Раздел@"/>
 * </pre>
 */

/**
 * @name Controls/_tile/interface/ITile#nodesHeight
 * @cfg {Number} Высота узлов, отображаемых в виде плитки.
 * @default 150
 * @remark Эта опция необходима для расчета размеров элементов при отрисовке на сервере.
 * Если установить высоту с помощью css, компонент не будет отображен корректно.
 * @example
 * В следующем примере показано, как установить высоту элементов - 200 пикселей.
 * <pre>
 *    <Controls._tile.Tile nodesHeight="{{200}}"
 *                   source="{{_viewSource}}"
 *                   keyProperty="id"
 *                   parentProperty="Раздел"
 *                   nodeProperty="Раздел@"/>
 * </pre>
 */

/*
 * @name Controls/_tile/interface/ITile#nodesHeight
 * @cfg {Number} The height of the tile nodes items.
 * @default 150
 * @remark This option is required to calculate element sizes when rendering on the server.
 * If you set the height using css, the component cannot be displayed immediately in the correct state.
 * @example
 * The following example shows how to set the height of nodes to 200 pixels.
 * <pre>
 *    <Controls._tile.Tile nodesHeight="{{200}}"
 *                   source="{{_viewSource}}"
 *                   keyProperty="id"
 *                   parentProperty="Раздел"
 *                   nodeProperty="Раздел@"/>
 * </pre>
 */

/**
 * @name Controls/_tile/interface/ITile#tileScalingMode
 * @cfg {String} Режим отображения плитки при наведении.
 * @variant none При наведении курсора размер элементов не изменяется.
 * @variant outside При наведении курсора размер элементов увеличивается. Увеличенный элемент находится в окне браузера.
 * @variant inside При наведении курсора размер элементов увеличивается. Увеличенный элемент находится в контроле-контейнере.
 * @default none
 * @remark Увеличенный элемент расположен в центре относительно исходного положения.
 * Если увеличенный элемент не помещается в указанный контейнер, увеличение не происходит.
 * @example
 * В следующем примере показано, как установить режим наведения 'outside'.
 * <pre>
 *    <Controls._tile.Tile itemsHeight="{{200}}"
 *                   scaleTileMode="outside"
 *                   source="{{_viewSource}}"
 *                   keyProperty="id"
 *                   parentProperty="Раздел"
 *                   nodeProperty="Раздел@"/>
 * </pre>
 */

/*
 * @name Controls/_tile/interface/ITile#tileScalingMode
 * @cfg {String} Scale mode for items when you hover over them.
 * @variant none On hover the size of the items is not changed.
 * @variant outside On hover the size of the items increases. The increased item is located within the browser window.
 * @variant inside On hover the size of the items increases. The increased item is located within the control container.
 * @default none
 * @remark The increased item is positioned in the center relative to the initial position.
 * If the increased item does not fit in the specified container, the increase does not occur.
 * @example
 * The following example shows how to set the hover mode to 'outside'.
 * <pre>
 *    <Controls._tile.Tile itemsHeight="{{200}}"
 *                   scaleTileMode="outside"
 *                   source="{{_viewSource}}"
 *                   keyProperty="id"
 *                   parentProperty="Раздел"
 *                   nodeProperty="Раздел@"/>
 * </pre>
 */

/**
 * @name Controls/_tile/interface/ITile#imageProperty
 * @cfg {String} Имя свойства, содержащего ссылку на изображение для плитки.
 * @default image
 * @remark Увеличенный элемент расположен в центре относительно исходного положения.
 * Если увеличенный элемент не помещается в указанный контейнер, увеличение не происходит.
 * @example
 * В следующем примере показано, как задать поле с изображением 'img'.
 * <pre>
 *    <Controls._tile.Tile source="{{_viewSource}}"
 *                   keyProperty="id"
 *                   parentProperty="Раздел"
 *                   nodeProperty="Раздел@">
 *       <ws:itemTemplate>
 *          <ws:partial template="wml!Controls/_tile/TreeTileView/DefaultItemTpl"
 *                      imageProperty="img" >
 *       </ws:itemTemplate>
 *    </Controls._tile.Tile>
 * </pre>
 */

/*
 * @name Controls/_tile/interface/ITile#imageProperty
 * @cfg {String} Name of the item property that contains the link to the image.
 * @default image
 * @remark The increased item is positioned in the center relative to the initial position.
 * If the increased item does not fit in the specified container, the increase does not occur.
 * @example
 * The following example shows how to set the field with the image 'img'.
 * <pre>
 *    <Controls._tile.Tile source="{{_viewSource}}"
 *                   keyProperty="id"
 *                   parentProperty="Раздел"
 *                   nodeProperty="Раздел@">
 *       <ws:itemTemplate>
 *          <ws:partial template="wml!Controls/_tile/TreeTileView/DefaultItemTpl"
 *                      imageProperty="img" >
 *       </ws:itemTemplate>
 *    </Controls._tile.Tile>
 * </pre>
 */
