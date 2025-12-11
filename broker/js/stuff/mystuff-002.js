var popup = {} ; 
var broker = store.getItem("user") ; 
var p_data = {
    "brkno" : broker.userno,
    "cplxTy": "00"
} ;
var fn_init_popup = ( popid ) => {
    popup.id = popid ; 
    var arcode = !!!broker.arcode ? "1171010100" : broker.arcode ; 
    $("#p_brk_arcode").val(arcode) ; 
    fn_stuff_Load({
        "contid" : "pop_stuff_cont",
        "popid"  : popup.id 
    }).then(response => {
    }) ; 
}

var fn_stuff_Load = ( option ) => {
    $("button.btn-tab").removeClass("active") ; 
    
    var ix = option.popid == "mystuff-210" ? 0 : 1 ; 
    $("button.btn-tab").eq(ix).addClass("active") ; 
    var cont = $("#" + option.contid) ;
    return new Promise(resolve => {
        cont.load("/html/stuff/" + option.popid + ".html", () => {
            resolve({"status": "Completed"}) ;
        }) ;
    }) ; 
    
}

var fn_set_comm_event = () => {
    $("#btn_close").click(function() {
        parent.pop_close({
            "id": popup.id,
            "action": "pop-close" 
        }) ;
    }) ; 

    $("button.btn-tab").click(function() {
        var popid = $(this).index() == 0 ? "mystuff-210" : "mystuff-220" ;
        fn_init_popup(popid) ; 
    }) ; 

    /* footer Load */ 
    fn_pop_footer_Load({
        id: "pop_footer"
    }).then(response => {
    }) ;
}

