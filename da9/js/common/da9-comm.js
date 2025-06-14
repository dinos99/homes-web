const da9comm = {
    menu: {
        Header: {
            title: ["Home", "Schedule", "Diary", "Photos"]
            , Home    : { link: "/"                         , title: "Home" }
            , Schedule: { link: "#"                         , title: "Schedule" } 
            , Diary   : { link: "/html/diary/diary-List.html", title: "Diary" } 
            , Photos  : { link: "#"                         , title: "Photos" } 
        }
        , Left: {
            title: ["Home", "Schedule", "Diary", "Photos"]
            , Home    : { link: "/"                         , title: "Home"    , icon: "bi-house-door-fill"}
            , Schedule: { link: "#"                         , title: "Schedule", icon: "bi-table" } 
            , Diary   : { link: "html/diary/diary-List.html", title: "Diary"   , icon: "bi-card-list"} 
            , Photos  : { link: "#"                         , title: "Photos"  , icon: "bi-image-fill"} 
        }
        , fn_create_header: (menu) => {
            var header = $("#top-header") ; 
            header.load("/html/common/header-top.html", () => {
                $("#btn-da9").click(function() {
                    location.href = "/index.html" ;
                }) ;
                var ul = $("#gnb-headers") ; 
                da9comm.menu.Header.title.forEach(title => {
                    const gnb = da9comm.menu.Header[title]  ; 
                    var li   = $("<li/>") ;
                    var aTag = `<a href="${gnb.link}" class="nav-link ${menu == title ? "active": ""}" title="${title}">${title}</a>`
                    var a    = $(aTag) ; 
                    li.append(a) ; 
                    ul.append(li) ;
                }) ; 
            }) ; 
        }
        , fn_create_lnb: () => {
            var Leftnavi = $("#left-navi") ; 
            Leftnavi.load("/html/common/left-navi.html", () => {
            }) ; 
        }
    }
    , ui: {
        datepicker: ( picker_id, button_id ) => {
            $( "#" + picker_id ).datepicker({
              dateFormat: "yy.mm.dd"
              , altFormat: "yy.mm.dd"
              , showMonthAfterYear: true
              , dayNames: [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일" ]
              , dayNamesMin: [ "일", "월", "화", "수", "목", "금", "토" ]
      //        , dayNamesShort: [ "일", "월", "화", "수", "목", "금", "토" ]
              , monthNames: [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ]
              , monthNamesShot: [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ]
              , prevText: "이전월"
              , nextText: "다음월"
            });

            var picker = $("#" + picker_id) ; 

            if ( !!button_id ) {
                $( "#" + button_id ).click(function() {
                    picker.datepicker("show") ; 
                }) ; 
            }

            /* 안되면 말고 */
            $("#ui-datepicker-div").addClass("border").addClass("shadow") ; 
        }
    }
}

var fn_set_Layout = menu => {
    da9comm.menu.fn_create_header(menu) ;
    da9comm.menu.fn_create_lnb(menu) ;
} ; 

var da9 = da9comm ; 