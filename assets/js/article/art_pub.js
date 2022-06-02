$(function () {
    const form = layui.form;
    const layer = layui.layer;

    // 获取文章分类
    const initCate = () => {
        $.ajax({
            // 获取文章类别的内容
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("初始化文章分类失败！");
                }
            // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template("tpl-cate", res);
                // [name=cate_id]属性选择器
                $("[name=cate_id]").html(htmlStr);
                // 一定要记得调用 form.render() 方法,否则看不到页面下拉内容的变化，括号不加内容，是代表全局的 ，加内容是局部
                form.render('select');
            },
        });
    };
    // 渲染封面裁剪区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 模拟封面点击 点击之后相当于我们把隐藏的文件自动点击了
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    // 获取文章数据
    initCate();
    // 初始化富文本编辑器
    initEditor()

    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 在发布和草稿中 用一个ajax，但是状态states是两个已发布和草稿，所以我们把草稿另作一个点击事件，点击事件，
    // 把已发布变成默认事件，提交就是默认为已发布，单独点击就是草稿
    // 默认定义文章的发布状态
    let art_state = '已发布'
    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 综合表单全部提交新增文章
    $('.layui-form').on('submit', function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        // 2. 基于 form 表单,获取表单里的内容，快速创建一个 FormData 对象 转为为Dom元素 因为我们获取的是layui-form表单里全部的状态
        var fd = new FormData($(this)[0]);
        // fd.forEach(function(k,v){
        //     console.log(k,v); console.log(fd);//拿到的是三个参数
        // })
        // 3.上面只有三个值，我们需要把status拿到， 将文章的发布状态，存到 fd 中 追加状态 有了其他 没有state状态 把状态添加
        fd.append('state', art_state)
        // fd.forEach(function(k,v){
        //     console.log(k,v); console.log(fd);//拿到的是四个参数
        // })
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                //创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象d
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                // layer.msg('发布文章成功！')
                console.log(res);
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
                window.parent.change()
            }
        })
    }

})