$(function() {
    // 点击去注册账号的链接
    $("#link-reg").on('click', function() {
            $('.login-box').hide()
            $('.reg-box').show()
        })
        // 点击去登陆
    $("#link-login").on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    var form = layui.form
    var layer = layui.layer
        // 通过form.verify来自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd != value) {
                return '两次密码不一致!'
            }
        }
    })
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data,
            function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                    //    console.log(res.message)
                }
                layer.msg('注册成功!');
                // console.log('注册成功!')
                // 模拟人的点击行为
                $('#link-login').click()
            })
    })
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('登录成功!');
                console.log(res.token)
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })
})