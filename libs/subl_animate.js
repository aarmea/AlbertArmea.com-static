// Based on the Sublime anim_encoder; https://github.com/sublimehq/anim_encoder
// Documented at http://www.sublimetext.com/~jps/animated_gifs_the_hard_way.html

var delay_scale = 0.7
var timer = null

var animate = function(img, timeline, element, text_timeline, text_element)
{
  var i = 0

  var run_time = 0
  for (var j = 0; j < timeline.length - 1; ++j)
    run_time += timeline[j].delay

  var f = function()
  {
    var frame = i++ % timeline.length
    var delay = timeline[frame].delay * delay_scale
    var blits = timeline[frame].blit
    var text = text_timeline[timeline[frame].text]

    var ctx = element.getContext('2d')

    for (j = 0; j < blits.length; ++j)
    {
      var blit = blits[j]
      var sx = blit[0]
      var sy = blit[1]
      var w = blit[2]
      var h = blit[3]
      var dx = blit[4]
      var dy = blit[5]
      ctx.drawImage(img, sx, sy, w, h, dx, dy, w, h)
    }

    if (text_element != null)
    {
      text_element.innerHTML = text
    }

    timer = window.setTimeout(f, delay)
  }

  if (timer) window.clearTimeout(timer)
  f()
}

var animate_fallback = function(img, timeline, element, text_timeline, text_element)
{
  var i = 0

  var run_time = 0
  for (var j = 0; j < timeline.length - 1; ++j)
    run_time += timeline[j].delay

  var f = function()
  {
    if (i % timeline.length == 0)
    {
      while (element.hasChildNodes())
        element.removeChild(element.lastChild)
    }

    var frame = i++ % timeline.length
    var delay = timeline[frame].delay * delay_scale
    var blits = timeline[frame].blit
    var text = text_timeline[timeline[frame].text]

    for (j = 0; j < blits.length; ++j)
    {
      var blit = blits[j]
      var sx = blit[0]
      var sy = blit[1]
      var w = blit[2]
      var h = blit[3]
      var dx = blit[4]
      var dy = blit[5]

      var d = document.createElement('div')
      d.style.position = 'absolute'
      d.style.left = dx + "px"
      d.style.top = dy + "px"
      d.style.width = w + "px"
      d.style.height = h + "px"
      d.style.backgroundImage = "url('" + img.src + "')"
      d.style.backgroundPosition = "-" + sx + "px -" + sy + "px"

      element.appendChild(d)
    }

    if (text_element != null)
    {
      text_element.innerHTML = text
    }

    timer = window.setTimeout(f, delay)
  }

  if (timer) window.clearTimeout(timer)
  f()
}

function set_animation2(img_url, timeline, canvas_id, fallback_id, text_timeline, text_id)
{
  var img = new Image()
  img.onload = function()
  {
    var canvas = document.getElementById(canvas_id)
    var text_element = document.getElementById(text_id)
    if (canvas && canvas.getContext)
      animate(img, timeline, canvas, text_timeline, text_element)
    else
      animate_fallback(img, timeline, document.getElementById(fallback_id), text_timeline, text_element)
  }
  img.src = img_url
}

function set_animation(img_url, timeline, canvas_id, fallback_id)
{
  set_animation2(img_url, timeline, canvas_id, fallback_id, null, null)
}
