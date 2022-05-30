// 获取用户信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        //请求头 有权限 所以先把tokey获取 然后再传递给后台
        //以 /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
        // headers: { //headers属性
        //     Authorization: localStorage.getItem("token"),
        // },
        success: (res) => {
            console.log(res);
            if (res.status !== 0) return layer.msg("获取用户信息失败！");
            layer.msg("获取用户信息成功！");
            //数据拿到后 ，拿数据渲染用户头像
            renderAvatar(res.data)
        },
    });
}
// getUserInfo() //这里也可以调用 写在这里也可以

// 渲染用户头像
const renderAvatar = (user) => {
    // 获取用户名字 因为ajax里面的数据有两个名字所以用||看哪个有，选择任意一个
    let name = user.nickname || user.username;
    // 设置欢迎文本 把自己的用户名渲染上去
    $("#welcome").html(`欢迎 ${name}`);
    // 按需渲染用户头像  user_pic是图片，看图片是否等于null（默认是null）
    if (user.user_pic !== null) {
        // 渲染图片头像 不等于空，就自定义一个路径出来，把图片显示，把文本隐藏
        $(".layui-nav-img").attr("src", user.user_pic).show();
        $(".text-avatar").hide();
    } else {
        // 渲染文本头像  图片等于空，就把图片隐藏，把用户名显示并且把第一个字母填上去
        $(".layui-nav-img").hide();
        let firstName = name[0].toUpperCase();
        console.log(name[0].toUpperCase()); //G
        $(".text-avatar").html(firstName);
    }
};

// 退出登录
$("#btnLogout").click(() => {
    // 点击后弹出框显示是否退出登录，index相当于索引  可以写可以不写
    layui.layer.confirm(
        "确定退出登录？",
        { icon: 3, title: "" },
        function (index) {
            // 清空本地存储里面的 token 
            localStorage.removeItem("token");
            // 重新跳转到登录页面
            location.href = "/login.html";
            //这里相当于定时器在把index关闭
            // layui.layer.close(index)
        }
    );
});
getUserInfo()