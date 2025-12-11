var popup = {} ; 
var broker = store.getItem("user") ; 
var fn_init_popup = ( popid ) => {
    popup.id = popid ; 
    var arcode = !!!broker.arcode ? "1171010100" : broker.arcode ; 
}
var fn_set_event = () => {
    $("#btn_close").click(function() {
        parent.pop_close({
            "id": popup.id,
            "action": "pop-close" 
        }) ;
    }) ; 
    $("button.btn-tab").click(function() {
        var idx = $(this).index() ;
        if ( idx == 0 ) {
            /* 단지내 물건등록 이동 */ 
            location.href = "/html/stuff/mystuff-002.html" ; 
        }
    }) ; 
}