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
        "diryde": p_diary.diryde,
        "diryno": p_diary.diryno
    }).then(data => {
        if ( da9comm.util.is_not_empty( data["cont"])) {
            fn_set_contents(data.cont.diryCont) ;
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
}) ; 

