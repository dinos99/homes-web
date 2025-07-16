const qEdit = quillEditor.fn_get_editor("#p_diary_cont", {
    placeHolder: "오늘하루 어떠셨나요? 당신의 오늘 하루를 알려주세요 😀"
}) ;

$(document).ready(function() {
    fn_init_page("Diary", {
    }) ;

    /* 로드 후 페이지 event */
    $("#btn_List").click(function() {
        location.href="/html/diary/diary-List.html"
    }) ; 
    da9.ui.datepicker( "p_diary_de", "btn_diary_de", {
        "default": "Today"
    }) ; 

    $("#p_holiday").keypress(function(e){
        var holiday = $("#p_holiday").val() ;
        if ( !!holiday && e.keyCode == 13) {
            $("#p_holiday").val("") ; 
            var badge   = $("<span class='badge red'/>") ; 
            var bg_text = $("<span class='px-1'/>") ; 
            var a_Tag   = $("<a href='#'/>") ;
            var btn_del = $("<span class='bi bi-x-circle-fill ms-2 text-danger'/>") ;
            bg_text.text(holiday) ; 
            a_Tag.append(btn_del) ; 

            badge.append(bg_text) ;
            badge.append(a_Tag) ;

            $("#badge_holiday").append(badge) ; 
            a_Tag.click(function() {
                badge.remove() ; 
            }) ;
        }
    });
    $("#p_anniversary").keypress(function(e){
        var anniversary = $("#p_anniversary").val() ;
        if ( !!anniversary && e.keyCode == 13) {
            $("#p_anniversary").val("") ; 

            var badge   = $("<span class='badge info'/>") ; 
            var bg_text = $("<span class='px-1'/>") ; 
            var a_Tag   = $("<a href='#'/>") ;
            var btn_del = $("<span class='bi bi-x-circle-fill ms-2 text-danger'/>") ;
            bg_text.text(anniversary) ; 
            a_Tag.append(btn_del) ; 

            badge.append(bg_text) ;
            badge.append(a_Tag) ;

            $("#badge_anniversary").append(badge) ; 
            a_Tag.click(function() {
                badge.remove() ; 
            }) ;
        }
    });
    $("#p_tag").keypress(function(e){
        var tagnm = $("#p_tag").val() ;
        if ( !!tagnm && e.keyCode == 13) {
            $("#p_tag").val("") ; 
            var tag = $("<span class='mx-2 cur-hand' />") ; 
            var aTag = $("<a href='#'/>") ;
            aTag.text('#' + tagnm) ; 
            tag.append(aTag) ; 
            $("#input_tag").append(tag) ; 
            tag.click(function() {
                $(this).remove() ; 
            }) ;
        }
    });
    
    $("#sel_weather").click(function() {
        $("#option_weather").toggle() ;
    }) ;

    $("div[id^=btn_weather_00_]").click(function() {
        var idx = $(this).attr("id").split("_").splice(3,1)[0] ;
        var icons = w_set[Number(idx)] ;
        $("#sel_weather").children(0).children(0).removeClass() ; 
        $("#sel_weather").children(0).children(0).children(0).text("") ;
        $("#sel_weather").children(0).children(0).addClass("cur-hand mx-1 p-2 bi text-orange")
        $("#sel_weather").children(0).children(0).addClass(icons.icon) ;
        $("#sel_weather").children(0).children(0).children(0).text(icons.text) ;

        $("#option_weather").hide() ;

        $("#p_weather").val(idx) ; 

    }) ;

    $(".feeling_set").children().each(function() {
        $(this).hover(function() {
            $(this).removeClass("text-secondary") ;
            if (!$(this).hasClass("text-yellow")) {
                $(this).addClass("text-yellow") ;
            }

        }, function() {
            $(this).addClass("text-secondary") ;
            $(this).removeClass("text-yellow") ;
        }) ; 
    }) ;
    $(".feeling_set").children().click(function() {
        $(".feeling_set").children().removeClass("active") ; 
        $(this).addClass("active") ;

        $("#p_feeling").val($(this).index() + 1) ;
    }) ;

    $("#btn_temp_save").click(function() {
        var is_empty = da9comm.validator.is_Empty("#p_diary_title") ;
        if ( is_empty ) {
            $("#p_diary_title").removeClass("invalid").addClass("invalid") ; 
            $("#p_diary_title").parent().children(1).removeClass("invalid").addClass("invalid") ;
            return false ; 
        }
        fn_save("SAV000") ; 
    }) ;
    $("#btn_save").click(function() {
        var is_empty = da9comm.validator.is_Empty("#p_diary_title") ;
        if ( is_empty ) {
            $("#p_diary_title").removeClass("invalid").addClass("invalid") ; 
            $("#p_diary_title").parent().children(1).removeClass("invalid").addClass("invalid") ;
            return false ; 
        }
        fn_save("SAV001") ; 
    }) ;

}) ; 

var fn_get_save_data = (sttus) => {

    var p_diary_de = $("#p_diary_de").val().split(".").join("") ; 
    var p_weather  = $("#p_weather").val() ;
    var p_feeling  = $("#p_feeling").val() ;
    var p_title    = $("#p_diary_title").val() ;
    var p_cont     = JSON.stringify(qEdit.getContents().ops) ; 

    p_feeling = p_feeling < 10 ? "0" + p_feeling : p_feeling ; 
    var p_diary_sttus = sttus ; 

    /* 공휴일 배지 */ 
    var h_idx = 1 ; 
    var p_holiday = [] ; 
    $("#badge_holiday").find(".badge").each(function() {
        p_holiday.push({
            holdySeq: h_idx,
            holdyDe : p_diary_de,
            holdyNm : $(this).text()
        })
        h_idx ++ ; 
    }) ;

    /* 기념일 배지 */ 
    var a_idx = 1 ; 
    var p_anniversary = [] ; 
    $("#badge_anniversary").find(".badge").each(function() {
        p_anniversary.push({
            annivsarySeq: a_idx,
            annivsaryDe : p_diary_de,
            annivsaryNm : $(this).text()
        })
        a_idx ++ ; 
    }) ;

    /* Tag */
    var t_idx = 1 ; 
    var p_Tags = [] ;
    $("#input_tag").find("span") .each(function() {
        p_Tags.push({
            tagno: t_idx,
            tagnm : $(this).text()
        })
        t_idx ++ ; 
    }) ;

    return {
        "p_diary_de": p_diary_de,
        "p_weather" : p_weather,
        "p_feeling" : p_feeling,
        "p_title"   : p_title,
        "p_cont"    : p_cont,
        "p_sttus"   : p_diary_sttus,
        "hdyList"   : p_holiday,
        "anvList"   : p_anniversary,
        "tagList"   : p_Tags,
    }

}

var fn_save = ( sttus ) => {
    var p_svData = fn_get_save_data( sttus ) ; 
    network.send("/api/v1/diary/diary-write", {
        is_auth: true /* 생략가능 */ 
    }, {
        diryDe      : p_svData.p_diary_de,
        dirySttus   : p_svData.p_sttus,
        todayWthr   : p_svData.p_weather,
        todayFellng : p_svData.p_feeling,
        diryTitle   : p_svData.p_title,
        diryCont    : p_svData.p_cont,
        hdyList     : p_svData.hdyList,
        anvList     : p_svData.anvList,
        tagList     : p_svData.tagList
    }).then(response => {
        da9comm.alert({
            remove: true,
            title: `[<span class='c-red'>나의일기</span>]일기 등록`,
            message: "<strong>[" + $("#p_diary_de").val() + "]</strong>" + " 일기가 등록되었습니다."
        }).then(ok => {
            location.href = "/html/diary/diary-List.html" ;
        }) ;
    }) ;
}
