<!--
 * @Author: JoyWT
 * @Date: 2021-04-02 16:57:11
 * @LastEditors: JoyWT
 * @LastEditTime: 2021-04-07 16:51:11
 * @version: 1.0
 * @Description: 
-->
## vite-plugin-store-router
自动注册store 和router的一个插件，目前会根据src/store 和src/router路径下的文件  
夹名称自动注册。

#### 前提要求

###### 项目目录结构
```
|-- src
    |-- router   
        |--a
            |--a1
                |--a1.js
            |--a2
                |--a2.js
            |--index.js         
    |-- store 
         |--a1
            |--a1.js
         |--a2
            |--a2.js
```
vue项目目录结构需要按照上面的结构，本插件会自动对router和store下的文件进行遍历，  
默认加载对应的index.js和store.js文件。
###### index.js 示例代码
```
import a1 from "./a1/a1.js"
import a2 from "./a2/a2.js"
import yourView from "yourView.vue"
let cName =  {
  name:"cName",
  path: 'cName',
  component: yourView,
  children: [a1, a2]
}

let router = [cName]
export default router;
```
###### store.js 示例代码

```
import a1 from "./a1.js"
import a2 from "./a2.js"
export default {
    namespaced: true,
    state: {
    },
    modules: {
        "a1": a1,
        "a2": a2,
    }
}

```

#### 使用方法
##### 1.vite.config.js文件中注册组件

```
import viteAutoRoute from 'vite-plugin-store-router'

module.exports = {
    plugins: [
         viteAutoRoute({filters:['a']})
         //viteAutoRoute()默认所有文件夹下都有对应的文件。
       ]
    }
```

##### 2.在main.js文件中直接引入store和router

```
import {router,store}  from 'vite-plugin-store-router'
new Vue({
    store,
    router,
    render: (h) => h(App),
}).$mount('#app')
```
