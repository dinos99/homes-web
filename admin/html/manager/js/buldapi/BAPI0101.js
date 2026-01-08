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

    h_grid = h_manager.grid.fn_create_grid(grid.gid, {
        g_Headers : ["지역코드", "시도", "시도/시군구", "읍/면/동", "번", "지", "도로명코드", "도로명 본번", "도로명 부번" ]
        , g_Models: [
            { name: "arcode" , align: "center", width: "10%" },
            { name: "arname1", align: "center", width: "10%" },
            { name: "arname2", align: "center", width: "10%" },
            { name: "arname3", align: "center", width: "10%" }, 
            { name: "bunjib"       , align: "center", width: "10%" },
            { name: "bunjij"       , align: "center", width: "10%" },
            { name: "rdcode"       , align: "center", width: "10%" },
            { name: "rdMainBun"    , align: "center", width: "10%" },
            { name: "rdSubBun"     , align: "center", width: "10%" }
        ]
        , height: 500
        , rownum: 100
    }) ; 
}

var fn_search = (pgno) => {
    var p_arcd  = $("#p_arcd_2").val() ; 
    var p_legcd = $("#p_arcd_3").val() ; 
    var p_bunjib = $("#p_bunjib").val() ;
    var p_bunjij = $("#p_bunjij").val() ; 
    h_manager.network.post("/buldapi/bapi/0101", {
        "arcode" : p_arcd + p_legcd,
        "bunjib" : p_bunjib,
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

$(document).ready(function() {

    $("#btn_search").click(function() {
        fn_search() ; 
    }) ; 

}) ; 