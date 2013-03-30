$(function(){
  var mark423Playlist = new Array();
  
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

  function mark423_load_podcast(podcast_url){
    $.get(podcast_url, function(xml_result){

      // fetch and parse podcast xml
      mark423Playlist = new Array();
      $(xml_result).find('item').each(function(){
        item = $(this);
        url = item.find('enclosure').attr("url");
        theme = item.find('title').text();
        speaker = item.find("itunes\\:author, author").text();
        str_date = item.find('pubDate').text();
        parsed_date = new Date(str_date);
        rendered_date = mark423_format_date(parsed_date);
        recording = new Mark423Recording(speaker, theme, rendered_date, url);
        mark423Playlist.push(recording);
        
      });

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
    });
    
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
  }

 

  mark423_load_podcast('http://mark423.com/podcasts/test.rss');
})