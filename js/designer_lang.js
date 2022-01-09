about=
{
    name:       "PiSlot Web Designer",
    version:    "20.07.15 beta"
}

translation=
{
    "en": 
            {
                "#menu_file"                :"File",
                "#menu_file_new"            :"New",
                "#menu_file_open"           :"Open",
                "#menu_file_save"           :"Save",
                "#menu_file_save_as"        :"Save As ...",
                "#menu_rename_as"           :"Rename As ...",
                "#menu_file_delete"         :"Delete",
                "#menu_file_import"         :"Import",
                "#menu_file_export"         :"Export",
                                
                "#menu_view"                :"View",
                "#menu_view_auto"           :"Center Auto",
                "#menu_view_zoom_auto"      :"Zoom Auto",
                "#menu_view_zoom_in"        :"Zoom +",
                "#menu_view_zoom_out"       :"Zoom -",
                "#menu_view_rotation_left"  :"Rotation Clockwise",
                "#menu_view_rotation_right" :"Rotation Counter-Clockwise",
                "#menu_view_track_show"     :"Show/Hide Track",
                "#menu_view_color_show"     :"Show/Hide Color Track",
                
                "#menu_tracks"              :"Tracks",
                
                "#menu_tools"               :"Tools",

                "#menu_about"               :"About...",
                "#about_title"              :about.name,
                "#about_version"            :about.version                
            }
        ,
    "fr": 
            {
                "#menu_file"                :"Fichier",
                "#menu_file_new"            :"Nouveau",
                "#menu_file_open"           :"Ouvrir",
                "#menu_file_save"           :"Enregistrer",
                "#menu_file_save_as"        :"Enregistrer sous ...",
                "#menu_rename_as"           :"Renommer ...",
                "#menu_file_delete"         :"Supprimer",
                "#menu_file_import"         :"Import",
                "#menu_file_export"         :"Export",
                
                "#menu_view"                :"Affichage",
                "#menu_view_auto"           :"Centrage Auto",
                "#menu_zoom_auto"           :"Zoom Auto",
                "#menu_zoom_in"             :"Zoom +",
                "#menu_zoom_out"            :"Zoom -",
                "#menu_rotation_left"       :"Rotation",
                "#menu_rotation_right"      :"Rotation Inverse",
                "#menu_track_show"          :"Montrer/Cacher la Piste",
                "#menu_color_show"          :"Montrer/Cacher les voies",
                
                "#menu_tracks"              :"Pistes",
                
                "#menu_tools"               :"Outils",

                "#menu_about"               :"A propos...",
                "#about_title"              :about.name,
                "#about_version"            :about.version
    },
};

$( document ).ready(function() {
    lang=getUrlParameter("lang");
    if (lang===undefined) lang="en";
   
    for (var k in translation[lang]) {
        if (translation[lang].hasOwnProperty(k)) {
            $(k).html(translation[lang][k]);                
        }
    }
    $('#menu_tools_track_part_editor').attr("href", "track_part_editor.html?model="+getUrlParameter("model")+"&lang="+lang)
});


