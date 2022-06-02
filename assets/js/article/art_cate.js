$(function () {
    // 获取 表格数据
    const initArtCateList = () => {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: (res) => {
                console.log(res);
                // 调用 template 渲染数据 这里用res是因为遍历是用Data遍历，所以不能写res.Data,如果遍历不写名字，那就可以写data
                const htmlStr = template("tpl-table", res);
                // 渲染数据到tbody里面 这里用append(htmlStr)也可以
                $("tbody").empty().html(htmlStr);
            },
        });
    };

    initArtCateList();

    //新增分类
    const layer = layui.layer;
    // 设置索引为空的时 点击添加分类弹出框所以开始不为空，把索引为空给到他提交的时候在关闭
    let indexAdd = null
    $("#btnAddCate").click(() => {
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "添加文章分类",
            content: $('#dialog-add').html()
        });
    });

    // 通过代理监听 submit提交 事件 弹窗就会动态生form-add
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            // 这边是获取表单全部的值，但是表单里面没有id,我们的POST文档是需要带id的参数的，所以需要隐藏添加
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) return layer.msg("新增分类失败！");
                // 数据渲染到列表中
                initArtCateList();
                layer.msg("新增分类成功！");
                // 关闭弹出的框 
                layer.close(indexAdd);
            },
        });
    })

    // 通过代理方式，为 btn-edit 按钮绑定点击事件
    // 每次弹窗都会有索引为空 打开的时候就会有索引
    let indexEdit = null;
    // btn-edit是动态后期加上去的 所以没有办法直接改动，只能利用事件委托tbody
    $("tbody").on("click", ".btn-edit", function () {
        // 弹出修改文章分类的弹窗 这里是相当于 const indexEdit=layer.open() 声明的变量
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "修改文章分类",
            content: $("#dialog-edit").html(),
        });
        // 获取自定义属性的值
        const id = $(this).attr("data-id");
        // 发起请求获取对应分类的数据
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                console.log(res);
                //form-edit是添加的类名 直接赋值 就是一打开就有值了
                layui.form.val("form-edit", res.data);
            },
        });
    });

    // 更新文章分类  表但是动态设置的，所以需要委托事件
$("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    $.ajax({
        method: "POST",
        url: "/my/article/updatecate",
        data: $(this).serialize(),
        success: (res) => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg("更新分类数据失败！");
            }
            layer.msg("更新分类数据成功！");
            // 把弹窗关掉
            layer.close(indexEdit);
            initArtCateList();
            
        },
    });
});
// 删除文章分类 提示用户是否确认删除 旁边的取消是layui提供的所以不用管就行，自己本来就有效果
$("tbody").on("click", ".btn-delete", function () {
    const id = $(this).attr("data-id");
    // 提示用户是否删除
    layer.confirm("确定删除吗？", { icon: 3, title: "提示" }, function (index) {
        $.ajax({
            method: "GET",
            url: "/my/article/deletecate/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("删除分类失败！");
                }
                layer.msg("删除分类成功！");
                layer.close(index);
                initArtCateList();
            },
        });
    });
});
})