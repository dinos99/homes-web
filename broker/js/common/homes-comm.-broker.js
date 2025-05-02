const homes_comm = {
    constants: {
        _API_BASE_URL : "http://127.0.0.1"
        , _API_BASE_PORT: 8090
        , _API_VERSION: "v1"
        /* 프리패스 페이지 */ 
        , _NO_AUTH_PAGES: [
            "/html/sign-in/sign-in.html" /* 로그인 페이지 */
        ]
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
    
            token.expiration = token.expdt ; 
            token.issuedAt = token.issdt ; 
    
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
            homes_comm.store.setItem("user", user) ; 
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
            var item_id = $("#" + options.item_id) ; 
            debugger ;
            item_id.removeClass("hidden") ; 
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
        , popup: {
            pop_stack: []
            , pop_data: {}
            , param_data: {}
            , pop_open: ( pop_id, option ) => {
                return new Promise((resolve, reject) => {
                    $("body").append("<div class='dimmed'/>") ; 

                    /* title-bar 생성 */ 
                    var pop_dimmed = $(`<div class='homes-popup-modal bg-primary' id='dimmed_${pop_id}'>`) ; 
                    var pop_title_arear = $("<div class='homes-popup-title-wrap'></div>")

                    var pop_title = $(`<div class='homes-popup-title'></div>`) ;

                    var pop_title_div = $(`<div id='${pop_id}_title' class='homes-popup-title-text'></div>`) ; 
                    var pop_btn_div = $(`<div class='homes-popup-title-button'></div>`)

                    var pop_button = $(`<button id='btn_popup_close_${pop_id}' class='btn btn-secondary rounded-circle p-2 lh-1' type='button'></button>`) ; 
                    pop_button.append(`<svg class="bi" width="16" height="16" aria-hidden="true"><use xlink:href="#x-lg"></use></svg>`) ; 
                    pop_button.append(`<span class="visually-hidden">Dismiss</span>`) ; 
                    pop_btn_div.append(pop_button) ;

                    var pop_hidden = $(`<button type='button' id='pop_hddn_${pop_id}' class='pop_hidden_button'>popClose</div>`) ; 
                    pop_btn_div.append(pop_hidden) ;

                    var options = {
                        "pop_id" : pop_id
                        , "pop_title": "&nbsp;" 
                        , "pop_width": 400 
                        , "pop_height": 300
                        , "param_data": {}
                    }

                    if (!! option && !!option["pop_title"]) options.pop_title = option.pop_title ; 
                    if (!! option && !!option["pop_width"]) options.pop_width = option.pop_width ; 
                    if (!! option && !!option["pop_height"]) options.pop_height = option.pop_height ; 

                    if (!!option && !!option["pop_url"]) options.pop_url = option.pop_url ; 

                    options.param_data = option["param_data"] || {} ; 

                    pop_dimmed.css("width", options.pop_width + "px") ;

                    var pop_cont = $(`<div id='${pop_id}_cont' class='homes-popup-cont'></div>`) ; 

                    pop_cont.load(options.pop_url, {}, () => {
                        popup_start() ; 
                    }) ; 


                    var pop_width = pop_dimmed.width() ; 
                    pop_title_div.css("width", Number(pop_width - 90) + "px") ; 

                    pop_title_div.html(options.pop_title) ; 

                    pop_title.append(pop_title_div) ;
                    pop_title.append(pop_btn_div) ;
                    pop_title_arear.append(pop_title) ; 
                    pop_dimmed.append(pop_title_arear) ; 
                    pop_dimmed.append(pop_cont) ; 

                    pop_x = ($(".dimmed").width() - options.pop_width) / 2; 
                    pop_h = ($(".dimmed").height() - 50 - options.pop_height) / 2; 
                    
                    pop_dimmed.css("top", pop_h + "px") ; 
                    pop_dimmed.css("left", pop_x + "px") ; 
                    $("body").append(pop_dimmed) ; 

                    var pop_data = homes_comm.ui.popup.pop_data[pop_id] ;
                    
                    homes_comm.ui.popup.pop_stack.push(pop_id) ; 
//                    homes_comm.ui.popup.pop_data[pop_id] = {} ; 
                    homes_comm.ui.popup.param_data[pop_id] = options.param_data ; 

                    pop_button.click(() => {
                        $(".dimmed").remove() ;
                        $(".homes-popup-modal").remove() ; 
                        var arr_index = homes_comm.ui.popup.pop_stack.indexOf(pop_id) ; 
                        var pop_data  = homes_comm.ui.popup.pop_data[pop_id] ;
                        if ( arr_index >= 0) {
                            homes_comm.ui.popup.pop_stack.splice(arr_index, 1) ; 
                            delete homes_comm.ui.popup.pop_data[pop_id] ; 
                            delete homes_comm.ui.popup.param_data[pop_id] ; 
                            delete homes_comm.ui.popup.pop_data[pop_id] ; ; 
                        }
                        resolve({
                            "pop_id": pop_id,
                            "pop_data": pop_data
                        }) ;
                    }) ; 

                    pop_hidden.click(function() {
                        $(".dimmed").remove() ;
                        $(".homes-popup-modal").remove() ; 
                        var arr_index = homes_comm.ui.popup.pop_stack.indexOf(pop_id) ; 
                        var pop_data  = homes_comm.ui.popup.pop_data[pop_id] ;
                        if ( arr_index >= 0) {
                            homes_comm.ui.popup.pop_stack.splice(arr_index, 1) ; 
                            delete homes_comm.ui.popup.pop_data[pop_id] ; 
                            delete homes_comm.ui.popup.param_data[pop_id] ; 
                            delete homes_comm.ui.popup.pop_data[pop_id] ; ; 
                        }
                        resolve({
                            "pop_id": pop_id,
                            "pop_data": pop_data
                        }) ;
                    })
                })
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
        }
        /* option setting */ 
        var options = option || def_options ; 
        options.pop_id = option["pop_id"] || def_options.pop_id ; 
        options.arcode = option["arcode"] || def_options.arcode ; 


        var dimmed = $("<div class='dimmed'/>") ; 
        var cont = $("<div class='pop-container'/>") ;
        
        cont.load("/html/popup/search-area.html", () => {
            debugger ;
            $("#select_sido").click(function() {
                homes_ui.create_select({
                    item_id: "options_sido"
                }) ;
            }) ; 
        }) ; 

        $("body").append(cont)
        $("body").append(dimmed) ;

        dimmed.show() ;
    }
}


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

var fn_comm_search = (path, params, fn_callback) => {
    homes_comm.ui.progress(true, () => {
        homes_comm.network.send(path, params, fn_callback) ; 
    }) ; 
} 

var homes = homes_comm ;
var homes_ui = homes_comm.ui ; 
var network = homes_comm.network ; 
var popup_ui = homes_comm.ui.popup ; 
var store = homes_comm.store ; 
var homes_message = homes.message ; 
