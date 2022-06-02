$(function () {
  // 点击去注册账号让 登录框隐藏，注册框显示
  $("#link_reg").click(() => {
    $(".login-box").hide();
    $(".reg-box").show();
  });
  // 点击去登录让 注册框隐藏，登录框显示
  $("#link_login").click(() => {
    $(".login-box").show();
    $(".reg-box").hide();
  });

  //注册中的按钮密码设置字数范围，以及确认密码
  // 从 LayUI 中获取 form 和layer 因为直接写form和layer是没有的，layui底下有form和layer
  const form = layui.form;
  var layer = layui.layer
  form.verify({
    //1. 自定义一个叫 密码 的校验规则
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],

    // 2.确认密码校验规则
    //val 通过形参拿到的是确认密码框中的内容
    repwd: (val) => {
      // 获取当前输入的值
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败,则return一个提示消息即可
      // [name=password]是获取属性
      const pwd = $(".reg-box [name=password]").val();
      if (pwd !== val) return "两次密码不一致"
    },
  })
  // 3.设置请求根路径 要去注册密码和把密码给隐藏掉，需要用到接口
  // const baseUrl = "http://www.liulongbin.top:3007";
  // 监听注册表单，发送注册请求
  $("#form_reg").on("submit", (e) => {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/api/reguser",
      data: {
        //获取数据，就是获取密码里面的值
        username: $("#form_reg [name=username").val(),
        password: $("#form_reg [name=password").val(),
      },
      success: (res) => {
        //不成功后的话弹出message，成功弹出 layer.msg("注册成功！");
        //message是错误的话系统自己弹出，也可以写layer.msg(“注册失败！”)
        if (res.status !== 0) return layer.msg(res.message);
        //这里没有用message有可能系统会出现错误，本来成功可能就会弹出错误
        layer.msg("注册成功！");
        // 注册成功后自动跳转到登录界面
        $("#link_login").click();
      },
    });
  });

  // 4.监听登录表单，发送登录请求，并且需要认证身份，认证成功后才能登录
$("#form_login").submit((e) => {
  e.preventDefault();
  $.ajax({
      type: "POST",
      url: "/api/login",
      //serialize（）出来的是键值对的形式，name="username"&&name="password"
      // 该方法的调用者应该是某个表单对象
      data: $("#form_login").serialize(),
      success: (res) => {
          if (res.status !== 0) return layer.msg(res.message);
          layer.msg("登录成功！");
          //token是判别用户的身份认证，认证失败不会登录也不会发送ajax
          // 将登录成功得到的 token 字符串，保存到 localStorage 中 后续方便使用
          localStorage.setItem("token", res.token);
          // console.log(res);里面会有一个token
          // 跳转到主页，页面直接跳转
          location.href = "/index.html";
      },
  });
});
});