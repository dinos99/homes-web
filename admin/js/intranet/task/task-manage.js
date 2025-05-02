window.onload = () => {
  fn_homes_admin_init()  /* 모든 js에 포함시켜야 함 */  ; 

  /* 로드 후 페이지 event */
  homes_ui.datepicker( "p_task_stde", "btn_task_stde" ) ; 
  homes_ui.datepicker( "p_task_edde", "btn_task_edde" ) ; 

  $("#btn_cher_nm").click(function() {
    popup_ui.pop_open("pop_cher_nm", {
      pop_url: "/html/popup/pop_cher_nm.html"
      , pop_title: "작업담당자 지정"
      , pop_width: 600  
      , pop_height: 400
      , param_data: { "p_cher_nm": $("#p_cher_nm").val() }
    }).then(pop_result => {
      var data = pop_result.pop_data ; 
      $("#p_cher_nm").val(data.usernm) ; 
      $("#p_userno").val(data.userno) ; 
    }) ; 
  })

  $("#p_cher_nm").keypress(function(e) {
    if (e.keyCode == 13) {
      $("#btn_cher_nm").click() ;
    }
  }) ; 
} ; 