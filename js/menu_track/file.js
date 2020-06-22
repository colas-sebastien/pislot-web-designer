/*
 * Menu / File
 */
var PiecesGoInfos;

$( document ).ready(function() { 

    /**** SAVE ****************************************************************/
    $("#menu_file_save").on("click",function()
    {
        PiecesGoInfos.timestamp=Date.now();
        localStorage.setItem("model_"+getUrlParameter("model"), JSON.stringify(PiecesGoInfos));
    });
    
    /**** EXPORT **************************************************************/
    $("#menu_file_export").on("click",function()
    {
        PiecesGoInfos.timestamp=Date.now();
        downloadObjectAsJson(PiecesGoInfos,PiecesGoInfos.description);        
    });
});