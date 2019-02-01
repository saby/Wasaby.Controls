# Обработка ошибок
MyComponent.wml
    
    <div class='MyComponent'>
        <MyHeader />
        <Controls.error:Container
           name="errorContainer"
        >
           <!-- MyComponent Body -->
        </Controls.error:Container>
        <MyFooter />
    </div>

## Отображение диалогового окна с ошибкой
MyComponent.ts

    ...
    readData(config: ReadConfig) {
        let source: ISourse = this.__getSource();
        return source.read(config).then((result) => {
            ...
        }, (error: Error) => {
            // init error processing
            this._children.errorContainer.process({
                error
            });
        });
    } 
    ...
    
## Отображение ошибки внутри компонента с перекрытием контента
MyComponent.ts

    ...
    import { Mode } from 'Controls/error';
    ...
        this._children.errorContainer.process({
            error,
            mode: Mode.include
        });
    ...

## Обработка кастомной ошибки с отображением собственного шаблона
MyComponent.wml

    <div class='MyComponent'>
        <MyHeader />
        <Controls.error:Container
           name="errorContainer"
        >
           <ws:controller>
               <Controls.error:Controller 
                   handlers={{ _getErrorHandlers() }}
               /> 
           </ws:controller>
         
           <!-- MyComponent Body -->
        </Controls.error:Container>
        <MyFooter />
    </div>


MyComponent.ts

    ...
    import { Mode } from 'Controls/error';
    ...
    let myErrorHandler = ({ error, mode }: {
        error: Error,
        mode: Mode
    }) => {
        if (!isMyError(error)) {
            return;
        }
        return {
            template: MyErrorTemplate,
            options: {...}
        }
    }
    ...
        private _getErrorHandlers() {
            return [
                myErrorHandler
            ]
        }
    ...


## Кастомизация внешнего обработчика ошибки
MyComponent.ts

    ...
    import { errorHandler as foreignErrorHandler } from 'Foreign/error';
    ...
    let myErrorHandler = (config) => {
        let result = foreignErrorHandler(config);
        if (!result) {
            return;
        }
        return {
            template: result.template,
            options: {
                ...result.options
                ...MY_ERROR_TEMPLATE_OPTIONS,
            }
        }
    }
