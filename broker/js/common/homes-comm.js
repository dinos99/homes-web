const homes_comm = {
    constants: {
        _API_BASE_URL : "http://127.0.0.1"
        , _API_BASE_PORT: 8090
        , _API_VERSION: "v1"
        , _LOGIN_PAGE_URL: "/html/sign-in/sign-in.html"  
        , _LOGIN_AFTER_PAGE_URL: "/html/system/SYST00010001.html"
        , _KAKAO_LOGIN_REDIRECT_URL: "/html/auth/kakao_auth_redirect.html"
        /* 프리패스 페이지 */ 
        , _HOMES_PRO_BASE_DOMAIN: "http://127.0.0.1:8081"
        , _NO_AUTH_PAGES: [
            "/html/sign-in/sign-in.html" /* 로그인 페이지 */
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
    },
    validate: {
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
    }
    , message: {
        alert: ( message, options ) => {
            return new Promise(resolve => {
                var cont = $("<div id='pop_cont_alert' class='popup-container'/>") ; 
                $("body").append(cont) ; 
                var option = options || {} ;
                option.title = option["title"] || "&nbsp;" ; 
                option.message = message ; 
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
                option.title = option["title"] || "&nbsp;" ; 
                option.message = message ; 
                cont.load("/html/popup/popConfirm.html", (html) => {
                    $("#alert_title").html(option.title) ;
                    $("#alert_cont").html(option.message) ;
                    $(".btn-close").click(function() {
                        reject(true) ; 
                        $("#pop_cont_confirm").remove() ;
                    }) ;
                    $("#btn_cancel").click(function() {
                        reject(true) ; 
                        $("#pop_cont_confirm").remove() ;
                    }) ;
                    $("#btn_ok").click(function() {
                        resolve(true) ; 
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
                    homes_ui.progress(false) ; 
                    return response.json() ;
                }).then((response) => { 
                    homes_ui.progress(false) ; 
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
                
                console.log(def_option)

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
var fn_page_init = () => {
    const user = homes_comm.store.getItem("user") ; 
    /* 왜 그런지 모르겠는데 테마가 dark 에서 light로 자동바뀜(현재 로그인페이지만 그럼) */
    $("html").attr("data-bs-theme", "dark") ; 
    /* svg icon load */ 
//    homes.fn_Loadsvg() ;
    /* 상단 GNB 영역생성 */ 
    fn_create_gnb() ; 
    /* 좌측 LNB 영역 생성 */
    fn_create_lnb() ; 

    homes_comm.store.getArcodeList( user.arcode ) ;
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
    mcont.load("/html/popup/popAddress.html", () => {   
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

var homes = homes_comm ;
var homes_ui = homes.ui ; 
var network = homes.network ; 
var popup_ui = homes.ui.popup ; 
var store = homes.store ; 
var message = homes.message ; 
var popup = homes.popup ; 

var page = { pageid: "" } ; 

/* 글로벌 변수 선언 */ 
var _gv = {} ; 

// fn_isLogin() ;
/* event */
window.onload = () => {
    fn_page_onLoad() ;
}