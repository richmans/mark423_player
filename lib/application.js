var mark423Playlist = new Array();
var mark423Options = {}
var mark423Ready = false;
function getElementByNodeName(parentNode, nodeName) {   
    var colonIndex = nodeName.indexOf(":");
    var tag = nodeName.substr(colonIndex + 1);
    var nodes = parentNode.getElementsByTagNameNS("*", tag);
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeName == nodeName) return nodes[i]
    }
    return undefined;
}

function Mark423Recording(speaker, theme, date, url){
  this.speaker = speaker;
  this.theme = theme;
  this.url = url;
  this.date = date
}

function mark423_format_date(date){
  var d = date.getDate();
  var m = date.getMonth() + 1;
  var y = date.getFullYear();
  return '' + (d <= 9 ? '0' + d : d) + '-' + (m<=9 ? '0' + m : m) + '-' + y;
}

function mark423_install_player(){
  $("#mark423-player-audio").jPlayer({
   swfPath: '[root_url]flash',
   solution: 'html, flash',
   supplied: 'mp3',
//   preload: 'metadata',
   volume: 0.8,
   muted: false,
   backgroundColor: '#000000',
   cssSelectorAncestor: '#mark423-player',
   cssSelector: {
    play: '.jp-play',
    pause: '.jp-pause',
    seekBar: '.jp-seek-bar',
    playBar: '.jp-play-bar',
  //  mute: '.jp-mute',
  //  unmute: '.jp-unmute',
  //  volumeBar: '.jp-volume-bar',
  //  volumeMax: '.jp-volume-max',
    currentTime: '.jp-current-time',
    noSolution: '.jp-no-solution',
   
   },
   ready: function () {
     console.log("The player is ready for action.");
     mark423Ready = true;
   },
   errorAlerts: false,
   warningAlerts: false
  });

  $('div#mark423-player div.jp-eject a').click(function(){
    alert("To download the current file, please right-click this link and select 'save target as'");
    return false;
  })
}

function mark423_load_podcast(){
 if (typeof mark423Podcast === 'undefined' || mark423Ready == false){
    if(mark423Ready == false) console.log("waiting for player...");
    if (typeof mark423Podcast === 'undefined') console.log("Waiting for podcast...");
    setTimeout('mark423_load_podcast()', 100);
    return;
  }
  console.log("All files loaded, proceeding with initialize");
    // fetch and parse podcast xml
  mark423Playlist = new Array();
  $.each(mark423Podcast['items'], function(index, item) {
    url = item["url"];
    theme = item['title'];
    speaker = item["speaker"];
    str_date = item['date'];
    parsed_date = new Date(str_date);
    rendered_date = mark423_format_date(parsed_date);
    recording = new Mark423Recording(speaker, theme, rendered_date, url);
    mark423Playlist.push(recording);
    
  } );
  console.log("Filling playlist");
  // render playlist
  $('div#mark423-playlist').html("");
  counter = 0;
  $.each(mark423Playlist, function(key, recording){
    new_link = $(document.createElement('a'));
    new_link.attr('id', 'playlist-item-' + counter);
    new_link.addClass('playlist-item');
    new_link.html(recording.speaker + ' - ' + recording.theme + ' - ' + recording.date)
    $('div#mark423-playlist').append(new_link);
    counter += 1;
  })

  // Install click handler for playlist items
  $('div#mark423-playlist a').click(function(){ 
    element_id = $(this).attr('id');
    item_id = element_id.split('-')[2];
    mark423_switch_item(item_id);
    return false
  });
  mark423_switch_item(0);
  mark423_update_colors(mark423Options);
  console.log("Mark423 initialization ready");
  
}

function mark423_switch_item(item_id){
  $('div#mark423-playlist a.playing').removeClass('playing');
  $('div#mark423-playlist a#playlist-item-' + item_id).addClass('playing');
  recording = mark423Playlist[item_id];
  $('div#mark423-player span#mark423-player-speaker').html(recording.speaker);
  $('div#mark423-player span#mark423-player-theme').html(recording.theme);
  $("div#mark423-player-audio").jPlayer("setMedia", {
   mp3: recording.url,
  });
  $('div#mark423-player div.jp-eject a').attr('href', recording.url);
}

function mark423_write_podcast_input(url){
  document.write("<script type='text/javascript' src='" + url + "'></script>");
}

function mark423_update_colors(options){
  background = options['background_color'];
  font = options['font_color'];
  highlight = options['highlight_color'];

  $('div#mark423-player div.jp-play-bar').css('background-color', highlight);
  $('div#mark423-player div.jp-play-pause a').css('color', highlight);
  $('div#mark423-player div.jp-display div.jp-current-time').css('color', highlight);
  $('div#mark423-playlist a').css('color', font);
  $('div#mark423-playlist a').css('color', font);
  $('div#mark423-player div.jp-display').css('color', font);
  $('div#mark423-player div.jp-display').css('background-color', background);
  $('div#mark423-player div.jp-play-pause').css('background-color', background);
  $('div#mark423-player div.jp-eject ').css('background-color', background);
  $('div#mark423-player div.jp-eject a').css('color', highlight);
  $('div#mark423-playlist').css('background-color', background);
  
  $('div#mark423-playlist a').hover(function() {
    $(this).css({'color': highlight});
  }, function() {
    $(this).css({'color': font});
  });

}

function mark423_check_parameters(options){
  if (typeof options['url'] === 'undefined') return alert("No url defined...");
  if (typeof options['highlight_color'] === 'undefined')  options['highlight_color'] = '#DD4B39';
  if (typeof options['font_color'] === 'undefined')  options['font_color'] = '#333333';
  if (typeof options['background_color'] === 'undefined')  options['background_color'] = '#f5f5f5';
   
}

function mark423(options){
  console.log("Startup mark423");
  mark423Options = options;
  mark423_check_parameters(options);
  mark423_write_podcast_input(options['url']);
  document.write(mark423Styles);
  document.write(mark423Interface);
  $(function(){
    mark423_install_player();
    mark423_load_podcast(); 
  });
}
