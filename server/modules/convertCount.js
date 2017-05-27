var reflectionCountByDate = [];
var convertCount = function(countData){
  for (i=0; i<countData.length; i++){
    var countByDate = {
      date: '',
      count: 0
    };
    countByDate.date = countData[i]._id.month + '/' + countData[i]._id.day + '/' + countData[i]._id.year;
    countByDate.count = countData[i].count;
    reflectionCountByDate.push(countByDate);
  }
  console.log('countByDate: ', reflectionCountByDate);
  return reflectionCountByDate;
};

module.exports = convertCount;
