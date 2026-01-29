var stuff_210 = {} ;
stuff_210.data ={
    "arcd"  : p_data.arcd,
    "legcd" : p_data.legcd,
    "pbList": []
}
stuff_210.fn_set_checkbutton = () => {
    $("button[id^=btn_cpx_]").click(function() {
        var hppscd = $(this).attr("id").split("_").splice(2,1).toString() ;
        stuff_210.data.hppscd = hppscd ; 
        hppscd = "HPS" + hppscd ; 

        $("button[id^=btn_cpx_]").removeClass("active") ; 
        $(this).addClass("active") ; 

        if ( hppscd == "HPS000" ) { /* 전체이면 새로 검색 */ 
            stuff_210.fn_get_public_List() ; 
        } else {
            var sfList = [] ; 
            if ( hppscd == "HPS999" ) { 
                /* 미분류 => 물건에 등록되지 않은 목록만 조회한다. */ 
                stuff_210.data.pbList.filter(pb => (pb.officeno == 0)).forEach(pb => {
                    sfList.push(pb) ;
                }) ; 

            } else {
                stuff_210.data.pbList.filter(pb => (pb.officeno > 0 && pb.hppscd == hppscd)).forEach(pb => {
                    sfList.push(pb) ;
                }) ; 
            }
            stuff_210.fn_set_public_List(sfList) ;
        }

    }) ;
}

stuff_210.fn_get_arcode = ( params ) => {
    return new Promise(resolve => {
        var arcode = !!!broker.arcode ? "1171011100" : broker.arcode ; 
        homes_comm.network.get("/common/arcode/" + arcode, {
        }).then(response => {
            resolve(response.data) ;
        }) ; 
    }) ; 
}

stuff_210.fn_set_area_button = (data) => {
    $("#p_brk_sdnm").text(data.sdname) ; 
    $("#p_brk_sggnm").text(data.sggname) ; 
    $("#p_brk_emdnm").text(data.emdname) ; 
    stuff_210.data.areacode = data.areacode ; 
    stuff_210.data.arcd = data.arcode ;
    stuff_210.data.legcd = data.legcode ; 
    stuff_210.data.sdname = data.sdname ;
    stuff_210.data.sggname = data.sggname ; 
    stuff_210.data.emdname = data.emdname ; 
    return new Promise(resolve => {
        resolve(data) ;
    }) ; 
}

stuff_210.fn_get_public_List = () => {
    var cplxTy = stuff_210.data.cplxTy ;
    var p_data = stuff_210.data ;
    return new Promise(resolve => {
        homes.network.post("/broker/getPublicList", {
            "arcd" : p_data.arcd,
            "legcd": p_data.legcd
        }).then(response => {
            stuff_210.data.pbList = response.data ; 
            stuff_210.fn_set_public_List(response.data) ; 
        }) ; 
    }) ; 
}

stuff_210.fn_set_public_List = ( dataList ) => {
    $("#sec_cplxList").empty() ; 
    $("#sec_cplxList").append("<div class='title'>단지 선택</div>") ; 
    if ( homes_comm.util.fn_isNotEmpty(dataList)) {
        dataList.forEach( data => {
            var div_cont = $("<div class='cont justify-between bg-gray'/>") ;
            if ( data.brkno > 0 ) {
                div_cont = $("<div class='cont justify-between bg-light-blue'/>") ;
            }

            var desc = $("<div class='desc no-width'/>") ; 
            var html =  data.buldnm + " / " ; 

            if ( !!!data["hppscd"] ) {
                html += "<span class='c-red'>미분류</span> / "
            } else {
                html += "<span>" + data["hppsnm"] + "</span> / " 
            }
            if ( data.hppscd == 'HPS113' ) {
                html += homes_comm.util.fn_format_number(data.hshldco) + "호실  " ;
            } else {
                html += homes_comm.util.fn_format_number(data.hshldco) + "세대 " ;
            }
            desc.html(html) ;
            
            html += homes_comm.util.fn_format_number(data.buldco) + "개동 " ;
            desc.html(html) ;

            var field = $("<div class='fields'/>") ; 
            var button =$("<button type='button' class='hs-button btn-lime'>단지등록</button>") ; 
            if ( data.officeno > 0 ) {
                field.append("등록완료 / " + data.crde) ; 
            } else {
                field.append(button) ; 
            }

            div_cont.append(desc) ;
            div_cont.append(field) ;
            $("#sec_cplxList").append(div_cont) ;
            var p_data = stuff_210.data ; 
            button.click(function() {
                stuff_210.fn_pop_pbhouse_setting({
                    "cplxnm"  : data.buldnm,
                    "htbdno"  : data.htbdno, 
                    "buldnm"  : data.buldnm,
                    "areacode": p_data.areacode,
                    "arcd"    : p_data.arcd,
                    "legcd"   : p_data.legcd,
                    "bdaddr"  : data.bdaddr
                }) ; 
            }) ; 
        }) ; 
    } else {
        var no_cplx = $("<div class='cont first justify-center bg-gray' />") ; 
        no_cplx.text("해당 지역에 등록된 단지가 없습니다.") ; 
        $("#sec_cplxList").append(no_cplx) ;
        return ; 
    }
}

stuff_210.fn_pop_pbhouse_setting = ( param ) => {
//    console.group("*** pop_pbhouse ", param ) ;
    homes_comm.popup.pop_open("/complex/pop-complex-setting.html", {
        "popid"   : "pop_cpsetting",
        "htbdno"  : param.htbdno, 
        "cplxnm"  : param.buldnm,
        "buldnm"  : param.buldnm,
        "areacode": param.areacode,
        "arcd"    : param.arcd,
        "legcd"   : param.legcd,
        "bdaddr"  : param.bdaddr,
    }).then(response => {
        stuff_210.fn_get_public_List() ;
    }) ;
}

stuff_210.fn_set_event = () => {
    $("#btn_popArea").click(function() {
        homes_comm.popup.pop_open("/area/pop-area-001.html", {
            popid : popup.id,
            arcode: $("#p_brk_arcode").val()
        }).then(pop_result => {
            return stuff_210.fn_set_area_button(pop_result.pop_data) ;
        }).then(response => {
            return stuff_210.fn_get_public_List() ; 
        }) ;
    }) ;
}

$(document).ready(function() {
    stuff_210.fn_set_checkbutton() ;
    stuff_210.fn_set_event() ; 
    stuff_210.fn_get_arcode()
    .then(response => {
        return stuff_210.fn_set_area_button(response.arCode) ; 
    }).then(response => {
        return stuff_210.fn_get_public_List() ; 
    }) ;
}) ;