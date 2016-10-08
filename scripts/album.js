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
              setSong(SongNumber);
              updatePlayerBarSong();
                currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
                  var $volumeFill = $('.volume .fill');
+                 var $volumeThumb = $('.volume .thumb');
+                 $volumeFill.width(currentVolume + '%');
+                 $volumeThumb.css({left: currentVolume + '%'});
	       } else if (currentlyPlayingSongNumber === songNumber) {
		   $(this).html(playButtonTemplate);
              $(".main-controls .play-pause").html(playerBarPlayButton);
              if(currentSoundFile.isPaused()){
                  currentSoundFile.play();
                  $(".main-controls .play-pause").html(playerBarPauseButton);
              } else {
                  currentSoundFile.pause();
                  currentlyPlayingCell.html(currentlyPlayingSongNumber);
                  $(".main-controls .play-pause").html(playerBarPlayButton);
              }
              //check if currentSoundFile is paused
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
var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // #10
         currentSoundFile.bind('timeupdate', function(event) {
             // #11
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
         setCurrentTimeInPlayerBar(filterTimeCode(this.getTime());
     }
 };
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};
var setupSeekBars = function(){
  var $seekBars = $('.player-bar .seek-bar');
     $seekBars.click(function(event) {
         // #3
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         // #4
         var seekBarFillRatio = offsetX / barWidth;
         if($(this).parent().attr('class') == 'seek-control'){
                 seek(seekBarFillRatio * currentSoundFile.getDuration());
             } else{
                 setVolume(seekBarFillRatio * 100);
             }
         // #5
         updateSeekPercentage($(this), seekBarFillRatio);
     });
     $seekBars.find('.thumb').mousedown(function(event) {
         // #8
         var $seekBar = $(this).parent();
 
         // #9
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
             if($seekBar.parent().attr('class') == 'seek-control'){
                 seek(seekBarFillRatio * currentSoundFile.getDuration());
             } else{
                 setVolume(seekBarFillRatio);
             }
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         // #10
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
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
    currentSoundFile.play();
    updatePlayerBarSong();
    
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
    currentSoundFile.play();
    updatePlayerBarSong();
    var lastSongNumber = getLastSong(currentSongIndex);
    var $previousSongCell = $('.song-item-number[data-song-number="'+lastSongNumber+'"]');
    var $lastSongCell = $('.song-item-number[data-song-number="'+lastSongNumber+'"]');
    
    $previousSongCell.html(pauseButtonTemplate);
    $lastSongCell.html(lastSongNumber);
};
var updatePlayerBarSong = function(){
    setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
    $(".currently-playing .song-name").text(currentSongFromAlbum.title);
    $(".currently-playing .artist-name").text(currentAlbum.artist);
    $(".currently-playing .artist-song-mobile").text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $(".main-controls .play-pause").html(playerBarPauseButton);
};
var setSong = function(songNumber){
    if(currentSoundFile){
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: ['mp3'],
        preload: true
    });
    setVolume(currentVolume);
};
var setCurrentTimeInPlayerBar = function(currentTime){
    $('.current-time').text(currentTime);
};
var setTotalTimeInPlayerBar = function(totalTime){
    $('.total-time').text(totalTime);
};
var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
};
var setVolume = function(volume){
    if(currentSoundFile){
        currentSoundFile.setVolume(volume);
    }
};
var filterTimeCode = function(timeInSeconds){
    var temp = parseFloat(timeInSeconds);
    var sec =  Math.round(((temp % 60)*100))/100;
    var minutes = Math.floor(temp/60);
    return minutes+":"+sec;
};
var getSongNumber = function(number){
    if(number >= 0 && number < currentAlbum.songs.length){
        return trackIndex(currentAlbum, currentAlbum.songs[number-1]);
    }
}
//write togglePlayFromPlayerBar function
var togglePlayFromPlayerBar = function(){
    if(currentSoundFile.isPaused() && $songToggle.html == playerBarPlayButton){
        $('.song-item-number').html = playButtonTemplate;
        $songToggle.html = playerBarPauseButton;
        currentSoundFile.play();
    } else if(currentSoundFile !== null && $songToggle == playerBarPauseButton){
        $('.song-item-number').html = pauseButtonTemplate;
        $songToggle.html = playerBarPlayButton;
        currentSoundFile.pause();
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
var currentSoundFile = null;
var currentVolume = 80;
var $songToggle = $('.main-controls .play-pause');
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
$(document).ready(function(){
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $songToggle.click(togglePlayFromPlayerBar());
});
