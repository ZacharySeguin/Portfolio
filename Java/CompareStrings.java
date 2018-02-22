public class CompareStrings {
  public static boolean match(String x, String y) {
    // "*" represents any number of chars and also any char
    // "@" represents one char that can fit any char
    if(x.equals("")){
      if(y.equals("")){
        return true; 
      }else if(y.charAt(0) == '*'){
        return (match(x , y.substring(1)));
      }
      else{
        return false; 
      }
    }
    else{
      if(y.equals("")){
        return false;
      }
      else if(y.charAt(0) == '*'){
        if (y.length() == 1) {
          return true;
        } else if (y.charAt(1) == '*') {
          return match(x, y.substring(1));
        } else if (y.charAt(1) == '@') {
          //I know that this isnt entirely correct but I couldn't figure out how to do this without loops
          y = "*"+y.substring(2); //Remove @ symbol
          return match(x, y);
        } else {
          if (x.indexOf(y.charAt(1)) == -1) {
            return false;
          }
          else {
            return match(x.substring(x.indexOf(y.charAt(1))),y.substring(1));
          }
        }
      }
      else {
        if (x.charAt(0) == y.charAt(0) || y.charAt(0) == '@') {
          return match(x.substring(1), y.substring(1));
        }
        else {
          return false;
        }
      }
    }
  } 
  
  public static void main(String args[]) {
    System.out.println(match("hello", "hello")); //true
    System.out.println(match("hello", "h@llo")); //true
    System.out.println(match("hello", "h@@@@")); //true
    System.out.println(match("hello", "h*"));  //true
    System.out.println(match("hello", "*l*"));  //true
    System.out.println(match("anyString", "*"));  //true
    System.out.println(match("help", "h@@@@")); //false
    System.out.println(match("help", "h*"));  //true
    System.out.println(match("help", "*l*"));  //true
    System.out.println(match("help", "*l*p"));  //true
    System.out.println(match("help", "h@llo")); //false
    System.out.println(match("", "*"));  //true
    System.out.println(match("", "***"));  //true
    System.out.println(match("", "@"));  //false
    
    // I added these test cases on November 25th to ensure that everyone has proper code
    // All should result in false
    System.out.println(match("A", "B")); 
    System.out.println(match("ABCD", "ABDC")); 
    System.out.println(match("AB", "*C")); 
    System.out.println(match("ABCDE", "A*F")); 
    System.out.println(match("ABC", "A@D")); 
    System.out.println(match("", "*@*")); 
  }  
}