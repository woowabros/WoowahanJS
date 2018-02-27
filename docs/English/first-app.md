# First app development(making?)
Single page application that is written by WoowahanJS consists of one or more view components and one application that supervise these views.  

This example is very simple code that operates one view and one application.
#### hello-view.js
```
import Woowahan from 'woowahan'; 

export default Woowahan.View.create('Hello', {
  template: '<h1>Hello, WoowahanJs</h1>'
});
```
#### main.js
```
import Woowahan from 'woowahan';
import HelloView from './hello-view';

const app = Woowahan();

app.start({
  url: '/', container: 'body', view: HelloView
});
```
`Woowahan.View.create` can creates new view with static method. View consists of name and option object. View name doesn't have any restrictions if it is string and you can make name that can 
distinguish view. It is allowed overlap of view name. But, if you print log from browser console, view name is printed basically so it is recommanded name that can identify enough for easy distinguish.  

You can drive whole app by start app that is `app = Wppwahan()`. First parameters of start gets object that consists of configuration information of view to be linked with routing path.
```
app.start({
  url: '/',
  view: MainView,
  container: 'body',
  pages: [
    { url: 'users', container: '.contents', view: UserView },
    { url: 'orders', container: '.contents', view: OrderView, pages: [
        { url: ':orderno', view: OrderDetailView, pages: [
            { url: 'edit', view: OrderEditView }
          ] 
        },
        { url: 'search', view: OrderSearchView }
      ]
    }
  ]
});
```     
Routing path configuration of that app looks like this.  
* / => MainView
* /users => UserView
* /orders => OrderView
* /orders/10 => OrderDetailView
* /orders/10/edit => OrderEditView
* /orders/search => OrderSearchView  

UI of view that made of `Woowahan.View.create` can create by HTML and Woowahan.View describe this by template.  
If you make view that doesn't have UI, you can do the following.
```
const emptyView = Woowahan.View.create('EmptyView');
```  
If the HTML is not set in the template, the view does not actually have any markup. If the HTML be not supplied, it can be like `<div></div>`.   

View needs UI, so fill in HTML in the template like first sample code for write UI. If you drive browser after build, you can see Hello, WoowahanJS to be marked.  

[Introduction of view and basic](https://github.com/woowabros/WoowahanJS/blob/master/docs/view.md)        

