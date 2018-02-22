public class ParkingSimulationProgram {
  public static void carEnters(ParkingLot p, Car c, Time t) {
    c.enteredLot = p.lotNumber; //setting the entered lot number for checks later
    if(c.entered){ //if statement to make sure that this specific car has not been entered twice
      System.out.println("The same car is trying to be entered again. This is an input error, please make sure the car is only entered once.");
      return;
    }
    //updating values after entry
    p.currentCarCount++;
    c.entered = true; 
    c.enteringTime = t;
    if((p.currentCarCount) > (p.capacity)){ //if statement to check for overloaded capacity. If lot is full, move car to lot with spaces
      System.out.println(c + " arrives at lot #" + p.lotNumber + " at " + t + " but the lot is full.");  
      System.out.println(c + " cannot get in");
      p.currentCarCount--;
      c.entered = false; 
    }
    else{ //enters the car into the selected lot
      System.out.println(c + " enters lot #" + p.lotNumber + " at " + t); 
    }
  }
  
  public static void carLeaves(ParkingLot p, Car c, Time t) {
    c.leftLot = p.lotNumber;//setting the lotNumber that the car would leave from for checking
    
    if(!c.entered){//if statement to check if the car has been entered or not
      System.out.println("A car that has not been entered is trying to leave. This is an input error, please make sure the car is entered first.");
      return; 
    }
    if(c.enteredLot != c.leftLot){//if statement to check if the car is leaving from the same lot it entered
      System.out.println("A car from lot #" + c.enteredLot + " is trying to leave lot #" + c.leftLot + ". Please make sure that a car is leaving from the same lot it entered. In this case, lot #" + c.enteredLot + ".");
      return;
    }
    //updating values after cars leave
    p.currentCarCount--;
    c.entered = false; 
    String previousPlate = c.liscensePlate; 
    Time d = (Time.difference((c.enteringTime),(t)));
    if(d.minutes < 0){//if statement to correct some errors durring calculation (converting time to decimal values)
      d.hours--;
      d.minutes = d.minutes + 60;
    }

    if(d.minutes !=0){//if statement to round up the minutes in an hour (1:25 = 2:00)
      d.hours++;
      d.minutes = 0;
    }
    double cost = (p.hourlyRate) * (d.hours);//calculating the cost of the parking spot
    
    if(cost > p.maxCharge){//if statement to check if the maximum charge has been reached, if so, set the cost to the maxCharge
      cost = p.maxCharge;
    }
    
    if(c.permit){//if statement to check for permit, if car has one, there is no cost, also prints the result
      System.out.println(c + " leaves lot #" + p.lotNumber + " at " + t);
      cost = 0;
    }
    else{//prints out all of the necessary information
      System.out.println(c + " leaves lot #" + p.lotNumber + " at " + t + " pays $" + cost + "0");
    }
    p.revenue = p.revenue + cost;//calculating revenue for that specific parking lot
  }
  
  
  public static void main(String args[]) { 
    //creating new cars
    Car  car1 = new Car("ABC 123"), car2 = new Car("ABC 124"), 
      car3 = new Car("ABD 314"), car4 = new Car("ADE 901"), 
      car5 = new Car("AFR 304"), car6 = new Car("AGD 888"), 
      car7 = new Car("AAA 111"), car8 = new Car("ABB 001"), 
      car9 = new Car("XYZ 678", true);
    //creating new parking lots
    ParkingLot p1 = new ParkingLot(1, 4);
    ParkingLot p2 = new ParkingLot(2, 6);
    //setting rates for these lots
    p1.hourlyRate = 5.5; 
    p1.maxCharge = 20.0; 
    p2.hourlyRate = 3.0;
    p2.maxCharge = 12.0; 
    //print statment to display lot information (calls toString on parkinglot.class
    System.out.println(p1); 
    System.out.println(p2 + "\n"); 
    //simulate cars entering the lots
    carEnters(p1, car1, new Time(7, 15)); 
    carEnters(p1, car2, new Time(7, 25)); 
    carEnters(p2, car3, new Time(8, 0)); 
    carEnters(p2, car4, new Time(8, 10)); 
    carEnters(p1, car5, new Time(8, 15)); 
    carEnters(p1, car6, new Time(8, 20)); 
    carEnters(p1, car7, new Time(8, 30)); 
    carEnters(p2, car7, new Time(8, 32)); 
    carEnters(p2, car8, new Time(8, 50)); 
    carEnters(p2, car9, new Time(8, 55)); 
    //displays updated lot info
    System.out.println("\n" + p1); 
    System.out.println(p2 + "\n"); 
    //simulate cars leaving parking lots
    carLeaves(p2, car4, new Time(9, 0)); 
    carLeaves(p1, car2, new Time(9, 05)); 
    carLeaves(p1, car6, new Time(10, 0)); 
    carLeaves(p1, car1, new Time(10, 30)); 
    carLeaves(p2, car8, new Time(13, 0)); 
    carLeaves(p2, car9, new Time(15, 15)); 
    carEnters(p1, car8, new Time(17, 10)); 
    carLeaves(p1, car5, new Time(17, 50)); 
    carLeaves(p2, car7, new Time(18, 0)); 
    carLeaves(p2, car3, new Time(18, 15)); 
    carLeaves(p1, car8, new Time(20, 55));
    //display updated lot info
    System.out.println("\n" + p1); 
    System.out.println(p2 + "\n"); 
    //display total revenues
    System.out.println("Total revenue of Lot 1 is $" + p1.revenue); 
    System.out.println("Total revenue of Lot 2 is $" + p2.revenue); 
    //this section is used for advanced test cases
    System.out.println("===============================================================");
    System.out.println("===============================================================");
    
    System.out.println("Testing car trying to leave lot before it has entered ...");
    Car  car10 = new Car("LEL 840");
    carLeaves(p1, car10, new Time(9, 0)); 
    
    System.out.println();
    System.out.println("Testing car entering and leaving lot at exact same time ...");
    Car  car11 = new Car("TOO CUTE");
    carEnters(p1, car11, new Time(9, 0));
    carLeaves(p1, car11, new Time(9, 0)); 
    
    System.out.println();
    System.out.println("Testing a car entering a lot twice and never leaving in between...");
    Car  car12 = new Car("NOT SO CUTE");
    carEnters(p1, car12, new Time(9, 0));
    carEnters(p1, car12, new Time(9, 0));
    
    System.out.println();
    System.out.println("Testing a car leaving a lot twice...never entering in between..."); //have not quite gotten this one to pass the first car through unfortunately 
    Car  car13 = new Car("FERDABOIS");
    carLeaves(p1, car13, new Time(9, 0)); 
    carLeaves(p1, car13, new Time(9, 1)); 
    
    System.out.println();
    System.out.println("Testing a car entering into one lot (say P1) but attempts to leave from another lot (say P2)...");
    Car  car14 = new Car("ABCDEFG");
    carEnters(p1, car14, new Time(9, 0)); 
    carLeaves(p2, car14, new Time(9, 0)); 

  }
}