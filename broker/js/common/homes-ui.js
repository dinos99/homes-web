const homes_button = {} ; 
const homes_check = {
    fn_generate: ( cont, options ) => {
        var container = $("#" + cont) ; 
        container.empty() ;
        var id = options.id ; /* 필수 */  
        var chk_group   = options.chk_group ; /* 필수, 그룹구분코드(Type: Array), 필요없으면 1이라도 넣어라 */
        var check_List  = options.chk_List ; /* 필수 */ 
        var group_co  = chk_group.length ; 
        var dv_chk_root = $("<div class='' id='h_chk_root_" + id + "'/>") ; 
        chk_group.forEach(group => {
            var dv_group = $("<div class='' id='h_chk_group_" + id + "_" + group + "'/>") ; 
            var chk_cont = $("<div class='checkbox-container'/>") ; 
            check_List[group].forEach(cdata => {
                var checkbox = $("<input type='checkbox' id='h_chk_" + id + "_" + cdata.chkVal + "' class='custom-checkbox' />") ; 
                var is_checked  = cdata["checked"]  === true ; 
                var is_disabled = cdata["disabled"] === true ; 
                if ( is_checked ) {
                    checkbox.prop("checked", "checked") ; 
                }
                if ( is_disabled ) {
                    checkbox.prop("disabled", "disabled") ; 
                }
                chk_cont.append(checkbox) ; 
                var chkLabel = $("<label for='h_chk_" + id + "_" + cdata.chkVal + "' class='checkbox-label w-fixed-min-80' />") ; 
                chkLabel.append("<span class='checkbox-icon'/>") ; 
                chkLabel.append("<span class='checkbox-text'>" + cdata.label + "</span>") ;
                chk_cont.append(chkLabel) ; 

                checkbox.click(function() {
                    var _fn_callback = options["fn_callback"] ; 
                    if ( $.isFunction(_fn_callback)) {
                        var _data    = cdata.data ; 
                        _data.is_checked = $(this).is(":checked") ; 
                        _data.chkVal = cdata.chkVal ; 
                        _fn_callback.apply(null, [_data]) ;
                    }
                }) ; 
            }) ; 

            dv_group.append(chk_cont) ; 
            dv_chk_root.append(dv_group) ; 
        }) ; 

//        dv_chk_root.text("dv_chk_root") ; 
        container.append(dv_chk_root) ; 
    }
} ; 
homes_button.btn_radio = {
    fn_generate: ( cont, options ) => {
//        var container = document.querySelector("#" + cont) ; 
        var container = $("#" + cont) ; 
        container.empty() ;
        var id = options.id ; /* 필수 */  
        var dataList = options["dataList"] ; /* 필수 */ 
        var fn_callback = options["fn_callback"] ; 

        if ( !!!dataList || dataList.length == 0 ) return ; 
        var has_slide = options["has_slide"] === true &&  dataList.length > 8 ; 
        var selclass = !!options["selclass"] ? options.selclass : "btn-lime" ; 
        var btn_group = $("<div id='h_btn_radio_group_" + id + "' class='homes-button-group'/>") ; 
        var dv_slide = $("<div id='h_slide_" + id + "' class='homes-button-slide' />") ; 
        dataList.forEach( data => {
            var rownum = data.rn ; 
            var label = data.label ; 
            var button = $("<button type='button' id='btn_" + id + "_" + rownum + "' class='hs-button btn-white' />") ; 
            button.text(label) ; 
            if ( rownum > 8 && has_slide ) {
                dv_slide.append(button) ; 
                btn_group.append(dv_slide) ;                 
            } else {
                btn_group.append(button) ; 
            }
            button.click(function() {
                var _fn_callback = fn_callback ; 
                $("button[id^=btn_" + id).removeClass("btn-white").removeClass(selclass).addClass("btn-white") ; 
                $(this).removeClass("btn-white").addClass(selclass) ; 
                if ( $.isFunction(_fn_callback)) {
                    var _data    = data.data ; 
                    _data.rownum = rownum ; 
                    _data.label  = label;
                    _fn_callback.apply(null, [_data]) ;
                }
            }) ; 
        }) ; 
        var slide_arrow = $("<div class='btn-slide-arrow down'/>") ; 
        var arrow = $("<img src='/images/V.png' />") ; 

        if ( has_slide ) {
            slide_arrow.click(function() {
                var _slide   = $(this) ; 
                var _is_down = _slide.is(".down") ; 
                $("#h_slide_" + id).slideToggle(function() {
                    if (_is_down) {
                        _slide.removeClass("down").addClass("up") ; 
                    } else {
                        _slide.removeClass("up").addClass("down") ; 
                    }
                }) ; 
            }) ; 
            slide_arrow.append(arrow) ; 
            btn_group.append(slide_arrow) ; 
        }
        container.append(btn_group) ; 
        $("#h_slide_" + id).slideToggle() ; 
    }
    , fn_set_value: (id, rownum, options) => {
        $("#btn_" + id + "_" + rownum).click() ;
    }
    , fn_get_Label: (id, rownum) => {
        return $("#btn_" + id + "_" + rownum).text() ; 
    }
}
