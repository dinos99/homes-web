var grid = {
    gid: "h_grid",
    dataList: [] 
}
var fn_start_page = () => {
   var picker = h_manager.ui.fn_datepicker("p_stde") ;
    picker.val(h_manager.util.fn_get_today()) ; 

    h_manager.grid.fn_create_grid(grid.gid, {
        g_Headers : ['UUID', '배치유형', '배치상태', '시작일시', '종료일시', '실행건수', '배치메시지']
        , g_Models: [
            {name:'uuid'       , align:'left'  , width: '22%'},
            {name:'batchTy'    , align:'center', width: '8%'},
            {name:'btSttuscd'  , align:'center', width: '8%', formatter: (val, opt, row) => {
                if ( val == "BTS000" ) return "작업대기";
                else if ( val == "BTS001" ) return "작업중" ;
                else if ( val == "BTS002" ) return "작업완료" ; 
                else return val ; 
            }},
            {name:'btstDt'     , align:'center', width: '10%'},
            {name:'btedDt'     , align:'center', width: '10%'},
            {name:'btExco'     , align:'right' , width: '5%', formatter: (val, opt, row) => {
                return h_manager.util.fn_format_number(val) ;
            }},
            {name:'btErrormsg' , align:'left'  , width: '37%'},
        ]
        , shrinkToFit: true
        , height: 400
        , rownum: 100
    }) ; 
}

var fn_search = (pg) => {
    var bt_stde = $("#p_batchde").val().split(".").join("") ; 
    h_manager.network.post("/batch/btjobList", {
        "btstde" : bt_stde,
        "pgno"   : pg,
        "numrows": 30
    }).then(response => {
        var dataList = response.data.dataList ; 
        h_manager.grid.fn_set_dataList( grid.gid, response.data ) ;
        h_manager.grid.fn_set_paging( grid.gid, response.data, (pgno) => {
            fn_search(pgno) ; 
        }) ;
    }) ;
}

var fn_delete_total_row = (id) => {
    var rcnt =$("#" + id).getGridParam("reccount") ;
    if ( rcnt > 0 ) {
        for ( var i = 1; i <= rcnt; i ++ ) {
            $("#" + id).delRowData(i) ; 
        }
    }
}
var fn_nodata = () => {
    fn_delete_total_row("h_gridList") ;
    $("#h_gridList").addRowData(1, {}) ;

    for ( var i = 0; i < jqHeaders.length; i ++ ) {
//                var tds = $("#h_gridList").find("tr").eq(1).children() ; 
    }
}


$(document).ready(function() {

    $("#btn_search").click(function() {
        fn_search() ; 
    }) ; 

    $("#btn_create").click(function() {
        fn_create_pssion_area() ; 
    }) ; 
}) ; 