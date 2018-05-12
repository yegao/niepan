module.exports = function (source) {
  var reg = new RegExp('<np>.*?</np>','g');
  return "module.exports = " + JSON.stringify(source.replace(reg,'<div>-------------</div>'));
}
