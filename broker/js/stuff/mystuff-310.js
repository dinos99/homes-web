var stuff_310 = {} ;
var commcode = {} ; 
var stuff_310 = {} ; 
stuff_310.data = {} ; 
stuff_310.params = {} ; 
stuff_310.ownList = [] ; 

stuff_310.fn_page_onLoad = ( params ) => {
    stuff_310.params = params ; 
    stuff_310.data.cplxno = params.cplxno ; 
    /* 공통코드 조회 */
    fn_get_commcode(["OWT", "TCM"]).then(data => {
        commcode = data ; 
        /* 단지 동정보 목록 조회 */ 
        return stuff_310.fn_get_blockList( params ) ;         
    }).then(response => {
        /* 단지 소유주 목록 조회 */ 
        return stuff_310.fn_get_ownerList( params ) ; 
    }).then(response => {
        stuff_310.fn_set_owner(response.data) ;
    }) ;
}


stuff_310.fn_get_blockList = ( params ) => {
    return new Promise(resolve => {
        homes_comm.network.post("/stuff/blockList", {
            "cplxno"  : params.cplxno,
        }).then(response => {
            $("#p_dong_List").empty() ;
            var blockList = response.data ; 
            var buldno    = "" ; 
            /* 여기서 관리사무소/전기실/발전실 등 걸러보자 */ 
            /* ***********************************************
            * 포기함 ....
            * ***********************************************/ 
            if ( !!blockList && blockList.length > 0) {
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
                    dataList.forEach((blk, i) => {
                        var dv_dnum = $("<div id='dnum_" + blk.buldno + "' class='hs-label room-number' />") ;
                        dv_dnum.text(blk.blocknm) ;
                        dv_slide.append(dv_dnum) ; 
                        dv_dnum.click(function() {
                            $("div[id^=dnum_]").removeClass("selected") ; 
                            $(this).addClass("selected") ;
                            stuff_310.fn_get_floor(blk.buldno) ;
                        }) ; 
                    })
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
                $("div[id^=dnum_]").eq(0).addClass("selected") ; 
                /* 동선택에 따른 층별정보 조회 */ 
                buldno = $("div[id^=dnum_]").eq(0).attr("id").split("_").splice(1, 1).toString() ;
                stuff_310.fn_get_floor(buldno) ; 
            }
            resolve({data: { "buldno": buldno }}) ; 
        });
    }) ;
}

stuff_310.fn_get_floor = ( buldno ) => {
    var dnum = $("#dnum_" + buldno).text() ;
    $("#dv_dongnm").text(dnum) ;
    homes_comm.network.post("/stuff/floorList", {
        "buldno": buldno 
    }).then(response => {
        stuff_310.data = response.data ;
        stuff_310.data.cplxno = stuff_310.params.cplxno 
        $("#text_floor_co").text(stuff_310.data.floor.floorCo) ;
        var underCo = stuff_310.data.under.floorCo ; 
        if ( !!!underCo || underCo == 0) {
            $("#text_under_co").text("-") ;
        } else {
            $("#text_under_co").text(underCo + "층") ;
        }
        stuff_310.fn_set_data() ;
    }) ; 
}
stuff_310.fn_set_under = () => {
    var data = stuff_310.data ; 
    var under = data.under ; 
    var room_co = data.floor.roomCo ; 
    var dv_fbox = $("<div class='under-ground'/>") ;
    var dv_floor = $("<div class='floor'/>") ; 
    dv_fbox.append(dv_floor) ;
    if ( under.floorCo == 0) {
        dv_fbox.addClass("bottom") ;
        dv_floor.text("B01") ;
        for ( var i = 0; i < room_co; i ++ ) {
            var dv_room  = $("<div class='room'/>") ;
            dv_room.text("") ; 
            dv_room.addClass("empty-space") ;
            dv_fbox.append(dv_room) ;
            if ( i > 0) dv_room.addClass("nbdl");
            if ( i == room_co -1 ) dv_room.addClass("last") ;
        }
        $("#dv_buld").append(dv_fbox) ; 
    } else {
        for ( var f = 0; f < under.floorCo; f++ ) {
            var flno = Number(f + 1) ;
            var floor = under["floor" + flno]
            dv_floor.text("B" + flno) ;
            dv_fbox.append(dv_floor) ;
            if ( floor.length == 0 ) {
                dv_fbox.addClass("bottom") ;
                dv_floor.text("B1") ;
                for ( var i = 0; i < room_co; i ++ ) {
                    var dv_room  = $("<div class='room'/>") ;
                    dv_room.text("") ; 
                    dv_room.addClass("empty-space") ;
                    dv_fbox.append(dv_room) ;
                    if ( i > 0) dv_room.addClass("nbdl");
                    if ( i == room_co -1 ) dv_room.addClass("last") ;
                }
                $("#dv_buld").append(dv_fbox) ; 
            } else {
                for ( var r = 0; r < room_co; r ++ ) {
                    if ( r < floor.length ) {
                        var dv_room  = $("<div class='room' />") ;
                        dv_room.text(floor[r].roomNm) ; 
                        dv_room.attr("id", "room_" + flno + "_" + floor[r].buldno + "_" + floor[r].pssionno) ;
                        if ( floor[r].stuffno != "0" && floor[r].sfsttus == "D") {
                            dv_room.addClass("done") ;
                        } else if ( floor[r].stuffno != "0" && floor[r].sfsttus == 'T' ) {
                            dv_room.addClass("selected") ; 
                        } else {
                            /* under *********************************/
                            dv_room.addClass("cursor-hand") ;
                            dv_room.click(function() {
                                $(this).addClass("selected") ;
                                $(this).removeClass("cursor-hand") ; 
                                $(this).off("click") ;
                                stuff_310.fn_set_owndata($(this).attr("id"), "floor").then(response => {
                                    stuff_310.fn_set_owner(response.data) ;
                                }) ; 
                            }) ;
                        }
                        dv_fbox.append(dv_room) ;
                    } else {
                        var dv_room  = $("<div class='room' />") ;
                        dv_room.text("") ; 
                        dv_room.addClass("empty-space") ;
                        dv_fbox.append(dv_room) ;
                    }
                    if ( r == room_co -1 ) dv_room.addClass("last") ;
                }
                $("#dv_buld").append(dv_fbox) ; 
            }

            if ( f == under.floorCo - 1 ) {
                dv_fbox.addClass("bottom") ;
            }
        }
    }
}
stuff_310.fn_set_floor = () => {
    var data = stuff_310.data ; 
    for ( var f = data.floor.floorCo; f > 0; f -- ) {
        var flno = f ;
        var floor = data.floor["floor" + flno] ; 
        var dv_fbox = $("<div class='floor-box'/>") ;
        var dv_floor = $("<div class='floor'/>") ; 
        dv_floor.text(flno) ;
        dv_fbox.append(dv_floor) ;
        if ( floor.length == 0 ) {
            for ( var r = 0; r < data.floor.roomCo; r ++ ) {
                var dv_room  = $("<div class='room'/>") ;
                dv_room.text("") ; 
                dv_room.addClass("empty-space") ;
                dv_fbox.append(dv_room) ;
                if ( r > 0) dv_room.addClass("nbdl");
                if ( r == data.floor.roomCo -1 ) dv_room.addClass("last") ;
            }
        } else {
            for ( var r = 0; r < data.floor.roomCo; r ++ ) {
                if ( r < floor.length ) {
                    var dv_room  = $("<div class='room' />") ;
                    if ( !!floor[r].roomNm ) {
                        dv_room.attr("id", "room_" + flno + "_" + floor[r].buldno + "_" + floor[r].pssionno) ;
                        dv_room.text(floor[r].roomNm) ; 
                        if ( floor[r].stuffno != "0" && floor[r].sfsttus == "R" ) {
                            dv_room.addClass("done") ;
                        } else if ( floor[r].stuffno != "0" && floor[r].sfsttus == 'T' ) {
                            dv_room.addClass("selected") ; 
                        } else {
                            /* floor *********************************/
                            dv_room.addClass("cursor-hand") ;
                            dv_room.hover(function() {
                               $(this).addClass("hover") ;
                            }, function() {
                               $(this).removeClass("hover") ;
                            }) ; 
                            dv_room.click(function() {
                                $(this).addClass("selected") ;
                                $(this).removeClass("cursor-hand") ; 
                                $(this).off("click") ;
                                stuff_310.fn_set_owndata($(this).attr("id"), "floor").then(response => {
                                    stuff_310.fn_set_owner(response.data) ;
                                }) ; 
                            }) ;
                        }
                        dv_fbox.append(dv_room) ;
                    } else {
                        var dv_room  = $("<div class='room' />") ;
                        dv_room.text("") ; 
                        dv_room.addClass("empty-space") ;
                        dv_fbox.append(dv_room) ;
                    }
                } else {
                    var dv_room  = $("<div class='room' />") ;
                    dv_room.text("") ; 
                    dv_room.addClass("empty-space") ;
                    dv_fbox.append(dv_room) ;
                }
                if ( r == data.floor.roomCo -1 ) dv_room.addClass("last") ;
            }
        }
        $("#dv_buld").append(dv_fbox) ; 
    }
}
stuff_310.fn_set_data = () => {
    $("#dv_buld").empty() ;
    stuff_310.fn_set_floor() ;
    stuff_310.fn_set_under() ;

    var data = stuff_310.data ; 
    var pos_y = data.floor.floorCo * 30 ; 
    if ( !!!data["rftop"] || data.rftop.floorCo == 0 ) pos_y = pos_y - 30 ;
    $(".dong-matrix").css("background-position-y", pos_y + "px") ;
}

stuff_310.fn_set_owner = ( dataList ) => {
    $("#dv_ownerList").empty() ;
    var rn = dataList.length ; 
    if ( !!dataList && dataList.length > 0 ) {
        dataList.forEach((data, i) => {
            var rownum = Number(i + 1) ;
            var dv_owner   = $("<div id='owrn_" + rownum + "' class='cont justify-start bg-gray'/>") ; 
            var dv_acfield = $("<div class='action-field' />") ; 
            var dv_aclabel = $("<div class='action-label' />") ; 
            dv_aclabel.append("<span class='c-red'>" + data.stffnm01 + "</span> / ") ; 
            dv_aclabel.append("<span class='c-red'>" + data.stffnm02 + "</span>") ; 
            var btn_del = $("<button type='button' id='btn_del_" + data.owno + "_" + data.owseq + "' class='btn-x'></button>") ; 
            var _buldno = data.buldno ; 
            btn_del.click(function() {
                var owner = $(this).attr("id").replace("btn_del_", "").split("_") ; 
                stuff_310.fn_delete_owner(owner[0], owner[1], _buldno) ; 
            }) ; 


            dv_aclabel.append(btn_del) ; 
            dv_acfield.append(dv_aclabel) ;

            var dv_field  = $("<div class='action-field'/>") ;
            var sel_owner = $("<select id='sel_owt_" + rownum + "' class='form-select'/>") ; 
            sel_owner.append("<option value=''>소유주 구분</option>") ; 
            commcode["OWT"].forEach(code => {
                var option = "<option value='" + code.code + "'>" + code.codenm + "</option>" ; 
                sel_owner.append(option) ; 
            }) ; 
            dv_field.append(sel_owner) ; 
            var text_cttpc = $("<input type='text' class='w-180px' maxlength='16' id='text_cttpc_" + rownum + "' placeholder='휴대전화번호(숫자만입력)' />") ; 
            dv_field.append(text_cttpc) ; 
            var text_ownernm = $("<input type='text' class='w-100px' id='text_ownernm_" + rownum + "' placeholder='이름' />") ; 
            dv_field.append(text_ownernm) ; 
            var btn_contact = $("<button type='button' class='hs-button btn-cyan mx-2'>연락처</button>") ; 
            dv_field.append(btn_contact) ; 
            var sel_telecom =  $("<select id='sel_tcm_" + rownum + "' class='form-select'/>") ; 
            sel_telecom.attr("disabled", "disabled") ;           
            sel_telecom.append("<option value=''>통신사선택</option>") ;   
            commcode["TCM"].forEach(code => {
                var option = "<option value='" + code.code + "'>" + code.codenm + "</option>" ; 
                sel_telecom.append(option) ; 
            }) ; 
            dv_field.append(sel_telecom) ; 

            dv_acfield.append(dv_field) ; 
            dv_owner.append(dv_acfield) 
            $("#dv_ownerList").append(dv_owner) ; 
            
            $("div[id$=" + data.buldno + "_" + data.pssionno + "]").off("click") ; 
            $("div[id$=" + data.buldno + "_" + data.pssionno + "]").removeClass("cursor-hand") ; 
            if ( data.sfsttus == "T" ) {
                $("div[id$=" + data.buldno + "_" + data.pssionno + "]").addClass("selected") ; 
            } else if (data.sfsttus == "D") {
                $("div[id$=" + data.buldno + "_" + data.pssionno + "]").addClass("done") ;
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
    var cplxno   = stuff_310.data.cplxno ; 
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