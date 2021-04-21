/*
 * @Author: JoyWT
 * @Date: 2021-04-02 17:03:44
 * @LastEditors: JoyWT
 * @LastEditTime: 2021-04-21 10:45:38
 * @version: 0.0.1
 * @Description: 
 */
/*
  参照文章 https://juejin.cn/post/6876812524338216973
*/
var fs = require('fs')
var path = require('path');
const virtual = require('@rollup/plugin-virtual')
function filterFile(basePath,items) {
    var result  = []
    items.map(item => {
        let temp = path.join(basePath, item);
        if( fs.statSync(temp).isDirectory() ){
            result.push( item ); 
        }
    });
    return result;
}
function parseAutoRouterComp(option) {

    const basePath = './src/router/pc';
    const paths = fs.readdirSync(path.resolve(basePath));
    const files = filterFile(basePath,paths).filter((f) => option.filters.indexOf(f) === -1 && !f.startsWith("."))
        .map((f) => ({ name: f.split('.')[0], importPath: path.resolve(basePath) + `/${f}/index.js` }))

  
    const rImports = files.map((f) => `import ${f.name} from '${f.importPath}'`)

    const routes = files.map((f) => `{
                                    name: '${f.name}',
                                    path: '/${f.name}',
                                    component: {
                                        render(c) {
                                            return c("router-view")
                                        }
                                    },
                                    children: [...${f.name}]
                                    }
                                    `,)

    return { rImports, routes }
}
function parseAutoStoreComp(option) {
    const basePath = './src/store/pc';
    const paths = fs.readdirSync(path.resolve(basePath));
    const files = filterFile(basePath,paths).filter((f) => option.filters.indexOf(f) === -1 && !f.startsWith("."))
        .map((f) => ({ name: f.split('.')[0], importPath: path.resolve(basePath) + `/${f}/store.js` }))

    const sImports = files.map((f) => `import ${f.name}s from '${f.importPath}'`)

    const modules = files.map(
        (f) => `'${f.name}': ${f.name}s`)

    return { sImports, modules }
}

module.exports = function (option) {
    var o = {
        filters: []
    }
    if (option != undefined) {
        o = option;
    }
    const { rImports, routes } = parseAutoRouterComp(o);
    const { sImports, modules } = parseAutoStoreComp(o);
    const moduleContent = `${rImports.join('\n')}\n
    ${sImports.join('\n')}
    import Router from 'vue-router';
    import Vuex from 'vuex';
    import Vue from 'vue';
    Vue.use(Router);
    Vue.use(Vuex);
    const routes = [${routes.join(', \n')}]
    const router = new Router({routes:routes});
    const store = new Vuex.Store({modules:{${modules}}});
    export default {
        router,
        store
    }
    `
    return {
        name: 'vite-plugin-store-router',
        resolveId(source) {
            if (source === 'vite-plugin-store-router' || source.indexOf('/.vite/vite-plugin-store-router.js') != -1) {
                return source;
            }
            return null;
        },
        load(id) {
            if (id === 'vite-plugin-store-router' || id.indexOf('/.vite/vite-plugin-store-router.js') != -1) {
                return moduleContent;
            }
            return null;
        },
        rollupInputOptions:{
            plugins: [virtual({ 'vite-plugin-store-router': moduleContent })],
        }
    
    }
}