const w_set = [
    { icon: "", text: "" },
    { icon: "bi-sun-fill", text: "햇볕은 쨍쨍" },
    { icon: "bi-cloud-sun-fill", text: "구름 조금" },
    { icon: "bi-cloudy-fill", text: "흐림" },
    { icon: "bi-clouds-fill", text: "곧 비올듯" },
    { icon: "bi-cloud-rain-fill", text: "어라? 비가 내리네?" },
    { icon: "bi-cloud-rain-heavy-fill", text: "비가 퍼붓는데?" },
    { icon: "bi-cloud-sleet-fill", text: "비도오고 눈도오고" },
    { icon: "bi-cloud-snow-fill" ,text: "눈이내린다!" }
]





$(document).ready(function() {
    fn_init_page("Diray", {
        "sc_container": ".top-cont-body"
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
            var badge = $("<span class='badge red mx-2 cur-hand' />") ; 
            badge.text(holiday) ; 
            $("#badge_holiday").append(badge) ; 
            badge.click(function() {
                $(this).remove() ; 
            }) ;
        }
    });
    $("#p_anniversary").keypress(function(e){
        var anniversary = $("#p_anniversary").val() ;
        if ( !!anniversary && e.keyCode == 13) {
            $("#p_anniversary").val("") ; 
            var badge = $("<span class='badge info mx-2 cur-hand' />") ; 
            badge.text(anniversary) ; 
            $("#badge_anniversary").append(badge) ; 
            badge.click(function() {
                $(this).remove() ; 
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
    }) ;

    $("#btn_temp_save").click(function() {
        var is_empty = da9comm.validator.is_Empty("#p_diary_title") ;
        if ( is_empty ) {
            $("#p_diary_title").removeClass("invalid").addClass("invalid") ; 
            $("#p_diary_title").parent().children(1).removeClass("invalid").addClass("invalid") ;
            return false ; 
        }
    }) ;
    $("#btn_save").click(function() {
        var is_empty = da9comm.validator.is_Empty("#p_diary_title") ;
        if ( is_empty ) {
            $("#p_diary_title").removeClass("invalid").addClass("invalid") ; 
            $("#p_diary_title").parent().children(1).removeClass("invalid").addClass("invalid") ;
            return false ; 
        }
    }) ;

}) ; 
const qEdit = quillEditor.fn_get_editor("#p_diary_cont", {
    placeHolder: "오늘하루 어떠셨나요? 당신의 오늘 하루를 알려주세요 😀"
}) ;
