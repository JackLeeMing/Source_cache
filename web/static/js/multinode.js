function getoffset(e){
  var offX, offY;
  if(!e.offsetX || !e.offsetY){
	offX = e.pageX - $(e.target).offset().left;
	offY = e.pageY - $(e.target).offset().top;
  }else{
	offX = e.offsetX;
	offY = e.offsetY;
  }
  return {x:offX,y:offY};
}

var oldpos = null,
	curpos = null,
	ox,oy,cx,cy;
var paddingtop = $('.multinode').css('paddingTop');

var selectdiv = $('<div>').addClass('selectmark');
var markdiv = "<div style='position: absolute; background-color: #fff;' id='markdiv'></div>";

$('.multinode').prepend(markdiv);

$('.multinode').mousedown(function(event) {
  oldpos = getoffset(event);
});

$('.multinode').mousemove(function(event) {
	curpos = getoffset(event);

	if(oldpos){                                              

	   ox = Math.min(curpos.x,oldpos.x);
	   cx = Math.max(curpos.x,oldpos.x);
	   oy = Math.min(curpos.y,oldpos.y);
	   cy = Math.max(curpos.y,oldpos.y);

	   $('#markdiv').css({
		  'left':ox,
		  'top':oy + paddingtop,
		  'width':cx-ox,
		  'height':cy-oy
	   })

	 }

});