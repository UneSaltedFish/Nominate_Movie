var listnum=0;
var movielist = [];
var inputT;
//an array of current search Result
var idlist=[];
let moviedata=''//default
let poster = 'https://cdn.pixabay.com/photo/2016/12/14/23/08/page-not-found-1907792_1280.jpg';//default as not found
//topten movie's id in gallery,can be changed using movie id ex: tt11874226','tt9231040'
var topten = ['tt9770150'];



function galleryload(){
  console.log("loading gallery");
  $.each(topten,function(i,object){
      $.getJSON('https://omdbapi.com/?apikey=94e5b3c8&i='+ topten[i],function(jmoviedata){
     
        //append movie class to gallery
        $("<div>",{id:"g"+i,"class":"movie"}).appendTo("#gallery");
        //source of poster
        var sss=jmoviedata.Poster;
        //if no poster, put on a 404 image as a poster
        if (jmoviedata.Poster =="N/A"){
          sss="https://cdn.pixabay.com/photo/2016/12/14/23/08/page-not-found-1907792_1280.jpg";
        }
        //append image in to the movie
        $("<img>",{src:sss,width:"250", height:"350"}).appendTo("#g"+i);
        //overlay affect on image to show detail
        $("<div>",{id:"go"+i,"class":"overlay"}).appendTo("#g"+i);
        $("<div>",{id:"gte"+i,"class":"text"}).appendTo("#go"+i);
        //get description for each movie
        $("#gte"+i).html("Title: "+jmoviedata.Title+"<br />" +"Year: "+jmoviedata.Year+"<br />" +"Rated: "+jmoviedata.Rated+"<br />" +"Released: "+jmoviedata.Released+"<br />" +"Runtime: "+ jmoviedata.Runtime+"<br />" +"Genre: "+jmoviedata.Genre);
        //title
        $("<div>",{id:"gi"+i,"class":"title"}).appendTo("#g"+i);
        $("#gi"+i).html(jmoviedata.Title + '<br>'+ "year: "+jmoviedata.Year);
        //nominate button
        $("<button>",{id:"nominate0"+i,"class":"nominate"}).appendTo("#g"+i);
        $('#nominate0'+i).html(" Nominate");
        $('#nominate0'+i).prepend('<i class="fa fa-plus-circle"></i>');
        $('#nominate0'+i).click(function(){
          galleryclick(topten[i],i);
        });

      });
    });


}

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

    //movieloads data to list top 10 movice name include input text
    $.getJSON(movieloads,function(jmovieloads){
      if(jmovieloads.Response=="False"){
        alert("movie not found");
      }
      else{
        idlist =[];
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
          $("<div>",{id:"o"+i,"class":"overlay"}).appendTo("#"+i);
          $("<div>",{id:"te"+i,"class":"text"}).appendTo("#o"+i);
          //get description for each movie
          $.getJSON('https://omdbapi.com/?apikey=94e5b3c8&i='+id,function(jsmoviedata){
            $("#te"+i).html("Title: "+jsmoviedata.Title+"<br />" +"Year: "+jsmoviedata.Year+"<br />" +"Rated: "+jsmoviedata.Rated+"<br />" +"Released: "+jsmoviedata.Released+"<br />" +"Runtime: "+ jsmoviedata.Runtime+"<br />" +"Genre: "+jsmoviedata.Genre);
          });

          //title
          $("<div>",{id:"i"+i,"class":"title"}).appendTo("#"+i);
          $("#i"+i).html(jmovieloads.Search[i].Title + '<br>'+ "year: "+jmovieloads.Search[i].Year);
          //nominate button
          $("<button>",{id:"nominate"+i,"class":"nominate"}).appendTo("#"+i);
          $('#nominate'+i).html(" Nominate");
          $('#nominate'+i).prepend('<i class="fa fa-plus-circle"></i>');
          //if movie is in the movie list
          if(movielist.indexOf(id) !== -1){

            //find id in current search array "idlist" get the index
            var which= idlist.indexOf(id);
            isnominated.push(which);

          }

          //click nominate, add it in to list
          $('#nominate'+i).click(function(){
            addlist(jmovieloads.Search[i].imdbID,i);
            $(".listbox").show();
            //if movie is added in list,button in search diabled
            if(movielist.indexOf(id) !== -1){
            document.getElementById("nominate"+i).disabled = true;
            //if this movie is also in gallery,disable that as well
            if(topten.indexOf(id) !== -1){
              document.getElementById("nominate0"+i).disabled = true;
            }
            }
          });


        });
        //when check current page has/not has movie in the list
        //if has, disable the nominate button
        $.each(isnominated, function( index, value ) {

            document.getElementById("nominate"+isnominated[0]).disabled = true;
            isnominated.shift();

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

  //resume nominate of that movie

  //if movie both in search and gallery
  if (idlist.indexOf(movieid) !==-1 && topten.indexOf(movieid) !==-1){
    document.getElementById("nominate0"+i).disabled = false;
    document.getElementById("nominate"+i).disabled = false;
  }
  else if(topten.indexOf(movieid) !==-1){
    document.getElementById("nominate0"+i).disabled = false;
  }
  else{document.getElementById("nominate"+i).disabled = false;}



  //delete from movielist
  if(movielist.indexOf(movieid) !== -1){
    movielist.splice(movielist.indexOf(movieid), 1);
  }
  listnum--;


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

//when click nominate on gallery movies
//imdb:movie imdbID,i:index of movie in gallery
function galleryclick(imdb,i){
  addlist(imdb,i);
  $(".listbox").show();
  //if movie is added in list,button diabled
  if(movielist.indexOf(imdb) !== -1){
  document.getElementById('nominate0'+i).disabled = true;
  }
}

//click list icon to show/hide box
function boxswitch(){

  if($('.listbox').css('display') == 'none'){
    console.log('hide list');
    $(".listbox").css("display", "block");
  }
  else{
    console.log('show list');
    $(".listbox").css("display", "none");
  }
}
