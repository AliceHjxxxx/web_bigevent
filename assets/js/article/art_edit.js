$(function() {
    var form = layui.form
        // $('tbody').on('click', '#btn-edit', function() {
    location.href = '/article/art_pub.html'
    var id = $(this).attr('data-id')
    $.ajax({
        method: 'GET',
        url: '/my/article/editinit/' + id,
        async: false,
        success: function(res) {
            if (res.status != 0) {
                return layer.msg('获取文章信息失败')
            }
            console.log(res.data);
            var data2 = { id: 3, title: "0dsfsdf", cate_name: "历史", content: "001", cover_img: "", };
            // $("#form-pub").val(data2); 
            console.log(form.val('form-pub', res.data))
            form.val('form-pub', res.data);
            form.render('select')


        }

    })


    // var data2 = { id: 3, title: "0dsfsdf", cate_name: "历史", content: "001", cover_img: "", };
    // form.val('form-pub', data2);
    // var select = document.getElementById("cate_name");
    // //循环遍历option里面的值，然后加判断
    // for (var i = 0; i < select.options.length; i++) {
    //     //如果和回显值一致则selected为true就可以了 
    //     console.log(select.options.length)
    //     if (select.options[i].value == data2.cate_name) {

    //         select.options[i].selected = true;
    //     }
    // }

    // form.val('form-pub', data2)
    // console.log($("#cate_name").find("option[value=" + data2.cate_name + "]"))
    // $("#cate_name").find("option[value=" + data2.cate_name + "]").attr('selected', true);

    // $("#cate_name[0] option[value='data2.cate_name']").prop("selected", true);
    // form.render()
})