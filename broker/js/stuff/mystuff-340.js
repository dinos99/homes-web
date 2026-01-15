var stuff_340 = {} ;

stuff_340.fn_page_onLoad = ( params ) => {
    stuff_340.params = params ; 
    stuff_340.data = {
        "stuffno": params.stuffno,
        "htbdno" : params.htbdno,
        "buldnm" : params.buldnm, 
        "hppscd" : params.hppscd,
        "ppscd"  : params.ppscd,  
        "hppsnm" : params.hppsnm,
        "ppsnm"  : params.ppsNm,
        "memocn" : ""
    }
//    console.log(stuff_340.data) ; 

    $("#p_text_memo").change(function() {
        if ( $(this).val() == "" ) {
            $("#btn_insert_memo").attr("disabled", "disabled") ; 
        } else {
            $("#btn_insert_memo").removeAttr("disabled") ; 
        }
    }) ; 


    $("#btn_insert_memo").click(function() {
        stuff_340.fn_save_memo() ; 
    }) ; 

    stuff_340.fn_get_memo_List() ;

}

stuff_340.fn_save_memo = () => {
    stuff_340.data.memocn = $("#p_text_memo").val() ; /* 웹취약점 나중에 하자 ㅜㅜ */ 
    homes_comm.network.post("/broker/ins-memo", {
        "stuffno": stuff_340.data.stuffno,
        "memocn" : stuff_340.data.memocn
    }).then(response => {
        stuff_340.fn_get_memo_List() ; 
    }) ; 
}

stuff_340.fn_get_memo_List = () => {
    homes_comm.network.post("/broker/memoList", {
    }).then(response => {
        var mList = response.data ; 
        if (homes_comm.util.fn_isEmpty(mList)) {
            $("#gv_memo_cnt").text(0) ; 
            stuff_340.fn_set_memo_List(mList) ; 
        } else {
            var mcnt = response.data.length ; 
            $("#gv_memo_cnt").text(mcnt) ; 
            stuff_340.fn_set_memo_List(mList) ; 
        }

    }) ; 
}

stuff_340.fn_set_memo_List = (mList) => {
    $("#dv_memoList").empty() ;
    if (homes_comm.util.fn_isNotEmpty(mList)) {
        for ( var i = 0 ; i < mList.length ; i ++ ) {
            var memo = mList[i] ; 
            var dv_data = $("<div class='data'>") ;
            var dv_mdate = $("<div/>") ; 
            dv_mdate.append("<span class='label'>등록일</span>") ; 
            dv_mdate.append("<span class='label-text'>" + memo.memodt + "</span>") ; 
            dv_data.append(dv_mdate) ; 

            var dv_memo = $("<div class='bg-gray my-3'/>")
            dv_memo.html("<p class='label-text'>" + memo.memocn + "</p>") ; 
            dv_data.append(dv_memo) ;
            $("#dv_memoList").append(dv_data) ; 
        }
    }
}