# Project environment configuration  
Modern web applications consist of many components and pages. There are a lot of effective ways to compose multiple files.

WoowahanJS supports configuration that uses Bundler and all the ways using loading with Scripts tag. You can choose right way according to property of the project. 
## Bundling Proect  
---
You can do modularity components with way that support CommonJS or ES6 to develop many project modules effectively.
But, there are many browsers that don’t support this way so it can go through the process of trans-filing for browser compatibility.

Please refer to the apps of example directory. It consists of configuration that uses  Webpack and Babel.   
[Examples](https://github.com/woowabros/WoowahanJS/tree/master/examples)
## Configuration that doesn’t Bundling   
---
In case of simple project, it is configuration that doesn’t need bundling.
WoowahanJS can be loaded with Script tag like common library.

Included example of timer example be written doesn’t do bundling and loading with script tag simply. 
[Timer example](https://github.com/woowabros/WoowahanJS/tree/master/examples/timer)
