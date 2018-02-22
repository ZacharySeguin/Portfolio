public class ParkingLotTestProgram {
    public static void main(String args[]) {
        ParkingLot p0 = new ParkingLot();
        ParkingLot p1 = new ParkingLot(1, 4);
        ParkingLot p2 = new ParkingLot(2, 6);
        
        System.out.println(p0);
        System.out.println(p1);
        System.out.println(p2);
        
        p1.hourlyRate = 5.5;
        p1.maxCharge = 20.0;
        p2.hourlyRate = 3.0;
        p2.maxCharge = 12.0;
        
        System.out.println(p1);
        System.out.println(p2);
        System.out.println(p1.maxCharge);
        System.out.println(p2.maxCharge);
    }
}