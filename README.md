## Mark423 player
This is a javascript based player that reads podcasts and presents them as a list. It uses jPlayer to do the playout

## Embed
Embedding the player works like this:

    <script src='http://player.mark423.com/mark423-player.js' type='text/javascript'></script>
    <script type='text/javascript'>
      mark423({
        url: 'http://mark423.com/podcasts/<your_podcast>.js', //required
        highlight_color: 'red',      //optional, default: #DD4B39
        font_color: '#000000',       //optional, default: #333333
        background_color: 'white',   //optional, default: #f5f5f5
        count: 10                    //amount of items shown, optional, default: 20
      })
    </script>

## Thanks
* [jQuery](jquery.com)
* [jPlayer](jplayer.org)
* Symbol fonts by [icomoon](icomoon.io)