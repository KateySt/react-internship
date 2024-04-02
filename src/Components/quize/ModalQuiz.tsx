import React from 'react';
import Modal from '../modal';
import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { Question } from 'Types/Question';
import DeleteIcon from '@mui/icons-material/Delete';
import StyleButton from '../button/StyleButton';
import { Quiz } from 'Types/Quiz';
import { NewQuiz } from 'Types/NewQuiz';

const MAX = 365;
const MIN = 1;
const marks = [
  {
    value: MIN,
    label: '',
  },
  {
    value: MAX,
    label: '',
  },
];
const ModalQuiz: React.FC<{
  open: boolean,
  handleClose: () => void,
  quiz: Quiz | NewQuiz,
  setQuiz: (e: any) => void,
  handleActionQuiz: () => void,
  handleQuestionTextChange: (index: number, newText: string) => void,
  handleDeleteQuestion: (index: number) => void,
  handleChangeQuestionCorrectAnswer: (questionCorrectAnswer: number, questionIndex: number) => void,
  handleAnswerTextChange: (index: number, answerIndex: number, newText: string) => void,
  handleEnterKeyPress: (event: React.KeyboardEvent<HTMLDivElement>, index: number, answerIndex: number) => void,
  handleDeleteAnswer: (index: number, answerIndex: number) => void,
  handleAddQuestion: (index: number) => void,
  isCreateButtonActive: boolean
}> = ({
        open,
        handleClose,
        quiz,
        setQuiz,
        handleActionQuiz,
        handleQuestionTextChange,
        handleDeleteQuestion,
        handleChangeQuestionCorrectAnswer,
        handleAnswerTextChange,
        handleEnterKeyPress,
        handleDeleteAnswer,
        handleAddQuestion,
        isCreateButtonActive,
      }) => {
  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      aria-labelledby="create-quiz-modal-title"
      aria-describedby="create-quiz-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        borderRadius: '2%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        width: 600,
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>
        <Typography variant="h5" id="create-quiz-modal-title" textAlign="center">Create a quiz</Typography>

        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={6}>
            <Typography variant="h6">Quiz Information</Typography>
            <TextField
              margin="normal"
              helperText="Please enter your quiz name"
              id="quiz-name"
              label="Name"
              fullWidth
              value={quiz.quiz_name}
              onChange={(e) => setQuiz({ ...quiz, quiz_name: e.target.value })}
            />

            <Box mt={2}>
              <Typography>Frequency (days)</Typography>
              <Slider
                marks={marks}
                step={10}
                value={quiz.quiz_frequency}
                valueLabelDisplay="auto"
                min={MIN}
                max={MAX}
                onChange={(_: Event, newValue: number | number[]) => setQuiz({
                  ...quiz,
                  quiz_frequency: newValue as number,
                })}
                color="secondary"
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  variant="body2"
                  onClick={() => setQuiz({ ...quiz, quiz_frequency: MIN })}
                  sx={{ cursor: 'pointer' }}
                >
                  {MIN} min
                </Typography>
                <Typography
                  variant="body2"
                  onClick={() => setQuiz({ ...quiz, quiz_frequency: MAX })}
                  sx={{ cursor: 'pointer' }}
                >
                  {MAX} max
                </Typography>
              </Box>
            </Box>

            <TextField
              margin="normal"
              id="outlined-multiline-static"
              label="Multiline"
              multiline
              helperText="Please enter your quiz description"
              rows={4}
              fullWidth
              defaultValue="Default Value"
              value={quiz.quiz_description}
              onChange={(e) => setQuiz({ ...quiz, quiz_description: e.target.value })}
            />
          </Grid>

          <Grid item xs={6}>
            <Box>
              <Typography variant="h6">Questions</Typography>
              {quiz.questions_list.map((question: Question, index: number) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Stack direction="row" alignItems="center">
                    <TextField
                      label="Question text"
                      fullWidth
                      value={question.question_text}
                      margin="normal"
                      onChange={(e) => handleQuestionTextChange(index, e.target.value)}
                    />
                    {quiz.questions_list.length > 2 && (
                      <IconButton onClick={() => handleDeleteQuestion(index)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>
                  {question.question_answers.map((answer: string, answerIndex: number) => (
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={question.question_correct_answer}
                        onChange={(e) => handleChangeQuestionCorrectAnswer(Number(e.target.value), index)}
                      >
                        <Stack key={answerIndex} direction="row" alignItems="center">
                          <FormControlLabel value={answerIndex} control={<Radio color="secondary" />} label="" />
                          <TextField
                            label={`Answer ${answerIndex + 1}`}
                            fullWidth
                            margin="normal"
                            value={answer}
                            onChange={(e) => handleAnswerTextChange(index, answerIndex, e.target.value)}
                            onKeyDown={(e) => handleEnterKeyPress(e, index, answerIndex)}
                          />
                          {question.question_answers.length > 2 && (
                            <IconButton onClick={() => handleDeleteAnswer(index, answerIndex)}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  ))}
                </Box>
              ))}
              <IconButton onClick={() => {
                if ('quiz_id' in quiz) {
                  handleAddQuestion(quiz.quiz_id);
                }
              }}>
                +
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', '& > *': { marginLeft: '10px' } }}>
          <StyleButton onClick={handleActionQuiz} text={'Create'} disabled={isCreateButtonActive} />
          <StyleButton onClick={handleClose} text={'Close'} />
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalQuiz;