$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '长度必须在1~6个字符之间'
            }
        }
    })
    initUserForm()

    function initUserForm() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('获取用户信息失败')
                }

                // console.log(form.val('formuserinfo', res.data))
                form.val('formuserinfo', res.data);
            }

        })
    }
    // 重置表单的数据
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserForm();
    })
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
            // 发起ajax
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功')
                    // 调用父页面的渲染方法
                window.parent.getUserInfo();

            }

        })
    })
})