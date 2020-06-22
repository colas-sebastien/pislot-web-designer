/* 
 * Author: Sébastien Colas
 */

/* TODO LIST:
 *   
 *  
 */

var DEBUG=true;
var auto_adjust={};
var lang;
var PiecesGo=[]; 
var index_top=3;
var index_highligth=4;
var index_couleur=5;
var highligth_color='#ff00ea';
var show_track=true;
var show_color=true;
var reg_ex_array=[/(.{0})/,/(.{1})/,/(.{2})/,/(.{3})/];
var taille_code=0;
var piste={ };



$.fn.selectRange = function(start, end) {
    var e = document.getElementById($(this).attr('id')); // I don't know why... but $(this) don't want to work today :-/
    if (!e) return;
    else if (e.setSelectionRange) { e.focus(); e.setSelectionRange(start, end); } /* WebKit */ 
    else if (e.createTextRange) { var range = e.createTextRange(); range.collapse(true); range.moveEnd('character', end); range.moveStart('character', start); range.select(); } /* IE */
    else if (e.selectionStart) { e.selectionStart = start; e.selectionEnd = end; }
};


function display_canvas()
{
    $('canvas').setLayerGroup('color', { visible: show_color });    
    $('canvas').setLayerGroup('track', { visible: show_track });
    $('canvas').drawLayers();
}

function nomPiece(element)
{
    return element.nom===this.nom;
}

function encadre(coord,cadre)
{
    if (cadre.min_x===undefined)
    {
        cadre={min_x:coord.x,max_x:coord.x,min_y:coord.y,max_y:coord.y};        
    }
    else
    {
        cadre.min_x=cadre.min_x<coord.x?cadre.min_x:coord.x;
        cadre.max_x=cadre.max_x>coord.x?cadre.max_x:coord.x;
        cadre.min_y=cadre.min_y<coord.y?cadre.min_y:coord.y;
        cadre.max_y=cadre.max_y>coord.y?cadre.max_y:coord.y;
    }
    return cadre;
}

function ajuste_centre()
{
    piste.display.x += $( "canvas" ).width() /2-(auto_adjust.max_x-auto_adjust.min_x)/2-auto_adjust.min_x;
    piste.display.y += $( "canvas" ).height()/2-(auto_adjust.max_y-auto_adjust.min_y)/2-auto_adjust.min_y;         
}

function ajust_canvas()
{
    width   = Math.ceil($('#canvas_location').width()/10)*10;
    height  = Math.ceil($('#canvas_location').height()/10)*10;
    html   = '<canvas id="canvas" width="'+width+'" height="'+height+'" ></canvas>';
    $('#canvas_location').html(html);
}

function draw(track,highlight)
{   
    if (DEBUG) console.log(JSON.stringify(track));
    
    if (! track.hasOwnProperty("display"))
    {
        track.display={
            "x": 200,
            "y": 200,
            "angle": 0,
            "zoom": 0.5
        }
    }
    
    $("#track_name").val(track.name);
    $("#track_code").val(track.code);
    
    scale=track.display.zoom;
    
    var trace=[];
    trace.push({"x":track.display.x,
                "y":track.display.y,
                "angle":track.display.angle});
    
    $('canvas').removeLayers();
    $('canvas').clearCanvas();
    $("#track_code").css("background-color","white");

    var reg_ex = reg_ex_array[taille_code];       
    var layer=0;
    var changement_voie=0;
    var length={"left":0,"right":0};
    splits=track.code.split(reg_ex);
    auto_adjust={};
    $('#track_components').html('');
    for (var piece in splits)
    {
        if (splits[piece] === "[[[") layer;
        else
        if (splits[piece] === "]]]") layer;
        else            
        if (splits[piece] !== "")
        {
            var recherche={"nom":splits[piece]};            
            var infosPiece=PiecesGo.find(nomPiece,recherche);
            
            if (infosPiece===undefined)
            {
                $("#track_code").css("background-color","red");
                if (DEBUG) console.log("Not found: "+splits[piece]);
                return;    
            }
            
            var dimension= {
                "x":infosPiece.sortie.x-infosPiece.entree.x,
                "y":infosPiece.sortie.y-infosPiece.entree.y,
                "angle":infosPiece.sortie.angle
            };
            
            coord=trace[trace.length-1];
            angle=rad(coord.angle);                               
                
            new_coord=
                {
                    "x":coord.x+Math.round(scale*(dimension.x*Math.cos(angle)-dimension.y*Math.sin(angle))),
                    "y":coord.y+Math.round(scale*(dimension.x*Math.sin(angle)+dimension.y*Math.cos(angle))),
                    "angle":coord.angle+dimension.angle
                };

            display=
                {
                    "x":coord.x+scale*((infosPiece.image.largeur/2-infosPiece.entree.x)*Math.cos(angle)-(infosPiece.image.hauteur/2-infosPiece.entree.y)*Math.sin(angle)),
                    "y":coord.y+scale*((infosPiece.image.largeur/2-infosPiece.entree.x)*Math.sin(angle)+(infosPiece.image.hauteur/2-infosPiece.entree.y)*Math.cos(angle)),
                    "angle":coord.angle
                };                
            
            trace.push(new_coord);
            
            var dispay_infos={
                groups: ['track','drag'],
                dragGroups: ['drag'],
                type: 'image',
                source: infosPiece.image.dessous,
                x: display.x, y: display.y,
                rotate:display.angle+infosPiece.image.rotation,
                index: layer,
                draggable: true,                
                scaleX:scale,
                scaleY:scale,                                          
                
                dragstart: function(layer) {
                    layer.drag_x=layer.x;
                    layer.drag_y=layer.y;
                },
                dragstop: function(layer) {
                    track.display.x+=Math.round(layer.x-layer.drag_x);
                    track.display.y+=Math.round(layer.y-layer.drag_y);
                    //draw(track);
                }                                    
            };
            
            if (highlight === ("c"+piece))
            {
                dispay_infos.shadowColor=highligth_color;
                dispay_infos.shadowBlur=30;
                dispay_infos.index=index_highligth;
            }
            
            $('canvas').addLayer(dispay_infos);

            if (infosPiece.image.dessus)
            {
                dispay_infos.source=infosPiece.image.dessus;
                dispay_infos.index=index_top;
                $('canvas').addLayer(dispay_infos);
            }                        
            
            if(changement_voie%2===0)
            {
                if (infosPiece.image.couleur1)
                {
                    dispay_infos.groups=['color','drag'];
                    dispay_infos.source=infosPiece.image.couleur1;
                    dispay_infos.index=index_couleur;
                    $('canvas').addLayer(dispay_infos);
                }
                length.left+=infosPiece.longueur.gauche;
                length.right+=infosPiece.longueur.droite;
            }
            else
            {                
                if (infosPiece.image.couleur2)
                {
                    dispay_infos.groups=['color','drag'];
                    dispay_infos.source=infosPiece.image.couleur2;
                    dispay_infos.index=index_couleur;
                    $('canvas').addLayer(dispay_infos);
                }
                length.left+=infosPiece.longueur.droite;
                length.right+=infosPiece.longueur.gauche;                
            }
                        
            if (infosPiece.changement) changement_voie++;
            auto_adjust=encadre(new_coord,auto_adjust);
            $('#track_components').append('<li  id="c'+piece+'">'+infosPiece.description[lang]+'</li>');
            $('#c'+piece).hover(function()
            {                 
                draw(track,this.id);
                $("#"+this.id ).addClass("highlight");
                var pos=(parseInt(this.id.substr(1))-1)/2*taille_code;
                $("#track_code").selectRange(pos, pos+taille_code);
            });
        }
    }     
    $('#length_red').val(length.left);
    $('#length_blue').val(length.right);
    display_canvas();
}

function load_parts()
{
    var model="models/"+getUrlParameter("model")+"/";
    
    if (DEBUG) console.log("getting parts infos remotely");
    $.getJSON( model+"parts.json", function( data ) {
        
        var local_parts=localStorage.getItem("model_"+data.name);
        
        if (local_parts===null)
        {
            if (DEBUG) console.log("Using remote parts (no local parts)");
            localStorage.setItem("model_"+data.name,JSON.stringify(data));
            PiecesGo=data.parts;
            taille_code=data.code_size;
        }
        else
        {
            var PiecesGoInfos=JSON.parse(local_parts);
            
            if(PiecesGoInfos.timestamp<data.timestamp)
            {
                if (DEBUG) console.log("Using remote parts (remote parts are newer)");
                localStorage.setItem("model_"+data.name,JSON.stringify(data));
                PiecesGo=data.parts;
                taille_code=data.code_size;
            }
            else
            {
                if (DEBUG) console.log("Using local parts (local parts are newer)");
                PiecesGo=PiecesGoInfos.parts;
                taille_code=PiecesGoInfos.code_size;
            }                                                
        }
        draw(piste);
    });    
}
    


$( document ).ready(function() {        
    /***** Dynamic creation of the canvas ***/    
    ajust_canvas();
    
    $( window ).resize(function() {
        ajust_canvas();
        draw(piste);
    });
    
    $("#track_code").val(piste.code);
    $("#track_name").val(piste.name);
      
    $("#track_code").on("keyup",function(event)
    { 
      if ($(this).val().length%taille_code===0)
      {
        piste.code=$(this).val();
        draw(piste);
      }
    });
       
   $("#canvas").mousewheel(function(event) {        
        piste.display.zoom+=(event.deltaY/20);
        draw(piste);
    });
    
    load_parts();    
    
});







