// 每次调用POST GET AJAX会先调用这个函数，在这个函数中可以拿到我们给AJAX配置的对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    console.log(options.url);
})