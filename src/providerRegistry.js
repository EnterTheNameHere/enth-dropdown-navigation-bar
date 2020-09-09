
import { CompositeDisposable } from 'atom';
import { BabelProvider } from './babelProvider';

export class ProviderRegistry {
    _existingProviderInstances = new Map();
    _subscriptions = new CompositeDisposable();

    getProviderForTextEditor( textEditor ) {
        if( !textEditor ) {
            return null;
        }

        let provider = this._existingProviderInstances.get( textEditor );
        if( provider ) {
            return provider;
        }

        switch( textEditor.getRootScopeDescriptor().scopes[0] ) {
        case 'source.js':
            provider = new BabelProvider( textEditor );
            this._subscriptions.add( textEditor.onDidDestroy( () => {
                this._existingProviderInstances.delete( textEditor );
            }));
            this._existingProviderInstances.set( textEditor, provider );
            return provider;
        default:
            return null;
        }
    }

    dispose() {
        this._existingProviderInstances.clear();
    }
}
