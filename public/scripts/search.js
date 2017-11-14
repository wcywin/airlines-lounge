$(document).ready(function(){
     $("#airline-search").on("input", function(){
        var search = $(this).serialize();
        if(search === "search="){
            search = "all"
        }
        $.get("/airlines?" + search, function(data){
            $("#airline-grid").html("");
            data.forEach(function(airline){
                $("#airline-grid").append(
                    `
                    <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="thumbnail">
                            <img id="small-pic" src="${ airline.image }">
                            <div class="caption">
                                <h4>${ airline.name }</h4>
                            </div>
                            <p>
                                <a href="/airlines/${ airline._id }" class="btn btn-primary">More Info</a>
                            </p>
                        </div>
                    </div>
                    `
                );
            });
        });
    });
    
    $("#airline-search").submit(function(event){
        event.preventDefault();
    });
});
   