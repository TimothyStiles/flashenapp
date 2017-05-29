var flash = require('flaschenode')
var d3 = require('d3')
var Pixel = require('./pixer.js')

var refreshDelay = 500

flash.layer = 13
flash.init()
console.log(flash.hostname)

var datb = Buffer.alloc(flash.headerString().length + flash.footerString().length + flash.height * flash.width * 3)

flash.data = datb

datb.write(flash.headerString(), 0)
var starfoo = datb.length - flash.footerString().length
datb.write(flash.footerString(), starfoo)

var src = 'https://static.pexels.com/photos/17767/pexels-photo.jpg'
let svg

console.log('new try with src, ', src)

var imgi = new Image();  // eslint-disable-line

var layers = [];

for (i = 1; i < 16; i++) {
  layers.push(i);
}

console.log(layers)
d3.select('#layerselect') .on('change', function(d){
   console.log('it changed, ', this.value)
   flash.layer = parseInt(this.value);
   datb.write(flash.headerString(), 0);
 }).selectAll('option')
 .data(layers)
 .enter()
 .append('option')
 .attr('value', function(d){
   console.log('d of val', d)
   return d
 })
 .attr('selected', function(d){
   if( d === flash.layer ) {
     return true;
   }
   return false
 })
 .text( (d)=>d )




// handle when an image is loaded.
imgi.onload = function () {
  canny.width = imgi.width
  canny.height = imgi.height

  ct.drawImage(imgi, 0, 0)
  //  console.log(ct.getImageData(0, 0, img.width, img.height))
  flashenSvg()
}

imgi.src = 'https://i.ytimg.com/vi/1pH5c1JkhLU/hqdefault.jpg'// 'http://www.dmu.ac.uk/webimages/About-DMU-images/News-images/2014/December/cyber-hack-inset.jpg'//'http://i2.kym-cdn.com/photos/images/newsfeed/000/674/934/422.jpg';

window.addEventListener('keydown', function (e) {
  console.log('keycode=', e.keyCode)
  if (e.keyCode === 80) console.log('pressed save thing') // save();
  else if (e.keyCode === 70) {
  //  const footer = new Buffer(flash.footerString())
    console.log('want to make this auto send to the flashentaschen')
  //  var srcData = src
  //  var allcon // to hold the final buffer to send
  }
})

var inputElement = document.getElementById('fileuploader')
inputElement.addEventListener('change', handleFiles, false)

function handleFiles () {
  var fileList = this.files /* now you can work with the file list */
  console.log(fileList)
  imgi.src = window.URL.createObjectURL(fileList[0])
}

var screenWidth
var screenHeight
var width = 15
var height = 15
var pixels

function flashenSvg () {
  svg = d3.select('#flashsvg')
  screenWidth = 45
  screenHeight = 35
  svg.attr('width', width * screenWidth)
  svg.attr('height', screenHeight * height)

  svg.style('background-color', 'pink')

  pixels = []

  for (let y = 0; y < screenHeight; y++) {
    for (let x = 0; x < screenWidth; x++) {
      //  console.log(x)
      pixels.push(new Pixel(x, y))
    }
  }

  var imgdat = ct.getImageData(0, 0, imgi.width, imgi.height)

  canToFlashen(imgdat)

  drawFlash(pixels)
}

var canny = document.getElementById('mycanvas')
var ct = canny.getContext('2d')
// console.log(ct.getImageData(0, 0, 200, 200))
function drawFlash (data) {
  svg.selectAll('rect').remove()

  var pixs = svg.selectAll('rect')
      .data(data)

  pixs.enter().append('rect')
      .attr('x', function (d) {
    //  console.log(d)
        return width * d.xin
      })
      .attr('width', width)
        .attr('height', height)
      .attr('y', function (d) {
        return height * d.yin
      })
      .attr('id', function (d) {
        return 'p' + d.xin + '-' + d.yin
      })
      .attr('d', function (d) {
        return JSON.stringify(d)
      })
      .attr('stroke', 'blue')
      .attr('fill', function (d) {
      //  console.log(d.color)
        return d3.rgb(d.color[0], d.color[1], d.color[2])
      })
}

// my kind of lazy sampling of the canvas
function canToFlashen (imgdat) {
  var imageWidth = imgdat.width
  var imageHeight = imgdat.height

  var xoff = Math.floor(imageWidth / screenWidth)

  var yoff = Math.floor(imageHeight / screenHeight)

// each x picwel we need to go four through * imageWidth/screenHeight
  for (let y = 0; y < screenHeight; y++) {
    for (let x = 0; x < screenWidth; x++) {
      var indi = ((xoff) * x * 4 + (yoff * imageWidth) * y * 4)

        // counter= counter+1;
      pixels[x + y * screenWidth].color = [imgdat.data[indi],
        imgdat.data[indi + 1], imgdat.data[indi + 2]]
    }
  }
  sendToFlaschen(pixels)
}

function setupInput () {
  var linkinput = d3.select('#linkin')
  linkinput.on('keydown', function (err, d, e) {
  //  var linkinput = d3.select('#linkin');
    if (err) {
      console.log('somehow there was an error on keydown it is, ', err)
    }
    console.log('and d on keydown is, ', d)
  })
  // console.log(linkinput.value)
  linkinput.attr('value', imgi.src)
}

// Handle the action of setting a new image source.
d3.select('#urlbut')
  .on('click', function (d) {
  //  var newlink = linkinpu.attr('value')
    console.log('update image with', typeof document.getElementById('linkin').value)
    imgi.src = document.getElementById('linkin').value
  })

// Handle click on the button to update the flashentaschen
d3.select('#updateBut')
  .on('click', function (d) {
    sendToFlaschen(pixels)
  })

// When the check box if checkeud handle refreshing the flashentaschen or not
d3.select('#contcheck')
  .on('change', function (d, i) {
    console.log('checkedout', d, this.checked)
    flashenSvg()

    if (this.checked) {
      keepsending()
    }
  })

function keepsending () {
flash.show() //  flashenSvg()
//  console.log('is it still checked', d3.select('#contcheck')[0][0].checked)
  setTimeout(function (elap) {
    if (!(document.getElementById('contcheck').checked)) {
      // t.stop();
      console.log('stoping the refresh')
    } else {
      keepsending()
    }
  }, refreshDelay)
}

function sendToFlaschen (data) {
    // console.log("Got info from the client it is: " + data);
  var datum = data // .split('\n');
  for (let d of datum) {
    try {
      //  var djson = JSON.parse(d);
      //  console.log(djson.xin, djson.yin )
      var color = d.color
      flash.set(d.xin, d.yin, color)
    } catch (e) {
      console.log(e)
    }
  }
  flash.show()
}

// this part handles users dropping files into the red box
var dropbox;

dropbox = document.getElementById("filedragspot");
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  var dt = e.dataTransfer;
  var files = dt.files;

  handleFileDrop(files);

}

function handleFileDrop (filers) {
  var fileList = filers /* now you can work with the file list */
  console.log(filers)
  imgi.src = window.URL.createObjectURL(fileList[0])
}


// basic flow of the app
// set up text input and will load and show inital image and allow all the
// stuff to work
setupInput()
