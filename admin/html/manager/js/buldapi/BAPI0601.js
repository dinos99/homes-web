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
        g_Headers : ["표제부 PK", "건물구분", "지번 주소", "건물명", "건물동명", "층구분명", "층번호", "호실명" ]
        , g_Models: [
            { name: "buldRegstrPk"  , align: "left"  , width: "5%" },
            { name: "buldgb"        , align: "center", width: "5%", formatter: ( val, opt, row) => {
                return val == "2" ? "일반" : "집합"
            }}, 
            { name: "bdaddr"        , align: "left", width: "20%"},
            { name: "buldnm"        , align: "center", width: "10%" }, 
            { name: "dongnm"        , align: "center", width: "10%" },
            { name: "flgbnm"        , align: "center", width: "5%" },
            { name: "flno"         , align: "center", width: "5%" }, 
            { name: "hosilnm"         , align: "center", width: "5%" }, 
        ]
        , shrinkToFit: true
        , height: 400
        , rownum: 100
        , shrinkToFit: false
    }) ; 
}

var fn_search = (pgno) => {
    var p_arcd  = $("#p_arcd_2").val() ; 
    var p_legcd = $("#p_arcd_3").val() ; 
    var p_bunjib = $("#p_bunjib").val() ;
    var p_bunjij = $("#p_bunjij").val() ; 
    var p_buldgb = $("#p_buldgb").val() ; 
    h_manager.network.post("/buldapi/bapi/0601", {
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


$(document).ready(function() {

    $("#btn_search").click(function() {
        fn_search() ; 
    }) ; 
}) ; 