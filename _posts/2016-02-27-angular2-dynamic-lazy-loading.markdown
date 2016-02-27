---
layout: post
title:  "Angular 2 dynamic lazy loading"
date:   2016-02-27 1:52:37 +0100
categories: angular2 lazyloading lazy loading dynamic components javascript apps
---

I started [this little experiment](https://github.com/spawnius/angular2-dynamic-lazy-loading) when an idea came to my mind that Angular 2 can be used for more than just single page applications, but also to build dynamic component based websites.

What I wanted to acheve is - dynamically loaded and initialised components based on the html provided in the root application component as a template. The idea is simmilar to projection in Angular2 but happens dynamically, without the need to pre-register the routes and components in the application code. So I hope the name does not confuse you so much.

This approach might be usefull for a CMS system where editors want to specify components on the page by simply using custom tags in a WYSIWYG editor, or apps that have a large number of components that can be moved or removed from pages.

My first thought was that it can be achived on the back end side by generating javascript on the fly that registers components and routes. But I quickly dropped the idea by deciding that it's better to put apples to apples and leave front end things where they are supposed to be, well... the front end. So after a couple evenings I managed to code a [PoC](https://github.com/spawnius/angular2-dynamic-lazy-loading).

The Angular 2 application needs to be loaded after the promise returned by AsyncProviders SETUP is resolved.
The SETUP method is static and accepts two parameters - the tag name of the application component and the path to the components folder. The dependancies are resolved before the application code is loaded, and exposed to the application component as static properties on the AsyncProvider.

[Example](https://github.com/spawnius/angular2-dynamic-lazy-loading/blob/master/app/main.ts):

{% highlight javascript %}
AsyncProvider.SETUP('my-app', './app/components').then(() => {
    // Now we are ready to initialize the app with lazy loaded components
    System.import('./app/components/app.component').then((module) => {
       bootstrap(module.default);
    });
});
{% endhighlight %}

During this process the following steps are performed by AsyncProvider:

1. html is extracted from the body of the root component (provided in index.html)
2. The extracted html is analysed for custom tags
3. AsyncProvider tries to load a component for each custom tag
4. An app level route is generated for each component with the tag name of the component as its base and capitalized name as route name
5. The previously extracted html is used as the template to render the app and defined components
6. App get's loaded using System.import and reads a static property on AsyncProvider to get route, component and template definitions.

A working example can be found in the [github repo](https://github.com/spawnius/angular2-dynamic-lazy-loading).

If you are interested in the idea please don't hesitate to create an issue or pull request ^__-

Thanks for visiting!
