const homes_comm = {
    constants: {
        _API_BASE_URL : "http://127.0.0.1"
        , _API_BASE_PORT: 8081
        , _API_VERSION: "v1"
    },
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
    
            token.expiration = response.token.expdt ; 
            token.issuedAt = response.token.issdt ; 
    
            delete token.userNo ; 
            delete token.userNm ; 
            delete token.email ; 
            delete token.expdt ; 
            delete token.expdt ; 
    
            token["is_remember"] = user.is_remember ; 
            homes_comm.store.setItem("token", token) ; 
    
            user["is_remember"] = user.is_remember ; 
            delete user.expdt ; 
            delete user.issdt ; 
            delete user.issuedAt ; 
            delete user.expiration ; 
            homes_comm.store.setItem("user", data) ; 
        }
    },
    validation: {
        fn_isValidemail: (email) => {
            var regexp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i ; 
            return regexp.test(email) ;
        }
    }
    , message: {
        alert: ( message, fn_callback ) => {
            homes_comm._fn_create_modal( message )
            .then((data) => {
                if (fn_callback) {
                    fn_callback.apply() ;
                }
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
                })
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
var fn_page_init = () => {
    fn_slide_init() ; 
}


/* event */
window.onload = () => {
    /* 왜 그런지 모르겠는데 테마가 dark 에서 light로 자동바뀜(현재 로그인페이지만 그럼) */
    $("html").attr("data-bs-theme", "dark") ; 
    homes.fn_Loadsvg() ; 
    var token = homes_comm.store.getItem("token") ; 

    if ( !!token.accessToken) {
        /* token이 존재하면 토큰확인 */ 
        fn_verify_token(( response ) => {
            debugger ;
        }) ; 
    }
}
var fn_verify_token = (fn_callback) => {
    var token = homes_comm.store.getItem("token") 
    var is_remember = !!token["is_remember"] ? "Y" : "N" ; 
    homes.network.send("/auth/verifyToken", {
        "is_remember": is_remember
    }, (response) => {
        debugger ; 
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

var homes = homes_comm ;
var network = homes_comm.network ; 
var store = homes_comm.store ; 