var stuff_220 = {
    data: {}
} ; 
stuff_220.fn_set_event = () => {
    $("#btn_addr_search").click(function() {
        stuff_220.fn_addr_search() ;
    }) ; 
    $("#text_cplx_addr").keypress(function(e) {
        if (e.keyCode == 13) {
            stuff_220.fn_addr_search() ;
        }
    }) ; 
    /*
    $("#text_cplx_addr").change(function() {
        var val = $(this).val() ; 
        if ( val != "") {
            $("#btn_search_del").attr("src", "/images/btn-close-x-blue.png") ; 
        } else {
            $("#btn_search_del").attr("src", "/images/btn-search-green.png") ; 
        }
    }) ;
    */
}

stuff_220.fn_addr_search = () => {
        var query = $("#text_cplx_addr").val() ; 
//        $("#naver_map").empty() ; 
        homes_comm.fn_kakao_addr_search({
            "query"  : query
        }).then(response => {
            stuff_220.fn_set_kakao_addr_data(response.status, response.data)
        }).catch(e => {
            $("#text_cplx_addr").val("") ;
//            $("#text_cplx_addr").focus() ;
        }) ; 
}

stuff_220.fn_delete_addr = () => {
    $("#text_cplx_addr").val("") ;
    $(".addr-search-result").removeClass("show")
    $(".addr-search-result").empty() ;
}


stuff_220.fn_set_addr_result = ( addr ) => {
    if ( !!addr ) {
        $("#dv_map_result").removeClass("bold") ; 
        $("#dv_map_result").empty() ; 
        var dv_address = $("<div class='d-block'/>") ;
        var p_jibun = $("<p>") ;
        var p_road  = $("<p>") ;
        p_jibun.html("지&nbsp;&nbsp;&nbsp;번 : " + addr.address.address_name) ; 
        var road_addr = addr.road_address.address_name ; 
        if ( addr.road_address.building_name ) {
            road_addr += ", " + addr.road_address.building_name ; 
        }
        p_road.html("도로명 : " + road_addr) ; 
        dv_address.append(p_jibun) ;
        dv_address.append(p_road) ;
        $("#dv_map_result").append(dv_address) ;
    } else {
        $("#dv_map_result").removeClass("bold").addClass("bold") ; 
        $("#dv_map_result").empty() ; 
        $("#dv_map_result").text("등록할 물건의 주소를 검색하십시오.") ;
    }
}

stuff_220.fn_set_kakao_addr_data = ( status, dataList ) => {
    $(".addr-search-result").removeClass("show")
    $(".addr-search-result").empty() ;
    debugger ; 
    if ( status == "OK" && !!dataList && dataList.length > 0) {
        $(".addr-search-result").append("<div class='addr-title'>주소 선택</div>") ; 
        dataList.forEach((data, i) => {
            var dv_result = $("<div class='addr-result' id='addr_result_" + i + "' />") ; 
            var dv_block  = $("<div class='addr-block'/>") ;
            var dv_jibun  = $("<div class='jibun' />") ; 
            var dv_jibun_j = $("<div class='jibun-j'/>") ; 
            var sp_j = $("<span class='hs-badge sm bg-c1 mr-10 c-text'/>") ; 
            sp_j.html("지&nbsp;&nbsp;&nbsp;번") ;
            var sp_addr_j = $("<span/>") ; 
            if ( !!!data["address"] ) {
                stuff_220.fn_set_kakao_addr_data("ZERO_RESULT", null) ; 
                stuff_220.fn_set_addr_result() ; 
                return ; 
            } 
            sp_addr_j.text(data.address.address_name) ; 
            dv_jibun_j.append(sp_j) ;
            dv_jibun_j.append(sp_addr_j) ;
            dv_jibun.append(dv_jibun_j) ; 

            var dv_jibun_b = $("<div class='jibun-b'/>") ; 
            var sp_b = $("<span class='hs-badge sm bg-c1 mr-10 c-text'>도로명</span>") ; 
            var sp_addr_b = $("<span/>") ; 
            if ( !!data["road_address"]) {
                var road_addr = data.road_address.address_name ;
                if ( data.road_address.building_name) road_addr += ", " + data.road_address.building_name ; 
                sp_addr_b.text(road_addr) ; 
                dv_jibun_b.append(sp_b) ; 
                dv_jibun_b.append(sp_addr_b) ;
                dv_jibun.append(dv_jibun_b) ; 
                stuff_220.fn_set_addr_result( data ) ; 
            }

            var dv_select = $("<div class='addr-select' />") ; 
            var dv_button = $("<button type='button' class='hs-button-sm btn-white'>선택</button>") ; 
            dv_select.append(dv_button) ;

            dv_block.append(dv_jibun) ; 
            dv_block.append(dv_select) ; 
            dv_result.append(dv_block) ; 
            $(".addr-search-result").append(dv_result) ;

            dv_button.click(function() {
                stuff_220.fn_set_addr_data(data) ; 
            }); 

        }) ; 
        $(".addr-search-result").addClass("show") ; 
    } else {
        $("#text_cplx_addr").val("") ;

        var dv_result = $("<div class='addr-result' />") ; 
        var dv_block  = $("<div class='addr-block no-data'/>") ;
        var dv_nodata = $("<div class='no-data-result'/>") ; 
        var dv_desc   = $("<div class='no-data-desc'/> ") ;

        dv_nodata.text("검색결과가 없습니다.") ; 
        dv_desc.html("<span>건축물이 없는</span><span class='c-red'>토지는 [별도검색]을 선택</span><span>후, 검색하십시오</span>") ; 

        dv_block.append(dv_nodata) ; 
        dv_block.append(dv_desc) ;
        dv_result.append(dv_block) ;
        $(".addr-search-result").append(dv_result) ;
        $(".addr-search-result").addClass("show") ; 
    } 

}

stuff_220.fn_get_Homes_buld = ( params ) => {
    var arcd   = params.address.b_code.substring(0, 5) ; 
    var legcd  = params.address.b_code.substring(5, 10) ; 
    var bunjib = homes_comm.util.fn_Lpad(params.address.main_address_no, 4, '0') ;
    var bunjij = homes_comm.util.fn_Lpad(params.address.sub_address_no , 4, '0') ;
    /* 도로명 주소가 있는경우 대표지번을 조회하기 위하여 사용 */ 
    var arcode = params.address.b_code ; 
    var rdaddr = params["road_address"] || {
        main_building_no: "00000",
        sub_building_no : "00000",
        building_name   : ""
    } ; 
    rdaddr.rdmainb = homes_comm.util.fn_Lpad(rdaddr.main_building_no, 5, '0') ; 
    return new Promise(resolve => {
        /* 검색결과로 통합DB조회 */ 
        homes_comm.network.post("/stuff/total-buld", {
            "arcode" : arcode,
            "arcd"   : arcd,
            "legcd"  : legcd,
            "bun"    : bunjib,
            "ji"     : bunjij,
            "rdmainb": rdaddr.rdmainb,
            "buldnm" : rdaddr.building_name
        }).then(response => {
            response["addrdata"] = params ;
            resolve(response) ;
        }) ; 
    }) ; 
}

stuff_220.fn_set_addr_data = ( addr ) => {
    stuff_220.fn_delete_addr() ;
    homes_comm.fn_Load_navermap({
        mapid : "addr_map", /* 필수 */
        coords: { "x": addr.x, "y": addr.y }, /* 필수 */
    }).then( response => {
       addr.kakaox = addr.x ; /* 경도 (LngY) */ 
       addr.kakaoy = addr.y ; /* 위도 (LatX) */ 
       /* 네이버는 이순서가 뒤바뀜 */ 
       addr.naverx = addr.y ; /* 위도 (LatX) */
       addr.navery = addr.x ; /* 경도 (LngY) */ 
       /* *****************************************************************************************
        * 거의 근사치 값이라 네이버에서 따로 변환은 하지 않고 그냥 사용함 
        * 필요시 네이버 geoloation 관련 api검색 
        * https://navermaps.github.io/maps.js.ncp/docs/tutorial-1-geocoder-transcoord.example.html
        * *****************************************************************************************/
        return stuff_220.fn_get_Homes_buld( addr ) ; 
    }).then(response => {
        return stuff_220.fn_set_buld_info(response.addrdata, response.data) ; 
    }).then(response => {
    }) ;
}
stuff_220.fn_set_buld_info = ( addr, data ) => {
    var recap = data["recap"] ; /* 총괄표제부 */ 
    var tList = data["titleList"] || [] ; 
    stuff_220.data["recap"] = recap ; 
    stuff_220.data["titleList"] = tList ; 
    var tinfo = tList.length > 0 ? tList[0] : {} ;  
    
    if (recap) {
        /* 관련주소가 없는경우 대표지번 주소 */ 
        var bunji_j = " " ;  
        recap.mstrbun = Number(recap.bunjib) ; 
        recap.mstrji  = recap.bunjij ; 
        debugger ; 
        if ( recap.mstrji != "0000" ) {
            recap.mstrbun = recap.mstrbun + " - " + Number(recap.mstrji) ;
        }

        /* **********************************************
         * bdinfo를 직접대입했기때문에 bdinfo를 변경하면
         * stuff_220.data.bdinfo가 같이 변경됨 
         * stuff_220.data.bdinfo.arname = arname ; 
         * **********************************************/ 
        $("#sp_buld_arname").text(recap.arname) ; 
        $("#sp_buld_bunji").text(recap.mstrbun) ; 
        if ( !!recap.buldnm ) {
            $("#sp_buld_buldnm").text(" ( " + recap.buldnm + " ) ") ; 
        }

        /* **********************************************************************
         * 정보는 이미 받아왔으므로 
         * 보여줄거 안보여줄것만 표시하자 
         * 한숨만 .... 후 .... 하 .....
         * **********************************************************************/
        
        /* 부동산 구분 */
        $("#dv_ppscode").empty() ;
        
        if ( !!recap.ppscd && !!recap.estcd ) {
            /*
            var ppsmap = data.ppsmap ; 
            var span = $("<span/>") ; 
            span.html(ppsmap.ppsNm01 + " &gt; " + ppsmap.ppsNm02  + " &gt; " + ppsmap.ppsNm03 + "&nbsp;") ; 
            var img = $("<img/>") ; 
            img.attr("src", "/images/help.png") ; 
            img.attr("alt", "도움말") ; 
            img.addClass("cursor-hand") ; 
            $("#dv_ppscode").append(span) ; 
            $("#dv_ppscode").append(img) ;
            img.click(function() {
                homes_comm.fn_set_comm_help({
                    "pgid": "mystuff-220",
                    "data": {
                        "ppscode": ppsmap
                    }
                })
            }) ;
             */
        } else {
            var ppscd  = recap.ppscd ;
            var buldgb = recap.buldgb ; 

            var btn_ppscd   = $("<div class='btn-select no-max-width' id='btn_ppscd'/>") ; 
            var dv_select   = $("<div class='btn-select-text' />") ; 
            var sp_sel_text = $("<span>부동산구분을 선택하십시오</span>") ; 
            var dv_arrow    = $("<div class='btn-select-arrow'/>") ; 
            var img_arrow   = $("<img src='/images/V.png'/>") ; 
            dv_arrow.append(img_arrow) ; 
            dv_select.append(sp_sel_text) ; 
            btn_ppscd.append(dv_select) ; 
            btn_ppscd.append(dv_arrow) ;
            $("#dv_ppscode").append(btn_ppscd) ;

            $("#btn_ppscd").click(function() {
                homes_comm.fn_open_ppscode({
                    "ppscd" : ppscd,
                    "buldgb": buldgb
                }).then(pop_result => {
                    stuff_220.fn_set_ppscd({
                        "ppsList": pop_result.ppsList,
                        "ppscd"  : pop_result.ppscd 
                    })
                }) ;
            }) ; 
        }
        stuff_220.fn_set_buld_data( addr, recap, tinfo ) ;
        stuff_220.fn_set_display( recap, tinfo ) ; 

        return new Promise(resolve => {
            resolve({"data": data }) ; 
        }) ; 
    }
}
stuff_220.fn_set_ppscd = ( data ) => {
    var pps_cd_1 = data.ppscd.substring(0, 4) + "00" ; 
    var pps_cd_2 = data.ppscd.substring(0, 5) + "0" ; 
    data.ppsList[pps_cd_2]
        .filter(ppscode => ( ppscode.ppsCd03 == data.ppscd))
        .forEach(ppscd => {
            stuff_220.fn_set_pps_data(ppscd) ;
        }) ; 
}
stuff_220.fn_set_pps_data = ( ppscode ) => {
    $("#dv_ppscode").empty() ;
    var btn_ppscd   = $("<div class='btn-select no-max-width' id='btn_ppscd'/>") ; 
    var dv_select   = $("<div class='btn-select-text' />") ; 
    var sp_sel_text = $("<span>" + ppscode.ppsNm01 + " &gt; " + ppscode.ppsNm02  + " &gt; " + ppscode.ppsNm03 + "&nbsp;" + "</span>") ; 
    var dv_arrow    = $("<div class='btn-select-arrow'/>") ; 
    var img_arrow   = $("<img src='/images/V.png'/>") ; 
    dv_arrow.append(img_arrow) ; 
    dv_select.append(sp_sel_text) ; 
    btn_ppscd.append(dv_select) ; 
    btn_ppscd.append(dv_arrow) ;
    $("#dv_ppscode").append(btn_ppscd) ;
    $("#dv_ppscode").click(function() {
        homes_comm.fn_open_ppscode({
        }).then(pop_result => {
            stuff_220.fn_set_ppscd({
                "ppsList": pop_result.ppsList,
                "ppscd"  : pop_result.ppscd 
            })
        }) ;
    }) ;
//    $("#dv_info_01").removeClass("hidden").addClass("hidden") ;
    stuff_220.fn_hide_info_div() ; 
    if ( ppscode.ppsCd == "02000" ) {
        /* 집합건물정보 로드 */ 
        $("#dv_buld_group").removeClass("hidden") ;

    }
}

stuff_220.fn_hide_info_div = () => {
    $("#dv_info_01").removeClass("hidden").addClass("hidden") ;
    $("#dv_buld_group").removeClass("hidden").addClass("hidden") ;  /* 집합건물 영역 */
    $("#dv_buld_single").removeClass("hidden").addClass("hidden") ; /* 단독건물 영역 */ 
}

stuff_220.fn_hide_views = () => {
    $("#dv_info_01").removeClass("hidden").addClass("hidden") ; 
    $("#dv_buldnm").removeClass("hidden").addClass("hidden") ; 
    $("#dv_buldco").removeClass("hidden").addClass("hidden") ; 
    $("#dv_comm_house").removeClass("hidden").addClass("hidden") ; 
    $("#dv_building").removeClass("hidden").addClass("hidden") ; 
    $("#dv_parkingco").removeClass("hidden").addClass("hidden") ; 
    $("#dv_area").removeClass("hidden").addClass("hidden") ; 
//    $("#dv_info_02").removeClass("hidden").addClass("hidden") ; 

}

stuff_220.fn_set_buld_data = ( addr, recap, tinfo ) => {
    console.log("*** 총괄표제부 데이터: ", recap ) ; 
    console.log("*** 표제부 데이터: ", tinfo ) ; 
    var setup = homes_comm.store.getItem("setup") ; 
    var m_unit = "㎡"
    if ( setup.uType != "M" ) m_unit = "평" ; 
    $("span[id^=sp_unit_mp_").text(m_unit) ; 
    var rd_buldnm = addr.road_address["building_name"] || " - "; 
    var buldnm    = recap["buldnm"] || rd_buldnm ; /* 건물 명 */

//    var buldco = recap.buldco ;  /* 건물_동_수 */
    var buldco = stuff_220.data["titleList"].length ; 
    /* 건물 명 */
    $("#dv_buld_buldnm").text(buldnm) ; 

    /* 사용승인(입주예정)일 */ 
    var cfmvgb = tinfo.cfmvgb ; 
    if ( cfmvgb == "1" ) $("#dv_buld_cfmvinde").text(homes_comm.util.fn_format_date(tinfo.confde)) ;  /* 승인일자 */
    else $("#dv_buld_cfmvinde").text(homes_comm.util.fn_format_date(tinfo.miveinde)) ; /* 입주일자 */
    
    /* 건축면적 */ 
    var buldar = recap.buldAr.toFixed() ; 
    buldar = homes_comm.util.fn_format_number(buldar) ; 
    $("#sp_unit_buldAr").text(buldar) ; 
    /* 연면적 */
    var totalar = recap.totalAr.toFixed() ; 
    totalar = homes_comm.util.fn_format_number(totalar) ; 
    $("#sp_unit_totalAr").text(totalar) ; 
    /* 대지면적 */ 
    var platar = recap.platAr.toFixed() ; 
    platar = homes_comm.util.fn_format_number(platar) ; 
    $("#sp_unit_platAr").text(platar) ; 

    /* 건물_동_수 */
    var grndco = homes_comm.util.fn_format_number(recap.grndco) ; /* 최고(지상)층 */
    var underco  = homes_comm.util.fn_format_number(recap.underco) ;  /* 최하(지하)층 */ 
    $("#dv_buld_buldco").text(homes_comm.util.fn_format_number(buldco) + "개동(건물)") ; 
    if ( buldco > 1 ) {
        $("#dv_buld_floor_label").text("최저/최고층") ;
        $("#dv_buld_floorco").text("지하 " + underco + "층 / " + grndco + "층") ; /* 순서 반대임 */
    } else {
        $("#dv_buld_floor_label").text("지상/지하층") ;
        $("#dv_buld_floorco").text(grndco + "층 / 지하 " + underco + "층") ; /* 순서 반대임 */
    }
    /* 세대수 / 가구수 */ 
    var hshldco = homes_comm.util.fn_format_number(recap.hshldco) ; 
    var fmlyco  = homes_comm.util.fn_format_number(recap.fmlyco) ; 
    $("#dv_buld_hshldco").text(hshldco + "세대") ; 
    $("#dv_buld_fmlyco").text(fmlyco + "가구") ; 

    /* 총 주차수 */
    var parkingco = homes_comm.util.fn_format_number(recap.parkngco) ; 
    $("#dv_buld_parkingco").text("총 " + parkingco + "대") ; 

    $("#dv_bdong_dongco").text(homes_comm.util.fn_format_number(buldco) + "개동(건물)") ; 
}

/* **************************************************************************
 * 화면에 알잘딱!!(중요) 보여줄거 보여주고 텍스트 바꿀거 바꾸고 ....
 * **************************************************************************/
stuff_220.fn_set_display = ( bdinfo ) => {
    /* 전체 hidden 처리 */ 
    stuff_220.fn_hide_views() ; 
    /* 기본 Display Set */ 
    $("#dv_buldnm").removeClass("hidden") ;  /* 단지(건물)명 / 사용승인일(입주예정일 ) */ 
    $("#dv_buldco").removeClass("hidden") ;  /* 건물_동_수 */ 
    $("#dv_area").removeClass("hidden") ;    /* 건축면적 / 연면죽 */ 
    /* 이거 안나오면 큰일남 */ 
    var buldgb = bdinfo.buldgb ; 
    if ( buldgb == "2" ) { /* 집합건물 ( 공동주택 ) */
        $("#dv_comm_house").removeClass("hidden") ; /* 세대수 / 가구수 */
        $("#dv_parkingco").removeClass("hidden") ; /* 주차수/대지면적 */ 
    } else if ( buldgb == "1" ) { /* 일반건물 */ 
        $("#dv_house").removeClass("hidden") ; /* 세대수 / 가구수 */
    }

    /* 통합정보 *********************************************************/
    $("#sc_buld_info").removeClass("hidden") ;
    $("#dv_info_02").removeClass("hidden") ; 

    /* 동(건물)정보 *********************************************************/
    $("#sc_dong_info").removeClass("hidden") ; 
    $("#dv_info_03").removeClass("hidden") ; 
    /* 건물_동_목록 생성 */ 
    var tList = stuff_220.data["titleList"] || [] ; 
    $("#dv_dong_List").empty() ; 
    var is_vbtn = 0 ; 
    var hddn_dong = $("<div id='dv_dong_hddn_area' />") ; 
    var rn_last = homes_comm.util.fn_Lpad(tList.length, 4, '0') ; 
    tList.forEach((dinfo, i) => {
        var rn = homes_comm.util.fn_Lpad(i + 1, 4, '0') ; 
        var is_hidden = rn > 3 ;

        var dv_dong = $("<div id='dv_dong_" + rn + "' class='cont justify-between bg-gray'/>") ; 

        var dv_label_01 = $("<div id='dv_dong_label_buldnm_" + rn + "' class='label'>") ; 
        dv_label_01.text("동(건물)명") ; 
        var dv_dongnm = $("<div id='dv_dong_buldnm_" + rn + "' class='w-150px fields separate'/>") ; 
        dv_dongnm.text(dinfo.dongnm)
        
        var dv_label_02 = $("<div id='dv_dong_label_floor_" + rn + "' class='w-150px label'/>") ; 
        dv_label_02.text("지상/지하층") ; 
        var dv_floor = $("<div id='dv_dong_floor_" + rn + "' class='w-150px fields separate'/>") ; 
        dv_floor.text(dinfo.grndco + "층 / 지하 " + dinfo.underco + "층") ;

        var elvco = dinfo.rideElvtrco ; 
        var dv_label_03 = $("<div id='dv_dong_label_elvtco_" + rn + "' class='w-150px label'/>") ; 
        dv_label_03.text("엘레베이터") ; 
        var dv_elvtco = $("<div id='dv_dong_elvtco_" + rn + "' class='w-150px fields'/>") ; 
        if ( elvco > 0 ) dv_elvtco.append("<span class='c-blue'>있음</span>") ; 
        else dv_elvtco.append("<span class='c-red'>없음</span>") ; 
        dv_dong.append(dv_label_01) ; 
        dv_dong.append(dv_dongnm) ; 
        dv_dong.append(dv_label_02) ;
        dv_dong.append(dv_floor) ; 
        dv_dong.append(dv_label_03) ;
        dv_dong.append(dv_elvtco) ; 
        if ( is_hidden ) {
            hddn_dong.append(dv_dong) ; 
            hddn_dong.hide() ; 
            $("#dv_dong_List").append(hddn_dong) ; 
        } else {
            $("#dv_dong_List").append(dv_dong) ; 
        }
        if ( rn == rn_last ) {
            var v_List = $("<div id='btn_v_List' class='cont justify-center bg-light-blue cursor-hand'/>") ;
            var v_button = $("<div >전체보기( <span class='c-red'>" + tList.length + "</span> )<span class='arrow-down'></span></div>")
            v_List.append(v_button) ; 
            $("#dv_dong_List").append(v_List) ;
            v_List.click(function() {
                var updown = $(this).find(".arrow-up").length > 0 ? "up" : "down" ;
                var _this = $(this) ; 
                if ( updown == "down" ) {
                    _this.find(".arrow-down").removeClass("arrow-down").addClass("arrow-up") ;
                } else {
                    _this.find(".arrow-up").removeClass("arrow-up").addClass("arrow-down") ;
                }
                hddn_dong.slideToggle(500, function() {
                    var offset = $("#btn_v_List").offset() ; 
                    $(".pop-container").animate({scrollTop: offset.top + 180 }, 500) ; 
                }) ;
            }) ;
        }
    }) ; 
    if ( tList.length <= 3 ) $("#btn_v_List").hide() ; 
} ; 

$(document).ready(function() {
    stuff_220.fn_set_event() ;
}) ; 