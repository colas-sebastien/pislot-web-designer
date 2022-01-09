/*
 * Menu / File
 */
var reservedStorageWords=['key','getItem','setItem','removeItem','clear','length'];
var reservedPrefix='model_';

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) { 
                console.log('e readAsText = ', e);
                console.log('e readAsText target = ', e.target);
                try {
                    piste = JSON.parse(e.target.result);
                    draw(piste);
                    document.getElementById('file_import').style.display='none';
                } catch (ex) {
                    alert('ex when trying to parse json = ' + ex);
                }
            };
        })(f);
        reader.readAsText(f);
    }
}

$( document ).ready(function() { 

    /**** NEW *****************************************************************/
    $("#menu_file_new").on("click",function()
    {
        $("#file_new_trackname").val("");
        $('#file_new').show();
    });

    $("#file_new_ok").on("click",function()
    {
        track_name=$("#file_new_trackname").val();
        if(track_name.length>0)
        {
            $('#file_new').hide();
            piste={
                "name":track_name,
                "code":"",
                "display":{"x":0,"y":0,"angle":0,"zoom":0.5}
            };
            $("#track_code").val(piste.code);
            draw(piste);
        }        
    });
    
    /**** OPEN ****************************************************************/
    $("#menu_file_open").on("click",function()
    {
        var html="";
        for (var key in localStorage)
            if(!reservedStorageWords.includes(key))
                if (!key.startsWith(reservedPrefix))
                    html+='<p><input class="w3-radio" type="radio" name="track" value="'+key+'"><label> '+key+'</label></p>';
        $("#file_open_list").html(html);
        document.getElementById('file_open').style.display='block';
    });

    $("#file_load_ok").on("click",function()
    {
        var track_name=$("input[name=track]:checked","#file_open_list").val();
        if (track_name!==undefined)
        {
            piste=JSON.parse(localStorage.getItem(track_name));
            document.getElementById('file_open').style.display='none';
            draw(piste);
        }
    });

    /**** SAVE ****************************************************************/
    $("#menu_file_save").on("click",function()
    {
        localStorage.setItem(piste.name, JSON.stringify(piste));
    });
    
    /**** SAVE AS ... *********************************************************/
    //$("#menu_file_save_as").hide();

    /**** SAVE AS ... *********************************************************/
    //$("#menu_rename_as").hide();    
    
    /**** DELETE **************************************************************/
    $("#menu_file_delete").on("click",function()
    {
        localStorage.removeItem($('#track_name').val());
        $('#track_name').val('');
        piste={
            "name":"",
            "code":"",
            "display":{"x":0,"y":0,"angle":0,"zoom":0.5}
        };
        $("#track_code").val(piste.code);
        draw(piste);        
    });
    
    /**** IMPORT **************************************************************/
    $("#menu_file_import").on("click",function()
    {
        document.getElementById('file_import').style.display='block';
    });    
    
    $("#files").on("change",handleFileSelect);
    
    /**** EXPORT **************************************************************/
    $("#menu_file_export").on("click",function()
    {
        downloadObjectAsJson(piste,piste.nom);        
    });    
});