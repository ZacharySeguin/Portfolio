public class Car {
  //defining all of the car variables
  String liscensePlate;
  boolean permit;
  Time enteringTime;
  boolean entered = false; 
  int enteredLot;
  int leftLot;
  public Car (String p1){//constructor for car accepting one string variable
    liscensePlate = p1;
    permit = false; 
  }
   public Car (String p1, boolean p2){//constructor for car accepting two variables
    liscensePlate = p1;
    permit = p2; 
  }
  public String toString() {//toString method to neatly display the car info
   if(permit)
     return ("Car " + liscensePlate + " with permit");
   else
     return ("Car " + liscensePlate);
  }
}