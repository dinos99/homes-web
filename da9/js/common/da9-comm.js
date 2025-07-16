const w_set = [
    { icon: "", text: "" },
    { icon: "bi-sun-fill", text: "햇볕은 쨍쨍" },
    { icon: "bi-cloud-sun-fill", text: "구름 조금" },
    { icon: "bi-cloudy-fill", text: "흐림" },
    { icon: "bi-clouds-fill", text: "곧 비올듯" },
    { icon: "bi-cloud-rain-fill", text: "어라? 비가 내리네?" },
    { icon: "bi-cloud-rain-heavy-fill", text: "비가 퍼붓는데?" },
    { icon: "bi-cloud-sleet-fill", text: "비도오고 눈도오고" },
    { icon: "bi-cloud-snow-fill" ,text: "눈이내린다!" }
] ;
const f_set = [
    { icon: "", text: "" },
    { icon: "bi-emoji-heart-eyes-fill", text: "" },
    { icon: "bi-emoji-grin-fill"      , text: "" },
    { icon: "bi-emoji-kiss-fill"      , text: "" },
    { icon: "bi-emoji-laughing-fill"  , text: "" },
    { icon: "bi-emoji-smile-fill"     , text: "" },
    { icon: "bi-emoji-sunglasses-fill", text: "" },
    { icon: "bi-emoji-neutral-fill"   , text: "" },
    { icon: "bi-emoji-surprise-fill"  , text: "" },
    { icon: "bi-emoji-tear-fill"      , text: "" },
    { icon: "bi-emoji-frown-fill"     , text: "" },
    { icon: "bi-emoji-astonished-fill", text: "" },
    { icon: "bi-emoji-dizzy-fill"     , text: "" },
    { icon: "bi-emoji-angry-fill"     , text: "" },
    { icon: "bi-emoji-grimace-fill"   , text: "" },
] ;

var da9const = {
    profile: "LOCAL",
    _LOGIN_PATH_: "/html/auth/sign-in.html",
    _LOGIN_AFTER_PATH_: "/html/diary/diary-List.html",
    "LOCAL": {
        API_BASE_URL: "http://127.0.0.1:8377"
    },
    "TEST" : {},
    "OPER" : {}
}
const da9message = {
    auth: { REQUIRED_LOGIN: "로그인이 필요합니다." },
    validator: { REQUIRED_INPUT: "필수 입력항목입니다." },
    NOT_FOUND_MESSAGE_ID: "존재하지 않는 메시지 ID입니다.",
    fn_get_message: (key, pre) => {
        if ( typeof key !== "string" ) {
            return da9message.NOT_FOUND_MESSAGE_ID ; 
        } 
        return pre + key ;
    }
}

const da9comm = {
    menu: {
        fn_create_header: menu => {
            var header = $("#d_header") ; 
            header.load("/html/common/header-top.html", () => {
                $("#btn_Logo").text("@Brother da-9") ;
                $("a[id^=nav_]").removeClass("active") ;
                $("a[id^=nav_]").removeAttr("aria-current") ;

                $("#nav_" + menu).addClass("active") ;
                $("#nav_" + menu).attr("aria-current", "page") ;

                $("#d_profile").click(function() {
                    $(".d-profile-menu").toggle() ;
                }) ;
            }) ; 
        }
    }, 
    store: {
        setItem: (key, code) => {
            localStorage.setItem(key, JSON.stringify(code))
        }
        , getItem: (key) => {
            return JSON.parse(localStorage.getItem(key)) ; 
        }
        , clearItem: (key, clearKey) => {
            var jsonObj = JSON.parse(localStorage.getItem(key)) ; 
            delete jsonObj[clearKey] ; 
            localStorage.setItem(key, JSON.stringify(jsonObj)) ; 
        }
        , clear: () => {
            localStorage.clear() ;
        }
        , init_token: (token, user) => {
            var rememberMe = da9comm.store.getItem("rememberMe") ; 
            da9comm.store.clear() ; 

            user.role = token.role ; 
            delete user.accessToken ;
            delete user.rememberMe ; 
            delete user.verifyCd ;
            delete user.verifyMsg ;

            delete token.userid;
            delete token.usernm;
            delete token.role ; 
            delete token.nick ; 
            delete token.email ; 
            delete token.refreshToken ; 
            delete token.rememberMe ;

            da9comm.store.setItem("token", token) ; 
            da9comm.store.setItem("user", user) ; 
            da9comm.store.setItem("rememberMe", rememberMe) ;
        }
        , getAccessToken: () => {
            var token = da9comm.store.getItem("token") || { "accessToken": "" }; 
            return token["accessToken"] || "" ; 
        }
        , getRefreshToken: () => {
            var token = da9comm.store.getItem("token") || { "refreshToken": "" }; 
            return token["refreshToken"] || "" ; 
        }
        , getUser: () => {
            return da9comm.store.getItem("user") ;
        }
        , getUserno: () => {
            var user = da9comm.store.getItem("user") ;
            return user.userno ;
        }
    },
    util: {        
        is_empty: ( data ) => { return !(!!data) ;  },
        is_not_empty: ( data ) => { return !da9comm.util.is_empty(data) ; },
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
    },
    validator: {
        is_Empty: (selector) => {
            var elmnt = $(selector) ; 
            if ( elmnt.length == 0) return false ; 
            var el = elmnt[0] ; 
            if ( el.nodeName == "INPUT" || el.nodeName == "SELECT" || el.nodeName == "PASSWORD") {
                var inVal = elmnt.val() ; 
                return !(!!inVal && inVal.length > 0)  ; 
            }
        }
    },
    network: {
        fn_get_base_url: () => {
            var protocol = location.protocol ;
            var host     = location.hostname ;
            var port     = location.port ; 

            var colone = ( port == "80" || port == "443" ) ? "" : ":" ;
            var url    = protocol + "//" + host + colone + port ;
            var profile = "LOCAL" ;

            return da9const[profile].API_BASE_URL ; 
        },
        post: (api_url, params, fn_callgack) => {
            var api_base_url = da9comm.network.fn_get_base_url() ; 
            var verify_url = "/api/v1/auth/verify-token"
            if ( api_url.indexOf("/api") === 0 || api_url.indexOf("/auth") === 0) {
                verify_url = api_base_url + verify_url ; 
            }
            return new Promise(resolve => {
                da9comm.ui.progress(true) ; 
                da9comm.network.send(verify_url, {
                    method: "POST",
                    is_auth: false
                }, {
                    accessToken: da9comm.store.getAccessToken()
                }).then(response => {
                    store.init_token(response.token, response.data) ; 
                    da9comm.network.send(api_url, {
                        method: "POST"
                    }, params).then(response => {
                        da9comm.ui.progress(false) ;
                        resolve(response.data) ; 
                    }) ; 
                }) ;
            }) ; 
        }, 
        send: (api_url, option, params, fn_callgack) => {
            return new Promise((resolve, reject) => {
                var def_option = {
                    "method"        : option["method"]      || "POST",
                    "mode"          : option["mode"]        || "cors", /* no-cors, cors, same-origin */
                    "cache"         : option["cache"]       || "no-cache", /* no-cache, reload, force-cache, only-if-cached */
                    "credentials"   : option["credentials"] || "same-origin", /* include, same-origin, omit */
                    "headers"       : option["headers"]     || {
                        "Content-Type": "application/json",
//                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    "referrerPolicy": option["referrerPolicy"] || "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    "body"          : option["body"]           || JSON.stringify(params), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야
                    "redirect"      : option["redirect"]       || "follow", /* follow, manual, error */
                }

                /* ****************************************************************
                 * is_auth가 명시적으로 false로 들어온 경우만 인증안함 
                 * - is_auth가 null이가나 'undefined'인경우 인증필요
                 * ****************************************************************/ 
                var is_auth = option["is_auth"] === false ? false : true  ;
                var param   = JSON.parse(def_option.body) ;
                param.refreshToken = da9comm.store.getRefreshToken() ;
                param.rememberMe   = da9comm.store.getItem("rememberMe") ;
                def_option.body = JSON.stringify(param) ;

                if ( is_auth ) {
                    def_option.headers["Authorization"] = "Bearer " + da9comm.store.getAccessToken() ;
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
                var api_base_url = da9comm.network.fn_get_base_url() ; 
                if ( api_url.indexOf("/api") === 0 || api_url.indexOf("/auth") === 0) {
                    api_url = api_base_url + api_url ; 
                }
                fetch( api_url, def_option).then( response => {
                    var httpSttus = response.status ;
                    if ( httpSttus == 404 ) {
                        return new Promise((resolve, reject) => {
                            reject({
                                httpSttusCd : response.status,
                                httpSttusText: "API Not Found",
                                errorMessage: `<p class='mb-2'>네트워크에러가 발생하였습니다.</p><p>네트워크 상태를 확인해 주세요` 
                            }) ;
                        }) ;
                    } 
                    return response.json() ; 
                }).then( response => {
                    if ( response.error.httpSttusCd == 200 ) {
                        resolve(response) ; 
                    } else {
                        return new Promise((resolve, reject) => {
                            reject(response.error) ; 
                        }) ;
                    }
                }).catch( e => {
                    var opt = {} ; 
                    if ( !!e["httpSttusCd"]) {
                        var status = e.httpSttusCd ; 
                        var statusText = e.httpSttusText ;
                        if ( !!!statusText ) {
                            statusText = "Bad Request" ;
                        }
                        opt = {
                            remove: true,
                            title: `[<span class='c-red'>HTTP-${status}</span>] ${statusText}`,
                            message: e.errorMessage
                        }
                        if ( status == 101 || status == 102 ) {
                            da9comm.alert(opt).then(ok => {
                                da9comm.store.clear() ;
                                location.href = da9const._LOGIN_PATH_ ;
                            }) ;
                        }
                    } else {
                        opt = {
                            remove: true,
                            title: `[<span class='c-red'>HTTP-400</span>] Bad Request`,
                            message: `<p class='mb-2'>잘못된 요청입니다.</p>`
                        }
                        da9comm.alert(opt).then(ok => { reject(e); }) ;
                    }
                })
            })
        }
    }, 
    ui: {
        datepicker: ( picker_id, button_id, option ) => {
            $( "#" + picker_id ).datepicker({
              dateFormat: "yy.mm.dd"
              , altFormat: "yy.mm.dd"
              , showMonthAfterYear: true
              , dayNames: [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일" ]
              , dayNamesMin: [ "일", "월", "화", "수", "목", "금", "토" ]
//              , dayNamesShort: [ "일", "월", "화", "수", "목", "금", "토" ]
              , monthNames: [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ]
              , monthNamesShot: [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ]
              , prevText: "이전월"
              , nextText: "다음월"
            });

            var picker = $("#" + picker_id) ; 
            var picker = $("#" + picker_id) ; 

            var def = option || {"default": "" }  ; 
            def.default = option["default"] || { "default": "" } ; 
            if ( def.default == "Today" ) {
                var today = da9comm.util.fn_get_today() ;
                picker.val(today) ;

            } else {
                picker.val(def.default) ;

                if ( !!button_id ) {
                    $( "#" + button_id ).click(function() {
                        picker.datepicker("show") ; 
                    }) ; 
                }

                /* 안되면 말고 */
                $("#ui-datepicker-div").addClass("border").addClass("shadow") ; 
            }
        },
        progress: ( bshow ) => {
            if ( bshow ) {
                $("#da9-progress").remove() ; 
                var div = $("<div class='progress-dimmed' id='da9-progress' />") ; 
                var progress = $("<div class='progress'/>") ;
                div.append(progress) ;
                $("body").append(div) ; 
                div.show() ; 
            } else {
                $(".progress-dimmed").fadeOut(300, function() {
                    $(".progress-dimmed").remove() ;
                }) ;
            }
        }
    },
    auth: {
        fn_checkLogin: () => {
            var accessToken = da9comm.store.getAccessToken() ; 
            if ( !!!accessToken ) {
                da9comm.auth.fn_goLogin() ;
                return false ; 
            }

            var is_remember = !!!store.getItem("rememberMe") ? "N" : "Y" ; 
            network.send("/api/v1/auth/verifyToken", {
                is_auth: false
            }, {
                accessToken: store.getAccessToken(),
                rememberMe : is_remember
            }).then(response => {
                var verifyCd  = response.data.verifyCd ;
                var verifyMsg = response.data.verifyMsg ; 

                if ( verifyCd != 100 && verifyCd != 200) {
                    da9comm.alert({
                        remove: true,
                        title: `[<span class='c-red'>ERROR-${verifyCd}</span>]토큰검증 실패`,
                        message: `<p class='mb-2'>${verifyMsg}</p>`
                    }).then(ok => { 
                        location.href = da9const._LOGIN_PATH_ ;
                    }) ;
                } else if ( verifyCd == 200 ) {
                    store.init_token(response.token, response.data) ; 
                }
            }) ;


        },
        fn_goLogin: () => { location.href = da9const._LOGIN_PATH_ ; }
    },
    alert: ( options ) => {
        var cont = $("<div/>") ; 
        cont.attr("id", "div_alert_cont") ;
        $("body").append(cont) ;
        return new Promise( resolve => {

            cont.load("/html/common/alert.html", () => {
                var alert = new bootstrap.Modal("#da9-alert", {
                    backdrop: 'static',
                    keyboard: false
                }) ;

                var is_remove = options["remove"] || false ;
                if ( is_remove ) {
                    $("#alert-title").empty() ;
                }

                var span_1 = $("<span/>") ;
                span_1.html((options["title"] || "")) ; 

                $("#alert-title").append(span_1) ;
                $("#alert-body").html( options["message"] || "" ) ;
                alert.show() ;

                $("#btn_alert_close").click(function() { alert.hide() ; }) ;
                $("#btn_conf_ok").click(function() { alert.hide() ; }) ;

                $("#da9-alert").on("hidden.bs.modal", function(e) {
                    resolve(true)
                    $("#div_alert_cont").remove() ;
                }) ;
            }) ;
        }) ;
    }
}

var fn_set_Layout = menu => {
    da9comm.menu.fn_create_header(menu) ;
} ; 

var fn_set_Event = selector => {
    /* height를 계산하여 scroll을 만든다 */ 
    var fh = $(".flex-shrink-0").height() ;
    var offset = 161 ;

    $("#cont_body").height(Number(fh - 161)) ;

    /* scroll moving event */
    $(selector).scroll(function() {
        /* 현재 스크롤 위치 얻기 */
        let sc_pos = $(this).scrollTop() ;
        if (sc_pos > 160) {
//            $("#sub_title").removeClass("shadow").addClass("shadow") ; 
        } else {
//            $("#sub_title").removeClass("shadow") ; 
        }
    }) ; 
}
var fn_init_page = ( menu, option ) => {
    /* Layout setup */
    fn_set_Layout(menu) ; 
    /* Event bind */
    fn_set_Event(option["sc_container"]) ;
    var is_auth = option["is_auth"] ; 
    if ( is_auth !== false ) {
//        da9comm.auth.fn_checkLogin() ;
    }
}

var da9 = da9comm ; 
var ui = da9comm.ui ;
var network = da9comm.network ;
var store = da9comm.store ;
var util = da9comm.util ;