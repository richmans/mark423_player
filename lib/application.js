$(function(){
  function mark423_switch_item(item_id){
    $('div#mark423-playlist a.playing').removeClass('playing');
    $('div#mark423-playlist a#playlist-item-' + item_id).addClass('playing');
  }

  $('div#mark423-playlist a').click(function(){ 
    element_id = $(this).attr('id');
    item_id = element_id.split('-')[2];
    mark423_switch_item(item_id);
    return false
  });
})