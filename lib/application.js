var mark423Playlist = new Array();
var mark423Options = {};
var mark423Ready = false;
var mark423Language = 'en';
var mark423PrevVolume = 0.8

var mark423Translation = {
  'en': {
    'download alert': 'To download this audio file, please right-click this button and select \'save target as\'',
    'speaker': 'Speaker: ',
    'theme': 'Theme: ',
    'no recordings': "There are no recordings available"
  },
  'nl': {
    'download alert': 'Om deze opname te downloaden kunt u rechts-clicken op deze knop en dan kiezen voor \'Link opslaan als\'',
    'speaker': 'Spreker: ',
    'theme': 'Thema: ',
    'no recordings': "Er zijn nog geen opnamen beschikbaar."
  },
  'de': {
    'download alert': 'Zum downloaden klicken Sie mit der rechten Maustaste und wählen Sie \'Ziel speichern unter\'',
    'speaker': 'Sprecher: ',
    'theme': 'Thema: ',
    'no recordings': "There are no recordings available"
  }
}
if(!window.console) {
  var console = { log: function (logMsg) { } };
}

function m4t(input) {
  if(!mark423Translation[mark423Language][input] || typeof mark423Translation[mark423Language][input] === "undefined") {
    return input;
  } else {
    return mark423Translation[mark423Language][input];
  }
}

function getElementByNodeName(parentNode, nodeName) {   
    var colonIndex = nodeName.indexOf(":");
    var tag = nodeName.substr(colonIndex + 1);
    var nodes = parentNode.getElementsByTagNameNS("*", tag);
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeName == nodeName) return nodes[i]
    }
    return undefined;
}

function Mark423Recording(speaker, theme, date, url, file_type){
  this.speaker = speaker;
  this.theme = theme;
  this.url = url;
  this.date = date
  this.file_type = file_type;
}

function mark423_format_date(date){
  var d = date.getDate();
  var m = date.getMonth() + 1;
  var y = date.getFullYear();
  return '' + (d <= 9 ? '0' + d : d) + '-' + (m<=9 ? '0' + m : m) + '-' + y;
}

function mark423_install_player(){
  audio_tag = document.createElement('audio');
  audio_tag.id = "mark423-audio"
  audio_tag.preload = false;
  audio_tag.ontimeupdate = mark423_update_progress
  document.querySelector('div#mark423-player-audio').appendChild(audio_tag)
  
  console.log("The player is ready for action.");
  mark423Ready = true;
 
  document.querySelector('div#mark423-player div.jp-eject a').addEventListener("click", function(e) {
    alert(m4t('download alert'));
    return false;
  })
  
  document.querySelector('a.jp-play').addEventListener("click", mark423_play)
  document.querySelector('a.jp-pause').addEventListener("click", mark423_pause)
  document.querySelector('div.jp-mute').addEventListener("click", mark423_mute)
  document.querySelector('div.jp-unmute').addEventListener("click", mark423_unmute)  
  document.querySelector('div.jp-progress').addEventListener('click', mark423_skip)
  document.querySelector('div.jp-volume-bar').addEventListener('click', mark423_volume)
  mark423_set_volume(0.8)
}

function mark423_skip(e) {
  audio_tag = document.querySelector("audio#mark423-audio");
  let percent = (e.layerX / this.offsetWidth ) 
  let new_time = audio_tag.duration * percent
  audio_tag.currentTime = new_time;
}

function mark423_play() {
  document.querySelector("audio#mark423-audio").play()
  document.querySelector("a.jp-play").style.display = 'none'
  document.querySelector("a.jp-pause").style.display = 'inline-block'
  
}


function mark423_pause() {
  document.querySelector("audio#mark423-audio").pause()
  document.querySelector("a.jp-play").style.display = 'inline-block'
  document.querySelector("a.jp-pause").style.display = 'none'
  
}

function mark423_volume(e) {
  let x = e.clientX - e.currentTarget.offsetLeft; 
  let percent = x / this.offsetWidth
  mark423_set_volume(percent)
}

function mark423_set_volume(vol) {
  document.querySelector("audio#mark423-audio").volume = vol
  document.querySelector("div.jp-volume-bar-value").style.width = (vol * 100) + "%"
  if (vol == 0) {
    document.querySelector("div.jp-mute").style.display = 'none';
    document.querySelector("div.jp-unmute").style.display = 'inline-block';
    
  } else {
    document.querySelector("div.jp-mute").style.display = 'inline-block';
    document.querySelector("div.jp-unmute").style.display = 'none';
    
  }
}

function mark423_mute() {
  mark423PrevVolume = document.querySelector("audio#mark423-audio").volume
  mark423_set_volume(0)
}

function mark423_unmute() {
  mark423_set_volume(mark423PrevVolume)
}

function mark423_update_progress() {
  let audio_tag = document.querySelector("audio#mark423-audio");
  let percent = 0
  if (audio_tag.duration > 0 ) {
    percent = (audio_tag.currentTime / audio_tag.duration) * 100
  }
  document.querySelector("div.jp-play-bar").style.width = percent + "%";
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
  counter = 0;
  mark423Language = mark423Podcast['language'];
  mark423Podcast['items'].forEach(function(item, index) {
    // fix for IE, which takes the comma at the end of the podcast js
    // as an empty element
    if (typeof item === 'undefined') return false;
    if (counter >= mark423Options['count']) return false;
    url = item["url"];
    theme = item['title'];
    speaker = item["speaker"];
    str_date = item['date'];
    file_type = item['type'];
    parsed_date = new Date(str_date);
    rendered_date = mark423_format_date(parsed_date);
    recording = new Mark423Recording(speaker, theme, rendered_date, url, file_type);
    mark423Playlist.push(recording);
    counter += 1;
    
  } );
  console.log("Filling playlist");
  // render playlist
  document.querySelector('div#mark423-playlist').innerHTML = "";
  counter = 0;
  mark423Playlist.forEach(function(recording){
    new_link = document.createElement('a');
    new_link.id = 'playlist-item-' + counter;
    if(recording.file_type == 'application/pdf') {
      new_link.href = recording.url;
      new_link.target = '_blank';
    }
    new_link.classList.add('playlist-item');
    new_link.innerHTML = recording.date  + ' - ' + recording.speaker + ' - ' + recording.theme;
    document.querySelector('div#mark423-playlist').appendChild(new_link);
    counter += 1;
  })

  // Install click handler for playlist items
  document.querySelectorAll('div#mark423-playlist a').forEach(function(item) {
    item.addEventListener("click", function(e) {
      element_id = this.id;
      item_id = element_id.split('-')[2];
      if(mark423Playlist[item_id].file_type == 'application/pdf'){
        return true;
      } else {
        mark423_switch_item(item_id);
        return false;
      }
    })
  });
  if (mark423Playlist.length> 0){
    mark423_switch_item(0);
  }else{
    console.log("No playlist items")
    document.querySelector('div#mark423-player span#mark423-player-speaker').innerHTML = m4t("no recordings");
    document.querySelector('div#mark423-player span#mark423-player-theme').innerHTML = "";
 
  }
  mark423_update_colors(mark423Options);
  mark423_apply_translations()
  console.log("Mark423 initialization ready");
  
}

function mark423_switch_item(item_id){
  let curItem = document.querySelector('div#mark423-playlist a.playing')
  if (curItem) {
    curItem.classList.remove('playing');
  }
  document.querySelector('div#mark423-playlist a#playlist-item-' + item_id).classList.add('playing');
  recording = mark423Playlist[item_id];
  document.querySelector('div#mark423-player span#mark423-player-speaker').innerHTML = recording.speaker;
  document.querySelector('div#mark423-player span#mark423-player-theme').innerHTML = recording.theme;
  let audio_tag = document.querySelector("audio#mark423-audio")
  audio_tag.src = recording.url
  document.querySelector('div#mark423-player div.jp-eject a').href = recording.url;
  document.querySelector("audio#mark423-audio").currentTime = 0
  mark423_update_progress()
  mark423_pause()
}

function mark423_write_podcast_input(url){
  document.write("<script type='text/javascript' src='" + url + "'></script>");
}

function mark423_apply_translations(){
  document.querySelector('div#mark423-player div.jp-current-speaker span.speaker-label').innerHTML = m4t('speaker');
  document.querySelector('div#mark423-player div.jp-current-theme span.theme-label').innerHTML = m4t('theme');
}

function mark423_update_colors(options){
  background = options['background_color'];
  font_color = options['font_color'];
  highlight = options['highlight_color'];
  font = options['font'];
  document.querySelector('div#mark423-player div.jp-play-bar').style.backgroundColor = highlight;
  document.querySelector('div#mark423-player div.jp-play-pause a.jp-play').style.fill = highlight;
  document.querySelector('div#mark423-player div.jp-play-pause a.jp-pause').style.fill = highlight;
  document.querySelector('div#mark423-player div.jp-display div.jp-current-time').style.color =  highlight;
  document.querySelector('div#mark423-player div.jp-display').style.color = font_color;
  document.querySelector('div#mark423-player div.jp-display').style.backgroundColor = background;
  document.querySelector('div#mark423-player div.jp-play-pause').style.backgroundColor = background;
  document.querySelector('div#mark423-player div.jp-eject ').style.backgroundColor = background;
  document.querySelector('div#mark423-player div.jp-eject a').style.fill = highlight;
  document.querySelector('div#mark423-player div.jp-volume-bar-value').style.backgroundColor = highlight;
  document.querySelector('div#mark423-player div.jp-mute').style.fill = highlight;
  document.querySelector('div#mark423-player div.jp-unmute').style.fill = highlight;
  document.querySelector('div#mark423-playlist').style.backgroundColor = background;
  document.querySelector('div#mark423-playlist').style.font = font;
  document.querySelectorAll('div#mark423-playlist a').forEach(function(playItem) {
    playItem.addEventListener("mouseenter", function() {
      this.style.color = highlight
    });
    playItem.addEventListener("mouseleave", function() {
      this.style.color = font_color
    });
  })
}

function mark423_check_parameters(options){
  if (typeof options['url'] === 'undefined') return alert("No url defined...");
  if (typeof options['highlight_color'] === 'undefined')  options['highlight_color'] = '#DD4B39';
  if (typeof options['font_color'] === 'undefined')  options['font_color'] = '#333333';
  if (typeof options['background_color'] === 'undefined')  options['background_color'] = '#f5f5f5';
  if (typeof options['count'] === 'undefined')  options['count'] = 20;
  if (typeof options['font'] === 'undefined')  options['font'] = '12px Arial';
  
}

function mark423(options){
  console.log("Startup mark423");
  mark423Options = options;
  mark423_check_parameters(options);
  mark423_write_podcast_input(options['url']);
  document.write(mark423Styles);
  document.write(mark423Interface);
  document.addEventListener('DOMContentLoaded', function(){ 
    mark423_install_player();
    mark423_load_podcast(); 
  }, false);
}
