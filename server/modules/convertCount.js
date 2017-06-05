//gives the client the date in the format specified for the graph labels
var convertCount = function(countData){
  var reflectionCountByDate = [];
  for (i=0; i<countData.length; i++){
    var countByDate = {
      date: '',
      count: 0
    };
    countByDate.date = countData[i]._id.month + '/' + countData[i]._id.day + '/' + countData[i]._id.year;
    countByDate.count = countData[i].count;
    reflectionCountByDate.push(countByDate);
  }
  return reflectionCountByDate;
};

module.exports = convertCount;
