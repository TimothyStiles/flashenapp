// this should init the ui elements that aren't included in other places
var d3 = require('d3')


module.exports = function( sendToFlaschen, settings, flash, imgi, keepsending  ) {

  // Handle click on the button to update the flashentaschen
  d3.select('#updateBut')
    .on('click', function (d) {
      sendToFlaschen( settings.pixels, flash )
  })



    // When the check box if checked handle refreshing the flashentaschen or not
    d3.select('#contcheck')
      .on('change', function (d, i) {

        console.log('should be sending the image now or not')

        console.log('checkedout', d, flash)

        flashenSvg(imgi.width, imgi.height, settings, sendToFlaschen, drawFlash)

        if (this.checked) {

          keepsending(flash)

        }
      })

      d3.select('#colorChooser')
         .on('change',  function(d) {

            console.log('d is ', settings)
            console.log('this is', this.value)
            let rgbobj = hexToRgb(this.value);
            settings.draw_color = (rgbobj) ;
            console.log('color change', settings.draw_color)


          })


}
