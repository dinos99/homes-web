var stuff_310 = {} ;
var commcode = {} ; 
var stuff_310 = {} ; 
stuff_310.data = {} ; 
stuff_310.params = {} ; 
stuff_310.ownList = [] ; 

stuff_310.fn_page_onLoad = ( params ) => {
    stuff_310.params = params ; 
    stuff_310.data.htbdno  = params.htbdno ; 
    stuff_310.data.stuffno = params.stuffno ; 
    /* 공통코드 조회 */
    fn_get_commcode(["OWT", "TCM"]).then(data => {
        commcode = data ; 
        /* 단지 동정보 목록 조회 */ 
        return stuff_310.fn_get_blockList( params ) ;         
    }).then(response => {
        /* 단지 소유주 목록 조회 */ 
//        return stuff_310.fn_get_ownerList( params ) ; 
    }).then(response => {
        /* 소유주 목록 조회 */ 
//        stuff_310.fn_set_owner(response.data) ;
    }) ;

    $("#btn_insert_stuff").attr("disabled", "disabled") ;
    $("#btn_insert_stuff").click(function() {
        stuff_310.fn_save_data() ;
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


stuff_310.fn_get_blockList = ( params ) => {
    return new Promise(resolve => {
        homes_comm.network.post("/stuff/blockList", {
            "htbdno"  : params.htbdno,
        }).then(response => {
            $("#p_dong_List").empty() ;
            var blockList = response.data ; 
            if ( homes_comm.util.fn_isNotEmpty(blockList)) {
                var len = blockList.length ; 
                var mod = len % 10 ; 
                var div = ( len - mod ) / 10 ; 
                var block = [] ; 
                for ( var r = 0; r < div; r ++ ) {
                    block.push(blockList.slice(10 * r, Number(r + 1 ) * 10)) ; 
                }
                if ( mod > 0 )  {
                    block.push(blockList.slice(10 * div, len)) ; 
                }
                block.forEach((dataList, i) => {
                    var dv_slide = $("<div class='slide-text justify-start'></div>") ;
                    if ( i > 0 ) {
                        dv_slide = $("<div class='slide-hddn-List justify-start'></div>") ;
                    }
                    var dnum = 1 ; 
                    dataList.forEach((blk, i) => {
                        var dv_dnum = $("<div id='dnum_" + dnum + "' class='hs-label room-number' data-hbdno='" + blk.hbdno + "'/>") ;
                        dv_dnum.attr("data-dnum", dnum) ; 
                        var dongno = blk.dongno ; 
                        var dongnm = blk.dongnm ; 
                        if ( dongno == "0" && !! dongnm ) {
                            dongno = dongnm ; 
                        } else if ( dongno == "999999999999" ) {
                            /* 동명없음 => 건물명으로 + 순서로 대신사용 */ 
                            dongno = blk.buldnm + " " + homes_comm.util.fn_Lpad(dnum, 2, '0') ; 
                        } else {
                            if ( !!dongnm && dongnm != '' ) {
                                dongno = dongnm 
                            } else {
                                /* 동명없음 => 건물명으로 + 순서로 대신사용 */ 
                                dongno = blk.buldnm + " " + homes_comm.util.fn_Lpad(dnum, 2, '0') ; 
                            }
                        }

                        dv_dnum.text(dongno) ;
                        dv_slide.append(dv_dnum) ; 
                        dv_dnum.click(function() {
                            $("div[id^=dnum_]").removeClass("selected") ; 
                            $(this).addClass("selected") ;
                            var _dnum = $(this).attr("data-dnum") ; 
                            stuff_310.fn_get_floor(_dnum, blk.hbdno) ;
                        }) ; 
                        dnum ++ ; 
                    }) ;
                    if ( i == 0 ) {
                        var dv_arrow = $("<div class='slide-abs-arrow' />") ; 
                        dv_arrow.html("<img src='/images/V.png' class='arrow' alt='v'>") ;
                        dv_slide.append(dv_arrow) ;
                        dv_arrow.click(function() {
                            var has = $("#dv_dong_number").hasClass("open") ;
                            if ( has ) {
                                $("#dv_dong_number").removeClass("open") ; 
                                $(".slide-hddn-List").css("display", "none")
                            } else {
                                $("#dv_dong_number").removeClass("open").addClass("open"); 
                                $(".slide-hddn-List").css("display", "flex")
                            }
                        }) ;
                    }
                    $("#p_dong_List").append(dv_slide) ; 
                }) ;

                /* 제일 첫번째 동 선택 */ 
                $("#dnum_1").addClass("selected") ; 
                /* 동선택에 따른 층별정보 조회 */ 
                var hbdno = $("#dnum_1").attr("data-hbdno") ; 
                stuff_310.fn_get_floor(1, hbdno) ; 
            }
            resolve({data: { "dongList": blockList }}) ; 
        });
    }) ;
}

stuff_310.fn_get_floor = ( dnum, hbdno ) => {
    var buldnm = $("#dnum_" + dnum).text() ;
    $("#dv_dongnm").text(buldnm) ;
    homes_comm.network.post("/stuff/floorList", {
        "hbdno": hbdno 
    }).then(response => {
        /* 층정보 */
        stuff_310.data.f_List = JSON.parse(JSON.stringify(response.data)) ;
        stuff_310.data.hbdno  = response.data.hbdno ; 
        
        var f_List = response.data ;
        $("#dv_buld").empty() ;

        var dv_roof = $("<div class='buld-floor'/>") ; 
        var dv_grnd = $("<div class='buld-floor'/>") ; 
        var dv_undr = $("<div class='buld-floor'/>") ; 

        var rf_table = $("<table id='tbl_rfTop'/>")
        var gr_table = $("<table id='tbl_ground'/>")
        var un_table = $("<table id='tbl_under'/>")

        dv_roof.append(rf_table) ;
        dv_grnd.append(gr_table) ;
        dv_undr.append(un_table) ;

        var rfno = 0 ; 
        var grno = 0 ; 
        var unno = 0 ; 
        f_List.forEach(floor => {
            var flgb = floor.flgbcd ; 
            var tr = $("<tr/>") ; 
            if ( flgb == '30' ) {
                rf_table.append(tr) ; 
                /* 옥탑은 비워져있으면 그리지 않는다 */ 
                var mx_roomco = floor.maxRoomCo ; 
                var td = $("<td>") ; 
                if ( floor.hpsnos == 'EMPTY' ) {
                    td.addClass("empty") ; 
                    td.html("&nbsp;") ; 
                    tr.append(td) ;
                } else {
                    rfno ++ ;
                }
            } else if ( flgb == '20' ) {
                gr_table.append(tr) ; 
                /* 옥탑은 비워져있으면 그리지 않는다 */ 
                var mx_roomco = floor.maxRoomCo ; 
                var td = $("<td/>") ; 
                var arr_room   = floor.hosilnms.split("|") ; 
                var arr_hpsno  = floor.hpsnos.split("|")
//                var stf_hpsnos = floor.stfHpsnos.split("|")
                if ( arr_room.length < mx_roomco ) {
                    while ( arr_room.length < mx_roomco ) {
                        arr_room.push("noroom") ; 
                    }
                }
                if ( floor.hpsnos == 'EMPTY' ) {
                    for ( var rm = 0 ; rm < arr_room.length ; rm ++ ) {
                        var td = $("<td/>") ; 
                        td.addClass("empty") ; 
                        td.html("&nbsp;") ; 
                        tr.append(td) ;
                    }
                } else {
                    for ( var rm = 0 ; rm < arr_room.length ; rm ++ ) {
                        var room_nm   = arr_room[rm] ; 
                        var hpsno     = arr_hpsno[rm] ; 
                        if ( room_nm != "noroom" ) {
                            room_nm = room_nm.replace("호", "") ; 
                            var td = $("<td/>") ;
                            td.attr("data-hpsno", arr_hpsno[rm]) ; 
                            td.addClass("bd-room")
                            td.text(room_nm) ; 
                        } else {
                            var td = $("<td/>") ;
                            td.addClass("bd-noroom")
                        }
                        tr.append(td) ; 
                    }
                }
                grno ++ ;
            } else if ( flgb == '10' ) {
                un_table.append(tr) ; 
                /* 옥탑은 비워져있으면 그리지 않는다 */ 
                var mx_roomco = floor.maxRoomCo ; 
                var td = $("<td/>") ; 
                var arr_room = floor.hosilnms.split("|") ; 
                if ( arr_room.length < mx_roomco ) {
                    while ( arr_room.length < mx_roomco ) {
                        arr_room.push("") ; 
                    }
                }
                if ( floor.hpsnos == 'EMPTY' ) {
                    for ( var rm = 0 ; rm < arr_room.length ; rm ++ ) {
                        var td = $("<td/>") ;
                        td.addClass("empty") ; 
                        td.html("&nbsp;") ; 
                        tr.append(td) ;
                    }
                } else {
                    for ( var rm = 0 ; rm < arr_room.length ; rm ++ ) {
                        var room_nm = arr_room[rm] ; 
                        room_nm = room_nm.replace("호", "") ; 
                        var td = $("<td/>") ;
                        td.addClass("bd-room")
                        td.text(room_nm) ; 
                        tr.append(td) ; 
                    }
                    unno ++ ;  
                } 
            }
        }) ; 
        if ( rfno > 0 ) $("#dv_buld").append(dv_roof) ; 
        if ( grno > 0 ) $("#dv_buld").append(dv_grnd) ; 
        if ( unno > 0 ) $("#dv_buld").append(dv_undr) ; 
        
        $("#text_floor_co").text(grno) ;
        var underCo = unno ; 
        if ( !!!underCo || underCo == 0) {
            $("#text_under_co").text("-") ;
        } else {
            $("#text_under_co").text(underCo + "층") ;
        }
//        stuff_310.fn_set_data() ;
    }) ; 
}
stuff_310.fn_set_data = () => {
    var f_List = stuff_310.data.f_List ; 
    if ( homes_comm.util.fn_isNotEmpty(f_List)) {

        var rfco = $("#tbl_rfTop").children().length
        var grco = $("#tbl_ground").children().length
        var unco = $("#tbl_under").children().length

        var offset = 20 ; 
        var pos_y = (rfco + grco + unco) * 30 ; 
        pos_y = pos_y - offset ; 
        $(".dong-matrix").css("background-position-y", pos_y + "px") ;
    }

    /* 중개사 물건목록 조회 */ 
    stuff_310.fn_get_brkstuff() ;
}

stuff_310.fn_set_owner = ( dataList ) => {
    $("#dv_ownerList").empty() ;
    if ( !!dataList && dataList.length > 0 ) {
        dataList.forEach((data, i) => {
            var rownum = data.owno + "_" + data.owseq ;
            var dv_owner   = $("<div id='owrn_" + data.owno + "_" + data.owseq + "' class='cont justify-start bg-gray'/>") ; 
            dv_owner.attr("data-owno"   , data.owno) ; 
            dv_owner.attr("data-owseq"  , data.owseq) ;
            dv_owner.attr("data-stuffno", data.stuffno) ; 

            var dv_acfield = $("<div class='action-field' />") ; 
            var dv_aclabel = $("<div class='action-label' />") ; 
            dv_aclabel.append("<span class='c-red' id='sfnm01_" + rownum + "'>" + data.stffnm01 + "</span> / ") ; 
            dv_aclabel.append("<span class='c-red' id='sfnm02_" + rownum + "'>" + data.stffnm02 + "</span>") ; 
            var btn_del = $("<button type='button' id='btn_del_" + data.owno + "_" + data.owseq + "' class='btn-x'></button>") ; 
            var _buldno = data.buldno ; 
            btn_del.click(function() {
                var owner = $(this).attr("id").replace("btn_del_", "").split("_") ; 
                stuff_310.fn_delete_owner(owner[0], owner[1], _buldno) ; 
            }) ; 


            dv_aclabel.append(btn_del) ; 
            dv_acfield.append(dv_aclabel) ;

            var dv_field  = $("<div class='action-field'/>") ;
            var sel_owner = $("<select id='sel_owt_" + data.owno + "_" + data.owseq + "' class='form-select'/>") ; 
            sel_owner.append("<option value=''>소유주 구분</option>") ; 
            commcode["OWT"].forEach(code => {
                var option = "<option value='" + code.code + "'>" + code.codenm + "</option>" ; 
                sel_owner.append(option) ; 
            }) ; 
            dv_field.append(sel_owner) ; 
            var text_cttpc = $("<input type='text' class='w-180px' maxlength='16' id='text_cttpc_" + rownum + "' placeholder='휴대전화번호(숫자만입력)' />") ; 

            text_cttpc.keypress(function(e) {
                console.log(e.keyCode)
                if (e.keyCode < 48 || e.keyCode > 57 ) {
                    return false ;
                }
            }) ; 
            text_cttpc.blur(function() {
                var is_mobile = homes_comm.validate.fn_isMobilePattern($(this).val()) ;
                if ( !is_mobile) {
                    homes_comm.message.alert("핸드폰 형식이 아닙니다.") ; 
                }
            }) ; 

            dv_field.append(text_cttpc) ; 
            var text_ownernm = $("<input type='text' class='w-100px' maxlength='30' id='text_ownernm_" + rownum + "' placeholder='이름' />") ; 
            dv_field.append(text_ownernm) ; 
            var btn_contact = $("<button type='button' class='hs-button btn-cyan mx-2'>연락처</button>") ; 
            dv_field.append(btn_contact) ; 
            var sel_telecom =  $("<select id='sel_tcm_" + data.owno + "_" + data.owseq + "' class='form-select'/>") ; 
//            sel_telecom.attr("disabled", "disabled") ;           
            sel_telecom.append("<option value=''>통신사선택</option>") ;   
            commcode["TCM"].forEach(code => {
                var option = "<option value='" + code.code + "'>" + code.codenm + "</option>" ; 
                sel_telecom.append(option) ; 
            }) ; 
            dv_field.append(sel_telecom) ; 

            dv_acfield.append(dv_field) ; 
            dv_owner.append(dv_acfield) 
            $("#dv_ownerList").append(dv_owner) ; 
            sel_telecom.addClass("hidden") ;
            sel_owner.change(function() {
                var otype = $(this).val() ;
                if (otype == "OWT001") {
                    /* 소유주 선택시 통신사 선택 활성화 */ 
                    sel_telecom.removeClass("hidden") ; 
                } else {
                    sel_telecom.removeClass("hidden").addClass("hidden") ; 
                }
            }) ;

            sel_owner.val(data.ownerTy) ; 
            sel_telecom.val(data.ccbCd) ; 
            text_cttpc.val(data.cttpc) ;
            text_ownernm.val(data.ownernm) ; 

            if ( data.ownerTy == "OWT001" ) {
                sel_telecom.removeClass("hidden") ;
            }
        }) ; 

        $("#btn_insert_stuff").removeAttr("disabled") ; 
    } else {
        $("#btn_insert_stuff").attr("disabled", "disabled") ; 
    }
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
    console.log(stuff_310.params) ;
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
    var stuffList = stuff_310.data.stuffList ; 
    var ownerList = [] ; 
    $("div[id^=owrn]").each(function() {
        var owno    = $(this).attr("data-owno") ; 
        var owseq   = $(this).attr("data-owseq") ; 
        var stuffno = $(this).attr("data-stuffno") ; 
        var rownum  = owno + "_" + owseq ; 
        ownerList.push({
            "owno"     : owno,
            "owseq"    : owseq,
            "stuffno"  : stuffno,
            "stffnm01" : $("#sfnm01_" + rownum).text(),
            "stffnm02" : $("#sfnm02_" + rownum).text(),
            "ownerTy"  : $("#sel_owt_" + rownum).val(),
            "ownernm"  : $("#text_ownernm_" + rownum).val(),
            "cttpc"    : $("#text_cttpc_" + rownum).val(),
            "ccbCd"    : $("#sel_tcm_" + rownum).val()
        }) ; 
    }) ; 
    stuff_310.data.ownerList = ownerList ; 
    homes_comm.network.post("/stuff/update-stuff", {
        "stuffListVo": stuffList,
        "ownerListVo": ownerList
    }).then(response => {
        homes_comm.message.alert("물건이 등록되었습니다.").then(ok => {
            stuffList.forEach(stuff => {
                $("div[id$=" + stuff.buldno + "_" + stuff.pssionno + "]")
                    .removeClass("done")
                    .removeClass("selected")
                    .addClass("done") ;
            }) ; 
        }) ; 
    }) ;

}