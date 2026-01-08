var grid = {
    gid: "h_outLine",
    dataList: [] 
}
var fn_start_page = () => {
    h_manager.ui.fn_make_sidoList("p_arcd_1", {
        "sdid": "p_arcd_1",
        "sgid": "p_arcd_2",
        "edid": "p_arcd_3"
    }) ; 

    h_manager.grid.fn_create_grid(grid.gid, {
        g_Headers : ["표제부 PK", "건물구분", "용도코드", "기타용도", "지번주소", "건물 명", "동 명", "호실 수", "세대수", "가구수", "주차대수"
                    , "엘리베이터 수"
         ]
        , g_Models: [
            { name: "buldRegstrPk"  , align: "left"  , width: "10%" },
            { name: "buldgb"        , align: "center", width: "5%", formatter: ( val, opt, row) => {
                return val == "2" ? "일반" : "집합"
            }}, 
            { name: "ppscd"         , align: "left", width: "5%", formatter: ( val, opt, row) => {
                return h_manager.formatter.fn_get_ppsname(val) ; 
            }}, 
            { name: "ppsetcnm"      , align: "left"  , width: "10%" }, 
            { name: "bdaddr"        , align: "left"  , width: "20%" }, 
            { name: "buldnm"        , align: "left"  , width: "10%" }, 
            { name: "dongnm"        , align: "left"  , width: "10%" }, 
            { name: "hosilco"       , align: "right" , width: "5%", formatter: (val, opt, row) => {
                return h_manager.util.fn_format_number(val) ;
            }}, 
            { name: "hshldco"       , align: "right" , width: "5%", formatter: (val, opt, row) => {
                return h_manager.util.fn_format_number(val) ;
            }}, 
            { name: "fmlyco"        , align: "right" , width: "5%", formatter: (val, opt, row) => {
                return h_manager.util.fn_format_number(val) ;
            }}, 
            { name: "hosilco"       , align: "right" , width: "5%", formatter: (val, opt, row) => {
                return h_manager.util.fn_format_number(val) ;
            }}, 
            { name: "ridngElvtrCo"  , align: "right" , width: "5%", formatter: (val, opt, row) => {
                return h_manager.util.fn_format_number(val) ;
            }}, 
        ]
        , height: 500
        , rownum: 100
    }) ; 
}

var fn_search = (pgno) => {
    var p_arcd  =  $("#p_arcd_2").val() ; 
    var p_legcd =  $("#p_arcd_3").val() ; 
    var p_bunjib = $("#p_bunjib").val() ;
    var p_bunjij = $("#p_bunjij").val() ; 
    var p_selgb  = $("#p_selgb").val() ; 
    h_manager.network.post("/buldapi/bapi/0301", {
        "arcd"   : p_arcd,
        "legcd"  : p_legcd, 
        "bunjib" : p_bunjib,
        "bunjij" : p_bunjij,
        "selgb"  : p_selgb,
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


var fn_create_Ledgr = () => {
    var p_arcd  = $("#p_arcd_2").val() ; 
    var p_legcd = $("#p_arcd_3").val() ; 
    var p_bunjib = $("#p_bunjib").val() ;
    var p_bunjij = $("#p_bunjij").val() ; 
    h_manager.network.post("/buldapi/bapi/0302", {
        "arcd"   : p_arcd,
        "legcd"  : p_legcd, 
        "bunjib" : p_bunjib,
        "bunjij" : p_bunjij
    }).then(response => {
        h_manager.message.alert( response.data.message, {
            "title"  : "<strong>[ 홈즈관리대장-표제부 생성 ]</strong>", 
            "msgType": "success"
        })
    }) ;
}

$(document).ready(function() {

    $("#btn_search").click(function() {
        fn_search() ; 
    }) ; 

    $("#btn_create").click(function() {
        fn_create_Ledgr() ;
    }) ; 

}) ; 