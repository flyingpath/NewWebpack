import * as OfflinePluginRuntime from 'offline-plugin/runtime';

const register = () =>{
    if ('serviceWorker' in window.navigator) {
        OfflinePluginRuntime.install()
    }
}
export default register