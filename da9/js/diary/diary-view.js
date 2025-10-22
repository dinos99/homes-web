const qEdit = quillEditor.fn_get_editor("#p_diary_cont", {
    placeHolder: "오늘하루 어떠셨나요? 당신의 오늘 하루를 알려주세요 😀"
}) ;

var p_diary = {
    diryno: "",
    diryde: "" 
}

var fn_set_params = () => {
    p_diary.diryno = location.search.split("=").splice(1,1).toString() ; 
    p_diary.diryde = p_diary.diryno.substring(0, 8) ; 
}

var fn_get_contents = () => {
    fn_set_params() ;
    network.post('/api/v1/diary/diary-view', {
        "diryDe": p_diary.diryde,
        "diryno": p_diary.diryno
    }).then(data => {
        var cont = data["cont"] ; 
        $("#text_diryde").text(cont.diryWrtDe) ; 
        $("#text_diryTitle").text(cont.diryTitle) ; 
        var diry_wthr = Number(cont.todayWthr) ; 
        var diry_feelng = Number(cont.todayFeelng) ; 

        var wicon = w_set[diry_wthr] ; 
        $("#diry_wthr").addClass(wicon.icon) ;
        $("#diry_wthr").addClass(wicon.color) ;

        var ficon = f_set[diry_feelng] ;
        $("#diry_felling").addClass(ficon.icon) ;

        var hdList = data["hdList"] ; 
        var avList = data["avList"] ; 
        var tgList = data["tgList"] ; 

        $("#diry_badge").empty() ; 
        $("#diry_Tag").empty() ; 
        if ( !!hdList && hdList.length > 0 ) {
            hdList.forEach(hd => {
                var hdTag = $("<span class='badge mr-5px red' />") ; 
                hdTag.text(hd.holdyNm) ;
                $("#diry_badge").append(hdTag) ;
            }) ; 
        }

        if ( !!avList && avList.length > 0 ) {
            avList.forEach(av => {
                var avTag = $("<span class='badge mr-5px info' />") ; 
                avTag.text(av.annivsaryNm) ;
                $("#diry_badge").append(avTag) ;
            }) ; 
        }
        if ( !!tgList && tgList.length > 0 ) {
            tgList.forEach(tag => {
                var html = $("<a class='link-style mr-5px' />") ; 
                html.text(tag.tagnm) ;
                $("#diry_Tag").append(html) ;
            }) ; 
        }

        if ( da9comm.util.is_not_empty(cont)) {
            fn_set_contents(cont.diryCont) ;
            var qCont = JSON.parse(cont.diryCont) ; 
            var img_cnt = 0 ; 
            qCont.forEach(q => {
                var is_image = da9comm.util.is_not_empty(q.insert["image"]) ; 
                if ( is_image ) img_cnt ++ ; 
            }) ; 
            if ( img_cnt > 0 ) {
                $("#diry_image").removeClass("hidden") ;
                $("#diry_image_cnt").text(img_cnt) ;
            }
        }
    }).catch(e => {
    }) ;
}

var fn_set_contents = ( cont ) => {
    qEdit.setContents(JSON.parse(cont)) ;
    var html = qEdit.getSemanticHTML() ;
    $("#diary_html").html(html) ;
}

$(document).ready(function() {
    fn_init_page("Diary", {
    }) ;

    $(".ql-toolbar").hide() ;
    
    fn_get_contents() ;
    
    $("#btn_List").click(function() {
        location.href="/html/diary/diary-List.html"
    }) ; 
}) ; 

