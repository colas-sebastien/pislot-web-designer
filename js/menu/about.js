$( document ).ready(function() { 
    /**** ABOUT **************************************************************/
    $('#menu_about').on('click',function() {
        $('#about_info').show();
    });

    /**** ABOUT MODAL ********************************************************/
    $('#about_ok').on('click',function() {
        $('#about_info').hide();
    });        
});