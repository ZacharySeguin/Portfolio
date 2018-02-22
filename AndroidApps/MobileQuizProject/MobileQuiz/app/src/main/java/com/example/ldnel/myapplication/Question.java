package com.example.ldnel.myapplication;

import android.util.Log;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;


/*
Modifications by Zachary Seguin 101000589
*/
public class Question {

    private static final String TAG = Question.class.getSimpleName();

    //XML tags the define Question properties
    public static final String XML_QUESTION = "question";
    public static final String XML_QUESTION_TEXT = "question_text";
    public static final String XML_ID = "id";
    public static final String XML_OPTIONS = "options";
    public static final String XML_OPTION1 = "answerA";
    public static final String XML_OPTION2 = "answerB";
    public static final String XML_OPTION3 = "answerC";
    public static final String XML_OPTION4 = "answerD";
    public static final String XML_OPTION5 = "answerE";
    public static final String XML_ATTR_CONTRIBUTER = "contributor";

    private int QID;
    private String mQuestionString; //id of string resource representing the question
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String optionE;
    private String mContributor; //author or contributor of the question

    public Question(int id, String aQuestion, String a, String b, String c, String d, String e){
        QID = id;
        mQuestionString = aQuestion;
        optionA = a;
        optionB = b;
        optionC = c;
        optionD = d;
        optionE = e;
        mContributor = "anonymous";

    }
    public Question(int id, String aQuestion, String a, String b, String c, String d, String e, String contributer){
        QID = id;
        mQuestionString = aQuestion;
        optionA = a;
        optionB = b;
        optionC = c;
        optionD = d;
        optionE = e;
        if(contributer != null && !contributer.isEmpty())
            mContributor = contributer;
        else
            mContributor = "anonymous";

    }
    public String getQuestionText(){
        return mQuestionString;
    }

    public int getQID(){return QID;}
    public String getQuestionString(){return mQuestionString;}
    public String getA(){return optionA;}
    public String getB(){return optionB;}
    public String getC(){return optionC;}
    public String getD(){return optionD;}
    public String getE(){return optionE;}
    public String getContributer(){return mContributor;}

    public String toString(){
        String toReturn = "";
        if(mContributor != null && !mContributor.isEmpty())
            toReturn += "[" + mContributor + "] ";
        toReturn += mQuestionString;
        return toReturn;
    }

}
