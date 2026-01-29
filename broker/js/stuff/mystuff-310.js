var stuff_310 = {} ;
var commcode = {} ; 
stuff_310.data = {
    selected: {
        htbdno: "",
        hbdno: "",
        hpsno: "",
        dnum: 0, 
        dongnm: "",
        items: [] 
    }, broker: {
        htbdno: "",
        hbdno : "",
        hpsno : ""
    }
} ; 
stuff_310.params = {} ; 
stuff_310.ownList = [] ; 

stuff_310.fn_page_onLoad = ( params ) => {
    stuff_310.params = params ; 
    stuff_310.data.htbdno  = params.htbdno ; 
    stuff_310.data.stuffno = params.stuffno ;
    stuff_310.data.arcd    = params.arcd ; 
    stuff_310.data.legcd   = params.legcd ; 
    stuff_310.data.ppscd   = params.ppscd ;

    /* 물건정보조회 */ 
    homes_comm.network.post("/stuff/stuff-info", {
        "stuffno": stuff_310.data.stuffno
    }).then(response => {
        stuff_310.data.hppscd = response.data.hppscd ; 
        stuff_310.data.hppsnm = response.data.hppsnm ; 
        stuff_310.data.arcd   = response.data.arcd ; 
        stuff_310.data.legcd  = response.data.legcd ; 
        stuff_310.data.ppscd  = response.data.ppscd ;
        stuff_310.data.buldgb = response.data.buldgb ; 
    }) ;

    /* 단지 동정보 목록 조회 */ 
    stuff_310.fn_get_blockList( params ) ;    

    /* 소유자코드 조회 */
    fn_get_commcode("OWT", {
    }).then(data => {
        commcode.OWT = data ; 
    }) ; 
    /* 통신사코드 조회 */
    fn_get_commcode("TCM", {
    }).then(data => {
        commcode.TCM = data ; 
    }) ; 
    
    
        /* 단지 소유주 목록 조회 */ 
//        return stuff_310.fn_get_ownerList( params ) ; 
        /* 소유주 목록 조회 */ 
//        stuff_310.fn_set_owner(response.data) ;
    
    $("#btn_insert_stuff").attr("disabled", "disabled") ;
    $("#btn_insert_stuff").click(function() {
        stuff_310.fn_save_data() ;
    }) ;

    $("#p_chk_regist_stuff").change(function() {
        var is_checked = $(this).is(":checked") ; 
        var dongco = $("button[id^=btn_rdo_dongnm]").length ; 
        if ( is_checked ) {
            $("#dv_info_regist_stuff").hide() ; 
            if ( dongco < 2 ) {
                $("#dv_wrap_dongnms").removeClass("hidden").addClass("hidden") ; 
            } else {
                $("#dv_wrap_dongnms").removeClass("hidden") ; 
            }
            $("#dv_wrap_hosil").removeClass("hidden") ; 
        } else {
            $("#dv_info_regist_stuff").show() ; 
            $("#dv_wrap_dongnms").removeClass("hidden").addClass("hidden") ; 
            $("#dv_wrap_hosil").removeClass("hidden").addClass("hidden") ; 
        }
    }) ; 
}

/* 가능하면 제일 마지막에 조회할것 */ 
stuff_310.fn_get_brkstuff = () => {
    var params = stuff_310.params ; 
    homes_comm.network.post("/stuff/brker-stuff", {
        "stuffno": params.stuffno,
        "htbdno" : params.htbdno, 
        /* *** 필요시 추가할것 */
        /*
        "hbdno"  : params.hbdno
         */
    }).then(response => {
        stuff_310.fn_set_brkstuff(response.data) ;
    }) ; 
}

stuff_310.fn_set_brkstuff = ( sfList ) => {
}

stuff_310.fn_get_dongnm = ( rn, dong ) => {
    var _dongno = dong.dongno ; 
    var _dongnm = dong.dongnm.trim() ; 
    if ( _dongno == "999999999999" ) {
        if ( !!_dongnm && _dongnm != '' ) {
            _dongno = _dongnm 
        } else {
            /* 동명없음 => 건물명으로 + 순서로 대신사용 */ 
            _dongno = dong.buldnm + " " + homes_comm.util.fn_Lpad(rn, 2, '0') ; 
        }
    } else {
        if ( !!_dongnm && _dongnm != '' ) {
            _dongno = _dongnm 
        } else {
            /* 동명없음 => 건물명으로 + 순서로 대신사용 */ 
            _dongno = dong.buldnm + " " + homes_comm.util.fn_Lpad(rn, 2, '0') ; 
        }
    }
    return _dongno ;
}

stuff_310.fn_get_blockList = ( params ) => {
    homes_comm.network.post("/stuff/blockList", {
        "htbdno"  : params.htbdno,
    }).then(response => {
        $("#p_dong_List").empty() ;
        var blockList = response.data ; 
        if ( homes_comm.util.fn_isNotEmpty(blockList)) {
            var dongList = [] ; 
            var rn = 1 ; 
            blockList.forEach(dong => {
                var _dongnm = stuff_310.fn_get_dongnm(rn, dong) ; 
                dongList.push({
                    "rn"     : rn,
                    "data"   : dong,
                    "label"  : _dongnm,
                    "rdoVal" : dong.hbdno
                }) ;
                rn ++ ; 
            }) ; 

            homes_button.btn_radio.fn_generate("dv_cont_dongnms", {
                "id"         : "rdo_dongnm",
                "dataList"   : dongList,
                "has_slide"  : true,
                "fn_callback": ( data ) => {
                    var _dnum  = data.rownum ; 
                    var _hbdno = data.hbdno ;
                    
                    stuff_310.data.selected.hbdno  = _hbdno ; 
                    stuff_310.data.selected.dnum   = _dnum; 
                    stuff_310.data.selected.dongnm = homes_button.btn_radio.fn_get_Label("rdo_dongnm", _dnum); 
                    stuff_310.fn_get_floor(_dnum, _hbdno, data) ;
                }
            }) ; 
            /* 제일 첫번째 동 선택 */ 
            homes_button.btn_radio.fn_set_value("rdo_dongnm", 1) ; 
        }
    });
}

stuff_310.fn_get_Ledgr = ( hbdno ) => {
    homes_comm.network.post("/stuff/buld-Ledgr-info", {
        "hbdno": hbdno 
    }).then(response => {
        var info = response.data ; 
        if ( homes_comm.util.fn_isNotEmpty( info )) {
            var grndco = info.grndco ; 
            var undrco = info.underco ; 
            $("#text_floor_co").text(grndco) ;
            if ( !!!undrco || undrco == 0) {
                $("#text_under_co").text("-") ;
            } else {
                $("#text_under_co").text(undrco + "층") ;
            }
            if ( info.elvtrco > 0) {
                $("#text_is_elevator").text("있음") ;
            } else {
                $("#text_is_elevator").text("없음") ;
            }
        }
    }) ; 
}
stuff_310.fn_set_floor = (flgb, stinfo, sfList ) => {
    var f_List = [] ;
}
stuff_310.fn_get_floor = ( dnum, hbdno, data ) => {
    stuff_310.fn_get_Ledgr(hbdno) ; 
    /*
    var buldnm = homes_button.btn_radio.fn_get_Label("rdo_dongnm", dnum) ; 
    $("#dv_dongnm").text(buldnm) ;
    */
    var rfco = 0 ; /* 옥탑층 개수 */
    var grco = 0 ; /* 지상층 개수 */
    var unco = 0 ; /* 지하층 개수 */ 
    homes_comm.network.post("/stuff/buld-struct", {
        "hbdno": hbdno 
    }).then(response => {
        var stList = response.data.stList ; 
        var sfList = response.data.sfList ; 
        var f_List = {} ;
//        var chk_grp_co = 0 ; 
        var chk_group  = [] ; 
        var chk_group_List = {} ; 
        stList.forEach(st => {
//            f_List["flgb_" + st.flgbcd] = {} ; 
            if ( st.flgbcd == '10' ) unco = st.flco ; 
            if ( st.flgbcd == '20' ) grco = st.flco ; 
            if ( st.flgbcd == '30' ) rfco = st.flco ; 
//            for ( var flno = 1; flno <= st.flco; flno ++ ) {}
//            chk_grp_co ++ ; 
//            chk_group.push(st.flgbcd) ; 
            for ( var flno = 1; flno <= st.flco; flno ++ ) {
                var grpList = [] ; 
                var grpid = "flgb_" + st.flgbcd + "_" + flno ; 
                sfList.filter(sf => ( sf.flgbcd == st.flgbcd && sf.flno == flno)) 
                      .forEach(sf => {
                        grpList.push({
                            "label"   : sf.hosilnm.replace("호", "") + "호",
                            "chkVal"  : sf.hpsno,
                            "data"    : sf,
                            "checked" : sf.hpsno == sf.stfHpsno,
                            "disabled": sf.hpsno == sf.stfHpsno
                        })
                      }) ; 
                if ( grpList.length > 0 ) chk_group.push( grpid ) ; 
                chk_group_List[grpid] = grpList ; 
            }
        }) ;
        homes_check.fn_generate("dv_cont_hosil", {
            "id"         : "hosil",
            "chk_group"  : chk_group,
            "chk_List"   : chk_group_List,
            "fn_callback": ( data ) => {
                if ( data.is_checked ) {
                    /* 현재 선택된 동 */ 
                    var htbdno = stuff_310.data.htbdno ; 
                    var hbdno  = stuff_310.data.selected.hbdno ; 
                    var dnum   = stuff_310.data.selected.dnum ; 
                    var dongnm = stuff_310.data.selected.dongnm ; 
                    /* 여기에 현재 선택된 호실정보를 입력한다. */ 
                    var items = {
                        "htbdno"   : htbdno,
                        "hbdno"    : hbdno, 
                        "hpsno"    : data.hpsno,
                        "dnum"     : dnum, 
                        "dongnm"   : dongnm,
                        "roomnm"   : data.hosilnm,
                        "rowStatus": "I"
                    }
                    stuff_310.fn_set_selected_data( data.hpsno, items, "I" ) ; 
                    /*
                    stuff_310.fn_set_owner( data.chkVal, {
                        "hpsno" : data.hpsno,
                        "roomnm": data.hosilnm
                    }) ;
                    */
                }
            }
        }) ; 
    }) ; 

    stuff_310.data.rfco = rfco ; 
    stuff_310.data.grco = grco ; 
    stuff_310.data.unco = unco ; 

    $("#text_floor_co").text(grco) ;
    var underCo = unco ; 
    if ( !!!underCo || underCo == 0) {
        $("#text_under_co").text("-") ;
    } else {
        $("#text_under_co").text(underCo + "층") ;
    }
//    stuff_310.fn_set_data() ;
}
stuff_310.fn_set_data = () => {

    var rfco = stuff_310.data.rfco
    var grco = stuff_310.data.grco
    var unco = stuff_310.data.unco

    var offset = 10 ; 
    var pos_y = (rfco + grco ) * 30 ; 
    pos_y = pos_y - offset ; 
    $(".dong-matrix").css("background-position-y", pos_y + "px") ;
    

    /* 중개사 물건목록 조회 */ 
//    stuff_310.fn_get_brkstuff() ;
}

stuff_310.fn_get_item_rowStatus = ( hpsno ) => {
    var rowStatus = "" ; 
    /* 동일한 hpsno가 존재하는지 검색 */ 
    stuff_310.data.selected.items.filter( item => item.hpsno == hpsno )
                                 .forEach(item => {
                                    rowStatus = item.rowStatus ; 
                                 }) ; 
    return rowStatus ; 
}

/* ************************************************************************
 * 부탁이니 최소한 동이라도 같아라 ....
 * 동별로 구분되면 2차원배열된다 ..... 
 * ************************************************************************/ 
stuff_310.fn_set_selected_data = ( hpsno, data, rowStatus ) => {
    /* 현재 선택된 동 */ 
    var htbdno = stuff_310.data.htbdno ; 
    var dnum   = stuff_310.data.selected.dnum ; 
    var dongnm = stuff_310.data.selected.dongnm ; 
    var hbdno  = stuff_310.data.selected.hbdno ; 
    /* 여기에 현재 선택된 호실정보를 입력한다. */ 
    var items = {
        "htbdno"   : htbdno, 
        "hbdno"    : hbdno, 
        "hpsno"    : data.hpsno,
        "dnum"     : dnum, 
        "dongnm"   : dongnm,
        "roomnm"   : data.roomnm, 
        "rowStatus": "I" 
    }

    var is_hpsno = 0 ; 
    /* 동일한 hpsno가 존재하는지 검색 */ 
    stuff_310.data.selected.items.filter( item => item.hpsno == hpsno )
                                 .forEach(item => {
                                    is_hpsno ++ ; 
                                    item.rowStatus = rowStatus ;
                                 }) ; 
    if ( is_hpsno == 0 ) {
        stuff_310.data.selected.items.push(items) ; 
    }

    is_hpsno = 0 ;
    stuff_310.data.selected.items.filter( item => ( item.rowStatus != "D"))
                                 .forEach(item => {
                                    is_hpsno ++ ; 
                                 }) ; 
//    console.log("items Length: ", stuff_310.data.selected.items.length, stuff_310.data.selected.items) ;  
    if ( is_hpsno > 0 ) {
        /* 물건등록버튼 활성화 */ 
        $("#btn_insert_stuff").removeAttr("disabled") ; 
    } else {
        /* 물건등록버튼 활성화 */ 
        $("#btn_insert_stuff").prop("disabled", "disabled") ; 
    }

}

stuff_310.fn_add_owner_row = ( hpsno, items ) => {

    stuff_310.fn_set_selected_data( hpsno, items, "I" ) ; 
//    var rowStatus = stuff_310.fn_get_item_rowStatus( hpsno ) ; 
    
    if ( $("#dv_owner_" + hpsno).length > 0 ) return ; 
    
    var dv_owner   = $("<div class='cont justify-start bg-gray'/>") ; 
    dv_owner.attr("id", "dv_owner_" + hpsno) ; 
    
    var dv_acfield = $("<div class='action-field' />") ; 
    var dv_aclabel = $("<div class='action-label' />") ; 
    dv_aclabel.append("<span class='c-red' id='ow_dongnm_"  + items.dnum + "'>" + items.dongnm + "</span> / ") ; 
    dv_aclabel.append("<span class='c-red' id='ow_hosilnm_" + hpsno + "'>" + items.roomnm + "</span>") ; 
    var btn_del = $("<button type='button' id='btn_del_" + hpsno + "' class='btn-x' data-hpsno='" + hpsno + "'></button>") ; 

    var dv_field  = $("<div class='action-field'/>") ;
    var sel_owner = $("<select id='sel_owt_" + hpsno + "_" + items.roomnm + "' class='form-select'/>") ; 
    sel_owner.append("<option value=''>소유주구분</option>") ; 
    commcode.OWT.forEach(code => {
        sel_owner.append("<option value='" + code.code + "'>" + code.codename + "</option>") ; 
    }) ; 

    dv_field.append(sel_owner) ;
    var text_cttpc = $("<input type='text' class='w-180px' maxlength='16' id='text_cttpc_" + hpsno + "' placeholder='휴대전화번호(숫자만입력)' />") ; 

    dv_field.append(text_cttpc) ; 
    var text_ownernm = $("<input type='text' class='w-100px' maxlength='30' id='text_ownm_" + hpsno + "' placeholder='이름' />") ; 
    dv_field.append(text_ownernm) ; 
    var btn_contact = $("<button type='button' class='hs-button btn-cyan mx-2'>연락처</button>") ; 
    dv_field.append(btn_contact) ; 
    var sel_telecom =  $("<select id='sel_tcm_" + hpsno + "' class='form-select'/>") ; 
//            sel_telecom.attr("disabled", "disabled") ;           
    sel_telecom.append("<option value=''>통신사선택</option>") ;   
    commcode.TCM.forEach(code => {
        sel_telecom.append("<option value='" + code.code + "'>" + code.codename + "</option>") ; 
    }) ; 
    sel_telecom.addClass("hidden") ; /* 임시로 가림 */ 
    dv_field.append(sel_telecom) ; 

    dv_acfield.append(dv_field) ; 
    dv_owner.append(dv_acfield) ; 

    dv_aclabel.append(btn_del) ; 
    dv_acfield.append(dv_aclabel) ;
    dv_acfield.append(dv_field) ; 
    dv_owner.append(dv_acfield) 
    $("#dv_ownerList").append(dv_owner) ; 

    btn_del.click(function() {
        hpsno = $(this).attr("data-hpsno") ; 
        $("#dv_owner_" + hpsno).remove() ;
        var td_room = $("#td_rm_" + hpsno) ; 
        td_room.removeClass("selected") ;  
        
        stuff_310.fn_set_selected_data( hpsno, {
            "hpsno": hpsno /* 삭제시 이것만 있으면 됨 */ 
        }, "D" ) ; 
        /* 소유주 삭제로직 추가 */ 
    })
}
stuff_310.fn_set_owner = ( hpsno, params ) => {
//    $("#dv_ownerList").empty() ;
    var td_room = $("#td_rm_" + hpsno) ; 
    td_room.addClass("selected") ; 

    /* click event 해제 */ 
//    td_room.off("click") ; 

    /* 현재 선택된 동 */ 
    var htbdno = stuff_310.data.htbdno ; 
    var hbdno  = stuff_310.data.selected.hbdno ; 
    var dnum   = stuff_310.data.selected.dnum ; 
    var dongnm = stuff_310.data.selected.dongnm ; 
    /* 여기에 현재 선택된 호실정보를 입력한다. */ 
    var items = {
        "htbdno"   : htbdno,
        "hbdno"    : hbdno, 
        "hpsno"    : params.hpsno,
        "dnum"     : dnum, 
        "dongnm"   : dongnm,
        "roomnm"   : params.roomnm,
        "rowStatus": "I"
    }
    stuff_310.fn_add_owner_row( hpsno, items ) ;
}

stuff_310.fn_get_ownerList = ( param ) => {
    return new Promise(resolve => {
        homes_comm.network.post("/stuff/ownerList", {
            "buldno": param.buldno
        }).then(response => {
            resolve(response) ;
        }) ; 
    }) ;
}

/* 소유주 신규생성 */ 
stuff_310.fn_set_owndata = ( id, fgb ) => {
    var cplxno   = stuff_310.params.cplxno ; 
//    console.log(stuff_310.params) ;
    var flno     = id.split("_").splice(1, 1).toString() ; 
    var buldno   = id.split("_").splice(2, 1).toString() ;
    var pssionno = id.split("_").splice(3, 1).toString() ;
    var stuffno  = "" ; 
    var cp_dong  = $("div[id^=dnum].selected").text() ; 
    var cp_ho    = "" ; 
    var flgbcd   = "" ; 
    if ( fgb == "under" ) flgbcd = "10" ; /* 지하 */
    else if ( fgb == "floor" ) flgbcd = "20" ; /* 지상 */ 
    else if ( fgb == "rftop" ) flgbcd = "30" ; /* 옥탑 */ 

    var data   = stuff_310.data[fgb] ; 
    var floor  = data["floor" + flno] ; 
    floor.filter(fl => ( fl.buldno == buldno && fl.pssionno == pssionno ))
         .forEach(fl => {
            stuffno   = fl.stuffno,
            cp_ho     = fl.roomNm
         }) ; 
    return new Promise((resolve, reject) => {
        homes_comm.network.post("/stuff/add-stuff", {
            "buldno"   : buldno,
            "cplxno"   : cplxno,
            "pssionno" : pssionno,
            "ppscd"    : stuff_310.params.cplxTy,
            "stffnm01" : cp_dong, /* 단지동 */ 
            "stffnm02" : cp_ho,   /* 단지동 호수 */
            "ownerTy"  : "", 
            "ownernm"  : "", 
            "ccbCd"    : "", 
            "cttpc"    : "", 
            "sfsttus"  : "T",
            "owsttus"  : "T"
        }).then(response => {
            resolve(response) ; 
        }) ; 
    }) ; 
}

/* 소유주 삭제(물건삭제는 하지 않는다) */ 
stuff_310.fn_delete_owner = ( owno, owseq, buldno ) => {
    homes_comm.network.post("/stuff/delete-owner", {
        "owno"  : owno,
        "owseq" : owseq,
        "buldno": buldno 
    }).then(response => {
       stuff_310.fn_set_owner(response.data) ;
    }) ;
}

/* 데이터 저장 */ 
stuff_310.fn_save_data = () => {
    var stuffno = stuff_310.data.stuffno ;
    var hppscd  = stuff_310.data.hppscd ; 
    var arcd    = stuff_310.data.arcd ; 
    var buldgb  = stuff_310.data.buldgb ; 
    var items = stuff_310.data.selected.items ;
    var dataList = [] ; 
    items.filter( item => item.rowStatus != "D" )
         .forEach( item => {
            item.stuffno = stuffno ; 
            item.hppscd  = hppscd ; 
            dataList.push(item) ; 
         }) ; 
//    console.log(dataList) ; 
    homes_comm.network.post("/stuff/insert-stuff", dataList)
    .then(response => {
        var insco = response.data.insco ; 
        if ( insco > 0 ) {
            homes_comm.message.alert("물건이 등록되었습니다.") ; 
        }
        /*
        var dnum = $("div[id^=dnum_].selected").attr("data-dnum") ; 
        var hbdno = "" ; 
        dataList.forEach(item => {
            $("#td_rm_" + item.hpsno).removeClass("selected").addClass("my-stuff") ; 
            $("#td_rm_" + item.hpsno).off("click") ; 
        }) ; 
        */
    }) ;

}