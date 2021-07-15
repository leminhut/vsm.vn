
        function explode_by(begin,end,data) {
          try {
            data = data.split(begin);
            data = data[1].split(end);
            return data[0];
          } catch(ex) {
            return "";
          }
        }
        $('#list_comment').on('keyup', function(){
            var text = $(this).val();   
            var lines = text.split(/\r*\n/);
            var count = lines.length;
            $('#count').val(count);
            var price = $('#price').val();
            $('#prices').val(addCommas(price*count) + ' VND');
        })
    function price_success(){
        Snackbar.show({
            text: 'Cập nhật giá thành công!',
            pos: 'bottom-right',
            backgroundColor: '#4361ee',
            showAction: false
        });
    }
    $(document).ready(function(){

        $('input[name=classicRadio][data-id=1]').prop('checked', true);
        $('#classicRadio-1 .fb-reaction .checkbox:nth-child(1) input').prop('checked', true);
        var value = $( "input[name=reaction]:checked" ).attr('data-price');
        $('#price').val(value);
        var price = value;
        var count = $('#count').val();
var minutes = $('#minutes').val();
        if(!minutes) { minutes = 1; }
        $('#prices').val(addCommas(price*count*minutes) + ' VND');
       
    });
    $( "input[type=radio]").on( "click", function() {
        var value = $( "input[name=reaction]:checked" ).attr('data-price');
        $('#price').val(value);
        var price = value;
        var count = $('#count').val();
       var minutes = $('#minutes').val();
        if(!minutes) { minutes = 1; }
        $('#prices').val(addCommas(price*count*minutes) + ' VND');
       price_success();
    });
    $( "input[name=classicRadio]" ).on( "click", function() {
        var data_id = $( "input[name=classicRadio]:checked" ).attr('data-id');
        $('.classicRadio-tab').hide();
        $('#classicRadio-'+data_id).show();
        $('#classicRadio-'+data_id+' .fb-reaction .checkbox:nth-child(1) input').prop('checked', true);
        var value = $( "input[name=reaction]:checked" ).attr('data-price');
        $('#price').val(value);
        var price = value;
        var count = $('#count').val();
        var minutes = $('#minutes').val();
        if(!minutes) { minutes = 1; }
        $('#prices').val(addCommas(price*count*minutes) + ' VND');
        price_success();
    });

    $("input[type=number]").keyup(function(){
        var price = $('#price').val();
        var count = $('#count').val();
        var minutes = $('#minutes').val();
        if(!minutes) { minutes = 1; }
        $('#prices').val(addCommas(price*count*minutes) + ' VND');
        price_success();
    })
    function addCommas(nStr)
        {
            nStr += '';
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        }


  $("#uid").change(function () {
  var data = $(this).val();
  // if ($('#url').length) $('#url').val(data);
  var info, uid;
  if (data.includes("facebook.com")) {
    if (data.includes("/posts/") || data.includes("/videos/")) {
      info = data.split("/");
      uid = info[info.length - 1];
      if (uid.includes("?")) {
        uid = uid.split("?")[0];
      }
      if (!uid) uid = info[info.length - 2];
    } else if (data.includes("fbid=")) {
      uid = explode_by("fbid=", "&", data);
    } else if (data.includes("story_fbid=")) {
      uid = explode_by("story_fbid=", "&", data);
    } else if (data.includes("/photos/")) {
      info = data.split("/");
      uid = info[info.length - 2];
    } else if (data.match(/\/permalink\/([0-9]+)/)) {
      uid = data.match(/\/permalink\/([0-9]+)/)[1];
    } else if (data.match(/watch\/live\/\?v=/)) {
      uid = data.match(/watch\/live\/\?v=([0-9]+)/)[1];
    }
  } else if (data.includes("instagram.com")) {
    var match = data.match(/com\/p\/([a-zA-Z0-9_.-]+)/);
    if (!match) match = data.match(/com\/([a-zA-Z0-9_.-]+)/);
    if (match) uid = match[1];
  }

  if (uid) {
    $("#uid").val(uid);
   snackbarshow('Cập nhật object ID thành công','#4361ee');
  } else {
    if (!data.match(/^([0-9_]+)$/)) snackbarshow('Không nhận ra UID','#e7515a');
  }
});

$("#link").change(function () {
  var data = $(this).val();
  var link;
  if (data.includes("facebook.com")) {
    if (data.includes("profile.php")) {
      if (data.includes("&")) link = explode_by("profile.php?id=", "&", data);
      else link = replaceAll(data, "https://www.facebook.com/profile.php?id=", "");
      $("#link").val(link);
      snackbarshow('Cập nhật link thành công','#4361ee');
    } else {
      var username = "";
      if (data.includes("/posts/")) {
        username = explode_by("facebook.com/", "/posts/", data);
      } else if (data.includes("/videos/")) {
        username = explode_by("facebook.com/", "/videos/", data);
      }
     else {
        var regex = /facebook\.com\/(.*)/gm;
        let m;
        while ((m = regex.exec(data)) !== null) {
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          m.forEach((match, groupIndex) => {
            if (groupIndex === 1) username = match;
          });
        }
      }
      if (username) {
        $('#link').request('onUID', {data: {id_link: username}, success: function(respon) {
            if(respon.status==1) {
                $('#link').val(respon.data.id);
                $('#name_fb').val(respon.data.name);
                snackbarshow('Cập nhật link thành công','#4361ee');
            } else {
                snackbarshow(respon.msg,'#e7515a');
            }
            
        }})
      } else {
        snackbarshow('Không nhận ra link','#e7515a');
      }
    }
  } else if (data.includes("instagram")) {
    if (!data.includes("/p/")) {
      link = explode_by("instagram.com/", "/", data);
      $("#link").val(link);
      snackbarshow('Cập nhật link thành công','#4361ee');
    } else {
      $("#link").val("");
      snackbarshow('Không nhận ra link','#e7515a');
    }
  } else {
        $('#link').request('onUID', {data: {id_link: data}, success: function(respon) {
            if(respon.status==1) {
                $('#link').val(respon.data.id);
                $('#name_fb').val(respon.data.name);
                snackbarshow('Cập nhật link thành công','#4361ee');
            } else {
                snackbarshow(respon.msg,'#e7515a');
            }
            
        }})
  }
});

$('#comment_link').change(function() {
  var link = $(this).val();
  let match = link.match(/comment_id=([0-9]+)/);
  if (match) {
    $(this).val(match[1]);
    snackbarshow('Cập nhật comment ID thành công','#4361ee');
  }
});


function snackbarshow(msg,color) {
    Snackbar.show({
        text: msg,
        pos: 'bottom-right',
        backgroundColor: color,
        showAction: false
    });
}
