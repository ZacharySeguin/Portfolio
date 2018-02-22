package com.example.ldnel.myapplication;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

/*
Code by Zachary Seguin 101000589
*/
public class Final extends AppCompatActivity {

    private Button reviewBtn;
    private Button submitBtn;
    private TextView displayUserAnswers;
    private String[] arr;
    private String userAnswers, userAnswersXML, emailAddr, userName, stuId;
    private EditText emailEdit, nameEdit, idEdit;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_final);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        //Attaching variables to view entities
        reviewBtn = (Button)findViewById(R.id.reviewBtn);
        submitBtn = (Button)findViewById(R.id.submitBtn);
        displayUserAnswers = (TextView)findViewById(R.id.userAnswerView);
        emailEdit = (EditText)findViewById(R.id.editEmailAddress);
        nameEdit = (EditText)findViewById(R.id.editStudentName);
        idEdit = (EditText)findViewById(R.id.editStudentId);

        Bundle extras = getIntent().getExtras(); //Check if data is received from other activity
        if (extras != null) {
            arr = extras.getStringArray("userInputs"); //Set string arr to passed data
            Log.i("Final Activity", "Received from QuizActivity: " + arr[0]);
        }
        stringifyFinalAnswers(); //Display user answers in textView
        reviewBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent returnToQuiz = new Intent(getApplicationContext(), QuizActivity.class); //Returns to QuizActitivty and passes in user answers
                returnToQuiz.putExtra("userInputsReview",arr);
                startActivity(returnToQuiz);
            }
        });
        submitBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                emailAddr = emailEdit.getText().toString(); //Pull data from input fields
                userName = nameEdit.getText().toString();
                stuId = idEdit.getText().toString();
                if(emailAddr.equals("") || userName.equals("") || stuId.equals("")){ //Check if fields have been filled
                    Toast.makeText(Final.this, "PLease fill out all of the fields before submitting", Toast.LENGTH_SHORT).show();
                }
                else {
                    Intent emailAnswers = new Intent(Intent.ACTION_SEND); //Start email intent and fill in email fields
                    emailAnswers.putExtra(Intent.EXTRA_EMAIL, new String[]{emailAddr}); //Fills in email recipient address
                    emailAnswers.putExtra(Intent.EXTRA_SUBJECT, "Quiz completed by: " + userName + " ID: " + stuId); //Fills in subject line of email
                    emailAnswers.putExtra(Intent.EXTRA_TEXT, stringifyFinalAnswers()); //Fills content of email with XML string return from stringifyFinalAnswers()
                    emailAnswers.setType("message/rfc822");
                    startActivity(Intent.createChooser(emailAnswers, "Select Email app"));
                }
            }
        });
    }
    public String stringifyFinalAnswers(){ //Displays user answers and returns XML formatted string to represent user answers
        userAnswers = "Your Answers: \n";
        for(int i=0; i<arr.length; i++){
            userAnswers += ("Q" + (i + 1) + ": " + arr[i] + "\n");
        }
        displayUserAnswers.setText(userAnswers); //Display user answers in readable format onto textView

        userAnswersXML = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"; //Building XML file for email to send
        userAnswersXML += "\n<answers>\n";
        for(int i=0; i<arr.length; i++){
            userAnswersXML += "<question>\n";
            userAnswersXML += "<id>" + (i+1) + "</id>\n";
            userAnswersXML += "<selected>" + arr[i] + "</selected>\n";
            userAnswersXML += "</question>\n";
        }
        userAnswersXML += "</answers>\n";
        Log.i("XML_STRING", userAnswersXML);
        return userAnswersXML; //Returns string formatted into XML for email
    }

}
