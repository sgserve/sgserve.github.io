

//有存档，优先加载存档。没有创建一个新存档
var namespace ;
if( Cookies.get('namespace') ){
    namespace = Cookies.get('namespace');
}else{
    namespace =  uuid.v4();
    Cookies.set('namespace', namespace, { expires: 365 });
}
var game = new ImageSliderGame('im/sanguosha_04.jpeg', 6, 12 );
window.onload = game.setUp;
window.onresize = game.resize;


//ffmpeg -t 12 -ss 00:00:02  -i /Users/cupdir/Desktop/emmm.mov -b 568k -vf fps=20,scale=360:-1:flags=lanczos  -r 20  /Users/cupdir/Desktop/emmm.gif
