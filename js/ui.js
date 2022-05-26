window.addEventListener("DOMContentLoaded", function(){
    let msg_box = $('.message_box p');
    let action_dot = $('.a_dot');
  $('#info').click(function () {
      $('.instructions').toggle();
  });
  $('.instructions').click(function () {
      $(this).hide();
  })
    action_dot.mouseover(function () {
        let text = $(this).data('text');
        msg_box.html(text);
    })
    action_dot.mouseout(function () {
        msg_box.html('Выбор действия');
    })
    action_dot.click(function () {
        let text = $(this).data('text');
        msg_box.html('');
        msg_box.html(text);
        $(this).unbind('mouseout');
    })
    $('.copyright').mouseover(function (e) {
        e.preventDefault();
        $('.copyright_dot').css('transform','translateX(0px)')
        $('.copyright_line').css('width','2rem')
    })
    $('.copyright').mouseout(function (e) {
        e.preventDefault();
        $('.copyright_dot').css('transition-duration','450ms')
        $('.copyright_dot').css('transform','translateX(50px)')
        $('.copyright_line').css('width','0')
    })

})