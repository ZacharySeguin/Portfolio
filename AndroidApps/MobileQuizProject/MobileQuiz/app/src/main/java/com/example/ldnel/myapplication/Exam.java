package com.example.ldnel.myapplication;

import android.util.Log;

import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;
import org.xmlpull.v1.XmlPullParserFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;

import static com.example.ldnel.myapplication.Question.XML_ID;
import static com.example.ldnel.myapplication.Question.XML_OPTION1;
import static com.example.ldnel.myapplication.Question.XML_OPTION2;
import static com.example.ldnel.myapplication.Question.XML_OPTION3;
import static com.example.ldnel.myapplication.Question.XML_OPTION4;
import static com.example.ldnel.myapplication.Question.XML_OPTION5;
import static com.example.ldnel.myapplication.Question.XML_OPTIONS;
import static com.example.ldnel.myapplication.Question.XML_QUESTION;
import static com.example.ldnel.myapplication.Question.XML_QUESTION_TEXT;

/*
Modifications by Zachary Seguin 101000589
*/
public class Exam {

    private static final String TAG = Exam.class.getSimpleName();

    //XML tags used to define an exam of multiple choice questions.
    public static final String XML_EXAM = "exam";
    public ArrayList<Question> myQuestions;

    public static ArrayList pullParseFrom(BufferedReader reader){

        ArrayList questions = new ArrayList();
        Question temp;
        Boolean inQuestionTag = false, inQuestionTxtTag = false, inATag = false, inBTag = false, inCTag = false, inDTag = false, inETag = false, inOptionsTag = false, inIdTag = false;
        String tempStr = "";
        int id = 0;
        String optionATxt = "";
        String optionBTxt = "";
        String optionCTxt = "";
        String optionDTxt = "";
        String optionETxt = "";
        Boolean tempAnswer = false;
        // Get our factory and create a PullParser
        XmlPullParserFactory factory = null;
        try {
            factory = XmlPullParserFactory.newInstance();
            XmlPullParser xpp = factory.newPullParser();

            xpp.setInput(reader); // set input file for parser
            int eventType = xpp.getEventType(); // get initial eventType

            // Loop through pull events until we reach END_DOCUMENT
            while (eventType != XmlPullParser.END_DOCUMENT) {

                // handle the xml tags encountered
                switch (eventType) {
                    case XmlPullParser.START_TAG: //XML opening tags
                        //Log.i(TAG, "START_TAG: " + xpp.getName());
                        if(xpp.getName().equals(XML_QUESTION)){
                            inQuestionTag = true;
                        }
                        if(xpp.getName().equals(XML_QUESTION_TEXT)){
                            inQuestionTxtTag = true;
                        }
                        if(xpp.getName().equals(XML_ID)){
                            inIdTag = true;
                        }
                        if(xpp.getName().equals(XML_OPTIONS)){
                            inOptionsTag = true;
                        }
                        if(xpp.getName().equals(XML_OPTION1)){
                            inATag = true;
                        }
                        if(xpp.getName().equals(XML_OPTION2)){
                            inBTag = true;
                        }
                        if(xpp.getName().equals(XML_OPTION3)){
                            inCTag = true;
                        }
                        if(xpp.getName().equals(XML_OPTION4)){
                            inDTag = true;
                        }
                        if(xpp.getName().equals(XML_OPTION5)){
                            inETag = true;
                        }

                        break;

                    case XmlPullParser.TEXT:
                        if(inQuestionTag && inQuestionTxtTag){ //Checks to see what kind of line reader is reading and sets appropriate values accordingly
                            tempStr = xpp.getText();
                        }
                        if(inQuestionTag && inIdTag){
                            id = Integer.parseInt(xpp.getText());
                        }
                        if(inQuestionTag && inATag && inOptionsTag){
                            optionATxt = xpp.getText();
                        }
                        if(inQuestionTag && inBTag && inOptionsTag){
                            optionBTxt = xpp.getText();
                        }
                        if(inQuestionTag && inCTag && inOptionsTag){
                            optionCTxt = xpp.getText();
                        }
                        if(inQuestionTag && inDTag && inOptionsTag){
                            optionDTxt = xpp.getText();
                        }
                        if(inQuestionTag && inETag && inOptionsTag){
                            optionETxt = xpp.getText();
                        }
                        break;

                    case XmlPullParser.END_TAG: //XML closing tags
                        //Log.i(TAG, "END_TAG: " + xpp.getName());
                        if(xpp.getName().equals(XML_QUESTION_TEXT)){
                            inQuestionTxtTag = false;
                        }
                        if(xpp.getName().equals(XML_ID)){
                            inIdTag = false;
                        }
                        if(xpp.getName().equals(XML_OPTION1)){
                            inATag = false;
                        }
                        if(xpp.getName().equals(XML_OPTION2)){
                            inBTag = false;
                        }
                        if(xpp.getName().equals(XML_OPTION3)){
                            inCTag = false;
                        }
                        if(xpp.getName().equals(XML_OPTION4)){
                            inDTag = false;
                        }
                        if(xpp.getName().equals(XML_OPTION5)){
                            inETag = false;
                        }
                        if(xpp.getName().equals(XML_OPTIONS)){
                            inOptionsTag = false;
                        }
                        if(xpp.getName().equals(XML_QUESTION)){
                            inQuestionTag = false;
                        }
                        break;

                    default:
                        break;
                }
                if(tempStr != "" && inQuestionTag){ //Displays parsed question and options for debugging
                    Log.i(TAG, "Question: " + tempStr);
                    Log.i(TAG, "A: " + optionATxt);
                    Log.i(TAG, "B: " + optionBTxt);
                    Log.i(TAG, "C: " + optionCTxt);
                    Log.i(TAG, "D: " + optionDTxt);
                    Log.i(TAG, "E: " + optionETxt);
                }
                if(!inQuestionTag && tempStr != ""){
                    temp = new Question(id, tempStr, optionATxt, optionBTxt, optionCTxt, optionDTxt, optionETxt); //Builds new question object
                    questions.add(temp); //Add question to questions array
                    //iterate
                    tempStr = ""; //Reset all values back to default
                    id = 0;
                    optionATxt = "";
                    optionBTxt = "";
                    optionCTxt = "";
                    optionDTxt = "";
                    optionETxt = "";
                }
                eventType = xpp.next();
            }
        } catch (XmlPullParserException e) {
            e.printStackTrace();
        } catch (java.io.IOException e) {
            e.printStackTrace();
        }

        return questions;

    }

}
