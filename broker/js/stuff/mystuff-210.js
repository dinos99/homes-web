var stuff_210 = {} ;
stuff_210.data ={
    "brkno" : p_data.brkno,
    "arcd"  : p_data.arcd,
    "legcd" : p_data.legcd,
    "cplxTy": "00"
}
stuff_210.fn_set_checkbutton = () => {
    $("button[id^=btn_cpx_]").click(function() {
        stuff_210.data.cplxTy = $(this).attr("id").split("_").splice(2,1).toString() ;
        $("button[id^=btn_cpx_]").removeClass("active") ; 
        $(this).addClass("active") ; 
        
        stuff_210.fn_get_complexList({
            "brkno": stuff_210.data.brkno,
            "arcd" : stuff_210.data.arcd,
            "legcd": stuff_210.data.legcd
        }).then(response => {
            var dataList = response.dataList ;
            stuff_210.fn_set_complex_List( dataList ) ;
        })  ; ; 
    }) ;
}

stuff_210.fn_get_arcode = ( params ) => {
    return new Promise(resolve => {
        var arcode = !!!broker.arcode ? "1171010100" : broker.arcode ; 
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

stuff_210.fn_get_complexList = () => {
    var cplxTy = stuff_210.data.cplxTy ;
    var p_data = stuff_210.data ;
    return new Promise(resolve => {
        homes.network.post("/broker/complexList", {
            "brkno": p_data.brkno,
            "arcd" : p_data.arcd,
            "legcd": p_data.legcd
        }).then( response => {
            var dataList = {
                tComplex: []
            }
            if ( cplxTy == "00" ) { /* 전체 */
                resolve({"dataList": response.data}) ; 
//                fn_set_complex_List( response.data ) ;
            } else if ( cplxTy == "03" ) {
                dataList.tComplex = [] ; 
                response.data.tComplex.filter( cplx => ( cplx.cplxTy == "EST113" || cplx.cplxTy == "EST121" )).forEach(cplx => {
                    dataList.tComplex.push(cplx) ;
                }) ; 
                resolve({ "dataList": dataList }) ;
//                fn_set_complex_List( dataList ) ;
            } else if ( cplxTy == "05" ) { /* 빌라/연립 */ 
                dataList.tComplex = [] ; 
                response.data.tComplex.filter( cplx => ( cplx.cplxTy == "EST114" || cplx.cplxTy == "EST115" )).forEach(cplx => {
                    dataList.tComplex.push(cplx) ;
                }) ; 
                resolve({ "dataList": dataList }) ;
//                fn_set_complex_List( dataList ) ;
            } else if ( cplxTy == "09" ) { /* 미분류 */ 
                dataList.tComplex = response.data.tComplex ; 
                resolve({ "dataList": dataList }) ;
//                fn_set_complex_List( dataList ) ;
            } else {
                var ix = Number(cplxTy) ;
                const estcd = [ "EST000", "EST111", "EST112", "EST113", "EST119", "EST114", "EST117", "EST118", "EST123", "EST999"]  ;
                dataList.tComplex = [] ; 
                response.data.tComplex.filter( cplx => ( cplx.cplxTy == estcd[ix] )).forEach(cplx => {
                    dataList.tComplex.push(cplx) ;
                }) ; 
                resolve({ "dataList": dataList }) ;
//                fn_set_complex_List( dataList ) ;
            }

        }).catch( error => {
        }) ;
    }) ; 
}

stuff_210.fn_set_complex_List = ( complex ) => {
    $("#sec_cplxList").empty() ; 
    $("#sec_cplxList").append("<div class='title'>단지 선택</div>") ; 
    var tComplex = complex.tComplex ; 
    var tCnt = 0 ; 
    tCnt += tComplex == null || tComplex.length == 0 ? 0 : tComplex.length ; 
    if ( tCnt == 0 ) {
        var no_cplx = $("<div class='cont first justify-center bg-gray' />") ; 
        no_cplx.text("해당 지역에 등록된 단지가 없습니다.") ; 
        $("#sec_cplxList").append(no_cplx) ;
        return ; 
    }
    tComplex.forEach(cp => {
        var div_cont = $("<div class='cont justify-between bg-gray'/>") ;
        if ( cp.isMine == "Y" ) {
            div_cont = $("<div class='cont justify-between bg-light-blue'/>") ;
        }
        var desc = $("<div class='desc no-width'/>") ; 
        var html =  cp.cplxnm + " / " ; 
        if (cp.cplxTy == "CPX999") {
            html += "<span class='c-red'>미분류</span> / "
        } else {
            html += "<span>" + cp.cplxTyNm + "</span> / " 
        }
        html += homes_comm.util.fn_format_number(cp.cplxDongCo) + "개동 " ;
        if ( cp.cplxTy == 'EST113' || cp.cplxTy == 'EST121' || cp.cplxTy == 'EST123' ) {
            html += homes_comm.util.fn_format_number(cp.cplxHshldCo) + "호실  " ;
        } else {
            html += homes_comm.util.fn_format_number(cp.cplxHshldCo) + "세대 " ;
        }
        desc.html(html) ;

        var field = $("<div class='fields'/>") ; 
        var button =$("<button type='button' class='hs-button btn-lime'>단지등록</button>") ; 
        field.append(button) ; 
        if ( cp.isMine == "Y" ) {
            field = $("<div class='fields'/>") ; 
            field.append("등록완료 / " + cp.crde) ; 
        }

        div_cont.append(desc) ;
        div_cont.append(field) ;
        $("#sec_cplxList").append(div_cont) ;
        var p_data = stuff_210.data ; 
        button.click(function() {
            stuff_210.fn_pop_complex_setting({
                "cplxno"  : cp.cplxno, 
                "buldno"  : cp.buldno,
                "areacode": p_data.areacode,
                "arcd"    : p_data.arcd,
                "legcd"   : p_data.legcd,
                "sdname"  : p_data.sdname,
                "sggname" : p_data.sggname,
                "emdname" : p_data.emdname,
                "plotLoc" : cp.plotLoc,
                "buldnm"  : cp.buldnm,
                "cplxnm"  : cp.cplxnm
            })
        }) ; 
    }) ;

}

stuff_210.fn_pop_complex_setting = ( param ) => {
    homes_comm.popup.pop_open("/complex/pop-complex-setting.html", {
        "popid"   : "pop_cpsetting",
        "cplxno"  : param.cplxno, 
        "areacode": param.areacode,
        "arcd"    : param.arcd,
        "legcd"   : param.legcd,
        "sdname"  : param.sdname,
        "sggname" : param.sggname,
        "emdname" : param.emdname,
        "plotLoc" : param.plotLoc,
        "buldnm"  : param.buldnm,
        "cplxnm"  : param.cplxnm
    }).then(pop_result => {
        return stuff_210.fn_get_complexList() ;
    }).then(response => {
        var dataList = response.dataList ;
        stuff_210.fn_set_complex_List( dataList ) ;
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
            stuff_210.fn_get_complexList({
                "brkno": stuff_210.data.brkno,
                "arcd" : stuff_210.data.arcd,
                "legcd": stuff_210.data.legcd
            }).then(response => {
                var dataList = response.dataList ;
                stuff_210.fn_set_complex_List( dataList ) ;
            }) ;
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
        return stuff_210.fn_get_complexList({
            "brkno": stuff_210.data.brkno,
            "arcd" : stuff_210.data.arcd,
            "legcd": stuff_210.data.legcd
        }) ;
    }).then(response => {
        var dataList = response.dataList ;
        stuff_210.fn_set_complex_List( dataList ) ;
    }) ;
}) ;