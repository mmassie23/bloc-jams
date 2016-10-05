var createSongRow = function(songNumber, songName, songLength){
    var template = 
        '<tr class="album-view-song-item">'
        + '<td class="song-item-number" data-song-number="'+songNumber+'">'+songNumber+'</td>'
        + '<td class="song-item-title">'+songName+'</td>'
        + '<td class="song-item-duration">'+songLength+'</td>'
        + '</tr>'
        ;
        var $row = $(template);
        var clickHandler = function(){
            var songNumber = parseInt($(this).attr('data-song-number'));
            if(currentlyPlayingSongNumber !== null){
                var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
		        currentlyPlayingCell.html(currentlyPlayingSongNumber);
            }
            if (currentlyPlayingSongNumber !== songNumber) {
		      $(this).html(pauseButtonTemplate);
		      currentlyPlayingSongNumber = songNumber;
              setSong(currentlyPlayingSongNumber);
              updatePlayerBarSong();
	       } else if (currentlyPlayingSongNumber === songNumber) {
		   $(this).html(playButtonTemplate);
              $(".main-controls .play-pause").html(playerBarPlayButton);
		      currentlyPlayingSongNumber = null;
              currentSongFromAlbum = null;
	       }
        };
        var onHover = function(event){
            var songCell = $(this).find('.song-item-number');
            var songNumber = parseInt(songNumberCell.attr('data-song-number'));
            if(songNumber !== currentlyPlayingSongNumber){
                songCell.html(playButtonTemplate);
            }
        };
        var offHover = function(event){
            var songCell = $(this).find('.song-item-number');
            var songNumber = parseInt(songNumberCell.attr('data-song-number'));
            console.log("songNumber type is "+typeof songNumber +"\nand currentlyPlayingSongNumber is "+typeof currentlyPlayingSongNumber);
            if(songNumber !== currentlyPlayingSongNumber){
                songCell.html(songNumber);
            }
        };
        $row.find('.song-item-number').click(clickHandler);
        $row.hover(onHover, offHover);
        return $row;
};
var setCurrentAlbum = function(album) {
     // #1
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
     // #2
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
     // #3
     $albumSongList.empty();
     // #4
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };
var trackIndex = function(album, song){
    return album.songs.indexof(song);
};
var nextSong = function(){
    var getLastSong = function(index){
        return index == 0 ? currentAlbum.songs.length : index;
    };
    var currentSongDex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongDex++;
    
    if(currentSongIndex >= currentAlbum.songs.length){
        currentSongDex = 0;
    }
    setSong(currentSongDex);
    currentlyPlayingSongNumber = currentSongDex + 1;
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSong(currentSongDex);
    var $nextSongCell = $('.song-item-number[data-song-number="]' + currentlyPlayingSongNumber+'"]');
    var $lastSongCell = $('.song-item-number[data-song-number="]' + lastSongNumber+'"]');
    $nextSongCell.html(pauseButtonTemplate);
    $lastSongCell.html(previousSongNumber);
};
var previousSong = function(){
    var getlastSong = function(index){
      return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;  
    };
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    if(currentSongIndex < 0){
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    setSong(currentSongIndex);
    
    $('.currenlty-playing .song-name').text(currentSongFromAlbum.title);
    $('.currenlty-playing .artist-name').text(currentAlbum.artist);
    $('.currenlty-playing .artist-song-mobile').text(currentSongFromAlbum.title+" - "+ currentAlbum.title);
    $('.main-controls .play-pause').html(palyerBarPauseButton);
    var lastSongNumber = getLastSong(currentSongIndex);
    var $previousSongCell = $('.song-item-number[data-song-number="'+lastSongNumber+'"]');
    var $lastSongCell = $('.song-item-number[data-song-number="'+lastSongNumber+'"]');
    
    $previousSongCell.html(pauseButtonTemplate);
    $lastSongCell.html(lastSongNumber);
};
var updatePlayerBarSong = function(){
    $(".currently-playing .song-name").text(currentSongFromAlbum.title);
    $(".currently-playing .artist-name").text(currentAlbum.artist);
    $(".currently-playing .artist-song-mobile").text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $(".main-controls .play-pause").html(playerBarPauseButton);
};
var setSong = function(songNumber){
    currentlyPlayingSongNumber = (songNumber - 1);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
};
var getSongNumber = function(number){
    if(number >= 0 && number < currentAlbum.songs.length){
        return trackIndex(currentAlbum, currentAlbum.songs[number-1]);
    }
}
 window.onload = function() {
     setCurrentAlbum(albumPicasso);
 };
var scroller = document.getElementsByClassName("album-view-song-item");
var songList = scroller.childNodes();
scroller.onclick = function(songList){
  for(var i = 0; i < songList.length; i++){
      if(i === (songList.length - 1)){
          i = 0;
      }
      setCurrentAlbum(songList[i]);
  }
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
//var currentlyPlayingSong = null;
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
$(document).ready(function(){
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});
