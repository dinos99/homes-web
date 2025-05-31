const homes_comm = {
    constants: {
        _API_BASE_URL : "http://127.0.0.1"
        , _API_BASE_PORT: 8090
        , _API_VERSION: "v1"
        , _LOGIN_PAGE_URL: "/html/sign-in/sign-in.html"  
        , _LOGIN_AFTER_PAGE_URL: "/html/system/SYST00010001.html"
        /* 프리패스 페이지 */ 
        , _NO_AUTH_PAGES: [
            "/html/sign-in/sign-in.html" /* 로그인 페이지 */
            , "/html/sign-in/sign-up.html" /* 회원가입 */
        ]
    }
    , admin_menu: {
        LCD: [{
            id: "PRJT", nm: "Homes 관리", link: "/html/project/PRJT00010001.html" 
            , MCD: [{
                id: "0001", nm: "사용자관리", link: "/html/project/PRJT00010001.html", icon: "bi-h-circle-fill" 
                , SCD: [{
                    id: "0001", nm: "사용자관리", link: "/html/project/PRJT00010001.html" 
                }]
            }, {
                id: "0002", nm: "중개사관리", link: "/html/project/PRJT00020001.html", icon: "bi-h-circle-fill" 
                , SCD: [{
                    id: "0001", nm: "중개사관리", link: "/html/project/PRJT00020001.html" 
                }]
            }]
        }, {
            id: "SYST", nm: "시스템관리", link: "/html/system/SYST00010001.html" 
            , MCD: [{
                id: "0001", nm: "Publishing", link: "/html/system/SYST00010001.html", icon: "bi-pencil-square"
                , SCD: [{ 
                    id: "0001", nm: "공통화면 목록", link: "/html/system/SYST00010001.html" 
                }, {
                    id: "0002", nm: "버튼 & 그리드", link: "/html/system/SYST00010002.html" 
                }]
            }]
        }]
    }
    , 
    store: {
        setItem: (key, code) => {
            localStorage.setItem(key, JSON.stringify(code))
        }
        , getItem: (key) => {
            return JSON.parse(localStorage.getItem(key)) ; 
        }
        , clearItem: (key, clearKey) => {
            var jsoObj = JSON.parse(localStorage.getItem(key)) ; 
            delete jsonObj[clearKey] ; 
            localStorage.setItem(key, JSON.stringify(jsonObj)) ; 
        }
        , clear: () => {
            localStorage.clear() ;
        }
        , init_token: (token, user) => {
            homes_comm.store.clear() ; 
        
            delete token.userno ; 
            delete token.usernm ; 
            delete token.email ; 
    
            token["is_remember"] = user.is_remember ; 
            homes_comm.store.setItem("token", token) ; 
    
            user["is_remember"] = user.is_remember ; 
            delete user.issuedAt ; 
            delete user.expiration ; 
            homes_comm.store.setItem("user", user) ; 
        }
        , getAccessToken: () => {
            var token = homes_comm.store.getItem("token") ; 
            return token["accessToken"] || "" ; 
        }
        , getArcodeList: (arcode) => {
            /* store에 지역코드 목록이 존재하지 않는다면 조회하여 setting한다. */ 
            var arList = homes_comm.store.getItem("arList") ;
            return new Promise((resolve, reject) => {
                if ( !!! arList ) {
                    homes_comm.network.send("/common/arcode/select-arcode", {
                        "arcode":  arcode
                    }, (response) => {
                        homes_comm.store.setItem("arList", response.data) ; 
                        resolve(response.data) ; 
                    }) ; 
                } else {
                    resolve(arList) ;
                }
            })
        }
    }
    , util: {
        /* file size 변환 */ 
        fn_conv_filesize: (fsize, option) => {
            const unit_shot = ["KB", "MB", "GB", "TB"];
            const unit_full = ["Kbytes", "Mbytes", "Gbytes", "Tbytes"];
            var def_option = option || {
                use_full_unit_size: false 
            } ; 
            def_option["use_full_unit_size"] =  !!def_option["use_full_unit_size"] ; 
            var useYn = def_option.use_full_unit_size ; 
            for ( var i = 0; i < unit_shot.length; i++ ) {
                fsize = Math.floor(fsize / 1024);
                if (fsize < 1024) {
                    var conv_size = fsize.toFixed(2) + " " ;
                    if (useYn)  {
                        return conv_size + unit_full[i]  ; 
                    } else {
                        return conv_size + unit_shot[i]  ; 
                    }
                }
            }
        }
        /* format string */ 
        , fn_format_number: ( num ) => {
            if(!!!num) return 0;
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        , fn_format_date: ( str_date ) => {
            if ( !!!str_date ) return "" ; 
            var yyyymmdd = [] ; 
            yyyymmdd.push(str_date.substring(0, 4)) ; 
            yyyymmdd.push(str_date.substring(4, 6)) ; 
            yyyymmdd.push(str_date.substring(6, 8)) ; 

            return yyyymmdd.join(".") ;
        }
        , fn_get_today: () => {
            var today = new Date() ; 
            var yyyy = today.getFullYear() ; 
            var mm   = today.getMonth() + 1 ; 
            var dd   = today.getDate() ; 
            
            mm = mm < 10 ? "0" + mm : mm ; 
            dd = dd < 10 ? "0" + dd : dd ; 
            var date = [] ; 
            date.push(yyyy) ;
            date.push(mm) ; 
            date.push(dd) ; 
            return date.join(".") ; 
        }

    }
    , validation: {
        fn_isValidemail: (email) => {
            var regexp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i ; 
            return regexp.test(email) ;
        }
    }
    , message: {
        alert: ( message, options ) => {
            return new Promise(resolve => {
                var cont = $("<div id='pop_cont_alert' class='popup-container'/>") ; 
                $("body").append(cont) ; 
                var option = options || {} ;
                option.title = option["title"] || `<strong>[ <span class='c-red'>Homes Error</span> ] Homes 관리자 오류</strong>` ;
                option.message = message || "잘못된 요청입니다"; 
                cont.load("/html/popup/popAlert.html", () => {
                    $("#alert_title").html(option.title) ;
                    $("#alert_cont").html(option.message) ;
                    $(".btn-close").click(function() {
                        resolve(true) ; 
                        $("#pop_cont_alert").remove() ;
                    })
                    $("#btn_ok").click(function() {
                        resolve(true) ; 
                        $("#pop_cont_alert").remove() ;
                    }) ; 
                }) ;
            }) ;
        }
        , confirm: (message, options ) => {
            return new Promise((resolve, reject) => {
                var cont = $("<div id='pop_cont_confirm' class='popup-container'/>") ; 
                $("body").append(cont) ; 
                var option = options || {} ;
                option.title = option["title"] || "<span><em class='c-red'>Homes</em> manager confirm</span" ; 
                option.message = message ; 
                cont.load("/html/popup/popConfirm.html", (html) => {
                    $("#confirm_title").html(option.title) ;
                    $("#confirm_cont").html(option.message) ;
                    $(".btn-close").click(function() {
                        reject(true) ; 
                        $("#pop_cont_confirm").remove() ;
                    }) ;
                    $("#btn_confirm_cancel").click(function() {
                        reject(true) ; 
                        $("#pop_cont_confirm").remove() ;
                    }) ;
                    $("#btn_confirm_ok").click(function() {
                        resolve(true) ; 
                        $("#pop_cont_confirm").remove() ;
                    }) ; 
                }) ;
            }) ;

        }
    }
    , network: {
        send: (api_url, option, params, fn_callgack) => {
            return new Promise((resolve, reject) => {
                homes_comm.ui.progress(true) ; 
                var def_option = {
                    "method"        : option["method"] || "POST",
                    "mode"          : option["mode"] || "cors", /* no-cors, cors, same-origin */
                    "cache"         : option["cache"] || "no-cache", /* no-cache, reload, force-cache, only-if-cached */
                    "credentials"   : option["credentials"] || "same-origin", /* include, same-origin, omit */
                    "headers"       : option["headers"] || {
                        "Content-Type": "application/json",
//                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    "referrerPolicy": option["referrerPolicy"] || "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    "body"          : option["body"] || JSON.stringify(params), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야
                    "redirect"      : option["redirect"] || "follow", /* follow, manual, error */
                }

                /* ****************************************************************
                 * is_auth가 명시적으로 false로 들어온 경우만 인증안함 
                 * - is_auth가 null이가나 'undefined'인경우 인증필요
                 * ****************************************************************/ 
                var is_auth = option["is_auth"] === false ? false : true  ;
                if ( is_auth ) {
                    def_option.headers["Authorization"] = "Bearer " + homes_comm.store.getAccessToken() ;
                }
                
                /* Failed to execute 'fetch' on 'Window': Request with GET/HEAD method cannot have body. */
                if ( def_option.method == "GET" || def_option.method == "HEAD" ) {
                    delete def_option.body ; 
                }

                /* multipart/form-data의 헤더는 자동으로 생성되며 --boundary가 추가된다 */ 
                if ( def_option.headers["Content-Type"] == "multipart/form-data") {
                    delete def_option.headers["Content-Type"] ; 
                }
                
//              console.log(def_option)
                var api_base_url = homes_comm.fn_get_base_url() ; 
                if ( api_url.indexOf("/api") === 0 || api_url.indexOf("/auth") === 0) {
                    api_url = api_base_url + api_url ; 
                }
                fetch( api_url, def_option).then( response => {
                    if ( def_option.headers["Content-Type"] == "application/x-www-form-urlencoded" ) {
                        // return new URLSearchParams({ username: "example", password: "password" })
//                        return response.json() ; 
                    }
                    return response.json() ; 
                }).then( response => {
                    homes_comm.ui.progress(false).then(ok => {
                        if ( response.error.httpSttusCd == 200 ) {
                            resolve(response) ; 
                        } else {
                            reject(response.error) ; 
                        }
                    }) ;
                }).catch( e => {
                    homes_comm.ui.progress(false).then(ok => {
                        reject(e) ;
                    }) 
                })
            })
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
        }
        , adjust_scroll_height: () => {
            $(".content-wrap").css("height", Number($(".container").height() + 80) + "px") ; 
        }
        , progress: ( sh ) => {
            return new Promise((resolve, reject) => {
                var dimmed = $("<div class='dimmed' id='dimmed-progress'/>") ; 
                var dim_loading = $("<div class='dimmed-loading'/>") ; 
                var i = new Date().getSeconds() % 3 ; 
                var w = 90 ; 
                var h = 90 ; 
                if ( i == 0 ) {
                    w = 30 ; 
                    h = 30 ; 
                }
                var img_loading = $(`<img src="/images/loading/loading-0${i}.gif" width="${w}" height="${h}" alt="잠시만 기다려 주세요" />`) ; 
                var top  = ( document.getElementsByTagName("body")[0].clientHeight  - h ) / 2 ;
                var left = ( document.getElementsByTagName("body")[0].clientWidth - w ) / 2 ; 

                dim_loading.css("top" , top  + "px") ; 
                dim_loading.css("left", left + "px") ; 
                dim_loading.append(img_loading) ; 
                if ( !!sh ) {
                    $("body").append(dimmed) ; 
                    $("body").append(dim_loading) ; 
                    dim_loading.show("200", () => {
                        resolve(true) ; 
                    }) ; 
                } else {
                    $("#dimmed-progress").hide() ; 
                    $(".dimmed-loading").hide(500, () => { 
                        $("#dimmed-progress").remove() ;
                        $(".dimmed-loading").remove() ;
                        resolve(true) ;
                    }) ;
                }
            }) ; 
        }
        , grid: {
            constVar: {
                no_data_message: "검색된 데이터가 없습니다." 
            }
            , send_grid: (action_url, option, fn_callback) => {
                var fetch_option = option["fetch_option"] || {} ; 
                var params = option["param"] || {}
                var grid = $("#" + option.grid.id) ;
                return new Promise((resolve, reject) => {
                    homes_comm.ui.grid.create_empty_row(grid) ; 
                    homes_comm.network.send(action_url, fetch_option, params)
                    .then(response => {
                        return homes_comm.ui.grid.create_grid(grid, response.data, option.grid) ;
                    }).then(result => {
                        if ( !!option.grid["paging"] && !!option.grid.paging.useYn ) {
                            homes_comm.ui.grid.create_paging(grid, result.result.data, option.grid, (pginfo) => {
                                option.param.pgno = pginfo.pgno ; 
                                homes_comm.ui.grid.send_grid(action_url, option, fn_callback) ; 
                            }) ;
                        }
                        resolve(result.result.data) ; 
                    }).catch( e => {
                        console.log(e) ;
                        message.alert(e["errorMessage"] || "잘못된 요청입니다.", {
                            title: `<strong>[<span class='c-red'>Error-${e["httpSttusCd"] ? e.httpSttusCd : 400}</span>] Bad Request</strong>`
                        }) ; 
                        reject(e) ; 
                    })
                }) ;
            }
            , get_cell_count: (grid) => {
                return grid.children().eq(0).children().eq(0).children().length ; 
            }
            , init_grid: (option) => {
                var grid = $("#" + option.gid) ;
                homes_comm.ui.grid.create_div_result(option.rid) ; 
                homes_comm.ui.grid.create_empty_row(grid) ;
                homes_comm.ui.grid.create_paging(grid, {
                    t_cnt: 0
                    , pgno: 1
                    , f_pageno: 1
                    , f_lastpgno: 1
                }, option)  ;
            }
            , create_div_result: (id, data) => {
                var divResult = $("#" + id) ;
                var pginfo = !!!data ? {
                    t_cnt: 0
                    , pgno: 1
                    , l_pageno: 1
                } : data ; 

                divResult.empty() ;
                var html = `<span class="mt-20"><em class='c-red'>*</em> 전체 <em class='c-red' id="em_t_cnt">${pginfo.t_cnt}</em>건 검색  </span>
                            <span class="mt-20 mx-3"><em class='c-red' id="em_pgno">${pginfo.pgno}</em> / <em id="em_l_pageno">${pginfo.l_pageno}</em> pages </span>` ;
                divResult.append(html) ;                            
            }
            , create_paging: (grid, data, option, fn_callback) => {
                if ( !!!option["paging"]["useYn"] ) return false ;
                var pid = option.paging.id ; 
                var paging = $("#" + pid) ; 
                if (paging.length == 0 ) {
                    var div_paging = $("<div class='div-grid-paging' id='" + pid + "'/>") ; 
                    grid.parent().append(div_paging) ; 
                    paging = div_paging ; 
                }
                paging.empty() ; 
                var btn_first = $("<button type='button' class='paging-button first' id='btn_paging_firlst_1'/>")
                var btn_last = $("<button type='button' class='paging-button last' id='btn_paging_last_" + data.l_pageno + "'/>") ; 
                var btn_prev = $("<button type='button' class='paging-button bi bi-caret-left-fill'></button>") ;
                var btn_next = $("<button type='button' class='paging-button bi bi-caret-right-fill'></button>") ;
                btn_first.text("First") ; 
                btn_last.text("Last") ; 

                var curr_pgno = data.pgno ; 
                var pg_st = !!data["pg_st"] ? data.pg_st : 1 ;
                var pg_ed = !!data["pg_ed"] ? data.pg_ed : 1 ; 
                
                console.log("*** pg_st: ", pg_st, ", pg_ed: ", pg_ed, ", pg_last: ", data.l_pageno) ; 
                // Math.ceil(data.f_lastpgno / 10).toFixed() * 10 
                paging.append(btn_first) ;
                if ( curr_pgno > 10) paging.append(btn_prev) ;
                
                for ( var i = pg_st; i <= pg_ed; i ++ ) {
                    var btn_pg = $("<button tyoe='button' class='paging-button'>" + i + "</button>") ; 
                    if ( i == curr_pgno ) {
                        btn_pg.addClass("curr-page") ; 
                    }
                    paging.append(btn_pg) ;
                    if ( !!fn_callback && $.isFunction(fn_callback)) {
                        btn_pg.click(function() {
                            fn_callback.apply(null, [{ 
                                pgno: $(this).text() 
                            }]) ;
                        }) ;
                    }
                }

                /* 다음페이지가 존재하면 btn_next 삽입 */ 
                if ( data.l_pageno > 10 && curr_pgno < data.l_pageno && pg_ed < data.l_pageno) {
                    paging.append(btn_next)
                }
                
                paging.append(btn_last) ;
                if ( !!fn_callback && $.isFunction(fn_callback)) {
                    btn_first.click(function() {
                        fn_callback.apply(null, [{ 
                            pgno: 1 
                        }]) ;
                    }) ;
                    btn_last.click(function() {
                        fn_callback.apply(null, [{ 
                            pgno: data.l_pageno
                        }]) ;
                    }) ; 
                    btn_prev.click(function() {
                        fn_callback.apply(null, [{ 
                            pgno: pg_st - 1
                        }]) ;
                    }) ; 
                    btn_next.click(function() {
                        fn_callback.apply(null, [{ 
                            pgno: Number(pg_ed) + 1
                        }]) ;
                    }) ; 
                } 

            }
            , create_empty_row: (grid) => {
                var gid = grid.attr("id") ; 
                /* delete tbody  */
                homes_comm.ui.grid.remove_empty_row(grid) ; 
                var cell_count = homes_comm.ui.grid.get_cell_count(grid) ;  
                var tbody = $("<tbody id='" + gid + "'/>") ; 
                var tr = $("<tr/>") ; 
                tr.attr("id", "row_nodata") ; 
                var empty_cell = $("<td colspan='" + cell_count + "'>" + homes_comm.ui.grid.constVar.no_data_message + "</td>") ; 
                tr.append(empty_cell) ; 
                tbody.append(tr) ; 
                grid.append(tbody) ; 
            }
            , remove_empty_row: grid => {
                var gid = grid.attr("id") ;
                grid.children().each(function(i, c) {
                    if ( c.nodeName == "TBODY" ) {
                        $(c).remove() ;
                    }
                }) ;
            }
            , create_grid: ( grid, data, option ) => {
                return new Promise((resolve, reject) => {
                    var gid = option.id; 
                    var dataList = data["dataList"] || [] ; 
                    if ( !!!dataList || dataList.length == 0 ) { 
                        homes_comm.ui.grid.create_div_result(option.div_result) ; 
                        homes_comm.ui.grid.create_empty_row(grid) ;
                        resolve({
                            "completed": "COMPLED",
                            "result"   : "NO_DATA_FOUND"
                        })
                    }
                    var headers = option["headers"] || [] ;
                    if ( headers.length == 0 ) {
                        reject({
                            "completed": "COMPLED",
                            "result"   : "NOT_SET_HEADER"
                        })
                    }
                    var tbody = $("<tbody id='tbody_" + gid + "'/>") ;
                    var _data = data ; 
                    homes_comm.ui.grid.create_div_result(option.div_result, data) ; 
                    homes_comm.ui.grid.remove_empty_row(grid) ; 
                    var t_cnt = _data.t_cnt ;
                    var order = !!_data["order"] ? _data.order : "DESC" ; 
                    dataList.forEach((data, i) => {
                        var r_idx = Number(((_data.pgno - 1 ) * 10 ) / 10) + 1 + i ; 
                        var r_num = order == "DESC" ? (t_cnt - ((_data.pgno - 1) * 10)) - i  : r_idx ;
                        var trHtml = `<tr id="row_${r_num}"/>` ; 
                        var tr = $(trHtml) ; 
                        headers.forEach((h, r) => {
                            var is_format = !!h["format"] ; 
                            if ( h.id == "rnum" ) {
                                if ( is_format ) {
                                    r_num = h.format.apply(null, [r_num])
                                }
                                var tdHtml = `<td id="cell_${r_num}">${r_num}</td>` ; 
                                var td = $(tdHtml) ;
                            } else {

                                var tdVal = !!!data[h.id] ? "&nbsp;" : data[h.id] ; 

                                if ( is_format ) {
                                    tdVal = h.format.apply(null, [tdVal])
                                }

                                if (!!h["defval"] || h.defval == "0") {
                                    tdVal = !!!data[h.id] ? h.defval : data[h.id] ; 
                                }

                                if ( !!h["code"] ) tdVal = h.code[tdVal].nm ; 

                                if ( !!h["fn_link_click"] && $.isFunction(h.fn_link_click)) {
                                    tdVal= `<a href="#" class="link-style" id="a_${i}_${h.id}">${tdVal}</a>` ;
                                }

                                var tdHtml = `<td id="cell_${h.id}">${tdVal}</td>` ; 
                                var td = $(tdHtml) ;
                            }
                            var clsname = h["clsname"] || "" ; 
                            td.addClass(clsname) ; 
                            tr.append(td) ;
                        }) ; 

                        tbody.append(tr) ;
                    }) ; 
                    grid.append(tbody) ;
                    resolve({
                        "completed": "COMPLED",
                        "result"   : {
                            "grid"  : grid,
                            "option": option, /* option.grid */ 
                            "data"  : _data 
                        }
                    })
                }) ; 
            } 
        }
        , popup: {
            pop_stack: []
            , pop_data: {}
            , param_data: {}
            , open_popup: (pop_id, url, option) => {
                var contid = pop_id.split("_").join("-") ; 
                var cont = $("<div id='" + contid + "' class='popup-container'/>") ; 
                $("body").append(cont) ;
                cont.load(url, () => {
                    var pop_option = option || {} ; 
                    pop_option.popid = pop_id ; 
                    fn_open_completed( option ) ;
                }) ;
            }
            , pop_open: ( url, option ) => {
                var contid = option.popid ;
                var cont = $("<div id='" + contid + "' class='popup-container'/>") ; 
                $("body").append(cont) ;
                /*
                cont.load(url, () => {
                    fn_open_completed( option ) ;
                }) ;
                 */
            }
            , pop_close: (pop_id, pop_data) => {
                homes_comm.ui.popup.pop_data[pop_id] = pop_data ; 
                $("#pop_hddn_" + pop_id).click() ; 
            }
        }
    }
    , _fn_create_modal : (message) => {
        if ( !!message) {
            $("body").append("<div class='dimmed'/>")
                     .append("<div class='homes-modal'/>") ; 
            var dimmed = $(".dimmed") ; 
            var modal = $(".homes-modal") ; 
            return new Promise((resolve) => {
                modal.append(`<div class='message c-dark'>${message}</div>`) ;
                modal.append("<div class='buttons'><button type='button' class='btn btn-primary w-100' id='btn_alert_ok'>확인</button></div>") ;
                var offset = 40 ; 
                var w_dimmed = dimmed.width() ; 
                var h_dimmed = dimmed.height() ; 
                var top  = (h_dimmed - modal.height()) / 2 - offset; 
                var left = (w_dimmed - modal.width()) / 2 ; 
                modal.css("top", top + "px").css("left", left + "px") ; 
                $("#btn_alert_ok").click(function() {
                    $(".dimmed").remove() ;
                    $(".homes-modal").remove() ; 
                    resolve(true) ;
                }) ; 
            }) ; 
        }
    }
    , _fn_is_auth_url: () => {
        var is_required_auth = true ; 
        for ( var i in homes_comm.constants._NO_AUTH_PAGES) {
            var no_auth = homes_comm.constants._NO_AUTH_PAGES[i] ; 
            if ( no_auth == location.pathname ) {
                is_required_auth = false ; 
                break ; 
            }
        } 
        return  is_required_auth ;
    }
    , fn_get_base_url: () => {
        var api_base_url = homes_comm.constants._API_BASE_URL ; 
        api_base_url += homes_comm.constants._API_BASE_PORT === 443 ? "" : 
                        homes_comm.constants._API_BASE_PORT === 80 ? ""
                        : ":" + homes_comm.constants._API_BASE_PORT ; 
        return api_base_url ; 
    }
    , fn_get_api_url: (url) => {
        var api_base_url = homes_comm.fn_get_base_url() ; 
        return api_base_url + "/api/" + homes_comm.constants._API_VERSION + url ; 
    }
    , fn_Loadsvg: () => {
        $(".snippets").load("/html/snippets/svg.html") ; 
    }
    /* 로그인창 오픈 */
    , fn_popLogin: () => {
        var dimmed = $(".dimmed") ; 
        var modal = $(".homes-login-modal") ; 
    
        var x = ( dimmed.width() - 400 ) / 2 ; 
        var y = ( dimmed.height() - 220 ) / 2 ; 

        modal.css("left", x + "px") ; 
        modal.css("top", y + "px") ; 
        dimmed.show() ;
        modal.show() ; 
    }
    /* 지역검색창 오픈 */ 
    , fn_popup_area: (option) => {
        var def_options = {
            pop_id: "pop_arear"
            , arcode: 1111000000
            , width: 800
            , height: 300
        }
        /* option setting */ 
        var options = option || def_options ; 
        options.pop_id = option["pop_id"] || def_options.pop_id ; 
        options.arcode = option["arcode"] || def_options.arcode ; 
        options.width = option["width"] || def_options.width ; 
        options.height = option["height"] || def_options.height ; 


        var dimmed = $("<div class='dimmed'/>") ; 
        var cont = $("<div class='pop-container shadow'/>") ;
        
        cont.load("/html/popup/pop-search-area.html", () => {
            var arList = {}
            homes_comm.store.getArcodeList(options.arcode)
            .then(data => {
                arList = data ; 
                $("#select_sido").empty() ;
                arList.arSidoList.forEach(arcode => {
                    $("#select_sido").append("<option value='" + arcode.arcode + "' " + arcode.selected + ">" + arcode.arname + "</option>" ) ; 
                }) ; 
                $("#select_sgg").empty() ;
                arList.arSggList.forEach(arcode => {
                    $("#select_sgg").append("<option value='" + arcode.arcode + "' " + arcode.selected + ">" + arcode.arname + "</option>" ) ; 
                }) ; 
                arList.arEmdList.forEach(arcode => {
                    $("#pop_btn_area").append("<button type='button' id='pop_btn_" + arcode.arcode + "' class='btn btn-outline-secondary'>" + arcode.arname + "</button>")
                }) ; 
            }) ; 
        }) ; 

        cont.width( options.width ) ;
        cont.height( options.height ) ;

        $("body").append(dimmed) ;
        $("body").append(cont) ;

        var dw = dimmed.width() ; 
        var dh = dimmed.height() ;
        var cw = cont.width() ;
        var ch = cont.height() ; 
        
        cont.css("top" , Number((dh - ch)/2) + "px") ; 
        cont.css("left", Number((dw - cw)/2) + "px") ; 
        
        dimmed.show();
        $(".dimmed").click(function() {
            $(".pop-container").remove() ;
            $(".dimmed").remove() ; 
        }) ; 

    }
}

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

var fn_isLogin = () => {
    var is_required_auth = homes_comm._fn_is_auth_url() ;
    var tokeninfo = store.getItem("token") ; 
    if ( is_required_auth ) {
        /* 로그인이 필요한 페이지 */
        if (!!!tokeninfo || !!!tokeninfo["accessToken"]) {
            /* 토큰정보가 없으면 로그인 페이지로 튕김 */ 
            message.alert("로그인이 필요한 페이지 입니다.", {
                title: `<strong>[<span class='c-red'>Error-401</span>] 로그인에러 </strong>`
            }).then(data => {
                location.href = homes_comm.constants._LOGIN_PAGE_URL ; 
            }) ;
            return false ;
        } else {
            /* ************************************************************
             * 토큰이 있으면 정확한 토큰인지 검증해야 함 
             * Api 호출시 Interceptor에서 체크한 이후 결과를 리턴한다.
             * 여기서는 토큰의 존재여부만 체크한다. 
             * *************************************************************/
        }
    } else {
        /* 로그인이 필요하지 않은 페이지 */ 
    }
    return true ;
}

var fn_homes_admin_init = () => {
    fn_page_init() ;
}

/* token 유효성 검증 API */ 
var fn_verify_token = (fn_callback) => {
    var token = homes_comm.store.getItem("token") 
    var is_remember = !!token["is_remember"] ? "Y" : "N" ; 
    homes.network.send("/auth/verifyToken", {
        "is_remember": is_remember
    }, (response) => {
        homes.store.init_token(response.token, response.data) ; 
        fn_callback.apply( null, [ response ]) ;
    }) ; 
} ; 

var fn_homes_signin = (params, fn_callback) => {
    homes_comm.network.send("/auth/sign-in", {
        is_auth: false
    }, {
        "email": params.email
        , "password": btoa(params.password)
        ,"is_remember": params.is_remember
    }).then(response => {
        homes.store.init_token(response.token, response.data) ; 
        fn_callback.apply( null, [ response ]) ;
    }).catch( e => {
        homes_comm.message.alert(e.errorMessage, {
            title: `<strong>[<span class='c-red'>Error-${e.httpSttusCd}</span>] 로그인에러 </strong>`,
        }) ;
    }) ; 
};

/* popup result */ 
var pop_close = ( pop_id, pop_data ) => {}
var fn_comm_search = (path, params, fn_callback) => {
    homes_comm.ui.progress(true, () => {
        homes_comm.network.send(path, params, fn_callback) ; 
    }) ; 
} 

/* 페이지 초기화 */ 
var fn_page_init = () => {
    const user = homes_comm.store.getItem("user") ; 
    /* 왜 그런지 모르겠는데 테마가 dark 에서 light로 자동바뀜(현재 로그인페이지만 그럼) */
    $("html").attr("data-bs-theme", "dark") ; 
    /* svg icon load */ 
//    homes.fn_Loadsvg() ;
    /* 상단 GNB 영역생성 */ 
    fn_create_gnb() ; 
    /* 좌측 LNB 영역 생성 */
//    fn_create_lnb() ; 

//    homes_comm.store.getArcodeList( user.arcode ) ;
}

var fn_get_menu = (cd) => {
    if ( cd == "LCD" ) {
        return homes_comm.admin_menu[cd] ; 
    } else if ( cd == "MCD" ) {
        return homes_comm.admin_menu.LCD ; 
    }
}
var fn_create_gnb = () => {
    var header_wrap = $("#homes_admin_gnb") ; 
    header_wrap.load("/html/common/homes-admin-gnb.html", () => {
        const user = store.getItem("user") ;
        var usernm = user.usernm ; 
        var userno = user.userno ; 
        $("#profile_name").text(usernm) ; 
        $("#gp_userno").val(userno) ;

        const pageid = page.pageid ; 
        const gnbcd = page.pageid.split("-").splice(0,1)[0].toLowerCase() 
        
        const menu = fn_get_menu("LCD") ; 
        $(".header-gnb").empty() ; 
        menu.forEach((m, i) => {
            var btn_menu = $("<button type='button' class='btn-gnb' id='gnb_" + m.id.toLocaleLowerCase() + "'>" + m.nm + "</button>") ; 
            $(".header-gnb").append(btn_menu) ; 
            btn_menu.click(function() {
                location.href = m.link ; 
            }) ;
        }) ; 
         

        $("#btn_homes").click(function() {
            location.href = "/" ; 
        }) ; 
        $(".profile-name").click(function() {
            var hasClass = $("#btn_profile").hasClass("hidden") ; 
            if ( hasClass ) $("#btn_profile").removeClass("hidden") ;
            else $("#btn_profile").addClass("hidden") ;
        }) ;

        $("button[id^=gnb_]").removeClass("on") ; 
        $("#gnb_" + gnbcd).addClass("on")
    }); 
}

var fn_create_lnb = () => {
    var lnb_wrap = $("#homes_admin_lnb") ; 
    lnb_wrap.load("/html/common/homes-admin-lnb.html", () => {
        const menu   = fn_get_menu("MCD") ; 
        menu.forEach((m, i) => {
            const pageid = page.pageid ; 
            const gnbcd = page.pageid.split("-").splice(0,1)[0].toLowerCase() ; 
            if ( m.id == page.pageid.split("-").splice(0,1)[0] ) {
                $("a[id^=a_" + gnbcd + "]").remove() ; 
                m.MCD.forEach((mcd, i) => {
                    $("svg[id^=svg_" + gnbcd + "_" + mcd.id + "]").removeClass("hidden") ; 
                    $("#lnb_mcd").append("<span id='a_" + gnbcd + "_" + mcd.id + "' class='ml-10 fs-5 fw-semibold'>" + mcd.nm + "</span>") ; 
                    $("#a_" + gnbcd + "_" + mcd.id).click(function(){
                        location.href = mcd.link ; 
                    }) ; 
                    mcd.SCD.forEach((scd, i) => {
                        const l_cd = page.pageid.split("-").splice(0,1)[0].toLowerCase() ;
                        const m_cd = page.pageid.split("-").splice(1,1)[0] ; 
                        const s_cd  = page.pageid.split("-").splice(2,1)[0] ; 
                        var menucd = page.pageid.split("-").join("_").toLowerCase() ; 
                        var li  = $("#li_lnb_hidden").clone() ; 
                        li.each((i, l) => {
                            $(l).attr("id", "li_lnb_" + scd.id)
                            $(l).removeClass("hidden")  ; 
                            var btn = l.children[0] ; 
                            for ( var i = 0; i < btn.children.length; i ++ ) {
                                var b = btn.children[i] ; 
                                var menucd = page.pageid.split("-").join("_").toLowerCase() ; 
                                if ( menucd == (l_cd + "_" + m_cd + "_" + scd.id)) {
                                    $(btn.children[1]).removeClass("hidden") ; 
                                } else {
                                    $(btn.children[0]).removeClass("hidden") ; 
                                    $(btn).click(function() {
                                        location.href = scd.link ; 
                                    }) ; 
                                }
                                if (i == 2 ) {
                                    var lnb_menu = btn.children[i] ; 
                                    $(lnb_menu).html(scd.nm)
                                }
                            }
                            $("#li_lnb").append(l) ; 
                        }) ; 
                    }) ; 
                }) ; 
            }
        }) ; 
    }) ; 
}

var fn_setpage = (pageinfo) => {
    page.pageid = pageinfo.pageid ; 
}

var homes = homes_comm ;

var homes_ui = homes_comm.ui ;
var homes_grid = homes_comm.ui.grid ; 

var network = homes_comm.network ; 
var store = homes_comm.store ; 
var message = homes_comm.message ; 
var popup = homes_comm.ui.popup ; 
var util = homes_comm.util ; 

var page = { pageid: "" }


/* event */
window.onload = () => {
    fn_page_onLoad() ;
}