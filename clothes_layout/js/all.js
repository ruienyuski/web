$(document).ready(function() {
 
 //左側選單
  $('.showmenu').on('click',  function(e){
     e.preventDefault();
     $('body').toggleClass('menu-show');
 });

 // 打開左側選單
 $('.mobile-link').click(function(event) {
  $('body').addClass('open');
});
// 關閉左側選單
$('.mobile-close').click(function(event) {
  $('body').removeClass('open');
});
});


// go to top
 $('.top_fix a').on('click',function(e){
   e.preventDefault();
   $('html,body').animate({
     scrollTop:0 //頁面到最上方
   },1000);//1秒



});

