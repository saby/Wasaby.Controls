import { ViewConfig } from "./Handler";

/**
 * {@link Controls/_dataSource/_error/IContainer IContainer} configuration object
 * @interface Controls/_dataSource/_error/IContainerConfig
 * @public
 * @author Заляев А.В
 */
export interface IContainerConfig {
    viewConfig?: ViewConfig;
}

/**
 * Interface for displaying the error template
 *
 * @interface Controls/_dataSource/_error/IContainer
 * @public
 * @author Заляев А.В
 */
export default interface IContainer {
    show(viewConfig: ViewConfig): void;
    hide(): void;
}

/**
 * {@link Controls/_dataSource/_error/IContainer IContainer} constructor's interface
 * @interface Controls/_dataSource/_error/IContainerConstructor
 * @public
 * @author Заляев А.В
 */
export interface IContainerConstructor {
    new(config: IContainerConfig): IContainer;
}
