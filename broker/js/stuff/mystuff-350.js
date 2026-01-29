var stuff_350 = {} ;
stuff_350.fn_page_onLoad = ( params ) => {
    stuff_350.params = params ; 
    stuff_350.data = {
        "stuffno": params.stuffno,
        "htbdno" : params.htbdno,
        "buldgb" : params.buldgb,
        "buldnm" : params.buldnm, 
        "hppscd" : params.hppscd,
        "ppscd"  : params.ppscd,  
        "hppsnm" : params.hppsnm,
        "ppsnm"  : params.ppsNm,
        "bdaddr" : params.bdaddr, /* 건물주소(지번) */
        "rdaddr" : params.rdaddr, /* 건물주소(도로명) */
        "buldnm" : params.buldnm,  /* 건물명 */ 
        "arcd"   : params.arcd,
        "legcd"  : params.legcd,
    }
    stuff_350.fn_get_public_info({
        "htbdno": stuff_350.data.htbdno
    }) ; 
    stuff_350.fn_get_buld_List({
        "stuffno": stuff_350.data.stuffno,
        "htbdno" : stuff_350.data.htbdno
    }).then(dataList => {
        stuff_350.fn_set_buld_List(dataList) ; 
    }) ; 
    
    $("#btn_v_List").click(function() {
        var cv_build = $("div[id^=dv_cont_]") ; 
        if ( cv_build.length > 3 ) {
            var is_hide = $("#dv_cont_4").is(".hidden") ; 
            if ( is_hide ) {
                $("div[id^=dv_cont_]").each(function(i) {
                    if ( i > 2 ) $(this).removeClass("hidden") ; 
                }) ;

                /* arrow up */ 
                $(this).find(".arrow-down").removeClass("arrow-down").addClass("arrow-up") ;
                var offset = $("#btn_v_List").offset() ; 
                $(".pop-container").animate({ scrollTop: offset.top + 60 }, 500) ; 

            } else {
                $("div[id^=dv_cont_]").each(function(i) {
                    if ( i > 2 ) $(this).addClass("hidden") ; 
                }) ; 
                /* arrow down */ 
                $(this).find(".arrow-up").removeClass("arrow-up").addClass("arrow-down") ;
            }
        } 
    }) ; 
}
stuff_350.fn_set_buld_List = ( dataList ) => {
    if ( homes_comm.util.fn_isNotEmpty( dataList )) {
        var buldco = dataList.length ; 
        $("#dv_buldco").text(homes_comm.util.fn_format_number(buldco) + "개동(건물)") ; 
        $("#dv_buld_buldco").text(homes_comm.util.fn_format_number(buldco) + "개동(건물)") ; 
        $("#sp_buldco").text(buldco) ;
        $("#dv_buld_List").empty() ; 
        for ( var rn = 0; rn < dataList.length; rn ++ ) {
            var dnum = rn + 1 ; 
            var binfo = JSON.parse(JSON.stringify(dataList[rn])) ; 
            binfo.dnum = dnum ; 
            stuff_350.fn_add_row_buld(binfo) ; 
        }
    }
} ; 
stuff_350.fn_get_dongnm = ( params ) => {
    var _dnum = params.dnum ; 
    var _dongno = params.dongno ; 
    var _dongnm = params.dongnm.trim() ; 
    if ( _dongno == "999999999999" ) {
        if ( !!_dongnm && _dongnm != '' ) {
            _dongno = _dongnm 
        } else {
            /* 동명없음 => 건물명으로 + 순서로 대신사용 */ 
            _dongno = params.buldnm + " " + homes_comm.util.fn_Lpad(_dnum, 2, '0') ; 
        }
    } else {
        if ( !!_dongnm && _dongnm != '' ) {
            _dongno = _dongnm 
        } else {
            /* 동명없음 => 건물명으로 + 순서로 대신사용 */ 
            _dongno = params.buldnm + " " + homes_comm.util.fn_Lpad(_dnum, 2, '0') ; 
        }
    }
    return _dongno ;

}
stuff_350.fn_add_row_buld = ( binfo ) => {
    var dv_buld_List = $("#dv_buld_List") ; 
    var cont = $("<div class='cont justify-around bg-gray'/>") ; 
    var lbl2 = $("<div class='label-2'/>") ; 
    cont.attr("id", "dv_cont_" + binfo.dnum) ; 
    if ( binfo.dnum > 3) {
        cont.addClass("hidden") ;
        $("#btn_v_List").removeClass("hidden") ; 
    } else {
        $("#btn_v_List").addClass("hidden") ; 
    }

    var label_01 = $("<div class='label-01'/>") ; 
    var lb_01_01 = $("<div class='c-gray'>동(건물) 명</div>") ; 
    var lb_01_02 = $("<div class='label-text'/>") ; 
    var dongnm = stuff_350.fn_get_dongnm({
        "dnum"  : binfo.dnum,
        "buldnm": binfo.buldnm,
        "dongno": binfo.dongno,
        "dongnm": binfo.dongnm,
    }) ; 
    lb_01_02.text(dongnm) ; 
    label_01.append(lb_01_01) ; 
    label_01.append(lb_01_02) ; 

    var label_02 = $("<div class='label-02'/>") ; 
    var lb_02_01 = $("<div class='c-gray'>지상/지하층</div>") ; 
    var lb_02_02 = $("<div class='label-text'/>") ; 
    lb_02_02.text(binfo.grndco + "층/" + binfo.underco + "층") ; 

    label_02.append(lb_02_01) ; 
    label_02.append(lb_02_02) ; 

    var label_03 = $("<div class='label-02'/>") ; 
    var lb_03_01 = $("<div class='c-gray'>엘리베이터</div>") ; 
    var lb_03_02 = $("<div class='label-text'/>") ; 
    if ( binfo.elvtco > 0) {
        lb_03_02.html("<span class='c-blue'>있음</span>") ; 
    } else {
        lb_03_02.html("<span class='c-red'>없음</span>") ; 
    }

    label_03.append(lb_03_01) ; 
    label_03.append(lb_03_02) ; 

    lbl2.append(label_01) ; 
    lbl2.append(label_02) ; 
    lbl2.append(label_03) ; 
    cont.append(lbl2) ; 
    dv_buld_List.append(cont) ; 
}

stuff_350.fn_get_buld_List = ( params ) => {
    return new Promise( resolve => {
    homes_comm.network.post("/stuff/blockList", {
            "htbdno"  : params.htbdno,
        }).then(response => {
            resolve(response.data) ; 
        }) ; 
    }) ; 

}
/* 공동건물(단지) 정보조회 */ 
stuff_350.fn_get_public_info = ( params ) => {
    homes_comm.network.post("/broker/complex-info", {
        "htbdno": params.htbdno
    }).then(response => {
        stuff_350.fn_set_public_info(response.data) ; 
    }) ; 
}

stuff_350.fn_set_public_info = (params) => {
    stuff_350.pbinfo = {} ; 
    stuff_350.pbinfo = params ; 
    /* 건물주소, 지번 색깔바꾸라 하면 ..... */ 
    var bdinfo = stuff_350.data ; 
    var buldgb = stuff_350.data.buldgb ; 
    
    var dongco   = params.dongco ; 
    var confde   = params.prmissde ; 
    var btmUnder = params.btmUnder ; 
    var topFloor = params.topFloor ; 
    var platAr   = params.platAr ; 
    var hshldco  = homes_comm.util.fn_format_number(params.hshldco) ; 
    var parkngco = homes_comm.util.fn_format_number(params.parkngco) ; 

    var bdaddr = bdinfo.bdaddr ; 
    if ( homes_comm.util.fn_isNotEmpty(bdinfo.buldnm)) {
        bdaddr = bdaddr + "( " + bdinfo.buldnm + " )" ; 
    }
    $("#dv_bdaddr").text(bdaddr) ; 

    var est_cate_01 = buldgb == "2" ? "집합건물" : "일반건물" ;
    var est_cate_02 = stuff_350.data.ppsnm ; 
    var est_cate_03 = stuff_350.data.hppsnm ; 
    $("#sp_estcd_Text").html( est_cate_01 + " &gt; " + est_cate_02 + " &gt; " + est_cate_03) ; 

    $("#dv_buldnm").text(bdinfo.buldnm) ; /* 건물명 */
    $("#dv_confde").text(confde) ; /* 승인일 */
    
    $("#dv_parkngco").text(parkngco + "대") ; /* 주차수 */
    $("#dv_buldco").text(homes_comm.util.fn_format_number(dongco) + "개동(건물)") ; 
    if (btmUnder == 0 || homes_comm.util.fn_isNotEmpty(btmUnder)) {
        $("#dv_topunder").text(btmUnder + "층 / " + topFloor + "층") ; 
    } else {
        $("#dv_topunder").text("- / " + topFloor + "층") ; 
    }
    $("#sp_platAr_calc").text(homes_comm.util.fn_format_number(platAr)) ; 
    $("#sp_platAr_unit").text("㎡") ; 
}
