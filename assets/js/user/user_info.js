$(function () {
    const form = layui.form;
    // 自定义校验规则
    form.verify({
        // val是表单里用户输入的内容，
        nickname: (val) => {
            if (val.length > 6) return "昵称长度必须在 1 ~ 6 个字符之间！";
        },
    });

 

    // 初始化获取用户信息
    const initUserInfo = () => {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: (res) => {
                // 用户成功没有写 因为主页有一个获取用户成功 老是弹影响体验
                if (res.status !== 0) return layer.msg("获取用户信息失败！");
                //layer.msg("获取用户信息成功！");
                console.log(res);
                // 调用 `form.val()` 方法为表单赋值 表单里赋值
                form.val("formUserInfo", res.data);
            },
        });
    };
    // 重置表单数据 是刚开始写的时候重置，不是用户昵称更改之后重置
    $("#btnReset").click((e) => {
        e.preventDefault();
        // 然后在返回原来的 不是重置之后就清空
        initUserInfo()
    });

    // 更新用户数据 发起post请求没有id 手写id
    $(".layui-form").on("submit", (e) => {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(".layui-form").serialize(),
            success: (res) => {
                
                if (res.status !== 0) return layer.msg("更新用户信息失败！");
                // layer.msg("更新用户信息成功！");
                // 点击提交 调用父页面渲染函数 找到window.parent.底下的getUserInfo（）调用渲染用户名
                window.parent.getUserInfo();
                console.log(res);
            },
        });
    });
    initUserInfo();
})