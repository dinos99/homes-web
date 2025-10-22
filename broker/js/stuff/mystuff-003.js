var pages = {} ; 
var build = {} ;

var fn_pageLoad = ( pgid ) => {
    $("#dv_container").load("/html/stuff/mystuff-" + pgid + ".html", () => {
        fn_Load_completed(pgid) ;
    }) ; 
}

var fn_Load_completed = ( pgid ) => {
    var pg_idx = ( pgid % 300 ) / 10 ; 
    pg_idx = pg_idx - 1 ; 
    $("#p_tab_items").children().removeClass("active")
    $("#p_tab_items").children().eq(pg_idx).addClass("active") ;
    pages["stuff_" + pgid] = stuff_310 ; 
    fn_get_List(pgid) ;

    /* *********************************************************************
     * 팝업클로즈(액션없음) 
     * 사장님 말씀이 임시저장 로직 추가하라고 함 ............
     * 나중에 넣겠다고 함 ....... 
     * *********************************************************************/ 
    $("#btn_close").click(function() {
        $("#ifrm_stuff_info", top.document).remove() ; 
    }) ; 
}

var fn_get_List = ( pgid ) => {
    var params = parent.fn_get_param() ;
    /* 등록정보 조회 */ 
    pages["stuff_" + pgid].fn_page_onLoad(params) ;
}


var fn_set_data = () => {
    build.params = parent.fn_get_param() ; 
//    console.log(build.params) ; 
    var bdinfo = JSON.parse(JSON.stringify(build.params)) ; 
    $("#p_build_type").text(bdinfo.estTynm) ; 
    $("#p_build_type").addClass(bdinfo.estColor) ;
    $("#btn_disp_complex").removeClass("hidden") ; 
    if ( bdinfo.isComplex == "Y" ) {
        $("#btn_disp_complex").text("단지") ; 
//        $("#p_buildnm").text(bdinfo.cplxnm)
    }
    /* 고객관심건수/중개사관심건수 조회 */ 
    /* 건물 사용승인일/세대수/동수/전체세대수/전체동수 조회 */ 
    if ( bdinfo.isComplex == "Y" ) {
        fn_get_complex(bdinfo) ; 
    }
    /* 중개사 등록물건/등록매물/계약만료/네이버광고 카운트 조회 */ 
    /* 사용하지 않는듯 ??? ( 2025.10.18 삭제 ) */ 
}

var fn_get_complex = ( params ) => {
    homes_comm.network.post("/broker/complex-info", {
        "buldno": params.buldno 
    }).then(response => {
        fn_set_complex(response.data) ; 
    }) ; 
}

var fn_set_complex = ( data ) => {
    $("#p_buildnm").text(data.cplxnm + "(" + data.arname + ")") ; 
    /* 사용승인일 */ 
    $("#p_promise_de").text(data.prmissde + "(" + data.diffy + "년)") ; 
    /* 총 세대 수 / 단지 동 */ 
    $("#p_hshldco").text(data.hshldco + "세대 / " + data.dongco + "개동") ; 
    /* 총 상가수/상가 동 */ 
//    $("#p_domgco").text(data.hshldco + "호실 / " + data.dongco + "개동)") ; 
    if ( data.elvtrco > 0) {
        $("#text_is_elevator").text("있음") ;
    }
}
