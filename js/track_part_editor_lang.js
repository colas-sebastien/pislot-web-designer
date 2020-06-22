translation=
{
    "en": 
            {                                              
                "#menu_file_save"           :"Save",
                "#menu_file_export"         :"Export",
                
                "#display_1"                :"Display bottom image",
                "#display_2"                :"Display top image",
                "#display_3"                :"Display color for track 1",
                "#display_4"                :"Display color for track 2"            
            }
        ,
    "fr": 
            {
                "#menu_file"                :"Fichier",
                "#menu_file_new"            :"Nouveau",

                "#display_1"                :"Affiche image du dessous",
                "#dessus"                   :"Affiche image du dessus",
                "#p1"                       :"Affiche piste couleur 1",
                "#p2"                       :"Affiche piste couleur 2"
    }
};

$( document ).ready(function() {
    lang=getUrlParameter("lang");
    if (lang===undefined) lang="en";
   
    for (var k in translation[lang]) {
        if (translation[lang].hasOwnProperty(k)) {
            $(k).html(translation[lang][k]);                
        }
    }
});


