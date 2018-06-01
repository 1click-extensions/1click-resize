$(function(){
    function refreshSizes(newSize){
        newSize = newSize ? newSize :'none';
        chrome.runtime.sendMessage({action: "getSizes"},
            function (response) {
                //console.log(response);
                $('select option.not-default').remove();
                for(let size of response){
                      $('.sizes').append('<option value="' + size.size + '" ' + ( size.name.indexOf('custom') > -1 ? 'class="custom"' : '') + '>' + size.name + '</option>')  
                }
                $('select').val(newSize);

        });
    }

    function checkSizes(){
        let width = $('#width').val(),
            height = $('#height').val(),
            justDigits = /^\d+$/,
            valid = width && justDigits.test(width) && (!height || justDigits.test(height));
        if(!valid){
            alert(chrome.i18n.getMessage('alert_custom'));
        }
        return valid;
    }
    $('select option.default').text(chrome.i18n.getMessage('select_label'));
    refreshSizes();
    $('select').change(function(){
        setTimeout(function(){
            console.log();
        });
        // let opt = $(this)[0].options[ $(this).val()] ;
        if($('select :selected').text().indexOf('custom') > -1){
            $('.remove').removeAttr('disabled');
        }
        else{
            $('.remove').attr('disabled', 'disabled');
        }
    });
    $('.custom').text(chrome.i18n.getMessage('custom_title'));
    $('.resize').text(chrome.i18n.getMessage('resize'));
    $('#width').attr('placeholder', chrome.i18n.getMessage('width'));
    $('#height').attr('placeholder', chrome.i18n.getMessage('height'));
    $('.custom-action-resize').text(chrome.i18n.getMessage('resize'));
    $('.custom-action-save').text(chrome.i18n.getMessage('save'));
    $('.resize').click(function(){
        chrome.runtime.sendMessage({action: "resize",size: $('.sizes').val()});
    });
    $('.remove').click(function(){
        chrome.runtime.sendMessage({action: "removeSize",size: $('.sizes').val() }, {}, refreshSizes);
    });
    $('.custom-action-resize').click(function(){
        if(checkSizes()){
            chrome.runtime.sendMessage({action: "resize",size: $('#width').val() + ' x ' + $('#height').val()});
        }
    });
     $('.custom-action-save').click(function(){
        if(checkSizes()){
            let newSize = $('#width').val() + ' x ' + $('#height').val();
            chrome.runtime.sendMessage({action: "addSize",size: newSize}, {}, function(){
                refreshSizes(newSize)
            });
        }
    });
});
