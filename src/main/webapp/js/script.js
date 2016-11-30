// Code goes here

$(function() {
  var $previewContainer = $('#comment-md-preview-container');
  $previewContainer.hide();
  var $md = $("#comment-md").markdown({
    autofocus: false,
    height: 270,
    iconlibrary: 'fa',
    onShow: function(e) {
      //e.hideButtons('cmdPreview');
      e.change(e);
    },

    onChange: function(e) {
      var content = e.parseContent();
      // console.log(content);
      if (content === '') $previewContainer.hide();
      else $previewContainer.show().find('#comment-md-preview').html(content).find('table').addClass('table table-bordered table-striped table-hover');
    },
    footer: function(e) {
      return '\
					<span class="text-muted">\
						<span data-md-footer-message="err">\
						</span>\
						<span data-md-footer-message="default">\
							通过拖拽图片到当前窗口或者 \
							<a class="btn-input">\
								从电脑中选取\
								<input type="file" multiple="" id="comment-images" />\
							</a>\
						</span>\
						<span data-md-footer-message="loading">\
							正在上传你的文件...\
						</span>\
					</span>';
    }
  });
  var $mdEditor = $('.md-editor'),
    msgs = {};

  $mdEditor.find('[data-md-footer-message]').each(function() {
    msgs[$(this).data('md-footer-message')] = $(this).hide();
  });
  msgs.
  default.show();
  $mdEditor.filedrop({
    binded_input: $('#comment-images'),
    url: "/markdown/file/static-uploads.do",
    fallbackClick: false,
    beforeSend: function(file, i, done) {
      msgs.
      default.hide();
      msgs.err.hide();
      msgs.loading.show();
      done();
    },
    maxfilesize: 15,
    error: function(err, file) {
      switch (err) {
        case 'BrowserNotSupported':
          alert('browser does not support HTML5 drag and drop')
          break;
        case 'FileExtensionNotAllowed':
          // The file extension is not in the specified list 'allowedfileextensions'
          break;
        default:
          break;
      }
      var filename = typeof file !== 'undefined' ? file.name : '';
      msgs.loading.hide();
      msgs.err.show().html('<span class="text-danger"><i class="fa fa-times"></i> 错误 上传 ' + filename + ' - ' + err + '</span><br />');
    },
    dragOver: function() {
      $(this).addClass('active');
    },
    dragLeave: function() {
      $(this).removeClass('active');
    },
    progressUpdated: function(i, file, progress) {
      msgs.loading.html('<i class="fa fa-refresh fa-spin"></i> 上传 <span class="text-info">' + file.name + '</span>... ' + progress + '%');
    },
    afterAll: function() {
      msgs.
      default.show();
      msgs.loading.hide();
      msgs.err.hide();
    },
    uploadFinished: function(i, file, response, time) {
      $md.val($md.val() + "![" + file.name + "](http://127.0.0.1:8080/markdown/img/"+response+")\n").trigger('change');
      // response is the data you got back from server in JSON format.
    }
  });
})
