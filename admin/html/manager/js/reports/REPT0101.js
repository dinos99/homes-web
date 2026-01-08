var codeList = {
    "cat_01": [{"cd": "SYS", "nm": "시스템"}, {"cd": "COM", "nm": "공통" }],
    "cat_02": [{
        "code": "SYS",
        "cd"  : "001",
        "nm"  : "건축물대장등록"
    }, {
        "code": "COM",
        "cd"  : "001",
        "nm"  : "로그인"
    }],
    "cat_03": [{
        "cat_01": "SYS", 
        "cat_02": "001",
        "code": [
                { "cd": "001", "nm": "기본개요 등록" },
                { "cd": "002", "nm": "총괄표제부 등록" },
                { "cd": "003", "nm": "표제부 등록" },
                { "cd": "004", "nm": "층별개요 등록" },
                { "cd": "005", "nm": "전유부 등록" },
                { "cd": "006", "nm": "전유공용면적 등록"}
        ]
    }]
}

var sv_params = [] ; 

var fn_set_params = () => {
    var p_stde   = $("#p_stde").val() ; 
    p_stde = p_stde.split(".").join("") ; 
    var p_edde   = "" ; 
    var p_doneYn = $("#p_doneYn").is(":checked") ? "Y" : "N" ; 
    var interval = $("#p_sel_stde").val() ; 
    if ( interval == "7D") {
        p_edde = h_manager.util.fn_add_days(p_stde, 7) ; 
        p_edde = p_edde.split(".").join("") ; 
    }
    return {
        "p_stde"  : p_stde,
        "p_edde"  : p_edde,
        "p_doneYn": p_doneYn
    }
}

var fn_remove_empty_row = () => {
    $("#tr_nodata").show() ; 
    if ( $("#tb_data").children().length > 1 ) {
        $("#tb_data").children().each(function(i) {
            if ( i > 0 ) {
                $(this).remove() ;
            }
        }) ; 
    }
}

var fn_set_todoList = ( dataList ) => {
    if ( !!dataList && dataList.length > 0 ) {
        fn_add_data_row( dataList ) ; 
    } else {
        fn_remove_empty_row() ;
    }
}

var fn_start_page = () => {
}

var fn_cat_01 = (rn, code) => {
    $("#sel_cat_02_" + rn).empty() ;
    $("#sel_cat_02_" + rn).append("<option value=''>선택</option>") ; 
    codeList.cat_02.filter(cat => cat.code == code ).forEach(cd => {
        $("#sel_cat_02_" + rn).append("<option value='" + cd.cd + "'>" + cd.nm + "</option>") ; 
    }) ;
    $("#sel_cat_02_" + rn).change(function() {
        fn_cat_02(rn, code, $(this).val()) ; 
    }) ;
}
var fn_cat_02 = (rn, c1, c2) => {
    codeList.cat_03.filter(cat => (cat.cat_01 == c1 && cat.cat_02 == c2)).forEach(cd => {
        cd.code.forEach(code => {
            $("#sel_cat_03_" + rn).append("<option value='" + code.cd + "'>" + code.nm + "</option>") ; 
        }) ; 
    }) ;
    $("#sel_cat_03_" + rn).change(function() {
        fn_cat_03(rn, c1, c2, $(this).val()) ; 
    }) ;
}

var fn_cat_03 = (rn, c1, c2, c3) => {
//    var wkid = h_manager.util.fn_Lpad(rn, 3, '0') ; 
    $("#wk_code_" + rn).text(c1 + c2 + c3) ;
}
var fn_add_data_row = ( dataList ) => {
    if ( !!!dataList || dataList.length == 0 ) return ; 
    fn_remove_empty_row() ; 
    $("#tr_nodata").hide() ;

    var rn = 1;
    dataList.forEach(data => {
        var c1 = data.wkid.substring(0, 3) ; 
        var c2 = data.wkid.substring(3, 6) ; 
        var c3 = data.wkid.substring(6, 9) ; 
        var tr = $("<tr id='rnum_" + rn + "' />") ;
        var td_check = $("<td class='tac'/>") ; 
        /* check box */
        var fm_check = $("<input type='checkbox' class='form-check-input' id='fm_chk_done_" + rn + "' />") ; 
        if ( data.doneYn == "Y" ) {
            fm_check.prop("checked", "checked") ; 
        }
        var _rownum = rn ; 
        fm_check.click(function() {
            fn_update_doneYn(_rownum, data.wkid) ;
        }) ; 

        /* 작업코드 */ 
        var td_wkcode = $("<td class='tac' id='wk_code_" + rn + "' />") ; 
        td_wkcode.text(data.wkid) ; 
        /* cate 01 */
        var td_cate_01 = $("<td class='tac' id='wk_cate_01_" + rn + "' />") ; 
        codeList.cat_01.filter(cat => cat.cd == c1).forEach(cd => {
            td_cate_01.text(cd.nm) ; 
        }) ;
        /* arrow 01 */
        var td_next_01 = $("<td class='tac' />&gt;</td>") ; 
        /* cate 02 */
        var td_cate_02 = $("<td class='tal' id='wk_cate_02_" + rn + "' />") ; 
        codeList.cat_02.filter(cat => (cat.code == c1 && cat.cd == c2)).forEach(cd => {
            td_cate_02.text(cd.nm) ; 
        }) ;
        /* arrow 02 */
        var td_next_02 = $("<td class='tac' />&gt;</td>") ; 
        /* cate 03 */
        var td_cate_03 = $("<td class='tal' id='wk_cate_03_" + rn + "' />") ; 
        codeList.cat_03.filter(cat => (cat.cat_01 == c1 && cat.cat_02 == c2)).forEach(cat => {
            cat.code.filter(cd => (cd.cd == c3)).forEach(cd => {
                td_cate_03.text(cd.nm) ; 
            }) ; 
        }) ;
        /* 시작일시 */
        var td_stde = $("<td class='tac' id='wk_stde_" + rn + "' />") ; 
        if ( !!data.stde ) td_stde.text(h_manager.util.fn_format_date(data.stde)) ;
        else td_stde.html("&nbsp;") ; 
        
        /* 종료일시 */
        var td_edde = $("<td class='tac' id='wk_edde_" + rn + "' />") ; 
        if ( !!data.edde ) td_edde.text(h_manager.util.fn_format_date(data.edde)) ;
        else td_edde.html("&nbsp;") ; 
        /* 작업내역 */
        var td_wkcont = $("<td class='tal' id='wk_cont_" + rn + "' />") ; 
        td_wkcont.text(data.wkcont) ; 
        td_check.append(fm_check) ; 

        tr.append(td_check) ; 
        tr.append(td_wkcode) ; 
        tr.append(td_cate_01) ; 
        tr.append(td_next_01) ; 
        tr.append(td_cate_02) ; 
        tr.append(td_next_02) ; 
        tr.append(td_cate_03) ; 
        tr.append(td_stde) ; 
        tr.append(td_edde) ; 
        tr.append(td_wkcont) ; 
        $("#tb_data").append(tr) ; 

        if ( data.doneYn == "Y" ) {
            tr.children().addClass("done") ;
            td_wkcont.addClass("txt-cancel") ;
        }

        rn ++ ;
    }) ; 
}
var fn_add_row = () => {
    fn_remove_empty_row() ;
    $("#tr_nodata").hide() ;
    var rn = $("#tb_data").children().length ; 
    var tr = $("<tr id='rnum_" + rn + "' />") ;
    var td_check = $("<td class='tac'/>") ; 

    /* check box */
//    var dv_check = $("<div class='form-check' />") ; 
    var fm_check = $("<input type='checkbox' class='form-check-input' id='fm_chk_done_" + rn + "' />") ; 
//    var lv_check = $("<label class='form-check-label' for='fm_chk_done_" + rn + "'>")
    fm_check.prop("disabled", "disabled") ; 

    /* 작업코드 */ 
    var td_wkcode = $("<td class='tac' id='wk_code_" + rn + "' />") ; 

    /* cate 01 */
    var td_cate_01 = $("<td class='tac' id='wk_cate_01_" + rn + "' />") ; 
    var select_01 =$("<select id='sel_cat_01_" + rn + "' class='form-select'/>") ; 
    select_01.append("<option value=''>선택</option>") ; 
    codeList.cat_01.forEach(code => {
        select_01.append("<option value='" + code.cd + "'>" + code.nm + "</option>")
    }) ; 
    select_01.change(function() {
        fn_cat_01(rn, $(this).val()) ; 
    }) ; 


    /* arrow 01 */
    var td_next_01 = $("<td class='tac' />&gt;</td>") ; 
    /* cate 02 */
    var td_cate_02 = $("<td class='tac' id='wk_cate_02_" + rn + "' />") ; 
    var select_02 =$("<select id='sel_cat_02_" + rn + "' class='form-select'/>") ; 
    select_02.append("<option value=''>선택</option>"); 

    /* arrow 02 */
    var td_next_02 = $("<td class='tac' />&gt;</td>") ; 
    /* cate 03 */
    var td_cate_03 = $("<td class='tac' id='wk_cate_03_" + rn + "' />") ; 
    var select_03 =$("<select id='sel_cat_03_" + rn + "' class='form-select'/>") ; 
    select_03.append("<option value=''>선택</option>"); 

    /* 시작일시 */
    var td_stde = $("<td class='tac' id='wk_stde_" + rn + "' />") ; 
    var in_stde = $("<input class='form-control' id='in_stde_" + rn + "' maxlength='10'/>")
    td_stde.append(in_stde) ; 
    /* 종료일시 */
    var td_edde = $("<td class='tac' id='wk_edde_" + rn + "' />") ; 
    var in_edde = $("<input class='form-control' id='in_edde_" + rn + "' maxlength='10'/>")
    td_edde.append(in_edde) ; 

    /* 작업내역 */
    var td_wkcont = $("<td class='tal' id='wk_cont_" + rn + "' />") ; 
    var in_wkcont = $("<input class='form-control' id='in_wkcont_" + rn + "' />")
    td_wkcont.append(in_wkcont) ; 

    td_cate_01.append(select_01) ;
    td_cate_02.append(select_02) ;
    td_cate_03.append(select_03) ;

    td_check.append(fm_check) ; 
    tr.append(td_check) ; 
    tr.append(td_wkcode) ; 
    tr.append(td_cate_01) ; 
    tr.append(td_next_01) ; 
    tr.append(td_cate_02) ; 
    tr.append(td_next_02) ; 
    tr.append(td_cate_03) ; 
    tr.append(td_stde) ; 
    tr.append(td_edde) ; 
    tr.append(td_wkcont) ; 
    $("#tb_data").append(tr) ; 
    
    h_manager.ui.fn_datepicker("in_stde_" + rn) ;
    h_manager.ui.fn_datepicker("in_edde_" + rn) ;

}

var fn_page_event = () => {
    $("#btn_add_row").click(function() {
        fn_add_row() ; 
    }) ; 
    $("#btn_stde_picker").click(function() {
         $('#p_stde').datepicker("show") ;
    });
    $("#btn_search").click(function() {
        fn_search_data() ; 
    }) ;

    $("#btn_save").click(function() {
        if ( $("#tb_data").children().length == 1 ) {
            h_manager.message.alert("등록할 작업내용이 없습니다.") ;
        } else {
            sv_params = [] ; 
            $("#tb_data").children().each(function(rn) {
                if ( rn > 0 ) {
                    var c1 = $("#sel_cat_01_" + rn).val() ; 
                    var c2 = $("#sel_cat_02_" + rn).val() ; 
                    var c3 = $("#sel_cat_03_" + rn).val() ; 
                    sv_params.push({
                        "wkid"  : c1 + c2 + c3 ,
                        "stde"  : $("#in_stde_"   + rn).val().split(".").join(""),
                        "edde"  : $("#in_stde_"   + rn).val().split(".").join(""),
                        "wkcont": $("#in_wkcont_" + rn).val(),
                        "doneYn": "N",
                    }) ;
                }
            }) ;
            if ( sv_params.length > 0 ) {
                h_manager.network.post("/manager/saveTodoList", sv_params, {
                }).then(response => {
                    fn_search_data() ;
                }) ; 
            }
        }
    }) ; 
}

var fn_search_data = () => {
    var p_stde = $('#p_stde').val() ; 
    if ( !!!p_stde ) {
        h_manager.message.alert("검색기간을 입력해 주십시오", {
        }).then(response => {
            $('#p_stde').datepicker("show") ;
        }) ; 
        return ; 
    } else {
        var params = fn_set_params() ; 
        h_manager.network.post("/manager/todoList", {
            "stde"  : params.p_stde,
            "edde"  : params.p_edde,
            "doneYn": params.p_doneYn,
        }).then(response => {
            fn_set_todoList(response.data) ; 
        }) ; 
    }
}
var fn_update_doneYn = ( rn, wkid ) => {
    var doneYn = $("#fm_chk_done_" + rn).is(":checked") ? "Y" : "N" ; 
    h_manager.network.post("/manager/updateTodoList", {
        "wkid"  : wkid,
        "doneYn": doneYn
    }).then(response => {
        fn_search_data() ; 
    }) ; 
}

var fn_set_datepicker = () => {
   var picker = h_manager.ui.fn_datepicker("p_stde") ;
    picker.val(h_manager.util.fn_get_today()) ; 
}

$(document).ready(function() {
    fn_page_event() ; 
    fn_set_datepicker() ; 

//    $(".ui-widget-header").css("color", "#ffffff") ;
}) ; 