var pop_chernm = {
    pop_id: "pop_cher_nm"
    , dataList: {} 
    , param_data: {}
    , page: { pageno: 1 }
}

var popup_start = () => {

//    popup_ui.pop_data[pop_chernm.pop_id].pop_date = pop_chernm.pop_data ; 
    pop_chernm.param_data = popup_ui.param_data[pop_chernm.pop_id] || { "p_cher_nm": "" } ; 

    if ( !!pop_chernm.param_data && pop_chernm.param_data.p_cher_nm ) {
        $("#pop_p_chernm").val(pop_chernm.param_data.p_cher_nm) ; 
        fn_comm_search("/popup/search/chernm" , {
            "usernm": $("#pop_p_chernm").val()
            , "pageno": pop_chernm.page.pageno 
        }, (response) => {
            fn_set_data(response.data) ; 
        }) ;
    }

    /* 검색버튼 클릭 */
    $("#btn_pop_usernm").click(function() {
        fn_comm_search("/popup/search/chernm" , {
            "usernm": $("#pop_p_chernm").val()
            , "pageno": pop_chernm.page.pageno 
        }, (response) => {
            fn_set_data(response.data) ; 
        }) ;
    }) ; 

    $("#pop_p_chernm").keypress(function(e) {
        if ( e.keyCode == 13 ) {
            $("#btn_pop_usernm").click() ;
        }
    }) ; 

    $("#btn_pop_close").click(function() {
        popup_ui.pop_close(pop_chernm.pop_id, {}) ; 
    }); 
}

fn_set_data = ( data ) => {
    fn_set_page(data.page) ; 
    fn_set_dataList(data.page, data.dataList) ; 
}

fn_set_dataList = ( page, dataList ) => {
    pop_chernm.dataList = dataList ; 
    if ( dataList.length > 0 ) {
        $("#tr_nodata").hide() ;
        fn_create_rows( page, dataList ) ;

    }
}

fn_create_rows = ( page, dataList ) => {
    var total = page.totalcnt ; 
    var tbody = $("#tbl_cherList > tbody")
    var row_id = "rows_" ; 
    for ( var i = 0 ; i < total; i ++ ) {
        var data = dataList[i] ; 
        var rnum = page.edno ; 
        if ( total < rnum ) rnum = total ; 
        /* 역순인 경우 */
        rnum =  (rnum < 10 ? "0" + Number( rnum - i ) : Number( rnum - i )) ; 
        /* 정순인 경우 */ 
//        rnum = (rnum < 10 ? "0" + Number( i + 1 ) : Number( i + 1 )) ; 
        row_id += rnum ; 
        var tr = $("<tr id='" + row_id + "'/>")
        var td_01 = $("<td class='tar' id='td_" + rnum + "_01'>" + Number(rnum) + "</td>") ; 
        var td_02 = $("<td class='tac' id='td_" + rnum + "_02'><a href='#' class='link-style bold' id='userno_" + data.userno + "'>" + data.usernm  + "</a></td>") ; 
        var td_03 = $("<td class='tal' id='td_" + rnum + "_03'>개발총괄/팀장</td>") ; 
        var td_04 = $("<td class='tac' id='td_" + rnum + "_04'>6150</td>") ; 
        var td_05 = $("<td class='tac' id='td_" + rnum + "_05'>" + data.userRolenm + "</td>") ; 
        var td_06 = $("<td class='tac' id='td_" + rnum + "_06'>" + data.userSttusnm + "</td>") ; 

        tr.append(td_01) ; 
        tr.append(td_02) ; 
        tr.append(td_03) ; 
        tr.append(td_04) ; 
        tr.append(td_05) ; 
        tr.append(td_06) ; 
        tbody.append(tr) ; 
    }
    $("a[id^=userno]").click(function() {
        var userno = $(this).attr("id").split("_").splice(1,1)[0] ; 
        var usernm = $(this).text() ;
        popup_ui.pop_close(pop_chernm.pop_id, { 
            "userno": userno
            , "usernm": usernm
        }) ; 

    }) ; 

}

fn_set_page = (page) => {
    pop_chernm.page = page ;
    $("#pop_chernm_pg_totalcnt").text(page.totalcnt) ; 
    $("#pop_chernm_pg_selpage").html("") ;
    if ( page.totalcnt == 0) page.totalcnt = 1 ; 
    if ( page.totalpg == 0 ) page.totalpg = 1 ; 

    var totalpg = page.totalpg < 10 ? "0" + page.totalpg : page.totalpg
    for ( var i = 0; i < page.totalpg; i ++) {
        var pg = Number( i + 1 ) ; 
        pg = pg < 10 ?  pg = "0" + pg : pg ; 
        var option = $("<option value='" + pg + "'>" + pg + " / " + totalpg + " pages</option>") ; 
        $("#pop_chernm_pg_selpage").append(option) ; 
    }
}