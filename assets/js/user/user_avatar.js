$(function(){
    // 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
  // 纵横比
  aspectRatio: 1,
  // 指定预览区域
  preview: '.img-preview'
}

// 1.3 创建裁剪区域  模拟点击上传文件
$image.cropper(options)

$('#btnChooseImage').on('click', function() {
    $('#file').click()
  })
  const layer = layui.layer;

  //1.4为文件上传框绑定 change 事件
  $("#file").change((e) => {
    //   e.target触碰 e事件中有一个target。下面还有一个files属性，是代表用户选择多少个文件，并通过索引拿过来，代表伪数组
    //e 获取用户选择的文件
      const fileList = e.target.files.length;
      console.log(fileList);
    //   如果等于0那就是用户没有选择照片，就直接结束
      if (fileList === 0) return layer.msg("请选择文件！");
  
      // 1. 拿到用户选择第一个文件
      let file = e.target.files[0];
      // 2. 将文件，转化为路径
      var imgURL = URL.createObjectURL(file);
      // 3. 重新初始化裁剪区域
      $image
          .cropper("destroy") // 销毁旧的裁剪区域
          .attr("src", imgURL) // 重新设置图片路径
          .cropper(options); // 重新初始化裁剪区域
  });

//  为确定按钮绑定点击事件 这里不用form是因为直接点击把图片给到他
$("#btnUpload").click(() => {
    // 1、拿到用户裁切之后的头像
    // 直接复制代码即可 image是在做上面已经拿到图片是base64` 转化的字符串
    const dataURL = $image.cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
    })
    .toDataURL("image/png");
    // 2、发送 ajax 请求，发送到服务器
    $.ajax({
        method: "POST",
        url: "/my/update/avatar",
        data: {
            // 参数
            avatar: dataURL,
        },
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg("更换头像失败！");
            }
            layer.msg("更换头像成功！");
            // 拿到图片后 通知首页把图片显示出来
            window.parent.getUserInfo();
        },
    });
});
})