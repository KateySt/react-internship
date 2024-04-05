import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { getQuizAsync, selectQuiz, takeQuizAsync, updateQuestion } from 'Store/features/quiz/QuizSliece';
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import StyleButton from 'Components/button/StyleButton';
import { Question } from 'Types/Question';

const QuizPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const quiz = useAppSelector(selectQuiz);
  const handleChangeQuestionCorrectAnswer = (questionCorrectAnswer: number, questionIndex: number) => {
    if (!quiz) return;
    const updatedQuestion = {
      ...quiz.questions_list[questionIndex],
      question_correct_answer: questionCorrectAnswer,
    };
    dispatch(updateQuestion(updatedQuestion));
  };

  useEffect(() => {
    dispatch(getQuizAsync(Number(id)));
  }, [id]);

  const handleSendAnswer = async () => {
    if (!quiz) return;
    const transformedQuiz = {
      answers: quiz.questions_list.reduce((acc, question) => {
        if (question.question_id !== undefined) {
          acc[question.question_id.toString()] = question.question_answers[question.question_correct_answer];
        }
        return acc;
      }, {} as { [key: string]: string }),
    };
    await dispatch(takeQuizAsync(quiz.quiz_id, transformedQuiz));
    navigate(-1);
  };

  return (
    <>
      {quiz &&
        <Box mt={3}>
          <Typography variant="h4" mb={2} textAlign="center">Quiz Details</Typography>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h5" mb={2}>Name: {quiz.quiz_name}</Typography>
              {quiz.quiz_title &&
                <Typography variant="body1" mt={2}>Title: {quiz.quiz_title}</Typography>}
              <Divider />
              {quiz.quiz_description &&
                <Typography variant="body1" mt={2}>Description: {quiz.quiz_description}</Typography>}
              <Typography variant="body2" mt={2}>Frequency: {quiz.quiz_frequency} days</Typography>
              <Typography variant="body2">Created by: {quiz.created_by.user_firstname}</Typography>
              <Divider />
              <Typography variant="h6" mt={3}>Questions</Typography>
              <List>
                {quiz.questions_list.map((question: Question, index: number) => (
                  <>
                    <ListItem key={index}>
                      <ListItemText primary={question.question_text} />
                    </ListItem>
                    <FormControl component="fieldset">
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name={`controlled-radio-buttons-group-${index}`}
                        value={question.question_correct_answer}
                        onChange={(e) => handleChangeQuestionCorrectAnswer(Number(e.target.value), index)}
                      >
                        {question.question_answers.map((answer: string, answerIndex: number) => (
                          <FormControlLabel key={answerIndex} value={answerIndex} control={<Radio color="secondary" />}
                                            label={answer} />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </>
                ))}
              </List>
            </Box>
            <StyleButton text={'Send'} onClick={handleSendAnswer} />
          </Paper>
        </Box>
      }
    </>
  );
};

export default QuizPage;