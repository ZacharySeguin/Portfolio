#|Programming Paradigms
Author: Zachary Seguin
|#

;Testing and additional comments are at the bottom of this document.
;Question 1 *Testing for this question is done here because they execute right away without having to be called*
;----------------------------------------------
;Q1 a. Convert 1 + -2 + 3 + -4 + 5 + -6 to Scheme
(display "Result of 1 + -2 + 3 + -4 + 5 + -6 = ")
(+ 1 -2 3 -4 5 -6);Expected output = -3

;Q1 b. Convert 7 + 12 * 5 - ((8/2 + 3) * (9/3 - 1)) to Scheme
(display "Result of 7 + 12 * 5 - ((8/2 + 3) * (9/3 - 1)) = ")
(- (+ 7 (* 12 5)) (*(+ 3 (/ 8 2))(- (/ 9 3) 1)));Expected output = 53

;Q1 c. Convert (36/9 * (6/2 + 6/3) * 5 * 10 + 9) * 2 to Scheme
(display "Result of (36/9 * (6/2 + 6/3) * 5 * 10 + 9) * 2 = ")
(* (+ (* (* (* (/ 36 9)(+ (/ 6 2)(/ 6 3))) 5) 10) 9) 2);Expected output = 2018

;Q1 d. Convert (1/4 + 3/7) * 4.5 + 2.7 to Scheme
(display "Result of (1/4 + 3/7) * 4.5 + 2.7 = ")
(+ (* (+ (/ 1 4)(/ 3 7))4.5) 2.7);Expected output = 5.753571429 (done on calculator, rounds up to 9 at last decimal place)
(newline)
;----------------------------------------------

;Question 2
;----------------------------------------------
;Q2 a. Create procedure (reciprocal x)
;The reciprocal method is for determining the reciprocal of the number that is passed in. 
; Input: integer -> number to get the reciprocal of
; Output: reciprocal of the passed number x
(define (reciprocal x);Defining procedure
  (if(= 0 x)#f(/ 1 x)))


;Q2 b. Create the procedure for f(x)= 3x + 12/(x+1)
;The f(x) method is meant to calculate the result of the following expression: 3x + 12/(x+1)
; Input: integer -> number to sub in for x
; Output: calculated result from expression: 3x + 12/(x+1)
(define (f x)
  (+ (* 3 x)(/ 12 (+ x 1))))


;Q2 c. Create the procedure for g(x)= x * 4^-1
;The g(x) method is meant to calculate the result of the following expression: x * 4^-1
; Note that the previous reciprocal procedure is used here to simplify the 4^-1 step as this is equivalent to 1/4 or reciprocal of 4. 
; Input: integer -> number to sub in for x
; Output: calculated result from expression: x * 4^-1
(define (g x)
  (* x (reciprocal 4)))


#|Q2 d. Provide substitution model in applicative order for:
*Note I did substitution one procedure at a time (first come first serve)*
(+ (f (- (* 3 2) 1))(g (reciprocal (/ 1 12))))
(+ (f (- 6 1))(g (reciprocal (/ 1 12))))
(+ (f 5)(g (reciprocal (/ 1 12))))
(+ (+ (* 3 5)(/ 12 (+ 5 1)))(g (reciprocal (/ 1 12))))
(+ (+ 15 (/ 12 6))(g (reciprocal (/ 1 12))))
(+ (+ 15 2)(g (reciprocal (/ 1 12))))
(+ 17 (g (reciprocal (/ 1 12))))
(+ 17 (g (reciprocal 1/12)))
(+ 17 (g (/ 1 1/12)));Omitting if statement inside of reciprocal procedure (not passing in a 0)
(+ 17 (g 12))
(+ 17 (* 12 (reciprocal 4)))
(+ 17 (* 12 (/ 1 4)));Omitting if statement inside of reciprocal procedure (not passing in a 0)
(+ 17 (* 12 1/4))
(+ 17 3)
20
|#

#|Q2 e. Provide substitution model in normal order for:
*Note I did substitution one procedure at a time (first come first serve)*
(+ (f (- (* 3 2) 1))(g (reciprocal (/ 1 12))))
(+ (+ (* 3 (- (* 3 2) 1))(/ 12 (+ (- (* 3 2) 1) 1)))(g (reciprocal (/ 1 12))))
(+ (+ (* 3 (- 6 1))(/ 12 (+ (- 6 1) 1)))(g (reciprocal (/ 1 12))))
(+ (+ (* 3 5)(/ 12 (+ 5 1)))(g (reciprocal (/ 1 12))))
(+ (+ 15 (/ 12 6))(g (reciprocal (/ 1 12))))
(+ (+ 15 2)(g (reciprocal (/ 1 12))))
(+ 17 (g (reciprocal (/ 1 12))))
(+ 17 (g (/ 1 (/ 1 12))))
(+ 17 (* (/ 1 (/ 1 12))(reciprocal 4)))
(+ 17 (* (/ 1 (/ 1 12))(/ 1 4)))
(+ 17 (* (/ 1 1/12)(/ 1 4)))
(+ 17 (* 12 1/4))
(+ 17 3)
20
|#
;----------------------------------------------

;Question 3
;----------------------------------------------
;Create the procedure (quadratic a b c) to calculate the roots of a quadratic formula with coefficient a, b, and c.
;The quadratic method is meant to calculate the root of a quadratic equation (solving it). 
; Input: integer -> number to sub in for a
; Input: integer -> number to sub in for b
; Input: integer -> number to sub in for c
; Output: The + root of the passed quadratic equation (not calculating the - root)
(define (quadratic a b c);Scheme quadratic formula ---> (/ (+ b (sqrt(- (* b b)(* 4 a c))))(* 2 a))
  (cond((= 0 a)#f);If a = 0 return #f
       ((< (- (* b b)(* 4 a c)) 0) #f);If (b^2 - 4ac) is negative return #f 
       (else (/ (+ (- b) (sqrt(- (* b b)(* 4 a c))))(* 2 a))));Evaluate quadratic value (only calculating the -b + ... version of the formula)
  )
;----------------------------------------------

;Question 4
;----------------------------------------------
;Q4 a. Construct a Scheme procedure (fib n) that computes the nth fibonacci number.
;The fib method is meant to calculate the nth fibonacci number. 
; Input: integer -> n represents the nth fibonacci number you are trying to calculate. 
; Output: nth fibonacci number, for example n = 5 output = 5th fibonacci number. 
(define (fib n)
     (- (*(/ 1 (sqrt 5))(expt(/ (+ 1 (sqrt 5)) 2)n))
        (*(/ 1 (sqrt 5))(expt(/ (- 1 (sqrt 5)) 2)n))))

;Q4 b. Validate the behaviour of part (a) by implementing the recursive definition of the fibonnaci sequence.
;The fibrec method is meant to calculate the nth fibonacci number using a recursive solution. 
; Input: integer -> n represents the nth fibonacci number you are trying to calculate. 
; Output: nth fibonacci number, for example n = 5 output = 5th fibonacci number. 
(define (fibrec n);*Please note* running this procedure passing in a larger number will make the program slow down exponentially.
     (cond  ((= n 0) 0)
           ((= n 1) 1)
           (else (+ (fibrec (- n 1))
                    (fibrec (- n 2))))))

;Q4 c. Construct a procedure called testfib that takes in a value n and a precision value.
;The testfib method is meant to calculate the precision of the two previous fib and fibrec procedures by comparing their outputs.  
; Input: integer -> n represents the nth fibonacci number you are trying to calculate, p represents the precision number (p = 0 fibrec output must == fib output)
; Output: results from both fib and fibrec (nth fibonacci numbers) and a boolean value (#t if difference is within precision, #f if not)
(define (testfib n p)
  (define p1 (fib n))
  (define p2 (fibrec n))
  (display "(fib ")(display n)(display ") => ")(display p1)(newline)
  (display "(fibrec ")(display n)(display ") => ")(display p2)(newline)
  (if(and
      (<= (- p1 p2) p);Need two lines here to account for upper and lower bound of the precision number
      (>= (- p1 p2) (- 0 p))
      )#t #f)
  )
;----------------------------------------------

;Question 5
;----------------------------------------------
#|(define (p)(p));Define function p, that just calls function (p)
(define (test x y);Stuck applicative
   (if (= x 0)x y));Normal order x!=0 stuck here p gets called over and over again
(test 0 (p))
Q5 a. Calling (Test 0 (p)) will pass in a primitive value 0 and procedure p (which calls itself forever).
At (define (test 0 (p))) the applicative order interpreter will try to evaluate (p) which is going to
cause it to enter an infinite loop where (p) calls itself forever.

Q5 b. When (Test 0 (p)) is called in a normal-order interpreter such as Lazy Racket, the procedure Test will
run (it will actually reach the if statement where it will check if x = 0), if x = 0 it will return
0 but if x != 0 it will then call the procedure (p) which will cause it to enter the infinit call
loop like part a. of this question.
|#
;----------------------------------------------

;Question 6
;----------------------------------------------
(define (a-b a b)
   ((cond ((> b 0) +)
          ((= b 0) -)
          (else *)) a b))

#|Substitution model for this example:
(define (a-b a b)
   ((cond ((> b 0) +)((= b 0) -)(else *)) a b))
(define (a-b 1 2)
((cond ((> 2 0) +)((= 2 0) -)(else *)) 1 2))*b is > 0 so apply addition procedure*
((cond (#t +)(#f -)(else *)) 1 2));Condition is true for + opperator so add a and b.
(+ 1 2)
3

*Passing in compound expressions*
(a-b (* 3 5)(- 8 12))
(a-b 15 -4)*Expressions reduced to primitive values before executing procedure due to applicative order*
((cond ((> -4 0) +)((= -4 0) -)(else *)) 15 -4))
((cond (#f +)(#f -)(#t *)) 15 -4))*Else statement is reached therefor apply * opperator, multiply 15 by -4*
(* 15 -4)
-60

*Passing in compound expression and 0*
(a-b (/ 12 4) 0)
(a-b 3 0)
((cond ((> 0 0) +)((= 0 0) -)(else *)) 3 0))
((cond (#f +)(#t -)(else *)) 3 0))*b = 0 condition met so use - opperator*
(- 3 0)
3
|#
;----------------------------------------------

;*TESTING FOR Q2*
;Q2 a.
;(define (reciprocal x);
;  (if(= 0 x)#f(/ 1 x)))
;simple cases
(display "Testing Q2 part a: (reciprocal 5)=> ")(newline)
   (display "Expected: 1/5")(newline)
   (display "Actual: ")(reciprocal 5)(newline)
(display "Testing Q2 part a: (reciprocal 14)=> ")(newline)
   (display "Expected: 1/14")(newline)
   (display "Actual: ")(reciprocal 14)(newline)

;negative val case
(display "Testing Q2 part a: (reciprocal -12)=> ")(newline)
   (display "Expected: -1/12")(newline)
   (display "Actual: ")(reciprocal -12)(newline)

;if statement check
(display "Testing Q2 part a: (reciprocal 0)=> ")(newline)
   (display "Expected: #f")(newline)
   (display "Actual: ")(reciprocal -0)(newline)

;large number
(display "Testing Q2 part a: (reciprocal (* 200 123))=> ")(newline)
   (display "Expected: 1/24600")(newline)
   (display "Actual: ")(reciprocal (* 200 123))(newline)

;Q2 b.
;(define (f x)
;  (+ (* 3 x)(/ 12 (+ x 1))))
;base cases
(display "Testing Q2 part b: (f 5)=> ")(newline)
   (display "Expected: 17")(newline)
   (display "Actual: ")(f 5)(newline)
(display "Testing Q2 part b: (f 0)=> ")(newline)
   (display "Expected: 12")(newline)
   (display "Actual: ")(f 0)(newline)

;negative case
(display "Testing Q2 part b: (f -7)=> ")(newline)
   (display "Expected: -23")(newline)
   (display "Actual: ")(f -7)(newline)

;large number
(display "Testing Q2 part b: (f 412)=> ")(newline)
   (display "Expected: 510480/413")(newline)
   (display "Actual: ")(f 412)(newline)

;Q2 c. 
;(define (g x)
;  (* x (reciprocal 4)))
;base cases
(display "Testing Q2 part c: (g 12)=> ")(newline)
   (display "Expected: 3")(newline)
   (display "Actual: ")(g 12)(newline)
(display "Testing Q2 part c: (g 0)=> ")(newline)
   (display "Expected: 0")(newline)
   (display "Actual: ")(g 0)(newline)

;negative case
(display "Testing Q2 part c: (g -5)=> ")(newline)
   (display "Expected: -5/4")(newline)
   (display "Actual: ")(g -5)(newline)

;large number
(display "Testing Q2 part c: (g 999)=> ")(newline)
   (display "Expected: 999/4")(newline)
   (display "Actual: ")(g 999)(newline)

;*TESTING FOR Q3*
;(define (quadratic a b c)
;base cases
(display "Testing Q3: (quadratic 1 2 -4)=> ")(newline)
   (display "Expected: 1.24")(newline)
   (display "Actual: ")(quadratic 1 2 -4)(newline)
(display "Testing Q3: (quadratic 2 5 -12)=> ")(newline)
   (display "Expected: 3/2")(newline)
   (display "Actual: ")(quadratic 2 5 -12)(newline)

;cond1 check
(display "Testing Q3: (quadratic 0 1 2)=> ")(newline)
   (display "Expected: #f")(newline)
   (display "Actual: ")(quadratic 0 1 2)(newline)

;cond2 check
(display "Testing Q3: (quadratic 2 12 24)=> ")(newline)
   (display "Expected: #f")(newline)
   (display "Actual: ")(quadratic 2 12 24)(newline)

;*TESTING FOR Q4*
;Q4 a. (define (fib n)
;base cases
(display "Testing Q4 part a: (fib 6)=> ")(newline)
   (display "Expected: 8")(newline)
   (display "Actual: ")(fib 6)(newline)
(display "Testing Q4 part a: (fib 0)=> ")(newline)
   (display "Expected: 0")(newline)
   (display "Actual: ")(fib 0)(newline)
(display "Testing Q4 part a: (fib 12)=> ")(newline)
   (display "Expected: 144")(newline)
   (display "Actual: ")(fib 12)(newline)

;large number
(display "Testing Q4 part a: (fib 40)=> ")(newline)
   (display "Expected: 102334155")(newline)
   (display "Actual: ")(fib 40)(newline)

;Q4 b. (define (fibrec n))
;base cases
(display "Testing Q4 part b: (fibrec 8)=> ")(newline)
   (display "Expected: 21")(newline)
   (display "Actual: ")(fibrec 8)(newline)
(display "Testing Q4 part b: (fibrec 0)=> ")(newline)
   (display "Expected: 0")(newline)
   (display "Actual: ")(fibrec 0)(newline)
(display "Testing Q4 part b: (fibrec 10)=> ")(newline)
   (display "Expected: 55")(newline)
   (display "Actual: ")(fibrec 10)(newline)

;large number
(display "Testing Q4 part b: (fibrec 21)=> ")(newline);Runs slower so decided to a "smaller" large number.
   (display "Expected: 10946")(newline)
   (display "Actual: ")(fibrec 21)(newline)

;Q4 c. (define (testfib n p))
;base cases
(display "Testing Q4 part c: (testfib 12 0)=> ")(newline)
   (display "Expected: #f")(newline)
   (display "Actual: \n")(testfib 12 0)(newline)
(display "Testing Q4 part c: (testfib 10 0)=> ")(newline)
   (display "Expected: #t")(newline)
   (display "Actual: \n")(testfib 10 0)(newline)

;precision changes
(display "Testing Q4 part c: (testfib 30 0)=> ")(newline)
   (display "Expected: #t")(newline)
   (display "Actual: \n")(testfib 30 1)(newline)
(display "Testing Q4 part c: (testfib 21 0.0000000000001)=> ")(newline)
   (display "Expected: #f")(newline)
   (display "Actual: \n")(testfib 21 0.0000000000001)(newline)
(display "Testing Q4 part c: (testfib 28 0.5)=> ")(newline)
   (display "Expected: #t")(newline)
   (display "Actual: \n")(testfib 28 0.5)(newline)

;negative precision
(display "Testing Q4 part c: (testfib 20 -1)=> ")(newline)
   (display "Expected: #f")(newline)
   (display "Actual: \n")(testfib 20 -1)(newline)