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
  });