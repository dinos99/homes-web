var grid = {
    gid: "h_grid",
    dataList: [] 
}

var fn_start_page = () => {
   var picker = h_manager.ui.fn_datepicker("p_stde") ;
    picker.val(h_manager.util.fn_get_today()) ; 
    h_manager.grid.fn_create_grid(grid.gid, {
        g_Headers : ["주차", "주간보고서", "시작일자", "종료일자", "보고일자", "보고자", "진행률" ]
        , g_Models: [
            { name: "weekno"  , align: "right" , width: "10%" },
            { name: "reportnm", align: "right" , width: "15%"}, 
            { name: "stde"    , align: "center", width: "15%" }, 
            { name: "edde"    , align: "center", width: "15%" },
            { name: "reportde", align: "center", width: "15%" },
            { name: "reporter", align: "center", width: "15%" }, 
            { name: "prgsrt"  , align: "center", width: "15%" }
        ]
        , height: 400
        , rownum: 10
        , shrinkToFit: true
    }) ; 
}

var fn_page_event = () => {
    $("#btn_stde_picker").click(function() {
         $('#p_stde').datepicker("show") ;
    });

    $("#btn_create").click(function() {
        location.href = 'REPT0202.html' ; 
    }) ; 
}

$(document).ready(function() {
    fn_page_event() ; 
    
}) ; 