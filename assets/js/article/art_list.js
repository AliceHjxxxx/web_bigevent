$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Data(date)
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + '-' + hh + '-' + mm + '-' + ss

    }

    function padZero(n) {
        return n > 9 ? n : '0' + n;

    }
    // 定义一个查询的参数对象
    // 需要将请求的参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认第一页
        pagesize: 2, //每页显示几条数据
        cate_name: '', //显示文章的id
        state: '' //文章发布的状态
    }
    initTable()
        // 获取当前文章列表数据的方法
    initCate()

    function initTable() {
        $.ajax({
            method: 'post',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('不存在相关内容')
                }
                console.log(q)
                    // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    // 调用渲染分页的方法
                console.log(res.total)
                renderPage(res.total)
            }
        })
    }

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/artcate/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板殷勤渲染分类的可选项  
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_name]').html(htmlStr)
                form.render()
            }
        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
            e.preventDefault()
                // 获取表单中选中下拉的值
            q.pagenum = 1
            var cate_name = $('[name=cate_name]').val()
            var state = $('[name=state]').val()
                // 为查询参数对应得属性赋值
            q.cate_name = cate_name
            q.state = state
            initTable()
        })
        // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页容器的Id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认被选中得分页
            limits: [2, 4, 6, 8],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 分页发生切换的时候，触发得回调
            // 出发jump回调得方式有两种，点击页码时会触发，或者只要调用了renderpage,就会触发jump的回调
            // obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
            jump: function(obj, first) {
                console.log(q.pagenum)
                    // console.log(first)
                    // console.log(obj)
                q.pagenum = obj.curr;
                // 把最新的条目数复制到q.pagesize上
                q.pagesize = obj.limit;
                if (!first) {
                    initTable()
                }
            }
        })
    }
    $('tbody').on('click', '#btn-del', function() {
        // 获取页面上删除按钮的个数
        var len = $('.btn-del').length
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                methiod: 'GET',
                url: '/my/article/delarticle/' + id,
                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                        // 当数据删除完成后，需要判断当前这一页中是否还有剩余的数据
                        // 如果没有剩余数据了，则让页码值-1再重新调用Init方法
                    if (len === 1) {
                        //页码值最小必须为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })

    // $('tbody').on('click', '#btn-edit', function() {
    //     location.href = '/article/art_pub.html'
    //     var id = $(this).attr('data-id')
    //     $.ajax({
    //         method: 'GET',
    //         url: '/my/article/editinit/' + id,
    //         async: false,
    //         success: function(res) {
    //             if (res.status != 0) {
    //                 return layer.msg('获取文章信息失败')
    //             }
    //             console.log(res);
    //             // form.val('form-pub', res.data); 
    //             console.log(id)
    //         }

    //     })

    // })

})