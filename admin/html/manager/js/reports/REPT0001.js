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
        "code": [{
                "cd": "001", "nm": "기본개요 등록"
            }, {
                "cd": "002", "nm": "총괄표제부 등록"
            }, {
                "cd": "003", "nm": "표제부 등록"
            }, {
                "cd": "004", "nm": "층별개요 등록"
            }, {
                "cd": "005", "nm": "전유부 등록"
            }, {
                "cd": "006", "nm": "전유공용면적 등록"
            }]
    }]
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

var fn_add_row = () => {
    $("#tr_nodata").hide() ;
    var rn = $("#tb_data").children().length ; 
    var tr = $("<tr id='runm_" + rn + "' />") ;
    var td_check = $("<td class='tac'/>") ; 

    /* check box */
//    var dv_check = $("<div class='form-check' />") ; 
    var fm_check = $("<input type='checkbox' class='form-check-input' id='fm_chk_done_" + rn + "' />") ; 
//    var lv_check = $("<label class='form-check-label' for='fm_chk_done_" + rn + "'>")

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
    var td_wkcont = $("<td class='tac' id='wk_cont_" + rn + "' />") ; 
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
}

var fn_page_event = () => {
    $("#btn_add_row").click(function() {
        fn_add_row() ; 
    }) ; 
}

$(document).ready(function() {
    fn_page_event() ; 
}) ; 