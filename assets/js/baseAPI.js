// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 每次去添加根路径，比较麻烦，所以有一个过滤器
// $.ajax() > ajaxPrefilter过滤器 -> 发送请求给服务器
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
//option是ajax全部的属性都给他拿过来了
$.ajaxPrefilter((option) => {
  console.log(option);
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  //option.url获取了前面login.js的url里面的url的接口
  option.url = `http://www.liulongbin.top:3007` + option.url;

  //2. 统一为有权限的接口，设置 headers 请求头 如果option.url.includes("/my/")里面有my就可以进行下面的代码
  //这里不用indexOf是因为如果没有my，也会出来一个-1,依然进行往下走，所以在这里不能用
  if (option.url.includes("/my/")) {
    option.headers = {
      Authorization: localStorage.getItem("token"),
    };
  }

  // 3.complete是不论成功还是失败，最终都会调用 complete 回调函数
  //这里是因为没有输入密码和账号直接进来了 所以进来把token删掉，
  option.complete=(res) => {
    // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
    if(res.responseJSON.status ===1 && res.responseJSON.message === "身份认证失败！") {
        //  强制清空 token
        localStorage.removeItem("token");
        // 强制跳转到登录页面
        location.href = "/login.html" 
    }
  }
});