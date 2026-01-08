var grid = {
    gid: "h_grid",
    dataList: [] 
}
var fn_start_page = () => {
    h_manager.ui.fn_make_sidoList("p_arcd_1", {
        "sdid": "p_arcd_1",
        "sgid": "p_arcd_2",
        "edid": "p_arcd_3"
    }) ; 

    h_manager.grid.fn_create_grid(grid.gid, {
        g_Headers : ["전유부 PK", "건물명", "건물동명", "층구분", "층번호명", "호실명", "전유/공융구분", "주부속구분"
                      , "용도코드", "기타용도", "연면적", "생성일자" ]
        , g_Models: [
            { name: "buldRegstrPk"  , align: "left"  , width: "5%" },
            { name: "buldnm"        , align: "center", width: "5%" }, 
            { name: "dongnm"        , align: "center", width: "5%" },
            { name: "flgbnm"        , align: "center", width: "5%" },
            { name: "flnm"          , align: "center", width: "5%" }, 
            { name: "hosilnm"       , align: "center", width: "5%" }, 
            { name: "pubusenm"      , align: "center", width: "5%" }, 
            { name: "mainnm"        , align: "center", width: "5%" }, 
            { name: "ppsnm"         , align: "center", width: "5%" }, 
            { name: "ppsetcnm"      , align: "center", width: "5%" }, 
            { name: "totalAr"       , align: "center", width: "5%" }, 
            { name: "crde"          , align: "center", width: "5%" }, 
        ]
        , shrinkToFit: true
        , height: 400
        , rownum: 100
    }) ; 
}

var fn_search = (pgno) => {
    var p_arcd  = $("#p_arcd_2").val() ; 
    var p_legcd = $("#p_arcd_3").val() ; 
    var p_bunjib = $("#p_bunjib").val() ;
    var p_bunjij = $("#p_bunjij").val() ; 
    var p_buldgb = $("#p_buldgb").val() ; 
    h_manager.network.post("/buldapi/bapi/0701", {
        "arcd"   : p_arcd,
        "legcd"  : p_legcd, 
        "bunjib" : p_bunjib,
        "bunjij" : p_bunjij,
        "numrows": 100,
        "pgno"   : pgno
    }).then(response => {
        grid.dataList = [] ; 
        h_manager.grid.fn_set_dataList( grid.gid, response.data ) ;
        h_manager.grid.fn_set_paging( grid.gid, response.data, (pgno) => {
            fn_search(pgno) ; 
        }) ;
    }) ;
}

var fn_create_pssion_area = () => {
    var p_arcd  = $("#p_arcd_2").val() ; 
    var p_legcd = $("#p_arcd_3").val() ; 
    var p_bunjib = $("#p_bunjib").val() ;
    var p_bunjij = $("#p_bunjij").val() ; 
    var p_buldgb = $("#p_buldgb").val() ; 
    var p_htbdno = $("#p_htbdno").val() ; 
    var p_hbdno  = $("#p_dongnm").val() ; 
    h_manager.network.post("/buldapi/bapi/0702", {
        "arcd"   : p_arcd,
        "legcd"  : p_legcd, 
        "bunjib" : p_bunjib,
        "bunjij" : p_bunjij,
        "htbdno" : p_htbdno,
        "hbdno"  : p_hbdno,
    }).then(response => {
        if ( response.data.insco > 0 ) {
            h_manager.message.alert( response.data.message, {
                "title"  : "<strong>[ 홈즈관리대장-전유공용면적 ]</strong>", 
                "msgType": "success"
            })
        } else {
            h_manager.message.alert( "대상지역 전유공용면적이 존재하지 않습니다.", {
                "title"  : "<strong>[ 홈즈관리대장-전유공용면적 ]</strong>", 
                "msgType": "error"
            })
        }
    }) ;
}

$(document).ready(function() {

    $("#btn_search").click(function() {
        fn_search() ; 
    }) ; 

    $("#btn_create").click(function() {
        fn_create_pssion_area() ; 
    }) ; 
}) ; 