const h_manager = {
    constants: {
        _API_BASE_URL : "http://127.0.0.1"
        , _API_DEVL_BASE_URL : "http://127.0.0.1"
        , _API_PROD_BASE_URL : "http://34.64.63.95"
        , _API_DEVL_IP: "127.0.0.1"
        , _API_PROD_IP: "34.64.63.95"
        , _API_BASE_PORT: 8090
        , _API_VERSION: "v1"
        /* 프리패스 페이지 */ 
        , _NO_AUTH_PAGES: [
            "/html/sign-in/sign-in.html" /* 로그인 페이지 */
        ]
    }
    , fn_get_base_url: () => {
        var protocol = location.protocol ; 
        var host = location.hostname ;
        var port = location.port

        var api_base_url = h_manager.constants._API_BASE_URL ; 
        if ( host == h_manager.constants._API_PROD_IP ) {
            api_base_url = h_manager.constants._API_PROD_BASE_URL ; 
        }

        api_base_url += h_manager.constants._API_BASE_PORT === 443 ? "" : 
                        h_manager.constants._API_BASE_PORT === 80 ? ""
                        : ":" + h_manager.constants._API_BASE_PORT ; 
        return api_base_url ; 
    }
    , fn_get_api_url: (url) => {
        var api_base_url = h_manager.fn_get_base_url() ; 
        return api_base_url + "/api/" + h_manager.constants._API_VERSION + url ; 
    }
    , fn_get_sidoList: ( params ) => {
        var arCode = h_manager.store.getItem("arCode") ;
        if (!!!arCode || !!!arCode["sido"]) {
            h_manager.network.get("/common/arcode/sidoList", {
            }).then(response => {
                var arCode = 
                h_manager.store.setItem("arCode", arCode) ;
                return new Promise(resolve => {
                    resolve( response.data ) ;
                })
            }) ; 
        } else {
            return new Promise(resolve => {
                resolve(arCode.sido) ;
            })
        }
    }
    , fn_get_sggList: ( params ) => {
        return new Promise( resolve => {
            h_manager.network.get("/common/arcode/sgg/" + params.sdcode , {
            }).then(response => {
                resolve( response.data ) ;
            }) ; 
        }) ; 
    }
    , fn_get_emdList: ( params ) => {
        return new Promise( resolve => {
            h_manager.network.get("/common/arcode/emd/" + params.sgcode , {
            }).then(response => {
                resolve( response.data ) ;
            }) ; 
        }) ; 
    }
    , fn_get_ppsList: () => {
        var ppsList = h_manager.store.getItem("ppsList") ;
        return new Promise((resolve, reject) => {
            if ( !!!ppsList ) {
                h_manager.network.get("/commcode/ppscdList", {
                }).then(response => {
                    h_manager.store.setItem("ppsList", response.data) ; 
                    resolve(response.data) ; 
                }) ; 
            } else {
                resolve(ppsList) ;
            }
        }) ; 
    }
    , store: {
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
            h_manager.store.clear() ; 
        
            delete token.userno ; 
            delete token.usernm ; 
            delete token.email ; 
    
            token["is_remember"] = user.is_remember ; 
            h_manager.store.setItem("token", token) ; 
    
            user["is_remember"] = user.is_remember ; 
            delete user.issuedAt ; 
            delete user.expiration ; 
            h_manager.store.setItem("user", user) ; 
        }
        , getAccessToken: () => {
            var token = h_manager.store.getItem("token") ; 
            return token["accessToken"] || "" ; 
        }
        , getArcodeList: (arcode) => {
            /* store에 지역코드 목록이 존재하지 않는다면 조회하여 setting한다. */ 
            var arList = h_manager.store.getItem("arList") ;
            return new Promise((resolve, reject) => {
                if ( !!! arList ) {
                    h_manager.network.send("/common/arcode/select-arcode", {
                        "arcode":  arcode
                    }, (response) => {
                        h_manager.store.setItem("arList", response.data) ; 
                        resolve(response.data) ; 
                    }) ; 
                } else {
                    resolve(arList) ;
                }
            })
        }
    }
    , validate: {
        fn_isValidemail: (email) => {
            var regexp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i ; 
            return regexp.test(email) ;
        }
        , fn_isEmpty: (text) => {
            return !!text ; 
        }
        , fn_isEqualVal: (t1, t2) => {
            return t1 === t2 ; 
        }
        , fn_isPassPattern: (pass) => {
            var regexp = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/
            return regexp.test(pass) ;
        }
        , fn_isMobilePattern: (cttpc) => {
            var regexp = /^01\d\d{3,4}\d{4}$/
            return regexp.test(cttpc) ;
        }
    }
    , formatter: {
        fn_get_ppsname: ( ppscd ) => {
            var ppsList = h_manager.store.getItem("ppsList")
            var ppsnm = "" ; 
            ppsList.filter(pps => pps.ppscd == ppscd).forEach(pps => {
                ppsnm = pps.ppsnm ; 
            }) ; 
            return ppsnm ; 
        }
    }
    , util: {
        fn_Lpad: ( text, num, f_char ) => {
            return ("" + text).padStart(num, f_char);
        },
        fn_Rpad: ( text, num, f_char ) => {
            return ("" + text).padEnd(num, f_char);
        },
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
        , fn_format_currency: ( num ) => {
            return h_manager.util.fn_format_number( nun ) ; 
        }
        , fn_format_date: ( str_date ) => {
            if ( !!!str_date ) return "" ; 
            if ( str_date.length != 8 ) return "" ; 
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
        , fn_add_days: ( d, days ) => {
            var yy = d.substring(0, 4) ; 
            var mm = d.substring(4, 6) ; 
            var dd = d.substring(6, 8) ; 

            var date = new Date(yy, mm - 1, dd) ; 
            date.setDate(date.getDate() + days) ; 
            yy = date.getFullYear() ; 
            mm = date.getMonth() + 1 ; 
            dd = date.getDate() ; 

            mm = mm < 10 ? "0" + mm : mm ; 
            dd = dd < 10 ? "0" + dd : dd ; 
            var sdate = [] ; 
            sdate.push(yy) ;
            sdate.push(mm) ; 
            sdate.push(dd) ; 
            return sdate.join(".") ; 
        }
    }
    , ui: {
        fn_make_sidoList: ( sid, params ) => {
            var select = $("#" + sid) ; 
            var selsgg = $("#" + params.sgid) ; 
            var selemd = $("#" + params.edid) ; 
            select.empty() ; 
            selsgg.empty() ; 
            selemd.empty() ; 
            select.append("<option value=''>시도 선택</option>") ;
            selsgg.append("<option value=''>시군구 선택</option>") ;
            selemd.append("<option value=''>읍/면/동 선택</option>") ;
            h_manager.fn_get_sidoList({
            }).then( sido => {
                sido.forEach(sd => {
                    select.append("<option value='" + sd.sdcode + "'>" + sd.arname + "</option>") ; 
                }) ; 
            }) ; 
            /* change event release */ 
            select.change(function() {
                selsgg.empty() ; 
                selemd.empty() ; 
                selsgg.append("<option value=''>시군구 선택</option>") ;
                selemd.append("<option value=''>읍/면/동 선택</option>") ;
                var sdcode = $(this).val() ; 
                h_manager.ui.fn_make_sggList(params.sgid, {
                    "sdid"  : params.sdid,
                    "sgid"  : params.sgid,
                    "edid"  : params.edid,
                    "sdcode": sdcode
                })
            }) ; 
        }
        , fn_make_sggList: ( sggid, params ) => {
            var select = $("#" + sggid) ; 
            var selemd = $("#" + params.edid) ; 
            select.empty() ; 
            selemd.empty() ; 
            select.append("<option value=''>시군구 선택</option>") ;
            selemd.append("<option value=''>읍/면/동 선택</option>") ;
            if ( !!params.sdcode ) {
                h_manager.fn_get_sggList({
                    "sdcode": params.sdcode 
                }).then(sggList => {
                    sggList.forEach(sgg => {
                        select.append("<option value='" + sgg.arcode + "'>" + sgg.arname + "</option>") ; 
                    }) ; 
                }) ;
            }
            select.off("change") ; 
            select.on("change", function() {
                selemd.empty() ; 
                selemd.append("<option value=''>읍/면/동 선택</option>") ;
                var sgcode = $(this).val() ;
                h_manager.ui.fn_make_emdList(params.edid, {
                    "sdid"  : params.sdid,
                    "sgid"  : params.sgid,
                    "edid"  : params.edid,
                    "sgcode": sgcode
                }) ;
            }) ; 
        }
        , fn_make_emdList: ( emdid, params ) => {
            var select = $("#" + emdid) ; 
            select.empty() ; 
            select.append("<option value=''>읍/면/동 선택</option>") ;
            if ( !!params.sgcode ) {
                h_manager.fn_get_emdList({
                    "sgcode": params.sgcode 
                }).then(emdList => {
                    emdList.forEach(emd => {
                        select.append("<option value='" + emd.legcode + "'>" + emd.arname + "</option>") ; 
                    }) ; 
                }) ; 
            }
        }
        , fn_datepicker: ( pickerid ) => {
            var picker = $("#" + pickerid ) ;
            picker.datepicker({
                format: 'yyyy.mm.dd', 
                todayHighlight: true, 
                weekStart: 0, 
                closeText: "닫기",
                prevText: "이전달",
                nextText: "다음달",
                currentText: "오늘",
                monthNames: [ "1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월" ],
                monthNamesShort: [ "1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월" ],
                dayNames: [ "일요일","월요일","화요일","수요일","목요일","금요일","토요일" ],
                dayNamesShort: [ "일","월","화","수","목","금","토" ],
                dayNamesMin: [ "일","월","화","수","목","금","토" ],
                weekHeader: "주",
                dateFormat: "yy.mm.dd",
                firstDay: 0,
                isRTL: false,
                showMonthAfterYear: true,
                yearSuffix: "년",
                beforeShowDay: function(date) {
                    if (date.getDay() === 0) { 
                        return [true, 'picker-color-sunday']; 
                    } else if ( date.getDay() == 6 ) {
                        return [true, 'picker-color-saturday']; 
                    }
                    return [true, 'picker-color-days']; // 그 외 날짜는 기본 스타일
                }
            }) ;

            return picker ; 
        }
    }
    , message: {
        alert: ( message, options ) => {
            var dv_dimmed = $(top.document.querySelector("#dv_dimmed")) ; 
            var dv_alert  = $(top.document.querySelector("#dv_alert_wrap")) ; 
            /*
                <div id="dv_alert" class="alert alert-warning alert-dismissible shadow"  role="alert">
                    <button type="button" id="btn_alert_close" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    <div id="dv_msg_title"></div>
                    <hr class="hr-default" />
                    <p class="mb-0" id="p_msg_text"></p>
                    <div class="mb-0 hidden" id="dv_msg_html"></div>
                </div>
             */
            var alert = $("<div id='dv_alert' />") ; 
            alert.attr("role", "alert") ; 
            var btn_close = $("<button type='button' id='btn_alert_close' class='btn-close' data-bs-dismiss='alert' aria-label='Close' />") ; 
            alert.append(btn_close) ; 
            var dv_title = $("<div id='dv_msg_title'/>") ; 
            alert.append(dv_title) ; 
            alert.append("<hr class='hr-default'/>") ; 
            var dv_message = $("<p class='mb-0' id='p_msg_text' />") ; 
            alert.append(dv_message) ; 
            dv_alert.append(alert) ; 

            dv_dimmed.removeClass("hidden") ; 
            dv_alert.removeClass("hidden") ; 
            var option     = options || {} ; 
            option.title   = option["title"] || "Warning" ; 
            option.msgType = option["msgType"] || "warning" ; 

            if ( option.msgType == "error" ) option.msgType = "danger" ; 

            var a_color = "alert-" + option.msgType ; 

            dv_title.html(option.title) ; 
            var alert = dv_alert.find("#dv_alert") ; 

            alert.removeClass() ; 
            alert.addClass("alert alert-dismissible shadow") ; 
            alert.addClass(a_color) ; 

            alert.find("#p_msg_text").text(message) ; 
            /* 위치 조정 */
            var dw = dv_dimmed.width() ; 
            var dh = dv_dimmed.height() ; 
            var aw = alert.width() ; 
            var ah = alert.height() ; 
            dv_alert.css("top" , (dh - ah) / 2) ;
            dv_alert.css("left", (dw - aw) / 2) ;

            dv_alert.removeClass("hidden") ; 

//            var btn_close = $(top.document.querySelector("#btn_alert_close")) ; 
            return new Promise(resolve => {
                btn_close.click(function() {
                    dv_dimmed.addClass("hidden") ;
                    dv_alert.empty() ;
                    resolve(true) ; 
                }) ; 
            }) ; 
        }
    }
    , network: {
        get: ( url, params ) => {
            var api_url = "/api/" + h_manager.constants._API_VERSION + url ; 
            var is_auth = false ; /* 기본 인증필요없음 */ 
            return new Promise((resolve, reject) => {
                h_manager.network.send(api_url, {
                    "method": "GET",
                    "is_auth": is_auth
                }, params).then(response => {
                    resolve({data: response.data}) ;
                }).catch(error => {
                    var errType    = error["name"] || "Error"; 
                    var errMessage = "" ; 
                    var title = "" ; 
                    if ( errType != "Error" ) {
                        /* 내부 스크립트 오류 */
                        title      = "<span class='c-red'>[Error]</span>" + errType ; 
                        errMessage = error["message"] ;
                    } else {
                        /* 서버에서 에러난 경우 */
                        title      = "<span class='c-red'>" + error.httpSttusText + "</span>" ; 
                        errMessage = error["errorMessage"]
                    }
                    h_manager.message.alert(errMessage, {
                        "title": title, 
                        "msgType": "error"
                    }) ; 
                }) ;
            }) ;
        }
        , post: (url, params) => {
            var api_url = "/api/" + h_manager.constants._API_VERSION + url ; 
            var is_auth = params["is_auth"] || true ; /* 기본 인증필요 */ 
            return new Promise((resolve, reject) => {
                h_manager.network.send(api_url, {
                    "method": "POST",
                    "is_auth": is_auth
                }, params).then(response => {
                    resolve({data: response.data}) ;
                }).catch(error => {
                    var errType    = error["name"] || "Error"; 
                    var errMessage = "" ; 
                    var title = "" ; 
                    if ( errType != "Error" ) {
                        /* 내부 스크립트 오류 */
                        title      = "<span class='c-red'>[Error]</span>" + errType ; 
                        errMessage = error["message"] ;
                    } else {
                        /* 서버에서 에러난 경우 */
                        title      = "<span class='c-red'>" + error.httpSttusText + "</span>" ; 
                        errMessage = error["errorMessage"]
                    }
                    h_manager.message.alert(errMessage, {
                        "title": title, 
                        "msgType": "error"
                    }) ; 
                }) ;
            }) ;
        }
        , send: (api_url, option, params, fn_callgack) => {
            return new Promise((resolve, reject) => {
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
                    def_option.headers["Authorization"] = "Bearer " + h_manager.store.getAccessToken() ;
                }
                
                /* Failed to execute 'fetch' on 'Window': Request with GET/HEAD method cannot have body. */
                if ( def_option.method == "GET" || def_option.method == "HEAD" ) {
                    delete def_option.body ; 
                }

                /* multipart/form-data의 헤더는 자동으로 생성되며 --boundary가 추가된다 */ 
                if ( def_option.headers["Content-Type"] == "multipart/form-data") {
                    delete def_option.headers["Content-Type"] ; 
                }

                var api_base_url = h_manager.fn_get_base_url() ; 
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
                    var error = response.error ; 
                    if ( error.httpSttusCd == 200 ) {
                        resolve(response) ; 
                    } else {
                        reject(response.error) ; 
                    }
                }).catch( e => {
                    reject(e) ;
                })
            })
        }
    }
    , grid: {
        fn_get_grid: ( gid ) => {
            return $("#" + gid) ; 
        }
        , fn_create_grid: ( gid, option ) => {
            $("#" + gid).jqGrid({
                datatype   : "json",
                autowidth  : true,
                rownumbers : true,
                height     : option.height,
                colNames   : option.g_Headers,
                colModel   : option.g_Models,
                rowNum     : option.rownum
            });
        }
        , fn_get_rowid: ( gid ) => {
//            var h_grid = h_manager.grid.fn_get_grid(gid) ; 
        }
        , fn_get_rowcount: ( gid ) => {
            var h_grid = h_manager.grid.fn_get_grid(gid) ; 
            return h_grid.getGridParam("reccount") ;
        }
        , fn_add_row: (gid, rowid, data ) => {
            var h_grid = h_manager.grid.fn_get_grid(gid) ; 
            h_grid.jqGrid("addRowData", rowid, data) ;
        }
        , fn_delete_row: ( gid, row ) => {
            var h_grid = h_manager.grid.fn_get_grid(gid) ; 
            h_grid.delRowData(row) ; 
        }
        , fn_delete_total_row: ( gid ) => {
            var h_grid = h_manager.grid.fn_get_grid( gid ) ; 
            var rcnt   = h_grid.getGridParam("reccount") ;
            if ( rcnt > 0 ) {
                for ( var row = 1; row <= rcnt; row ++ ) {
                    h_grid.delRowData(row) ;  ; 
                }
            }
        }
        , fn_set_dataList: ( gid, data ) => {
            var h_grid = h_manager.grid.fn_get_grid(gid) ; 
            h_manager.grid.fn_delete_total_row(gid) ;
            var rowid = h_grid.getGridParam("reccount") + 1 ;
            if ( !!data["dataList"] && data.dataList.length > 0 ) {
                var dataList = data.dataList ; 
                dataList.forEach(data => {
                    h_grid.jqGrid("addRowData", rowid, data) ;
                    rowid ++ ;
                }) ; 
            } 
        }
        , fn_set_result: ( gid, data ) => {
            $("#" + gid + "_total").text(h_manager.util.fn_format_number(data.t_cnt)) ;
            $("#" + gid + "_curr_pg").text(h_manager.util.fn_format_number(data.pgno)) ;
            $("#" + gid + "_total_pg").text(h_manager.util.fn_format_number(data.l_pageno)) ;
        }
        , fn_set_paging: ( gid, data, fn_callback ) => {
            h_manager.grid.fn_set_result(gid, data) ;
            $("#" + gid + "_pager").empty() ; 
            var f_pgno = data.f_pageno ; 
            var l_pgno = data.l_pageno ; 
            var pageno = data.pgno ; 

            var first = $("<button type='button' class='btn-page first'>First</button>") ; 
            var prev = $("<button type='button' class='btn-page prev'/>") ; 
            var next = $("<button type='button' class='btn-page next'/>") ; 
            var last  = $("<button type='button' class='btn-page last'>Last</button>") ; 
            $("#" + gid + "_pager").append(first) ; 
            $("#" + gid + "_pager").append(prev) ; 
            if ( pageno == 1 ) prev.hide() ;
            for ( var i = data.pg_st; i <= data.pg_ed; i ++ ) {
                var curr_pg  = ( i == data.pgno ) ? "curr_pg" : "" ; 
                var disabled = ( i == data.pgno ) ? "disabled='disabled'" : "" ; 
                var btn_page = $("<button type='button' id='" + gid +"_page_" + i + "' class='btn-page " + curr_pg + "'" + disabled + ">" + i + "</button>") ; 
                $("#" + gid + "_pager").append(btn_page) ; 
            }
            
            $("button[id^=" + gid + "_page_]").click(function() {
                var pg = $(this).attr("id").replace(gid + "_page_", "") ; 
                fn_callback.apply($(this), [ pg ]) ;
            }) ;


            if ( pageno == l_pgno ) next.hide() ;
            $("#" + gid + "_pager").append(next) ; 
            $("#" + gid + "_pager").append(last) ; 

            first.click(function() {
                fn_callback.apply($(this), [ f_pgno ]) ;
            }) ; 
            last.click(function() {
                fn_callback.apply($(this), [ l_pgno ]) ;
            }) ; 
            prev.click(function() {
                if ((pageno - 1) < 0) pgno = 1 ; 
                else pageno = pageno - 1 ;
                fn_callback.apply($(this), [ pageno ]) ;
            }) ;
            next.click(function() {
                if ((pageno + 1) > l_pgno) pgno = l_pgno ; 
                else pageno = pageno + 1 ;
                fn_callback.apply($(this), [ pageno ]) ;
            }) ;
        }
    }
}
