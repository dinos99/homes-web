var stuff_320 = {} ;
var commcode = {} ; 
stuff_320.data = {
    st_List: []
} ; 
stuff_320.params = {} ; 

stuff_320.fn_page_onLoad = ( params ) => {
    /* 점유구분코드 조회 */
    fn_get_commcode("OCC", {
    }).then(data => {
        commcode.OCC = data ; 
    }) ; 

    stuff_320.params = homes_comm.store.getItem("stuff") ; 
    /* 물건 건물정보조회 */ 
    homes_comm.network.post("/stuff/stuff-buld-info", {
        "stuffno": stuff_320.params.stuffno,
        "htbdno" : stuff_320.params.htbdno
    }).then(response => {
        stuff_320.data.st_List = [] ; 
        $("#dv_bdroomList").empty() ; 
        if ( homes_comm.util.fn_isNotEmpty(response.data)) {
            $("#dv_nodata").removeClass("hidden").addClass("hidden") ; 
            stuff_320.data.st_List = response.data ; 
            stuff_320.fn_set_stuff() ; 
        } else {
            $("#dv_nodata").removeClass("hidden") ; 
        }
    }) ;

    $("#btn_v_List").click(function() {
        var bd_room = $("div[id^=bdroom_rn_]") ; 
        if ( bd_room.length > 3 ) {
            var is_hide = $("#bdroom_rn_4").is(".hidden") ; 
            if ( is_hide ) {
                $("div[id^=bdroom_rn_]").each(function(i) {
                    if ( i > 2 ) $(this).removeClass("hidden") ; 
                }) ; 
                /* arrow up */ 
                $(this).find(".arrow-down").removeClass("arrow-down").addClass("arrow-up") ;
                var offset = $("#btn_v_List").offset() ; 
                $(".pop-container").animate({scrollTop: offset.top + 180 }, 500) ; 
            } else {
                $("div[id^=bdroom_rn_]").each(function(i) {
                    if ( i > 2 ) $(this).addClass("hidden") ; 
                }) ; 
                /* arrow down */ 
                $(this).find(".arrow-up").removeClass("arrow-up").addClass("arrow-down") ;
            }
        } 
    }) ; 
}

stuff_320.fn_set_stuff = () => {
    var st_List = stuff_320.data.st_List ; 
//    var dv_bdroom = $("#dv_bdroomList") ; 
    st_List.forEach((st, i) => {
        var rn = i + 1 ; 
        var dongnm  = st.dongnm ;
        var hosilnm = st.hosilnm ; 
        var h_text  = "" ; 

        var dv_bdroom = $("<div class='cont justify-start bg-gray' id='bdroom_rn_" + rn + "' />") ; 
        if ( rn > 3 ) dv_bdroom.addClass("hidden") ;
        var dv_af_01 = $("<div class='action-field W-200px'/>") ; 
        var dv_af_02 = $("<div class='action-field W-200px' />") ; 
        var dv_af_03 = $("<div class='action-field W-160px'/>") ; 
        var dv_af_04 = $("<div class='action-field w-100'/>") ; 
        
        var dv_al_01 = $("<div class='action-label'/>") ; 
        var dv_al_02 = $("<div class='action-label'/>") ; 
        var dv_al_03 = $("<div class='action-label w-160 d-flex'/>") ; 
        var dv_al_04 = $("<div class='action-label last tal'/>") ; 

        if ( homes_comm.util.fn_isNotEmpty(dongnm)) {
            h_text = h_text + dongnm + " / " ; 
        }
        h_text = h_text + hosilnm ; 
        dv_al_01.text(h_text) ;

//        console.log(st) ;
        var sp_02_01 = $("<span class='gray-label mr-10'>전용/공급면적</span>") ; 
        var sp_02_02 = $("<span>" + st.pssionAr + "/" + st.supplyAr + "㎡</span>") ; 
        dv_al_02.append(sp_02_01) ; 
        dv_al_02.append(sp_02_02) ; 

        var sp_03_01  = $("<span class='gray-label mr-10'>점유구분</span>") ;
        var select_03 = $("<select id='occpgb_" + rn + "' class='form-select'/>") ; 
        select_03.append("<option value=''>미선택</option>") ; 

        commcode.OCC.forEach(code => {
            var selected = code.code == st.occpgb ? " selected " : "" ; 
            select_03.append("<option value='" + code.commCode + "' data-hpsno='" + st.hpsno + "'" + selected + ">" + code.codename + "</option>") ; 
        }) ; 

        dv_al_03.append(sp_03_01) ; 
        dv_al_03.append(select_03) ; 

        var sp_04_01 = $("<span class='gray-label mr-10'>만기일</span>") ; 
        var sp_04_02 = $("<span class='icon-edit'/>") ; 
        var a_Link = $("<a href='#' class='text-decoration-none' />") ; 
        var sp_expirede = $("<span id='sp_expire_de_" + rn + "'/>") ; 
        var expde = homes_comm.util.fn_format_date(st.expirede) ;
        if ( st.crtcAt == "1" ) expde = expde + "(" + st.crtcyy + "년)" ; 
        else if (st.crtcAt == "2") expde = expde + "(" + st.crtcmm + "개월)" ; 
        else expde = " - " ; 
        var ico_edit = $("<i class='bi bi-pencil-square'></i>") ; 
        sp_expirede.text(expde) ;
        
        a_Link.attr("data-rn"      , rn) ; 
        a_Link.attr("data-stuffno" , st.stuffno) ; 
        a_Link.attr("data-hpsno"   , st.hpsno) ; 
        a_Link.attr("data-expirede", st.expirede) ; 
        a_Link.attr("data-crtcyy"  , st.crtcyy) ; 
        a_Link.attr("data-crtcmm"  , st.crtcmm) ; 
        a_Link.attr("data-crtcAt"  , st.crtcAt) ; 
        a_Link.append(sp_expirede) ; 
        a_Link.append(ico_edit) ; 

        sp_04_02.append(a_Link) ; 
        
        dv_al_04.append(sp_04_01) ; 
        dv_al_04.append(sp_04_02) ; 

        dv_af_01.append(dv_al_01) ; 
        dv_af_02.append(dv_al_02) ; 
        dv_af_03.append(dv_al_03) ; 
        dv_af_04.append(dv_al_04) ; 

        dv_bdroom.append(dv_af_01) ; 
        dv_bdroom.append(dv_af_02) ; 
        dv_bdroom.append(dv_af_03) ; 
        dv_bdroom.append(dv_af_04) ; 
        $("#dv_bdroomList").append(dv_bdroom) ;

        select_03.change(function() {
            var val   = $(this).val() ; 
            var hpsno = "" ; 
            $(this).children().each(function(i) {
                var _opVal = $(this).val() ; 
                var _hpsno = $(this).attr("data-hpsno") ; 
                if ( val == _opVal ) {
                    hpsno = _hpsno ;
                }
            }) ; 
            stuff_320.fn_update_buld_etc({
                "col"   : "OCCP",
                "occpgb": val,
                "hpsno" : hpsno 
            }) ; 
        }) ; 

        a_Link.click(function() {
            var _rownum   = $(this).attr("data-rn") ; 
            var _stuffno  = $(this).attr("data-stuffno") ; 
            var _hpsno    = $(this).attr("data-hpsno") ; 
            var _expirede = $(this).attr("data-expirede") ;
            var _crtcyy    = $(this).attr("data-crtcyy") ;
            var _crtcmm    = $(this).attr("data-crtcmm") ;
            var _crtcAt    = $(this).attr("data-crtcAt") ; 
            _this = $(this) ; 
            homes_comm.popup.fn_pop_open("/pop-contract-expirede.html", {
                "popid"   : "contract",
                "rn"      : _rownum, 
                "stuffno" : _stuffno,
                "hpsno"   : _hpsno,
                "expirede": _expirede,
                "crtcyy"  : _crtcyy,
                "crtcmm"  : _crtcmm,
                "crtcAt"  : _crtcAt,
            }, (data) => {
                var action = data.action ; 
                if ( action == "pop_ok") {
                    stuff_320.fn_update_buld_etc({
                        "col"     : "EXPR",
                        "expirede": data.pop_data.expirede,
                        "crtcyy"  : data.pop_data.crtcyy,
                        "crtcmm"  : data.pop_data.crtcmm,
                        "crtcAt"  : data.pop_data.crtcAt,
                        "hpsno"   : _hpsno 
                    }) ; 
                    var expde = data.pop_data.expirede ; 
                    if ( homes_comm.util.fn_isNotEmpty(expde)) {
                        debugger ;
                        _this.attr("data-expirede", expde.split(".").join("")) ; 
                        _this.attr("data-crtcyy"  , data.pop_data.crtcyy) ; 
                        _this.attr("data-crtcmm"  , data.pop_data.crtcmm) ; 
                        _this.attr("data-crtcAt"  , data.pop_data.crtcAt) ; 
                        $("#sp_expire_de_" + _rownum).text(data.pop_data.exp_Text) ; 
                    } else {
                        $("#sp_expire_de_" + _rownum).text(" - ") ; 
                    }

                }
            }) ; 
        }) ; 
    }) ; 
}
stuff_320.fn_update_buld_etc = (params) => {
    var occpgb   = params.col == "OCCP" ? "OCC" + params.occpgb : "" ; 
    var expirede = params.col == "EXPR" ? params.expirede.split(".").join("") : "" ; 
    /* 중개사_건물_기타정보 변경 */ 
    homes_comm.network.post("/broker/buld/update-buld-info", {
        "htbdno"  : stuff_320.params.htbdno,
        "hbdno"   : stuff_320.params.hbdno,
        "hpsno"   : params.hpsno,
        "col"     : params.col,
        "occpgb"  : occpgb ,
        "expirede": expirede,
        "crtcyy"  : params.crtcyy,
        "crtcmm"  : params.crtcmm,
        "crtcAt"  : params.crtcAt,
    }).then(response => {   
        var col = params.col ; 
        if ( col == "OCCP") {
            homes_comm.message.alert("점유구분을 변경하였습니다.") ; 
        } else {
            homes_comm.message.alert("만기일을 변경하였습니다.") ; 
        }
    }) ; 
}