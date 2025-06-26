/* document.ready 이후에 적용시킬것 */ 
var quillEditor = {
    def_option: {
        modules: {
            toolbar: [
                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'font': [] }],

                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],
                ['link', 'image', 'video'],

                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'align': [] }],
            ]
        }
        , placeHolder: "내용을 입력해 주세요"
    }
    , fn_set_option: opt => {
        var option = !!!opt ? quillEditor.def_option : opt ;
        option.modules         = opt["modules"] || quillEditor.def_option.modules ; 
        option.modules.toolbar = opt["modules"]["toolbar"] || quillEditor.def_option.modules.toolbar ; 
        option.placeHolder     = opt["placeHolder"] || quillEditor.def_option.placeHolder ; 

        return option ; 
    }
    /* page onLoad 이후에 호출할것 */ 
    , fn_get_editor: ( selector, opt ) => {
        var option = quillEditor.fn_set_option(opt) ; 
        const qEdit = new Quill(selector, {
            modules: {
                toolbar: option.modules.toolbar
            }
            , placeholder: option.placeHolder
            , theme: 'snow'
        });

        /* 삭제가능 ( 이미지, 동영상 아이콘이 마음에 안들어서 바꿨음 ) */ 
        /*
        $(".ql-image").empty() ;
        $(".ql-video").empty() ;
        $(".ql-image").append("<img src='/images/quill/file-earmark-image.svg' width='14' height='14'/>") ;
        $(".ql-video").append("<img src='/images/quill/caret-right-square.svg' width='14' height='14'/>") ;
        */
        return qEdit ;
    }
} ;

