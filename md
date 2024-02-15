 function getNumberOfDays(start, end, startTimeId, endTimeId) {
    // console.log(startTimeId)
    if(!start || !end){
      return 0;
    }
    const date1 = new Date(start);
    const date2 = new Date(end);
    const oneDay = 1000 * 60 * 60 * 24;
  
    // if (date1.toDateString() === date2.toDateString()) {
    //    if(startTimeId === 1 && endTimeId === 2){
    //     diffInDays- 0.5;
    //   }  
    // } 

      const diffInTime = date2.getTime() - date1.getTime();
      const diffInDays = Math.round(diffInTime / oneDay);


      return diffInDays + 1;
    
  }
