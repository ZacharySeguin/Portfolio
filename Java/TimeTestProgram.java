public class TimeTestProgram { 
    public static void main(String args[]) { 
        System.out.println(new Time(9,30)); // should display 9:30 
        System.out.println(new Time(21,30)); // should display 21:30 
        System.out.println(new Time(10,93)); // should display 11:33 
        System.out.println(new Time(9.5)); // should display 9:30 
        System.out.println(new Time(21.5)); // should display 21:30 
        System.out.println(new Time(0,0)); // should display 0:00 
        System.out.println(new Time(0)); // should display 0:00 
        System.out.println(new Time(1,1)); // should display 1:01
        
        System.out.println(Time.difference(new Time(1,10), new Time(10,10))); // should display 9:00
        System.out.println(Time.difference(new Time(7,50), new Time(8,10))); // should display 0:20
        System.out.println(Time.difference(new Time(12,57), new Time(2,10))); // should display -10:47 or -10:-47
    } 
}