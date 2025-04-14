var fn_slide_init = () => {
    $("button[data-bs-target*=collapse]").click(function() {
        var bs_target = $(this) ; 
        console.log(bs_target) ; 
        
        $("button[data-bs-target*=collapse]").each(function() {
            var id = $(this).attr("data-bs-target").substring(1) ; 
            $(this).attr("aia-expanded", "false")
            $("#" + id).removeClass("show") ; 
        }) ; 

        bs_target.attr("aria-expanded", "true") ;
        var id_target = bs_target.attr("data-bs-target") ; 
        $(id_target).addClass("show") ;
    }) ; 
}
var fn_page_init = () => {
    fn_slide_init() ; 
}