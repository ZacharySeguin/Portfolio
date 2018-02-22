public class ParkingLot{
  //defining parkinglot variables
  int lotNumber;
  double hourlyRate;
  double maxCharge;
  int capacity;
  int currentCarCount;
  double revenue = 0; 
  public ParkingLot (){//constructor for default parkinglot
    lotNumber = 0;
    hourlyRate = 2.0;
    maxCharge = 16.0; 
    capacity = 30;
    currentCarCount = 0; 
  }
  public ParkingLot (int p1, int p2){//constructor for parkinglot accepting two variables
    lotNumber = p1;
    hourlyRate = 2.0;
    maxCharge = 16.0; 
    capacity = p2;
    currentCarCount = 0; 
  }
  public ParkingLot (int p1, double p2, double p3, int p4){//contructor for custom, 4 variable, parkinglot
    lotNumber = p1;
    hourlyRate = p2;
    maxCharge = p3; 
    capacity = p4;
    currentCarCount = 0; 
  }
  public String toString() {//toString method to neatly display parkingLot info
    return ("Parking Lot #" + lotNumber + " - rate = $" + hourlyRate + ", capacity " + capacity + ", current cars " + currentCarCount);
  }
}