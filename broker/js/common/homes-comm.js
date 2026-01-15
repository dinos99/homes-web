const hsEvent = {
    "profile_click": new Event("profile-click", { bubbles: true, cancelable: false }) 
}

const homes_comm = {
    constants: {
        _API_BASE_URL : "http://127.0.0.1"
        , _API_DEVL_BASE_URL : "http://127.0.0.1"
        , _API_PROD_BASE_URL : "http://34.64.63.95"
        , _API_DEVL_IP: "127.0.0.1"
        , _API_PROD_IP: "34.64.63.95"
        , _API_BASE_PORT: 8090
        , _API_VERSION: "v1"
        , _LOGIN_PAGE_URL: "/html/sign-in/sign-in.html"  
        , _LOGIN_AFTER_PAGE_URL: "/html/system/SYST00010001.html"
        , _KAKAO_API_APP_KEY_JS: "e23a8c880d6b5fcb0f9af25ed39b0b10"
        , _KAKAO_LOGIN_REDIRECT_URL: "/html/auth/kakao_auth_redirect.html"
        /* 프리패스 페이지 */ 
        , _HOMES_PRO_BASE_DOMAIN: "http://127.0.0.1:8081"
        , _NO_AUTH_PAGES: [
            "/html/sign-in/sign-in.html" /* 로그인 페이지 */
        ]
        , _TOP_MENU: [
            {"T01": {"text": "마이홈", "href": "/html/main.html"}},
            {"T02": {"text": "중개매물", "href": "#"}},
            {"T03": {"text": "나의 물건", "href": "/html/stuff/mystuff-001.html"}},
            {"T04": {"text": "나의 매수/임차", "href": "#"}},
            {"T05": {"text": "네이버 광고", "href": "#"}},
            {"T06": {"text": "고객관리", "href": "#"}},
            {"T07": {"text": "일정관리", "href": "#"}},
            {"T08": {"text": "관심목록", "href": "#"}},
            {"T09": {"text": "고객센터", "href": "#"}}
        ]
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
            return homes_comm.util.fn_format_number( num ) ; 
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
        , fn_isEmpty: ( data ) => {
            return $.isEmptyObject(data) ;
        }
        , fn_isNotEmpty: ( data ) => {
            return !$.isEmptyObject(data) ;
        }
    }
    , message: {
        alert: ( message, options ) => {
            return new Promise(resolve => {
                var cont = $("<div id='pop_cont_alert' class='popup-container'/>") ; 
                $("body", top.document).append(cont) ; 
                var option = options || {} ;
                option.title = option["title"] || "&nbsp;" ; 
                option.message = message ; 
                cont.load("/html/popup/pop-alert.html", () => {
                    $(".message", top.document).html(message)
                    $("#btn_alert_ok", top.document).click(function() {
                        resolve(true) ; 
                        $("#pop_cont_alert", top.document).remove() ;
                    }) ; 
                }) ;
            }) ;
        }
        , confirm: (message, options ) => {
            return new Promise((resolve, reject) => {
                var cont = $("<div id='pop_cont_confirm' class='popup-container'/>") ; 
                $("body").append(cont) ; 
                var option = options || {} ;
                option.title = option["title"] || "&nbsp;" ; 
                option.message = message ; 
                cont.load("/html/popup/pop-confirm.html", (html) => {
                    $(".message").html(message)
                    $("#btn_conf_ok").click(function() {
                        resolve(true) ; 
                        $("#pop_cont_confirm").remove() ;
                    }) ; 
                    $("#btn_conf_cancel").click(function() {
                        resolve(false) ; 
                        $("#pop_cont_confirm").remove() ;
                    }) ;
                }) ;
            }) ;

        }
    }
    , network: {
        send: (url, params, fn_callback) => {
            var api_url = homes_comm.fn_get_api_url(url) ; 
            var token = homes_comm.store.getItem("token") ; 
            var accessToken = token.accessToken ; 
            const request = new Promise((resolve, reject) => {
                fetch(api_url, {
                    method: "POST",
                    mode: "cors", 
                    cache: "no-cache", 
                    credentials: "same-origin", 
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization" : "Bearer " + accessToken
                    },
                    redirect: "follow", 
                    referrerPolicy: "no-referrer", 
                    body: JSON.stringify(params), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야
                }).then((response) => {
//                    homes_ui.progress(false) ; 
                    return response.json() ;
                }).then((response) => { 
//                    homes_ui.progress(false) ; 
                    var errorCd = response.error.httpSttusCd ; 
                    if ( errorCd === 200) {
                        resolve(response) ; 
                    } else  {
                        homes_comm.message.alert(response.error.errorMessage) ; 
                    }
                }).catch((e) => {
                    homes_ui.progress(false) ; 
                    homes_comm.message.alert("네트워크 에러가 발생하였습니다.") ; 
                    reject(e) ; 
                }) ;
            }).then((response) => {
                fn_callback.apply( null, [ response ]) ; 
            }) ; 
        }
        , get: ( url, params ) => {
            var api_url = homes_comm.fn_get_api_url(url) ; 
            return new Promise((resolve, reject) => {
                fetch(api_url, {
                    method: "GET",
                    mode: "cors", 
                    cache: "no-cache", 
                    credentials: "same-origin", 
                    headers: {
                      "Content-Type": "application/json"
                    },
                    redirect: "follow", 
                    referrerPolicy: "no-referrer"// body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야
                }).then((response) => {
//                    homes_ui.progress(false) ; 
                    return response.json() ;
                }).then((response) => { 
//                    homes_ui.progress(false) ; 
                    var errorCd = response.error.httpSttusCd ; 
                    if ( errorCd === 200) {
                        resolve({ data: response.data }) ; 
                    } else  {
                        homes_comm.message.alert(response.error.errorMessage) ; 
                    }
                }).catch((e) => {
                    homes_ui.progress(false) ; 
                    homes_comm.message.alert("네트워크 에러가 발생하였습니다.") ; 
                    reject(e) ; 
                }) ;
            }) ; 
        }
        , post: (url, params, fn_callgack) => {
            var api_url = "/api/" + homes_comm.constants._API_VERSION + url ; 
            var is_auth = params["is_auth"] || true ; /* 기본 인증필요 */ 
            return new Promise((resolve, reject) => {
                homes_comm.network.send_api(api_url, {
                    "method": "POST",
                    "is_auth": is_auth
                }, params).then(response => {
                    resolve({data: response.data}) ;
                }).catch(error => {
                    homes_comm.message.alert(error.errorMessage) ; 
                }) ;
            }) ;
        }
        , send_api: (api_url, option, params, fn_callgack) => {
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
        , simple_send: (url, params, fn_callback) => {
            var api_base_url = homes_comm.fn_get_base_url() ; 
            const request = new Promise((resolve, reject) => {
                fetch(api_base_url + url, {
                    method: "POST", // *GET, POST, PUT, DELETE 등
                    mode: "cors", // no-cors, *cors, same-origin
                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: "same-origin", // include, *same-origin, omit
                    headers: {
                      "Content-Type": "application/json",
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: "follow", // manual, *follow, error
                    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: JSON.stringify(params), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야
                }).then((response) => {
                    return response.json() ;
                }).then((response) => {
                    var errorCd = response.error.httpSttusCd ; 
                    if ( errorCd === 200) {
                        resolve(response) ; 
                    } else  {
                        homes_comm.message.alert(response.error.errorMessage) ; 
                    }
                }).catch((e) => {
                    homes_comm.message.alert("네트워크 에러가 발생하였습니다.") ; 
                    reject(e) ; 
                }) ; 
            }).then((response) => {
                fn_callback.apply( null, [ response ]) ; 
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
        }
        , create_select: (options) => {
        }
        , progress: ( sh, fn_callback ) => {
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
                dim_loading.show("200", function(){
                    fn_callback.apply(null, []) ; 
                }) ; 
            } else {
                $("#dimmed-progress").hide() ; 
                $(".dimmed-loading").hide(500, () => { 
                    $("#dimmed-progress").remove() ;
                    $(".dimmed-loading").remove() ; 
                }) ;
            }

        }
    }
    , popup: {
        pop_stack: []
        , pop_data: {}
        , param_data: {}
        , pop_open: ( url, param ) => {
            var pop_url = "/html/popup" + url ; 
            var wrapid = "wrap_" + param.popid ; 

            var popwrap = $("<div id='" + wrapid + "'/>") ; 
            var is_popup  = $("#" + wrapid).length > 0 ; 
            var is_dimmed = $(".pop-dimmed").length > 0 ; 
            if ( is_popup ) {
                 $("#" + wrapid).remove() ;
            }
            if ( !is_dimmed ) {
                $("body").append("<div class='pop-dimmed'/>") ; 
            }
            $("body").append(popwrap) ;
            return new Promise(resolve => {
                homes_comm.popup.param_data.popid = param.popid ;
                homes_comm.popup.param_data[param.popid] = {
                    "params": param
                }
                popwrap.load( pop_url, () => {
                    popwrap.children().eq(0).attr("id", param.popid) ;
                    $(".pop-dimmed").click(function() {
                        resolve({
                            "action"  : "pop_close",
                            "pop_data": {}
                        }) ; 
                        delete homes_comm.popup.param_data[param.popid] ;
                        $(this).remove() ;
                        popwrap.remove() ;
                    }) ;
                    $("#btn_cancel").off("click") ;
                    $("#btn_cancel").click(function() {
                        var data = homes_comm.popup.pop_data[param.popid] ; 
                        resolve({
                            "action"  : "pop_close",
                            "pop_data": data
                        }) ; 
                        delete homes_comm.popup.param_data[param.popid] ;
                        delete homes_comm.popup.pop_data[popup.id] ; 
                        $(".pop-dimmed").remove() ;
                        popwrap.remove() ;
                    }) ; 
                    $("#btn_hddn_close").off("click") ;
                    $("#btn_hddn_close").click(function() {
                        var data = homes_comm.popup.pop_data[param.popid] ; 
                        resolve({
                            "action"  : "pop_close",
                            "pop_data": data
                        }) ; 
                        delete homes_comm.popup.param_data[param.popid] ;
                        delete homes_comm.popup.pop_data[popup.id] ; 
                        $(".pop-dimmed").remove() ;
                        popwrap.remove() ;
                    }) ; 
                    $("#btn_" + param.popid + "_ok").off("click") ; 
                    $("#btn_" + param.popid + "_ok").click(function() {
                        var data = homes_comm.popup.pop_data[param.popid] ; 
                        resolve({
                            "action"  : "pop_data",
                            "pop_data": data
                        }) ; 
                        delete homes_comm.popup.param_data[param.popid] ;
                        delete homes_comm.popup.pop_data[popup.id] ; 
                        $(".pop-dimmed").remove() ;
                        popwrap.remove() ;
                    }) ;
                }) ; 
            }) ; 
        }
        , pop_close: ( pop_option ) => {
            $("#" + pop_option.popid).remove() ;
        }
        , pop_set_center: ( popid ) => {
            var popup = $("#" + popid ) ; 
            var dimmed = $(".pop-dimmed") ; 
            var win_w = dimmed.width() ; 
            var win_h = dimmed.height() ; 
            var pop_w = popup.width() ; 
            var pop_h = popup.height() ; 

            var center_x = ( win_w - pop_w ) / 2 ; 
            var center_y = ( win_h - pop_h - 140 ) / 2 ; 
            popup.css("left", center_x + "px") ;
            popup.css("top" , center_y + "px") ;

        }
        , pop_movewindow: (el, pop_option) => {
            var pid = pop_option.pid ; 
            var container = $("#" + pid) ; 
            container.addClass("pos-absolute") ; 
            container.css("left", "-9999px") ; 
            container.css("top", "-9999px") ; 
            var fw = $(".dimmed").width() ;
            var fh = $(".dimmed").height() ;
            var pw = (container.children().eq(0).width() / 2).toFixed(0) + "px"; 
            var ph = (container.children().eq(0).height() / 2).toFixed(0) + "px" ; 
            container.css("left", pw) ; 
            container.css("top", ph) ; 
            container.hide() ;
            return new Promise(resolve => {
                container.show(100, (pop_option) => {
                    resolve(pop_option) ; 
                })
            }) ; 
            
        }
        , popOpenEstate: () => {
            var cont = $("<div id='pop-estate' class='popup-container'/>") ; 
            $("body").append(cont) ;
            cont.load("/html/popup/estate/popEstate.html", () => {
                /* 창닫기 버튼 클릭 */ 
                $("#popEstateClose").click(function() {
                    $("#pop-estate").remove() ;
                }) ; 
                fn_popup_Load() ; 
            }) ;
        }
        , popOpenAddress: () => {
            var cont = $("<div id='pop-address' class='popup-container'/>") ; 
            $("body").append(cont) ;
            cont.load("/html/popup/pop-address.html", () => {
                /* 창닫기 버튼 클릭 */ 
                $("#pop_address_close").click(function() {
                    $("#pop-address").remove() ;
                }) ; 
                fn_popup_Load() ; 
            }) ;
        }
        , fn_comm_open: (popurl, pop_params, fn_callback) => {
            var popid = pop_params.popid ; 
            var cont = $("<div id='" + popid + "' class='popup-container'/>") ; 
            var dimmed = $("<div class='dimmed' id='dimmed_" + popid + "'/>") ; 
            $("body").append(dimmed) ; 
            $("body").append(cont) ; 
            /*
            dimmed.click(function() {
                $("#" + popid).remove() ;
                $(this).remove() ;
            }) ;
             */
            cont.load("/html" + popurl, (el) => {
                fn_open_completed( pop_params, fn_callback ) ;
                homes_comm.popup.pop_movewindow(el, {
                    "pid": popid
                }); 
            }) ;
        }
        , fn_comm_popopen_area: ( pop_params, fn_callback ) => {
            var cont = $("<div id='popup-area' class='popup-container'/>") ; 
            var dimmed = $("<div class='dimmed'/>") ; 
            $("body").append(dimmed) ; 
            $("body").append(cont) ; 
            dimmed.click(function() {
                $("#popup-area").remove() ;
                $(this).remove() ;
            }) ;
            cont.load("/html/popup/pop-area.html", (el) => {
                fn_open_completed( pop_params, fn_callback ) ;
                homes_comm.popup.pop_movewindow(el, {
                    "pid": "popup-area"
                }).then(popup => {
                    
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

        var protocol = location.protocol ; 
        var host = location.hostname ;
        var port = location.port

        var api_base_url = homes_comm.constants._API_BASE_URL ; 
        if ( host == homes_comm.constants._API_PROD_IP ) {
            api_base_url = homes_comm.constants._API_PROD_BASE_URL ; 
        }

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
        var cont = $("<div id='popLogin' class='popup-container'/>") ; 
        $("body").append(cont) ; 
        cont.load("/html/popup/popLogin.html", () => {
            /* kakao 로그인버튼 클릭 */ 
            $("#btn_kakaoLogin").click(function() {
                /* window popup으로 교체할것(카카오 회원가입 및 계정선택때문) ********************************************/
                var ifrm = document.getElementById("hddn_ifrm") ; 
                ifrm.src = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${constants.kakao.restapi.appkey}&redirect_uri=${constants.kakao.restapi.redirect_url}` ; 
            }) ;
            /* 약관동의 */ 
            $("#btn_agreement").click(function() {
                var agcont = $("<div id='pop-subscribe-01' class='popup-container'/>") ; 
                $("body").append(agcont) ; 
                agcont.load("/html/popup/member/pop-subscribe-01.html", () => {
                    $("#btn_pop_close").click() ;
                }) ;
            }) ; 

            $("#btn_pop_close").click(function() {
                $("#popLogin").remove() ;
            }) ; 
        }) ; 
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
        options.width  = option["width"]  || def_options.width ; 
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
    /* naver 주소검색 */ 
    , fn_naver_addr_search: ( params ) => {
        var param = {
            "display": params["display"] || 10,
            "start"  : params["start"] || 1,
            "query"  : params["query"] || "",
            "sort"   : "sim"
        } ; 
        if ( !!param.query ) {
            return new Promise(resolve => {
                homes_comm.network.send_api("/api/naver/addr", {
                    "method": "POST",
                    "is_auth": false
                }, param).then(response => {
                    resolve({data: JSON.parse(response.data)}) ; 
                }).catch(error => {
                    homes_comm.message.alert(error.errorMessage)
                    .then(result => {
                        reject({
                            "resjult": false,
                            "message": error.errorMessage
                        })
                    }) ; 
                })  ; 
            }) ; 
        } else {
            return new Promise((resolve, reject) => {
                homes_comm.message.alert(_MESSAGE_REQUIRED_ADDR_)
                .then(result => {
                    reject({
                        "result" : false,
                        "message":_MESSAGE_REQUIRED_ADDR_
                    })
                })
            }) ; 
        }
    }
    /* 카카오 좌표체계(WTM) => 위/경도 좌표체계(WGS84) 변환(Javascript 사용) */ 
    , fn_trans_coords_KakaoToLatLng: ( params ) => {
        return new Promise( resolve => {
            var geocoder = new kakao.maps.services.Geocoder() ; 
            // WTM 좌표를 WGS84 좌표계의 좌표로 변환한다
            geocoder.transCoord(params.x, params.y, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    resolve({"data": {
                        "LatY": result[0].y, /* 위도 */
                        "LngX": result[0].x  /* 경도 */ 
                    }}) ;
                }
            }, {
                input_coord: kakao.maps.services.Coords.WTM,
                output_coord: kakao.maps.services.Coords.WGS84
            });
        }) ; 
    }
    /* 카카오 좌표체계(WTM) => 위/경도 좌표체계(WGS84) 변환(API 사용) */ 
    , fn_trans_coords_kton: ( params ) => {
        return new Promise((resolve, reject) => {
            homes_comm.network.send_api("/api/kakao/transcoord", {
                    "method": "POST",
                    "is_auth": false
                }, {
                    "x": params.x,
                    "y": params.y
                }).then(response => {
                    if ( response.error.errorMessage == "HTTP_OK") {
                        var naver = JSON.parse(response.data) ; 
                        if ( naver.meta.total_count > 0 ) {
                            naver = { "x": naver.documents[0].x.toString(), "y": naver.documents[0].y.toString() }
                        } else {
                            naver = { "x": '0', "y": '0'}
                        }
                        resolve({
                            "data": {
                                "kakao": { "x": params.x, "y": params.y },
                                "naver": { "x": naver.x , "y": naver.y  } 
                            }
                        })
                    } else {
                        reject({
                            "result" : false,
                            "message":response.error.errorMessage
                        })
                    }
                }); 
        }) ; 
    }
    /* kakao map Load */
    , fn_Load_kakaomap: ( option ) => {
        var mapContainer = document.getElementById('addr_map') ;  /* 지도를 표시할 div */
        var mapOption = {
            center: new daum.maps.LatLng(option.x, option.y), // 지도의 중심좌표
            level: 5 // 지도의 확대 레벨
        };
        /* 지도를 미리 생성 */ 
        var map = new daum.maps.Map(mapContainer, mapOption);
        
        /* 마커를 미리 생성 */
        var marker = new daum.maps.Marker({
            "position": new daum.maps.LatLng(option.x, option.y),
            "map"     : map
        });
        /* 해당 주소에 대한 좌표를 받아서 */
        var coords = new daum.maps.LatLng(option.y, option.x) ;
        /* 지도를 보여준다. */
        mapContainer.style.display = "block";
        map.relayout();
        /* 지도 중심을 변경한다. */
        map.setCenter(coords);
        /* 마커를 결과값으로 받은 위치로 옮긴다. */
        marker.setPosition(coords)
    }
    /* naver map Load */
    , fn_Load_navermap: ( option ) => {
        var coords = option.coords ; 
        var useControl = !!option["control"] ; 
        var useZoom    = !!option["zoom"] ; 
         
        $("#" + option.mapid).empty() ;
        var mapDiv = document.getElementById(option.mapid) ; 
        
        var map = new naver.maps.Map(mapDiv, {
            center: new naver.maps.LatLng(coords.y, coords.x), //지도의 초기 중심 좌표
            useStyleMap: true,
            zoom: 19, //지도의 초기 줌 레벨
            minZoom: 7, //지도의 최소 줌 레벨
            mapTypeControl: useControl, //지도 유형 컨트롤의 표시 여부
            mapTypeControlOptions: { //지도 유형 컨트롤의 옵션
                style: naver.maps.MapTypeControlStyle.BUTTON,
                position: naver.maps.Position.TOP_LEFT
            },
            zoomControl: useZoom, //줌 컨트롤의 표시 여부
            zoomControlOptions: { //줌 컨트롤의 옵션
                position: naver.maps.Position.TOP_RIGHT
            }
        });
        
        map.addListener('click', function(e) {
            var latlng = e.coord,
                utmk = naver.maps.TransCoord.fromLatLngToUTMK(latlng),
                tm128 = naver.maps.TransCoord.fromUTMKToTM128(utmk),
                naverCoord = naver.maps.TransCoord.fromTM128ToNaver(tm128);

            utmk.x = parseFloat(utmk.x.toFixed(1));
            utmk.y = parseFloat(utmk.y.toFixed(1));

            console.log('LatLng: ' + latlng.toString());
            console.log('UTMK: ' + utmk.toString());
            console.log('TM128: ' + tm128.toString());
            console.log('NAVER: ' + naverCoord.toString());
        });

        var marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(coords.y, coords.x),
            map: map
        });
        return new Promise(resolve => {
            resolve({
                "data" : option,
                "nvmap": {
                    "map"   : map,
                    "marker": marker
                }
            }) ;
        }) ; 
    /*
        var contentString = [].join("");
        var infowindow = new naver.maps.InfoWindow({
            content: contentString,
            anchorSize: new naver.maps.Size(15, 5),
            pixelOffset: new naver.maps.Point(0, -10)
        });
        naver.maps.Event.addListener(marker, "click", function(e) {
            if (infowindow.getMap()) {
                infowindow.close();
            } else {
                infowindow.open(map, marker);
            }
        });
//        infowindow.open(map, marker);
    */
    }
    /* kakao address search */ 
    , fn_kakao_addr_search: ( option ) => {
        /* 부모창에 반드시 로드되어야 함 */ 
        var geocoder = new daum.maps.services.Geocoder();
        if ( !!option.query ) {
            return new Promise(resolve => {
                geocoder.addressSearch(option.query, function(results, status) {
                    // 정상적으로 검색이 완료됐으면
                    if (status === daum.maps.services.Status.OK) {
//                            var result = results[0]; //첫번째 결과의 값을 활용
                        resolve({
                            "status": daum.maps.services.Status.OK,
                            "data"  : results
                        }) ;
                    } else {
                        resolve({
                            "status": status,
                            "data"  : null
                        })
                    }
                })
            }) ; 
        } else {
            return new Promise((resolve, reject) => {
                homes_comm.message.alert(_MESSAGE_REQUIRED_ADDR_)
                .then(result => {
                    reject({
                        "result" : false,
                        "message":_MESSAGE_REQUIRED_ADDR_
                    })
                })
            }) ; 
        }
    }
}

const constants = {
    kakao: {
        restapi: {
            appkey      : "c79e2b359bcd1089980df40b215227fb", 
            redirect_url: "http://127.0.0.1:8081/html/auth/kakao/kakao-login-redirect.html"
        },
        /* 리얼홈즈(사용자) 기준, 필요시 리얼홈즈 프로와 구분해야 함 */ 
        app_key: {
            "javascript": "3683e4f8faad0637b8a7db5fc23179bd",
            "restapi"   : "c79e2b359bcd1089980df40b215227fb",
            "native"    : "1679a3ca5c4a20799c6b0c22371933a2"
        }
    },
    naver: {
        address: {
            api_url     : "http://openapi.naver.com/v1/search/local.xml",
            method      : "GET", /* https: POST, http: GETR , cors덕분에 GET으로 설정*/
        },
        clientKey   : "UzyPZe2RD_eiUNo0ArnT",
        clientSecret: "RC9vNkO5pc"
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

var fn_isLoginRequired = () => {
    var path = location.pathname ; 
    if ( path == homes_comm.constants._LOGIN_PAGE_URL ) {
        homes_comm.store.clear() ;
    }

    var is_required_auth = homes_comm._fn_is_auth_url() ;
    var tokeninfo = store.getItem("token") ; 
    if ( is_required_auth ) {
        /* 로그인이 필요한 페이지 */
        if (!!!tokeninfo || !!!tokeninfo["accessToken"]) {
            /* 토큰정보가 없으면 로그인 페이지로 튕김 */ 
            homes_message.alert("로그인이 필요한 페이지 입니다.", () => {
                location.href = "/html/sign-in/sign-in.html" ;
            }) ; 
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
    homes_comm.network.simple_send("/auth/sign-in", {
        "email": params.email
        , "password": btoa(params.password)
        ,"is_remember": params.is_remember
    }, (response) => {
        homes.store.init_token(response.token, response.data) ; 
        fn_callback.apply( null, [ response ]) ;
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
var fn_page_init = (pgid) => {
    fn_page_event() ; 
//    const user = homes_comm.store.getItem("user") ; 
    /* 테마를 light로 일괄변경 */
    $("html").attr("data-bs-theme", "light") ; 
    /* 상단 GNB 영역생성 */ 
    fn_Loadmenu(pgid) ; 

//    homes_comm.store.getArcodeList( user.arcode ) ;
}

var fn_Loadmenu = (pgid) => {
    var header = $("#homes_Header") ;
    header.load("/html/common/top-menu.html", () => {   
        fn_create_Topmenu(pgid) ;
    }) ;
}

var fn_toggle_profile = () => {
    /* 사용자계정 */
    const user = homes_comm.store.getItem("user") ; 
    var account = document.querySelector("header .right-menu .account");
    var accountBtn = document.querySelector("header .right-menu .account button");
    var accountBox = document.querySelector("header .right-menu .account-box");
    var body = document.querySelector("body") ;
    
    /* user profile event */
    if (account) {
        account.addEventListener("click", function () {
            accountBox.classList.toggle("active");
            accountBtn.classList.toggle("active");
//            body.dispatchEvent(hsEvent.profile_click) ; 
            event.stopPropagation() ;
        });

        $("#p_broker_name").text(user.usernm) ; 
        $("#p_broker_nm").text(user.usernm) ; 
        $("#p_broker_email").text(user.email) ;

    }
}

var fn_toggle_unit = () => {
    var setup = homes_comm.store.getItem("setup") ;
    if ( !setup ) {
        setup = { uType: "M" } ; /* M: ㎡, P: 평 */ 
    } else if ( !setup["uType"] ) {
        setup.uType = "M" ; 
    }
    
    $("span[id^=uType_").removeClass("active") ; 
    $("#uType_" + setup.uType).addClass("active") ; 
    homes_comm.store.setItem("setup", setup) ;
    $("#btn_uType").click(function() {
        var setup = homes_comm.store.getItem("setup") ;
        var uType = setup.uType == "M" ? "P" : "M" ; 
        setup.uType = uType ; 
        $("span[id^=uType_").removeClass("active") ; 
        $("#uType_" + setup.uType).addClass("active") ; 
        homes_comm.store.setItem("setup", setup) ;
    }) ; 
}

var fn_create_Topmenu = ( pgid ) => {
    /* Top menu 생성 */ 
    var mid = 0 ; 
    var tmenu = $("#btn_Topmenu") ; 
    var tmenu = $("#btn_Topmenu") ; 
    homes_comm.constants._TOP_MENU.forEach( m => {
        mid ++ ; 
        var menucd = mid < 10 ? "T0" + mid : "T" + mid ; 
        var clss = menucd == pgid ? "active" : "" ; 
        tmenu.append("<a href='" + m[menucd].href + "' class='" + clss + "'>" + m[menucd].text + "</a>") ; 
    }) ; 
    fn_toggle_unit() ; 
    fn_toggle_profile() ;
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

var fn_setpage = (pageinfo) => {
    page.pageid = pageinfo.pageid ; 
}

/* kakao map load */
var fn_kakaomap_Load = (option) => {
    var container = document.getElementById(option.mapid); //지도를 담을 영역의 DOM 레퍼런스
    var def_option = { //지도를 생성할 때 필요한 기본 옵션
	    center: option["center"] || new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
	    level  : option["level"] ||  3 //지도의 레벨(확대, 축소 정도)
    };
    var map = new kakao.maps.Map(container, def_option); //지도 생성 및 객체 리턴

    /* 화면에 마커 표시여부 */ 
    if ( !!option["is_marker"]) {
        var coords = def_option.center ;
        var marker = new kakao.maps.Marker({
            "map"     : map,
            "position": coords
        });

        /* 인포윈도우로 장소에 대한 설명을 표시 */
        /*
        var infowindow = new kakao.maps.InfoWindow({
            content: '<div style="width:150px;text-align:center;padding:6px 0;">우리회사</div>'
        });
        infowindow.open(map, marker);
        */
        /* 지도의 중심이동 */
        map.setCenter(coords);
    }
}

/* 주소검색창 오픈 */
var fn_popAddress = ( option, fn_callback ) => {
    var mcont = $("<div id='popAddress' class='popup-container'/>") ; 
    $("body").append(mcont) ; 
    mcont.load("/html/popup/popAddressDaum.html", () => {   
        fn_popLoadCompleted(option, fn_callback) ;
    }) ;
}

/* 단순 token존재여부와 유효기간만 판단함 */ 
var fn_isLogin = () => {
    var token = homes_comm.store.getItem("token") ; 
    if ( !!!token ) {
        message.alert("로그인이 필요합니다.") ; 
        return false ; 
    }

    var today   = new Date() ;
    var expdate = new Date(token.expiration) ; 
    
    if (( expdate - today ) < 0 ) {
        message.alert("로그인이 필요합니다.") ; 
        return false ; 
    }
    return true ;
}

/* 공통코드 조회 */
var fn_get_commcode = ( grpcd ) => {
    var commcode = {} ; 
    var grpcds = [] ; 
    if (!Array.isArray(grpcd)) grpcds.push(grpcd) ; 
    else grpcds = grpcd ;
    
    return new Promise((resolve, reject) => {
        homes_comm.network.post("/commcode/commCodeList", {
            "grpcds": grpcds
        }).then(response => {
            grpcd.forEach(gcd => {
                commcode[gcd] = [] ; 
                response.data
                .filter(code => (code.grpcd == gcd))
                .forEach(code => {
                    commcode[gcd].push(code) ;
                }) ; 
                resolve(commcode) ;
            }) ; 
        }) ; 
    }) ;
}

homes_comm.fn_get_ppscdList = ( param ) => {
    return new Promise(resolve => {
        homes_comm.network.get("/commcode/ppsList", {
        }).then(response => {
            resolve({"data": response.data}) ;
        }) ; 
    }) ;
} ;

homes_comm.fn_open_ppscode = ( param ) => {
    return new Promise(( resolve, reject ) => {
        var params = param || {
            "ppscd" : "",
            "buldgb": ""
        } ; 
        params.ppscd  = params["ppscd"] || "" ;
        params.buldgb = params["buldgb"] || "" ; 
        homes_comm.popup.pop_open("/estate/pop-ppscd.html", {
            "popid" : "pop_ppscd",
            "ppscd" : params.ppscd,
            "buldgb": params.buldgb
        }).then(result => {
            if ( result.action == "pop_data") {
                resolve({
                    "ppsList": result.pop_data.ppsList,
                    "ppscd"  : result.pop_data.ppscd 
                }) ; 
            }
        }) ;
    }) ;
}

/* 공통 help icon */ 
homes_comm.fn_set_comm_help = ( params ) => {
    var pgid = params["pgid"] ; /* 필수: 유입경로 */
    var help_data = params["data"] ; /* 필수: 필요데이터 */ 
    /*
    console.log("*** comm help pgid: " + pgid) ; 
    console.log("*** comm help data: " + help_data) ;
    */
}
homes_comm.fn_get_hppscd_List = ( params ) => {
    return new Promise(resolve => {
        var api_url = "/commcode/hppscd/" ; 
        if (typeof(params) == "string") {
            api_url = api_url + params ; 
        } else if ( typeof(params) == "object" ) {
            api_url = api_url + params.upHppscd ; 
        }
        homes_comm.network.get(api_url, {
        }).then(response => {
//            console.log("*** hppscd: ", response.data)
            resolve({data: response.data }) ; 
        }) ; 
    }) ; 
}


/* upper_cd로 공통코드 조회 */ 
var fn_get_upcode = ( upcd ) => {
    var commcode = {} ; 
    return new Promise((resolve, reject) => {
        homes_comm.network.get("/commcode/upcd/" + upcd, {
        }).then(response => {
            if ( !!response.data && response.data.length > 0) {
                var gcd = response.data[0].grpcd ; 
                commcode[gcd] = [] ; 
                response.data.forEach(code => {
                    commcode[gcd].push(code) ;
                })
                resolve({data: commcode}) ;
            } else {
                resolve({data:[]}) ; 
            }
        }) ; 
    }) ;
}

/* pop-footer Load */
var fn_pop_footer_Load = ( params ) => {
    var footer = params || { id: "pop_footer" } ; 
    footer["id"] = !!params["id"] ? params.id : "pop_footer" ; 
    var footer = $("#" + footer.id ) ; 
    return new Promise(resolve => {
        footer.load("/html/common/pop-footer.html", () => {
            resolve(true) ; 
        }) ;
    }) ; 
}

var homes = homes_comm ;
var homes_ui = homes_comm.ui ; 
var network  = homes_comm.network ; 
var popup    = homes_comm.popup ; 
var store    = homes_comm.store ; 
var message  = homes_comm.message ; 

var page = { pageid: "" } ; 

/* 글로벌 변수 선언 */ 
var _gv = {} ; 

// fn_isLogin() ;
/* event */
var fn_page_event = () => {
    var body = document.querySelector("body") ;
    body.addEventListener("click", function() {
        if ($("#btn_profile").find("button").hasClass("active")) {
            $("#btn_profile").click() ;
        }
    }) ;
}
