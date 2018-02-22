public class Time{
  //defining all of the time variables
  int hours;
  int minutes;
  double remainder;
  double answer; 
  public Time (int p1, int p2){//constructor for new time accepting both hours and minutes
    if(p2 > 60){//if statement to add minutes into hours if minutes exceed 60
      p1++;
      p2 = (p2 - 60);
    }
    if((p1 == 0) && (p2 == 0)){//if statement to handle 0 values for hours and minutes
      hours = 0; 
      minutes = 0;
    }
    else{
    hours = p1;
    minutes = p2;  
    }
  }
  public Time (double p1){//contructor for new time accepting one variable
    if(p1%1 != 0){//if statement to check for decimal and convert it into time
      remainder = p1 - (Math.floor(p1));
      p1 = Math.floor(p1);
    }
    hours = (int)p1;
    answer = remainder * 60;
    minutes = (int)answer;
  }
  public Time (int p1){//constructor to deal with no input or input of 0
    if(p1 == 0)
      hours = 0;
      minutes = 0;
  }

  public String toString() {//toString method to neatly display time info
    if(hours == 1){ 
      if(minutes < 0){
       return ((hours - 1) + ":" + (60 + minutes));
      }
    }
    //if statements for certain scenarios 
    if(minutes == 0)
      return (hours + ":00");
    if((minutes < 10) && (minutes > 0))
      return (hours + ":0" + minutes);
    else
      return (hours + ":" + minutes);
  }
  public static Time difference(Time t1, Time t2){//static method to calculate the difference between two given times 
    int difHours = t2.hours - t1.hours;
    int difMinutes = t2.minutes - t1.minutes;
    return (new Time(difHours, difMinutes));
  }
}