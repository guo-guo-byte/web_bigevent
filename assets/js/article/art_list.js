$(function () {
    const form = layui.form;
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    const q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的发布状态
    };

    // 获取文章列表数据
    const initTable = () => {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q, //显示两条 因为上面写的每页显示两条，但是token是把全部的显示出来，如果页面上面改成10就是说每页显示10条
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！");
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);

                renderPage(res.total)
            },
        });
    };
    initTable()
    // 初始化文章分类的方法
    const initCate = () => {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("获取分类数据失败！");
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            },
        });
    };

    initCate();;

    // 筛选数据 在引入initTable获取出来数据
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        //为查询参数对象 q 中对应的属性赋值 参数赋值后 在get找出来
        q.cate_id = cate_id
        q.state = state
        console.log(q); //提交之后数据就会出来
        // 根据最新的筛选条件，重新渲染表格的数据 
        //直接调用 代码是从上而下执行 不用传参数，因为下面有一个自带的q，这上面的q也会直接传上去
        initTable()
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        layui.laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],// 每页展示多少条
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(first)
                console.log(obj);
                console.log(obj.curr)
                // obj.curr把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                // obj 里面的limit是在控制分页 所以把他的分页给到我们的pagesize 
                q.pagesize=obj.limit
                //第一次触发就是为true 第二次是undifind和true 不是第一个就会进入下面的判断,再去调用渲染
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }
    $('tbody').on('click', '.btn-delete', function() {
        const len=$('.btn-delete').length;
        console.log(len);
        // 获取到文章的 id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    //再重新获取文章列表之前改好q里面的参数
                //分页如果是1的话,就不要动了,如果是页面不是1 就减1
                    if(len===1){
                        q.pagenum=q.pagenum===1?1:q.pagenum-1
                    }
                    initTable()
                    layer.close(index)
                }
            })
    
            // layer.close(index)
        })
    })
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

})