/*
 * Menu / Tracks
 */

const prefix_track_list='track_list_';
var track_list=[];


function menu_list(event)
{
    type_piste=event.target.id;
    type_piste=underscore_to_space(type_piste.replace(prefix_track_list,""));
    var data=track_list;
    
    var html="";            

    for(var line in data)
        if (data[line].type===type_piste)
            html+='<p><input class="w3-radio" type="radio" name="track_official" value="'+line+'"><label> '+data[line].name+' '+(data[line].extra?data[line].extra:"")+'</label></p>';

    $("#library_open_list").html('<div id="library_open_list">'+html+'</div>');
       
    document.getElementById('library_open').style.display='block';        
}

$( document ).ready(function() { 

    var model="models/"+getUrlParameter("model")+"/";    
    if (DEBUG) console.log("getting tracks infos remotely");
    
    $.getJSON( model+"tracks.json", function( data ) {
        
        data.sort(function(a, b) {
            return (a.name + a.extra).localeCompare((b.name+b.extra));
        });      
        
        track_list=data;
        type_list=[];
        for (var item in data)
        {
            if (!type_list.includes(data[item].type))
            {
                var type=data[item].type;
                var id=prefix_track_list+space_to_underscore(type);
                type_list.push(type);
                $('#track_list').append('<li id="'+id+'" class="w3-bar-item w3-button">'+type+'</li>');
                $('#'+id).on("click",function(event) { menu_list(event); });
            }
        }                        
    });

    $("#track_load").on("click",function()
    {
        var track_name=$("input[name=track_official]:checked","#library_open_list").val();
        if (track_name!==undefined)
        {
            piste=track_list[track_name];
            $('#track_name').val(piste.name);
            
            document.getElementById('library_open').style.display='none';
            draw(piste);
        }
    });
    
});


