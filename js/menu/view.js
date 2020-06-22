/*
 * Menu / View
 */

var piste;
var DEBUG;
var auto_adjust;

function ajuste_zoom()
{
    zoom1=$( "canvas" ).width() / (auto_adjust.max_x-auto_adjust.min_x);    
    piste.display.zoom*=Math.round(zoom1*9)/10;    
}

$( document ).ready(function() { 
    $("#menu_view_center_auto").on("click",function()
    {
        angle=piste.display.angle;
        piste.display.angle=0;
        ajuste_centre();
        piste.display.angle=angle;
        draw(piste);
    });
    $("#menu_view_zoom_auto").on("click",function()
    {
        ajuste_zoom();
        draw(piste);
    });
    $("#menu_view_zoom_in").on("click",function()
    {
        if (DEBUG) console.log("zoom in");
        piste.display.zoom+=0.05;
        draw(piste);
    });
    $("#menu_view_zoom_out").on("click",function()
    {
        if (DEBUG) console.log("zoom out");
        piste.display.zoom-=0.05;
        draw(piste);
    });    
    $("#menu_view_rotation_left").on("click",function()
    {
        piste.display.angle=piste.display.angle+15;
        draw(piste);

    });
    $("#menu_view_rotation_right").on("click",function()
    {
        piste.display.angle=piste.display.angle-15;
        draw(piste);

    });
    $("#menu_view_track_show").on("click",function()
    {
        show_track=!show_track;
        display_canvas();        
    });
    $("#menu_view_color_show").on("click",function()
    {
        show_color=!show_color;
        display_canvas();        
    }); 
});

