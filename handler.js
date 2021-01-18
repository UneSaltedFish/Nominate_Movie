var listnum=0;
var movielist = [];
var inputT;
let moviedata=''//default
let poster = 'https://cdn.pixabay.com/photo/2016/12/14/23/08/page-not-found-1907792_1280.jpg';//default as not found




function magnify(){
  inputT= document.getElementById("input").value;
  //movie list that name include input
  movieloads='https://omdbapi.com/?apikey=94e5b3c8&s='+ inputT;
  //specifc movie data
  moviedata = 'https://omdbapi.com/?apikey=94e5b3c8&t='+ inputT;
//if input is null, alert
  if(!inputT){
    alert("Input something");
  }
  else{
    //clear gallery
    $("#gallery").hide();
    $("#rate").show();

    //change to searched movie
            /*$("#rate").html("Result of \""+inputT+"\"");*/

                    console.log(movieloads);
                    console.log(moviedata);
                    /*
                    console.log(poster);
                    */

    //movieloads data to list top 10 movice name include input text
    $.getJSON(movieloads,function(jmovieloads){
      console.log(jmovieloads);
      if(jmovieloads.Response=="False"){
        alert("movie not found");
      }
      else{
        //an array of current search Result
        var idlist=[];
        //an array of which movie in gallery has been nominated in movielist
        var isnominated =[];
        //refresh everytime after search
        $("#rate").empty();
        $.each(jmovieloads.Search,function(i,object){

          //specific movie moviedata
          var id = jmovieloads.Search[i].imdbID;
          idlist.push(id);
          //append movie class to rate
          $("<div>",{id:i,"class":"movie"}).appendTo("#rate");
          //source of poster
          var sss=jmovieloads.Search[i].Poster;
          //if no poster, put on a 404 image as a poster
          if (jmovieloads.Search[i].Poster =="N/A"){
            sss="https://cdn.pixabay.com/photo/2016/12/14/23/08/page-not-found-1907792_1280.jpg";
          }
          //append image in to the movie
          $("<img>",{src:sss,width:"250", height:"350"}).appendTo("#"+i);

          //overlay affect on image to show detail
          $("<div>",{"class":"overlay"}).appendTo("#"+i);
          $("<div>",{"class":"text"}).appendTo(".overlay");
          $(".text").html();

          //title
          $("<div>",{id:"i"+i,"class":"title"}).appendTo("#"+i);
          $("#i"+i).html(jmovieloads.Search[i].Title + '<br>'+ "year: "+jmovieloads.Search[i].Year);
          //nominate button
          $("<button>",{id:"nominate"+i,"class":"nominate"}).appendTo("#"+i);
          $('#nominate'+i).html(" nominate");
          $('#nominate'+i).prepend('<i class="fa fa-plus-circle"></i>');
          //if movie is in the movie list
          if(movielist.indexOf(id) !== -1){

            console.log("checking any movie has been nominate");
            //find id in current search array "idlist" get the index
            var which= idlist.indexOf(id);
            isnominated.push(which);

          }

          //click nominate, add it in to list
          $('#nominate'+i).click(function(){
                    /*alert(i+"is clicked"+" id is: "+jmovieloads.Search[i].imdbID);*/
            addlist(jmovieloads.Search[i].imdbID,i);
            $(".listbox").show();
            //if movie is added in list,button diabled
            if(movielist.indexOf(id) !== -1){
            document.getElementById("nominate"+i).disabled = true;
            }
          });


        });
        //when check current page has/not has movie in the list
        //if has, disable the nominate button
        $.each(isnominated, function( index, value ) {
            console.log(isnominated);
            console.log(idlist);
            document.getElementById("nominate"+isnominated[0]).disabled = true;
            isnominated.shift();
            console.log("poped");
            console.log(isnominated);
            console.log(idlist);
        });
      }
    });
  }
}
//addlist function: when click on nominate

function addlist(movieid,i){
  if(listnum<5){
    //if movie is not added
    if(movielist.indexOf(movieid) == -1){
      //search specific movie data by id
      $.getJSON('https://omdbapi.com/?apikey=94e5b3c8&i='+movieid,function(jsmoviedata){
        $("<li>",{id:"i"+movieid}).appendTo("ul");
        $("#i"+movieid).html(jsmoviedata.Title);
        //append a delete button after li
        $("<button>",{id:movieid,"class":"delete"}).appendTo("ul");
        $("#"+movieid).prepend('<i class="fa fa-minus-circle"></i>');
        $("#"+movieid).click(function(){
          deletefromlist(movieid,i);
        });
      });

      movielist.push(movieid);
      listnum++;
      console.log(listnum);
      console.log(movielist);
    }
    //if movie is added, don't add
    else{
      alert("movie is added");
    }


  }
  else{
    alert("you have 5 nominated movie, delete some to add")
  }

}

//delete movie from listbox
function deletefromlist(movieid,i){
  console.log("delete movie id: "+movieid);
  //delete that li and button after it
  $("#i"+movieid).remove();
  $("#"+movieid).remove();
  //if movie is in the list
  //delete from movielist
  if(movielist.indexOf(movieid) !== -1){
    movielist.splice(movielist.indexOf(movieid), 1);
  }
  listnum--;
  //resume nominate of that movie
  document.getElementById("nominate"+i).disabled = false;

  console.log(listnum);
  console.log(movielist);

}

//trigger search button when press enter
$(document).on('keypress',function(enter) {
    if(enter.which == 13) {
        $("#search").click();
    }
});
//go back to Gallery when click Home
function gogallery(){
  $("#rate").hide();
  $("#gallery").show();
}


//click list icon to show/hide box
function boxswitch(){

  if($('.listbox').css('display') == 'none'){
    console.log('none');
    $(".listbox").css("display", "block");
  }
  else{
    console.log('show');
    $(".listbox").css("display", "none");
  }
}
