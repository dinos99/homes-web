var pages = {} ; 
var build = {} ;
var stuff = {} ; 

var fn_pageLoad = ( pgid ) => {
    $("#dv_container").load("/html/stuff/mystuff-" + pgid + ".html", () => {
        fn_Load_completed(pgid) ;
    }) ; 
}

var fn_get_memo_count = () => {
    homes_comm.network.post("/broker/memo-count", {
    }).then(response => {
        var mcnt = response.data.mcnt ; 
        $("#gv_memo_cnt").text(mcnt) ; 
    }) ; 
}

var fn_Load_completed = ( pgid ) => {
    stuff = homes_comm.store.getItem("stuff") ; 
    
    var pg_idx = ( pgid % 300 ) / 10 ; 
    pg_idx = pg_idx - 1 ; 
    
    /* 클릭이벤트 해제후 재할당 */ 
    /* ***********************************************************************************
     * 집합건물이냐 일반건물이냐 토지냐에 따라 탭메뉴구성이 또 틀려짐
     * 이젠 말도 안나온다 ......
     * 탭메뉴구성 나중에 하자 에휴 ......
     * ***********************************************************************************/
//    var params = parent.fn_get_param() ;
    var params = JSON.parse(JSON.stringify(stuff)) ; 
    var buldgb = params.buldgb ;
    $("#p_tab_items").children().off("click") ; 
    if ( buldgb == 2 ) {
        /* 집합건물 시세/실거래가 미구현 */
//        $("#p_tab_items").children().eq(3).hide() ; 
        /* 집합건물 메모사용안함 */
        $("#p_tab_items").children().eq(3).hide() ; 
    }


    $("#p_tab_items").children().each(function(i) {
        if ( i != pg_idx ) {
            $(this).click(function() {
                $("#dv_container").empty() ; 
                var pgid = 300 + (( i + 1 ) * 10) ; 
                fn_pageLoad(pgid)
            }) ; 
        }
    }) ; 

    fn_get_memo_count() ; /* 메모건수조회 */ 

    $("#p_tab_items").children().removeClass("active")
    $("#p_tab_items").children().eq(pg_idx).addClass("active") ;

    $("#btn_disp_complex").text(params.ppsNm) ; 


    if ( pgid == 310 ) {
        /* 물건등록정보 조회 */ 
        pages["stuff_310"] = stuff_310 ; 
        /* 단지물건 정보 조회 */ 
        fn_get_complex(params)
        fn_get_List(pgid) ;
    } else if ( pgid == 320 ) {
        /* 호실관리 */ 
        pages["stuff_320"] = stuff_320 ; 
        stuff_320.fn_page_onLoad(params) ; 
    } else if ( pgid == 340 ) {
        /* 메모관리 */
        pages["stuff_340"] = stuff_340 ; 
        stuff_340.fn_page_onLoad(params) ; 
    }

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
    $("#p_build_type").text(bdinfo.hppsnm) ; 
    $("#p_build_type").addClass(bdinfo.bgcolor) ;
    $("#btn_disp_complex").removeClass("hidden") ; 
    if ( bdinfo.officeno > 0 ) {
        $("#btn_disp_complex").text("단지") ; 
//        $("#p_buildnm").text(bdinfo.cplxnm)
    }
    /* 고객관심건수/중개사관심건수 조회 */ 
    /* 건물 사용승인일/세대수/동수/전체세대수/전체동수 조회 */ 
    if ( bdinfo.officeno > 0 ) {
//        fn_get_complex(bdinfo) ; 
    }
    /* 중개사 등록물건/등록매물/계약만료/네이버광고 카운트 조회 */ 
    /* 사용하지 않는듯 ??? ( 2025.10.18 삭제 ) */ 
}

var fn_get_complex = ( params ) => {
    homes_comm.network.post("/broker/complex-info", {
        "htbdno": params.htbdno
    }).then(response => {
        fn_set_complex(response.data) ; 
    }) ; 
}

var fn_set_complex = ( data ) => {
    $("#p_buildnm").text(data.cplxnm + "(" + data.arname + ")") ; 
    /* 사용승인일 */ 
    if ( homes_comm.util.fn_isEmpty(data["prmissde"])) {
        $("#p_promise_de").text( " - " ) ; 
    } else {
        $("#p_promise_de").text(data.prmissde + "(" + data.diffy + "년)") ; 
    }
    
    /* 총 세대 수 / 단지 동 */ 
    var hshldco = homes_comm.util.fn_format_number( data.hshldco ) ;
    var dongco  = homes_comm.util.fn_format_number( data.dongco ) ;

    $("#p_hshldco").text(hshldco + "세대 / " + dongco + "개동") ; 
    /* 총 상가수/상가 동 */ 
//    $("#p_domgco").text(data.hshldco + "호실 / " + data.dongco + "개동)") ; 
    if ( data.elvtrco > 0) {
        $("#text_is_elevator").text("있음") ;
    }
}
