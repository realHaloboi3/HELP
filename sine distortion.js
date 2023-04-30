(function(ext) {

  var distortion = 0;

  ext._shutdown = function() {};

  ext._getStatus = function() {
    return {status: 2, msg: 'Ready'};
  };

  ext.setDistortion = function(value) {
    distortion = value;
  };

  ext.getDistortion = function() {
    return distortion;
  };

  ext.applySineDistortion = function() {
    var data = stage.canvas.getContext('2d').getImageData(0, 0, 640, 480);
    var pixels = data.data;
    var length = pixels.length;
    var width = data.width;

    for (var i = 0; i < length; i += 4) {
      var x = (i / 4) % width;
      var y = Math.floor((i / 4) / width);

      var sinDistortion = Math.sin(x / 10) * distortion;
      var cosDistortion = Math.cos(y / 10) * distortion;
      var offset = Math.round((y + sinDistortion) * width + (x + cosDistortion)) * 4;

      if (offset >= 0 && offset < length) {
        pixels[i] = data.data[offset];
        pixels[i + 1] = data.data[offset + 1];
        pixels[i + 2] = data.data[offset + 2];
      }
    }

    stage.canvas.getContext('2d').putImageData(data, 0, 0);
  };

  var descriptor = {
    blocks: [
      [' ', 'set sine distortion to %n', 'setDistortion', 0],
      ['r', 'get sine distortion', 'getDistortion'],
      [' ', 'apply sine distortion', 'applySineDistortion']
    ]
  };

  ScratchExtensions.register('Sine Distortion', descriptor, ext);

})({});
