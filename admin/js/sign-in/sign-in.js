const fn_signin = () => {
    var email = $("#p_email").val() ;
    var pass = $("#p_password").val() ; 

    return new Promise((resolve) => {
        if ( !!!email || !homes.validation.fn_isValidemail(email) ) {
            homes.message.alert("이메일주소를 정확하게 입력해 주세요.", () => {
                $("#p_email").focus() ; 
                resolve(false) ; 
            }) ;
        } else if ( !!!pass ) {
            homes.message.alert("비밀번호를 입력해 주세요.", () => {
                $("#p_password").focus() ; 
                resolve(false) ; 
            }) ;
        } else {
            resolve(true) ; 
        }
    }).then((is_valid) => {
        if ( is_valid ) {
            fn_homes_signin({
                "email": $("#p_email").val(),
                "password": $("#p_password").val() ,
                "is_remember": $("chk_remember_me").is(":checked") ? "Y" : "N"
            }, (response) => {
                /* 로그인 후 메인페이지로 이동 */ 
//                location.href = "/html/main.html"
                location.href = homes_comm.constants._LOGIN_AFTER_PAGE_URL; 
            }) ; 
        }
    }) ; 


}


var fn_page_onLoad = () => {
    homes_comm.store.clear() ;
    $("#btn_signin").click(function() {
        fn_signin() ;
    }) ; 

    $("#btn_signup").click(function() {
        location.href = "/html/sign-in/sign-up.html" ;
    }) ;
}
 