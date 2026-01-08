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

    h_grid = h_manager.grid.fn_create_grid("h_outLine", {
        g_Headers : ["표제부 PK", "총괄표제부 PK", "건물구분", "지역코드", "법정동코드", "번", "지", "도로명코드", "도로명 본번", "도로명 부번" ]
        , g_Models: [
            { name: "buldRegstrPk" , align: "left"  , width: "10%" },
            { name: "totalRegstrPk", align: "left"  , width: "10%" },
            { name: "buldgb"       , align: "center", width: "10%" },
            { name: "arcd"         , align: "center", width: "10%" }, 
            { name: "legcd"        , align: "center", width: "10%" }, 
            { name: "bunjib"       , align: "center", width: "10%" },
            { name: "bunjij"       , align: "center", width: "10%" },
            { name: "rdcode"       , align: "center", width: "10%" },
            { name: "rdMainBun"    , align: "center", width: "10%" },
            { name: "rdSubBun"     , align: "center", width: "10%" }
        ]
        , height: 400
        , rownum: 100
    }) ; 
}

var fn_search = (pgno) => {
    var p_arcd  = $("#p_arcd_2").val() ; 
    var p_legcd = $("#p_arcd_3").val() ; 
    var p_bunjib = $("#p_bunjib").val() ;
    var p_bunjij = $("#p_bunjij").val() ; 
    h_manager.network.post("/buldapi/bapi/0201", {
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

var fn_create_summary = () => {
    var p_arcd  = $("#p_arcd_2").val() ; 
    var p_legcd = $("#p_arcd_3").val() ; 
    var p_bunjib = $("#p_bunjib").val() ;
    var p_bunjij = $("#p_bunjij").val() ; 
    h_manager.network.post("/buldapi/bapi/0202", {
        "arcd"   : p_arcd,
        "legcd"  : p_legcd, 
        "bunjib" : p_bunjib,
        "bunjij" : p_bunjij
    }).then(response => {
        h_manager.message.alert( response.data.message, {
            "title"  : "<strong>[ 기본개요 생성 ]</strong>", 
            "msgType": "success"
        })
    }) ;
}

$(document).ready(function() {

    $("#btn_search").click(function() {
        fn_search() ; 
    }) ; 

    $("#btn_create").click(function() {
        fn_create_summary() ;
    }) ; 

}) ; 