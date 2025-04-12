var navi = {
    "LIST": ["WRPT", "DIRY", "SCHD", "TRVL"]
    , "WRPT": { "mcode": "WRPT", "title": "관찰일지"
           , list: {
                "WRPT0101": "관찰일지 상세보기"
                , "WRPT0102": "관찰일지 쓰기"
           }}
    , "DIRY": {"mcode": "DIRY", "title": "다이어리"}
    , "SCHD": {"mcode": "SCHD", "title": "일정/계획"}
    , "TRVL": {"mcode": "TRVL", "title": "추억여행"}
 } ; 


/**
 * create header
 * @param {*} cate 
 */
var fn_create_header = ( cate, mcode ) => {
    var container = $("#drpt-header") ; 
    container.empty() ;

    var header = $("<header/>") ; 
    container.append(header) ; 

    var banner = $("<div/>") ; 
    banner.addClass("d-flex flex-column flex-md-row align-items-center py-3 border-bottom") ; 
    header.append(banner) ; 

    var alink = $("<a/>") ; 
    alink.attr("href", "/") ; 
    alink.addClass("e-3 py-2 link-body-emphasis") ; 
    banner.append(alink) ; 

    var title_01 = $("<span/>") ; 
    title_01.addClass("title-logo") ;
    title_01.text("상민군의") ; 

    var title_02 = $("<span/>") ; 
    title_02.addClass("title-logo c-red") ;
    title_02.text(" 새상나기") ; 

    alink.append(title_01) ; 
    alink.append(title_02) ; 

    var nav = $("<nav/>") ; 
    nav.addClass("d-inline-flex mt-2 mt-md-0 ms-md-auto") ; 

    banner.append(nav) ;
    
    var base = "#" ; 
//    var base = "/static/html/" + cate + "/" +  mcode + ".html"; 
    navi.LIST.forEach(e => {
        var alink = $("<a/>") ; 
        alink.addClass("me-3 py-2 link-body-emphasis") ; 
        alink.attr("href", base) ; 
        alink.text(navi[e].title) ; 
        if ( navi[e].mcode == cate) {
            var mcd = mcode.toUpperCase() ; 
            base = `/static/html/${cate}/${mcode}.html`  ; 
            alink.attr("href", base) ; 
            alink.addClass("c-red") ; 
        } else {
            var mcd = e.toLowerCase() ; 
            base = `/static/html/${mcd}/${e.toUpperCase()}0101.html`  ; 
            alink.attr("href", base) ; 
        }

        nav.append(alink) ; 
    }) ; 

}


var fn_create_bread = ( cate, mcode ) => {
    var container = $("#drpt-bread") ; 
//    container.empty() ;

var ol = $("#drpt-bread") ; 

    var li_02 = $("<li/>") ;
    li_02.addClass("breadcrumb-item") ; 
    var a_02 = $("<a/>") ; 
    a_02.addClass("link-body-emphasis fw-semibold") ;
    var base = `/static/html/${cate}/${cate.toLowerCase()}0101.html`  ; 
    a_02.attr("href", base) ; 
    a_02.text(navi[cate].title) ; 
    li_02.append(a_02) ; 
    
    var li_03 = $("<li/>") ;
    li_03.addClass("breadcrumb-item active") ; 
    li_03.attr("aria-current", "page") ; 
    li_03.text(navi[cate].list[mcode]) ; 

    ol.append(li_02) ; 
    ol.append(li_03) ; 
}

var fn_create_top = ( cate, mcode ) => {
    fn_create_header(cate, mcode) ;
    fn_create_bread(cate, mcode) ;
}