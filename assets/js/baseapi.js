// 每次调用POST GET AJAX会先调用这个函数，在这个函数中可以拿到我们给AJAX配置的对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
        // options.url = 'http://www.liulongbin.top:3007' + options.url
        // 同意为有权限的接口，设置请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局同意挂载complete对象
    options.complete = function(res) {
        // console.log(res.responseJSON.message);
        // 在complete回调函数中，可以使用res.responseJSONP拿到服务器响应回来的数据
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {

            // 强制清空token
            localStorage.removeItem('token');
            // 强制跳转
            location.href = './login.html'
        }
    }
})