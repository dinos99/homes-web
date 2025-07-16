
            var fn_getList = () => {
                network.post("/api/v1/diary/get-recent-List", {
                    "accessToken": da9comm.store.getAccessToken(),
                    "interval"   : $("#p_interval").val()
                }).then(data => {
                    fn_set_List(data) ; 
                }) ;
            } ;

            var fn_set_List = ( data ) => {
                $("#no_diary").removeClass("hidden").addClass("hidden") ; 
                if ( data.count > 0) {

                    var dList = data.recentList ;

                    $("div[id^=diryno_").remove() ;

                    dList.forEach( diary => {
                        var cont = $("<div class='d-flex text-body-secondary pt-3'/>") ;
                        cont.attr("id", "diryno_" + diary.diryno) ; 

                        var diary_de = util.fn_format_date(diary.diryDe) ;
                        var dd = diary_de.split(".").splice(2, 1).toString() ; 

                        var is_holiday  = ( diary.diryWk == "SD" || diary.diryWk == "HD") ? "holiday " : "" ;
                        var is_saturday = diary.diryWk == "ST" ? "saturday " : "" ;
                        var is_weekly   = diary.diryWk == "WK" ? "weekly " : "" ;

                        var cal  = $("<div class='list-calendar cur-hand'/>") ;
                        cal.attr("id", "btn_diryno_" + diary.diryno) ;
                        var days = $("<div class='days " + is_weekly + is_saturday + is_holiday + "'/>") ;
                        
                        days.text(dd) ; 
                        cal.append(days) ;

                        var tcont = $("<div class='pb-1 mb-0 ml-10px small lh-sm border-bottom w-100'/>") ;

                        var dList_de    = $("<div class='diary-list between' />")
                        dList_de.append("<strong class='text-gray-dark'>" + "[ " + util.fn_format_date(diary.diryDe) + " ]</strong>") ;

                        var div = $("<div/>") ;

                        var w_icon = w_set[Number(diary.todayWthr)].icon ; 
                        var wHtml  = `<a href="#" class="text-decoration-none mx-1"><i class="bi ${w_icon} text-orange"></i></a>` ; 
                        var wTag   = $(wHtml) ;

                        var f_icon = f_set[Number(diary.todayFeelng)].icon ; 
                        var fHtml  = `<a href="#" class="text-decoration-none mx-1"><i class="bi ${f_icon} text-yellow"></i></a>` ; 
                        var fTag   = $(fHtml) ;

                        var file   = $("<a href='#' class='text-decoration-none mx-1'><i class='bi bi-file-image text-primary no-margin-r'></i></a>") ;
                        var fCnt   = $("<a href='#' class='text-decoration-none'><span class='text-dark no-margin-l'>0</span></a>") ;
                        
                        var reply  = $("<a href='#' class='text-decoration-none mx-1'><i class='bi bi-chat-text text-dark no-margin-r'></i></a>") ;
                        var rCnt   = $("<a href='#' class='text-decoration-none'><span class='text-dark no-margin-l'>0</span></a>") ;

                        div.append(wTag) ;
                        div.append(fTag) ;
                        div.append(file) ;
                        div.append(fCnt) ;
                        div.append(reply) ;
                        div.append(rCnt) ;
                        dList_de.append(div) ; 
                        tcont.append(dList_de) ;

                        var title = $("<div class='diary-list between'/>") ;
                        title.text(diary.diryTitle) ;
                        tcont.append(title) ;

                        var badge = $("<div class='diary-list start'/>") ;
                        if ( !!diary.hdList && diary.hdList.length > 0) {
                            diary.hdList.forEach(holiday => {
                                var span = $("<span class='badge mr-5px red'/>") ;
                                span.text(holiday.holdyNm)
                                badge.append(span) ;
                            }) ;
                        }
                        if ( !!diary.avList && diary.avList.length > 0) {
                            diary.avList.forEach(anniversary => {
                                var span = $("<span class='badge mr-5px info'/>") ;
                                span.text(anniversary.annivsaryNm)
                                badge.append(span) ;
                            }) ;
                        }

                        tcont.append(badge) ;

                        cont.append(cal) ;
                        cont.append(tcont) ; 

                        $("#diaryList").append(cont) ; 

                        $("div[id^=btn_diryno_]").click(function() {
                            var diryno = $(this).attr("id").split("_").splice(2,1).toString() ; 
//                            var diryde = diryno.substring(0, 8) ;
                            location.href="/html/diary/diary-view.html?diryno=" + diryno ;

                        }) ; 


                    }) ;
                } else {
                    $("div[id^=diryno_").remove() ;
                    $("#no_diary").removeClass("hidden") ; 
                }
            }

            $(document).ready(function() {
                fn_init_page("Diary", {
                }) ;

                $("#btn_write").click(function() {
                    location.href="/html/diary/diary-write.html"
                }) ; 

                $("#p_interval").change(function() {
                    fn_getList() ; 
                }) ;
                fn_getList() ; 

            }) ; 