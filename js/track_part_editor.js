/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var PiecesGoInfos;
var piece_courante=0;
var PiecesGo=[]; 
var DEBUG=true;
var highligth_color='#ff00ea';
var couleur_entree='lightgreen';
var couleur_sortie='lightgreen';
var centre_canvas={"x":250,"y":250};

function change_field()
{
    var value;
    var infos=this.id.split("_");
    // n    => number (integer) 
    // else => string
    if (infos[0]==="n")
        value=parseInt($(this).val());
    else
        value=$(this).val();
    PiecesGo[piece_courante][infos[1]][infos[2]]=value;
    
    // Need to update display ?
    if (["image","entree","sortie"].indexOf(infos[1])!==-1) display_canvas();        
}

function change_type()
{
    PiecesGo[piece_courante].type=$(this).val();
}

function change_category()
{
    PiecesGo[piece_courante].category=$(this).val();
}

function change_surface()
{
    var selected = [];
    $('input:checkbox[name=surface]:checked').each(function() {
        selected.push($(this).attr('value'));
    });    
    PiecesGo[piece_courante].surface=selected;
}

function change_changement_voie()
{
    PiecesGo[piece_courante].changement=$(this).is(":checked");        
}

function display_info()
{   
    piece_courante=this.id;

    // Values for numbers
    $('[id^=n_],[id^=s_]').each(function(){        
        var id_name=this.id;
        var infos=id_name.split("_");
        if (infos[0]==='n') $(this).val(0);
        else                $(this).val("");
        switch (infos.length)
        {
            case 2:
                if (PiecesGo[piece_courante][infos[1]]) $(this).val(PiecesGo[piece_courante][infos[1]]);
                break;
            case 3:
                if (PiecesGo[piece_courante][infos[1]][infos[2]]) $(this).val(PiecesGo[piece_courante][infos[1]][infos[2]]);
                break;
        }
        $(this).on('input',change_field);
    });            
    
    $("input:radio,input:checkbox").prop('checked', false);            
    
    $("input:radio[name=Type]").filter('[value="'+PiecesGo[this.id].type+'"]').prop('checked', true);
    if (PiecesGo[this.id].category)
    {
        $("input:radio[name=Category]").filter('[value="'+PiecesGo[this.id].category+'"]').prop('checked', true);
    }        
    else
    {
        $("input:radio[name=Category]").filter('[value="straight"]').prop('checked', true);
    }        
    for (var surface in PiecesGo[this.id].surface)
        $("input:checkbox[name=surface]").filter('[value="'+PiecesGo[this.id].surface[surface]+'"]').prop('checked', true);    

    if(PiecesGo[this.id].changement) $("input:checkbox[name=changement_voie]").prop('checked', true);

    $("input:radio[name=Type]").change(change_type);
    $("input:radio[name=Category]").change(change_category);
    $("input:checkbox[name=surface]").change(change_surface);
    $("input:checkbox[name=changement_voie]").change(change_changement_voie);
    

    $("#dessous,#dessus,#p1").prop('checked', true);
    $("#dessous,#dessus,#p1,#p2").change(function(){
        $('canvas').setLayerGroup(this.id, { visible: this.checked });    
        $('canvas').drawLayers();
    });        
    
    display_canvas();
}

function display_canvas()
{
    var infosPiece=PiecesGo[piece_courante];
    
    $('canvas').removeLayers();
    $('canvas').clearCanvas();
    
    // Bordure pour l'image
    $('canvas').addLayer({
      type: 'rectangle',
      strokeStyle: highligth_color,
      strokeWidth: 4,  
      x: centre_canvas.x, y: centre_canvas.y,
      width: infosPiece.image.largeur, 
      height: infosPiece.image.hauteur
    });
    
    // Image de fond
    var dispay_infos={
        groups: ['dessous'],
        type: 'image',
        source: infosPiece.image.dessous,
        x: centre_canvas.x, y: centre_canvas.y,
        rotate:infosPiece.image.rotation,
        index: 1                                                                   
    };
    $('canvas').addLayer(dispay_infos);
    
    if (infosPiece.image.dessus)
    {
        dispay_infos.groups=['dessus'];
        dispay_infos.source=infosPiece.image.dessus;
        dispay_infos.index=2;
        $('canvas').addLayer(dispay_infos);
    }
    
    if (infosPiece.image.couleur1)
    {
        dispay_infos.groups=['p1'];
        dispay_infos.source=infosPiece.image.couleur1;
        dispay_infos.index=3;
        $('canvas').addLayer(dispay_infos);
    }
    
    if (infosPiece.image.couleur2)
    {
        dispay_infos.groups=['p2'];
        dispay_infos.source=infosPiece.image.couleur2;
        dispay_infos.index=4;
        dispay_infos.visible=false;
        $('canvas').addLayer(dispay_infos);
    }
           
    var origine={   "x":centre_canvas.x-infosPiece.image.largeur/2,
                    "y":centre_canvas.y-infosPiece.image.hauteur/2};    
    // Entree    
    $('canvas').addLayer({
      type: 'line',
      strokeStyle: couleur_entree,
      strokeWidth: 3,      
      x1: origine.x  +infosPiece.entree.x, y1: origine.y+infosPiece.entree.y-2,
      x2: origine.x+5+infosPiece.entree.x, y2: origine.y+infosPiece.entree.y,
      x3: origine.x  +infosPiece.entree.x, y3: origine.y+infosPiece.entree.y+2,
      closed: true      
    });    
    
    // Sortie
    var angle=rad(infosPiece.sortie.angle);
    $('canvas').addLayer({
      type: 'line',
      strokeStyle: couleur_sortie,
      strokeWidth: 3,      
      x1: origine.x  +infosPiece.sortie.x - Math.sin(angle)*(-2), 
      y1: origine.y+infosPiece.sortie.y   + Math.cos(angle)*(-2),
      x2: origine.x  +infosPiece.sortie.x + Math.cos(angle)*5 , 
      y2: origine.y+infosPiece.sortie.y   + Math.sin(angle)*5 ,
      x3: origine.x  +infosPiece.sortie.x - Math.sin(angle)*( 2), 
      y3: origine.y+infosPiece.sortie.y   + Math.cos(angle)*( 2),
      closed: true      
    });    
    
    for (var positions_x in infosPiece.geometry.positions)
    {
        for (var positions_y in infosPiece.geometry.positions[positions_x])
        {
            $('canvas').addLayer({
              type: 'arc',
              fillStyle: highligth_color,
              x: origine.x + infosPiece.geometry.positions[positions_x][positions_y].x, 
              y: origine.y + infosPiece.geometry.positions[positions_x][positions_y].y,
              radius: 3,
              start: 0, end: 360
            });            
        }
    }
            
    $('canvas').drawLayers();  
}

function display_track_list()
{
    for (var piece in PiecesGo)
    {
        $('#track_list').append('<li id="'+piece+'">'+PiecesGo[piece].nom+'</li>');
        $('#'+piece).click(display_info);
    }
}

$( document ).ready(function() { 
    
    var test_pieces=localStorage.getItem("model_"+getUrlParameter("model"));
    if (test_pieces!==null)
    {
        if (DEBUG) console.log("getting tracks infos locally");
        PiecesGoInfos=JSON.parse(test_pieces);
        PiecesGo=PiecesGoInfos.parts;
        display_track_list();
    }
    else alert("Tracks not found");    
    
    $("#new_track").on("click",function()
    {
        $("#new_trackname").val("");
        $("#error").hide();
        document.getElementById('file_new').style.display='block';
    });
    
    $("#file_new_ok").on("click",function(){
        var name=$('#new_trackname').val();
        if (name.length!==3)
            $("#error").show();
        else
        {
            document.getElementById('file_new').style.display='none';
            PiecesGo.push({
                    "name": name,
                    "description": { "fr": "", "en": "" },                
                    "type": "GO",
                    "surface": ["asphalte"],
                    "longueur": { "gauche": 0, "droite": 0 },
                    "image": {  "dessous": "", "couleur1": "",
                                "largeur": 0, "hauteur": 0, "rotation": 0 },
                    "entree": { "x": 0, "y": 0 },
                    "sortie": { "x": 0, "y": 0, "angle": 0 }
                    });                    
            $('#track_list').html("");            
            PiecesGo.sort(function(a, b) { return a.name.localeCompare(b.name); });            
            display_track_list();
        }
    });

});

