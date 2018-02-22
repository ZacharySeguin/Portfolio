package com.example.ldnel.myapplication;

/*Code by Zachary Seguin*/

import android.content.Intent;
import android.graphics.Color;
import android.nfc.Tag;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.TextView;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;

public class QuizActivity extends AppCompatActivity {

    private static final String TAG = QuizActivity.class.getSimpleName();

    private Button mNextButton;
    private Button mPrevButton;
    private RadioButton optionA;
    private RadioButton optionB;
    private RadioButton optionC;
    private RadioButton optionD;
    private RadioButton optionE;

    private String currAnswer; //Current selection (checks toggled radio button)
    private TextView mQuestionTextView;
    private ArrayList<Question> questions; //ArrayList of Question objects to be displayed on the screen
    private String[] userAnswers; //String array of user answers {"a", "b" etc...}
    private static String QUESTION_INDEX_KEY = "question_index";
    private static String CURRENT_ANSWERS_KEY = "current_answers";
    private int questionIndex; //Current question being displayed on screen

    //Function below executes when emulator is flipped to its side or instance state is interrupted and saved
    @Override
    public void onSaveInstanceState(Bundle savedInstanceState){
        super.onSaveInstanceState(savedInstanceState);
        savedInstanceState.putInt(QUESTION_INDEX_KEY, questionIndex); //Store current question index to retrieve upon reload
        savedInstanceState.putStringArray(CURRENT_ANSWERS_KEY, userAnswers); //Store current user answers to be displayed upon reload
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_quiz); //set and inflate UI to manage

        //Getting all UI elements
        optionA = (RadioButton) findViewById(R.id.selectA);
        optionB = (RadioButton) findViewById(R.id.selectB);
        optionC = (RadioButton) findViewById(R.id.selectC);
        optionD = (RadioButton) findViewById(R.id.selectD);
        optionE = (RadioButton) findViewById(R.id.selectE);
        mPrevButton = (Button) findViewById(R.id.prev_button);
        mNextButton = (Button) findViewById(R.id.next_button);
        currAnswer = "";

        mQuestionTextView = (TextView) findViewById(R.id.question_text_view);
        mQuestionTextView.setTextColor(Color.BLUE);


        mPrevButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){ //Executes upon clicking "Prev" button
                Log.i(TAG, "Prev Button Clicked");
                if(questionIndex > 0) questionIndex--; //Subtract 1 from question index
                if(userAnswers[questionIndex] != " "){ //If question has been answered, load the answer
                    Log.i(TAG, "Loading previous answer " + userAnswers[questionIndex]);
                    selectCorrectButton(userAnswers[questionIndex]); //Toggles correct button according to what the user answered previously
                }
                reloadUi(); //Re-displays question with answer options
            }

        });
        mNextButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){ //Executes upon clicking "Next" button
                Log.i(TAG, "Next Button Clicked");
                if(questionIndex < questions.size()) questionIndex++; //Add 1 to the question index (move forward)
                if(questionIndex == questions.size()){ //If quiz is finished
                    Log.i(TAG, "Reached the end of the test!");
                    Log.i(TAG, "User answers: " + displayUserAnswers());
                    Intent i = new Intent(getApplicationContext(), Final.class); //Set up intent to switch to "Final" activity
                    i.putExtra("userInputs",userAnswers); //Pass in user answers array to new activity
                    startActivity(i); //Switch to "Final" activity
                }
                else {
                    if(userAnswers[questionIndex] != " "){ //If next answer has been inputed already, reload it
                        Log.i(TAG, "Loading next answer " + userAnswers[questionIndex]);
                        selectCorrectButton(userAnswers[questionIndex]);
                    }
                    reloadUi(); //Re-displays question with answer options
                }
            }

        });
        //Initialise Data Model objects
        //questions = Question.exampleSet1();
        questions = null;


        //Try to read resource data file with questions

        ArrayList<Question> parsedModel = null; //Model representing the return of parser inside of "Exam" class
        try {
            InputStream iStream = getResources().openRawResource(R.raw.comp2601exam); //Attach input stream to raw xml resource
            BufferedReader bReader = new BufferedReader(new InputStreamReader(iStream));
            parsedModel = Exam.pullParseFrom(bReader); //Calls parser and returns arrar list of question objects
            bReader.close();
        }
        catch (java.io.IOException e){
            e.printStackTrace();

        }
        if(parsedModel == null || parsedModel.isEmpty())
            Log.i(TAG, "ERROR: Questions Not Parsed");
        questions = parsedModel;

        if(questions != null && questions.size() > 0) { //Populate text in the UI with initial question
            mQuestionTextView.setText("" + (questionIndex + 1) + ") " + questions.get(questionIndex).getQuestionText());
            optionA.setText("A: " + questions.get(questionIndex).getA());
            optionB.setText("B: " + questions.get(questionIndex).getB());
            optionC.setText("C: " + questions.get(questionIndex).getC());
            optionD.setText("D: " + questions.get(questionIndex).getD());
            optionE.setText("E: " + questions.get(questionIndex).getE());
        }
        Bundle extras = getIntent().getExtras(); //Pulls from any intent being passed to this activity
        if (extras != null) { //If data has been received from other activity
            userAnswers = extras.getStringArray("userInputsReview"); //Set user answers to received string array
            selectCorrectButton(userAnswers[questionIndex]); //Select radio button according to the first user answer passed from another activity
        }
        else if(savedInstanceState != null) { //If instance state reloaded
            Log.i(TAG, "Instance state reloaded!");
            questionIndex = savedInstanceState.getInt(QUESTION_INDEX_KEY); //Set question index to where we left off before the stop
            userAnswers = savedInstanceState.getStringArray(CURRENT_ANSWERS_KEY); //Set user answers array to what we had (user does not lose previous answers to questions)
            reloadUi();
        }
        else {
            userAnswers = new String[questions.size()]; //Set up user answers string array to match size of questions array passed from exam class
            for (int j = 0; j < userAnswers.length; j++) {
                userAnswers[j] = " "; //Populating the user answer array with empty strings (no null pointers)
            }
        }
    }
    public void reloadUi(){ //Reloads all of the UI text to display correct question and options
        resetButtons();
        if(userAnswers[questionIndex] != " "){
            selectCorrectButton(userAnswers[questionIndex]); //If question on this index has been answered select the correct radio button
        }
        if(questions != null && questions.size() > 0) {
            mQuestionTextView.setText("" + (questionIndex + 1) + ") " + questions.get(questionIndex).getQuestionText());
            optionA.setText("A: " + questions.get(questionIndex).getA());
            optionB.setText("B: " + questions.get(questionIndex).getB());
            optionC.setText("C: " + questions.get(questionIndex).getC());
            optionD.setText("D: " + questions.get(questionIndex).getD());
            optionE.setText("E: " + questions.get(questionIndex).getE());
        }
    }

    public String displayUserAnswers(){ //Returns String representing a parsed version of the userAnswers String array
        String parsedAnswers = "\n";
        for(int i=0; i<userAnswers.length; i++){
            parsedAnswers += "Question " + (i+1) + ": " + userAnswers[i] + "\n";
        }
        return parsedAnswers;
    }
    public void resetButtons(){ //Resets all buttons to false (needed when reloading UI)
        optionA.setChecked(false);
        optionB.setChecked(false);
        optionC.setChecked(false);
        optionD.setChecked(false);
        optionE.setChecked(false);
    }

    public void selectCorrectButton(String answer){ //Selects correct button according to answer selected by user (answer is pulled from userAnswers String array)
        switch (answer){
            case "A":
                optionA.setChecked(true);
                optionB.setChecked(false);
                optionC.setChecked(false);
                optionD.setChecked(false);
                optionE.setChecked(false);
                break;
            case "B":
                optionA.setChecked(false);
                optionB.setChecked(true);
                optionC.setChecked(false);
                optionD.setChecked(false);
                optionE.setChecked(false);
                break;
            case "C":
                optionA.setChecked(false);
                optionB.setChecked(false);
                optionC.setChecked(true);
                optionD.setChecked(false);
                optionE.setChecked(false);
                break;
            case "D":
                optionA.setChecked(false);
                optionB.setChecked(false);
                optionC.setChecked(false);
                optionD.setChecked(true);
                optionE.setChecked(false);
                break;
            case "E":
                optionA.setChecked(false);
                optionB.setChecked(false);
                optionC.setChecked(false);
                optionD.setChecked(false);
                optionE.setChecked(true);
                break;
            default:
                Log.i(TAG, "ERROR, Invalid String input! --> (selectCorrectButton(String answer))");
                break;
        }
    }
    public void onRadioButtonClicked(View view) {

        boolean checked = ((RadioButton) view).isChecked();

        // Check which radio button was clicked
        switch(view.getId()) {
            case R.id.selectA:
                if (checked) {
                    Log.i(TAG, "Option A selected.");
                    currAnswer = "A"; //Sets current answer
                    optionB.setChecked(false);
                    optionC.setChecked(false);
                    optionD.setChecked(false);
                    optionE.setChecked(false);

                }
                    break;
            case R.id.selectB:
                if (checked) {
                    Log.i(TAG, "Option B selected.");
                    currAnswer = "B"; //Sets current answer
                    optionA.setChecked(false);
                    optionC.setChecked(false);
                    optionD.setChecked(false);
                    optionE.setChecked(false);
                }
                    break;
            case R.id.selectC:
                if (checked) {
                    Log.i(TAG, "Option C selected.");
                    currAnswer = "C"; //Sets current answer
                    optionB.setChecked(false);
                    optionA.setChecked(false);
                    optionD.setChecked(false);
                    optionE.setChecked(false);
                }
                    break;
            case R.id.selectD:
                if (checked) {
                    Log.i(TAG, "Option D selected.");
                    currAnswer = "D"; //Sets current answer
                    optionB.setChecked(false);
                    optionC.setChecked(false);
                    optionA.setChecked(false);
                    optionE.setChecked(false);
                }
                    break;
            case R.id.selectE:
                if (checked) {
                    Log.i(TAG, "Option E selected.");
                    currAnswer = "E"; //Sets current answer
                    optionB.setChecked(false);
                    optionC.setChecked(false);
                    optionD.setChecked(false);
                    optionA.setChecked(false);
                }
                    break;
        }
        userAnswers[questionIndex] = currAnswer;
    }
}
