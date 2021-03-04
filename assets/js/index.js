$(function() {
    getUserInfo()
    var layer = layui.layer;
    $('#btnLogout').on('click', function() {
        //eg1
        layer.confirm('是否确定退出', { icon: 3, title: '提示' },
            function(index) {
                //do something
                // 1、清空本地存储中的token
                localStorage.removeItem('token');
                // 2、重新跳转到登录页
                location.href = './login.html'
                    // 关闭Comfirm询问框
                layer.close(index);
            });

    })
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers为请求头配置对象
        // headers: { Authorization: localStorage.getItem('token') || '' },    
        // complete: function(res) {
        //     console.log(res.responseJSON.message);
        //     // 在complete回调函数中，可以使用res.responseJSONP拿到服务器响应回来的数据
        //     if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {

        //         // 强制清空token
        //         localStorage.removeItem('token');
        //         // 强制跳转
        //         location.href = './login.html'
        //     }
        // },
        success: function(res) {
            if (res.status != 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 渲染用户的头像

            renderAvater(res.data);
        },

    })
}

function renderAvater(user) {
    var name = user.nickname || user.username;

    $('#welcome').html('欢迎&nbsp' + name);
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}