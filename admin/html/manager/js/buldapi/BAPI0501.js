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
        g_Headers : ["표제부 PK", "건물구분", "건물명", "건물동명", "층구분명", "층번호", "층번호명", "용도코드", "기타용도", "면적", "면적제외", "주부속건물" ]
        , g_Models: [
            { name: "totalRegstrPk" , align: "left"  , width: "10%" },
            { name: "buldgb"        , align: "center", width: "5%", formatter: ( val, opt, row) => {
                return val == "2" ? "일반" : "집합"
            }}, 
            { name: "buldnm"        , align: "center", width: "10%" }, 
            { name: "dongnm"        , align: "center", width: "10%" },
            { name: "flgbnm"        , align: "center", width: "5%" },
            { name: "floorno"       , align: "center", width: "5%" }, 
            { name: "floornm"       , align: "center", width: "5%" }, 
            { name: "ppscd"         , align: "left", width: "5%", formatter: ( val, opt, row) => {
                return h_manager.formatter.fn_get_ppsname(val) ; 
            }}, 
            { name: "ppsetcnm"      , align: "left"  , width: "5%" }, 
            { name: "totalAr"       , align: "right" , width: "5%" }, 
            { name: "arExcldAt"     , align: "center", width: "5%", formatter: (val, opt, row) => {
                if ( val == "1" ) return "제외" ; 
                else return " - " ; 
             }}, 
            { name: "mainBuldAt"    , align: "center"  , width: "10%", formatter: ( val, opt, row) => {
                if ( val == "0" ) return "주건축물" ; 
                else return "부속건축물" 
            }} 
        ]
        , shrinkToFit: true
        , height: 400
        , rownum: 100
    }) ; 
}

var fn_get_select_buldnm = () => {
    var p_arcd  = $("#p_arcd_2").val() ; 
    var p_legcd = $("#p_arcd_3").val() ; 
    var p_bunjib = $("#p_bunjib").val() ;
    var p_bunjij = $("#p_bunjij").val() ; 
    var p_buldgb = $("#p_buldgb").val() ; 
    h_manager.network.post("/buldapi/bapi/0501", {
        "arcd"   : p_arcd,
        "legcd"  : p_legcd, 
        "bunjib" : p_bunjib,
        "bunjij" : p_bunjij,
        "buldgb" : p_buldgb
    }).then(response => {
        fn_create_select_buldnm( response.data ) ; 
    }) ;
}

var fn_get_buld_dongList = ( htbdno ) => {
    if ( !!! htbdno ) return ; 
    h_manager.network.post("/buldapi/bapi/0502", {
        "htbdno": htbdno
    }).then(response => {
        fn_create_select_dongnm( response.data ) ; 
    }) ;
}

var fn_get_floor_outLine = (pgno) => {
    var p_arcd  = $("#p_arcd_2").val() ; 
    var p_legcd = $("#p_arcd_3").val() ; 
    var p_bunjib = $("#p_bunjib").val() ;
    var p_bunjij = $("#p_bunjij").val() ; 
    var p_buldgb = $("#p_buldgb").val() ; 
    h_manager.network.post("/buldapi/bapi/0503", {
        "arcd"   : p_arcd,
        "legcd"  : p_legcd, 
        "bunjib" : p_bunjib,
        "bunjij" : p_bunjij,
        "buldgb" : p_buldgb,
        "numrows": 100,
        "pgno"   : pgno
    }).then(response => {
        grid.dataList = [] ; 
        h_manager.grid.fn_set_dataList( grid.gid, response.data ) ;
        h_manager.grid.fn_set_paging( grid.gid, response.data, (pgno) => {
            fn_get_floor_outLine(pgno) ; 
        }) ;
        fn_get_select_buldnm() ;
    }) ;
}

var fn_create_select_buldnm = ( dataList ) => {
    $("#p_htbdno").empty() ; 
    $("#p_htbdno").append("<option value=''>건물명 선택</option>") ; 
    if ( !!dataList && dataList.length > 0 ) {
        dataList.forEach( data => {
            $("#p_htbdno").append("<option value='" + data.htbdno + "'>" + data.buldnm + "</option>") ; 
        }) ; 
    } 
}
var fn_create_select_dongnm = ( dataList ) => {
    $("#p_dongnm").empty() ; 
    $("#p_dongnm").append("<option value=''>건물(동) 선택</option>") ; 
    if ( !!dataList && dataList.length > 0 ) {
        dataList.forEach( data => {
            $("#p_dongnm").append("<option value='" + data.hbdno + "'>" + data.dongnm + "</option>") ; 
        }) ; 
    }
}

var fn_create_temp_floor = () => {
    var p_arcd  = $("#p_arcd_2").val() ; 
    var p_legcd = $("#p_arcd_3").val() ; 
    var p_bunjib = $("#p_bunjib").val() ;
    var p_bunjij = $("#p_bunjij").val() ; 
    var p_buldgb = $("#p_buldgb").val() ; 
    var p_htbdno = $("#p_htbdno").val() ; 
    var p_hbdno  = $("#p_dongnm").val() ; 
    h_manager.network.post("/buldapi/bapi/0504", {
        "arcd"   : p_arcd,
        "legcd"  : p_legcd, 
        "bunjib" : p_bunjib,
        "bunjij" : p_bunjij,
        "buldgb" : p_buldgb,
        "htbdno" : p_htbdno,
        "hbdno"  : p_hbdno,
        "numrows": 100,
        "pgno"   : 1
    }).then(response => {
        h_manager.message.alert( response.data.message, {
            "title"  : "<strong>[ 홈즈관리대장-층별개요 ]</strong>", 
            "msgType": "success"
        })
    }) ;
}

var fn_create_floor = () => {
    var p_arcd  = $("#p_arcd_2").val() ; 
    var p_legcd = $("#p_arcd_3").val() ; 
    var p_bunjib = $("#p_bunjib").val() ;
    var p_bunjij = $("#p_bunjij").val() ; 
    var p_buldgb = $("#p_buldgb").val() ; 
    var p_htbdno = $("#p_htbdno").val() ; 
    var p_hbdno  = $("#p_dongnm").val() ; 
    h_manager.network.post("/buldapi/bapi/0505", {
        "arcd"   : p_arcd,
        "legcd"  : p_legcd, 
        "bunjib" : p_bunjib,
        "bunjij" : p_bunjij,
        "htbdno" : p_htbdno,
        "hbdno"  : p_hbdno,
    }).then(response => {
        if ( response.data.insco > 0 ) {
            h_manager.message.alert( response.data.message, {
                "title"  : "<strong>[ 홈즈관리대장-층별개요 ]</strong>", 
                "msgType": "success"
            })
        } else {
            h_manager.message.alert( "대상지역 층별개요가 존재하지 않습니다.", {
                "title"  : "<strong>[ 홈즈관리대장-층별개요 ]</strong>", 
                "msgType": "error"
            })
        }
    }) ;
}

$(document).ready(function() {

    $("#btn_search").click(function() {
        fn_get_floor_outLine() ; 
    }) ; 

    $("#btn_create").click(function() {
        fn_create_floor() ;
    }) ;

    $("#p_htbdno").change(function() {
        $("#p_dongnm").empty() ; 
        $("#p_dongnm").append("<option value=''>건물(동) 선택</option>") ; 
        fn_get_buld_dongList($(this).val()) ;
    }) ; 

    $("#btn_temp_create").click(function() {
        fn_create_temp_floor() ; 
    }) ; 
}) ; 