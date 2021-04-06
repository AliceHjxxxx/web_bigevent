$(function() {
    // 定义加载文章分类的方法
    var layer = layui.layer
    var form = layui.form

    initCate()
    initEditor()


    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/artcate/cates/',
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                var htmlStr = template('tpl-cate', res)

                $('[name=cate_name]').html(htmlStr)
                    // $('[Id=Id]').html(htmlStr)

                form.render();
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    $('#btnchooseimage').on('click', function() {
            $('#coverfile').click()
        })
        // 监听coverfile的change事件
    $('#coverfile').on('change', function(e) {
            // 获取到文件的数组列表
            var filelist = e.target.files;
            if (filelist.length === 0) {
                return layer.msg('请选择图片！')
            }
            var file = e.target.files[0]
            var newImgURL = URL.createObjectURL(file)
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        // 定义文章的发布状态
    var art_state = '已发布'
    $('#btnsave2').on('click', function() {
            art_state = '草稿';

        })
        // 为表单绑定提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();

        // 基于form表单快速创建一个form对象
        var fd = new FormData($(this)[0])
        console.log($(this)[0])
        fd.append('state', art_state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象  
                fd.append('cover_img', blob)

                // 得到文件对象后，进行后续的操作
                publishArticle(fd)
            })

    })

    //定义一个发布文章的方法
    function publishArticle(fd) {
        fd.forEach(function(v, k) {
            console.log(v, k);
        })

        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //如果向服务器提交的是formdata格式的数据，必须添加以下两个配置
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                location.href = '/article/art_list.html'

            }

        })
    }
    // var data2 = { id: 3, title: "0dsfsdf", cate_name: "历史", content: "001", cover_img: "", };
    // form.val('form-pub', data2)
    // console.log(data2.cate_name)
    // $("#cate_name option[value='data2.cate_name']").prop("selected", true);
    // form.render()
})