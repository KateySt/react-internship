import {
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  Slider,
  SpeedDial,
  SpeedDialIcon,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import CustomTabPanel from './CustomTabPanel';
import { UserInvited } from 'Types/UserInvited';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import { addAdminAsync, leaveCompanyAsync, removeAdminAsync } from 'Store/features/action/ActionSlice';
import {
  getListMembersAsync,
  getListQuizzesAsync,
  selectCompany,
  selectMembers,
  selectQuizzes,
} from 'Store/features/company/CompaniesSlice';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { selectUser } from 'Store/features/user/UsersSlice';
import { QuizzesInfo } from 'Types/QuizzesInfo';
import Modal from '../modal';
import TextField from '@mui/material/TextField';
import StyleButton from '../button/StyleButton';
import { NewQuiz } from '../../Types/NewQuiz';
import { createQuizAsync } from '../../Store/features/quiz/QuizSliece';
import { Question } from '../../Types/Question';

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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return `${text.slice(0, maxLength)}...`;
  }
  return text;
};

const label = { inputProps: { 'aria-label': 'Color switch demo' } };

const initialQuestion = {
  question_text: '',
  question_answers: [''],
  question_correct_answer: 0,
};
const CompanyTabs = () => {
  const [value, setValue] = useState<number>(0);
  const dispatch = useAppDispatch();
  const company = useAppSelector(selectCompany);
  const members = useAppSelector(selectMembers);
  const user = useAppSelector(selectUser);
  const quizzes = useAppSelector(selectQuizzes);
  const [open, setOpen] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [isCreateButtonActive, setIsCreateButtonActive] = useState(true);
  const [quiz, setQuiz] = useState<NewQuiz>({
    quiz_name: '',
    quiz_frequency: MIN,
    company_id: company?.company_id ?? 0,
    questions_list: [{
      ...initialQuestion,
      question_answers: [...initialQuestion.question_answers],
    }, {
      ...initialQuestion,
      question_answers: [...initialQuestion.question_answers],
    }],
  });

  const handleChangeQuestionCorrectAnswer = (questionCorrectAnswer: number, questionIndex: number) => {
    const newQuestions = [...quiz.questions_list];
    newQuestions[questionIndex].question_correct_answer = questionCorrectAnswer;
    setQuiz({ ...quiz, questions_list: newQuestions });
  };

  const handleAddQuestion = () => {
    setQuiz({
      ...quiz, questions_list: [...quiz.questions_list, {
        ...initialQuestion,
        question_answers: [...initialQuestion.question_answers],
      }],
    });
  };

  const handleQuestionTextChange = (index: number, newText: string) => {
    const newQuestions = [...quiz.questions_list];
    newQuestions[index].question_text = newText;
    setQuiz({ ...quiz, questions_list: newQuestions });
  };

  const handleAnswerTextChange = (index: number, answerIndex: number, newText: string) => {
    const newQuestions = [...quiz.questions_list];
    newQuestions[index].question_answers[answerIndex] = newText;
    setQuiz({ ...quiz, questions_list: newQuestions });
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = quiz.questions_list.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions_list: newQuestions });
  };

  const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLDivElement>, index: number, answerIndex: number) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (answerIndex === quiz.questions_list[index].question_answers.length - 1) {
        handleAddAnswer(index);
      }
    }
  };

  const handleAddAnswer = (index: number) => {
    const newQuestions = [...quiz.questions_list];
    newQuestions[index].question_answers.push('');
    setQuiz({ ...quiz, questions_list: newQuestions });
  };

  const handleDeleteAnswer = (index: number, answerIndex: number) => {
    const newQuestions = [...quiz.questions_list];
    newQuestions[index].question_answers.splice(answerIndex, 1);
    setQuiz({ ...quiz, questions_list: newQuestions });
  };

  useEffect(() => {
    setIsCreateButtonActive(
      quiz.quiz_name.trim() === '' ||
      quiz.questions_list.length < 2 ||
      quiz.questions_list.some(question => question.question_text.trim() === ''
        || question.question_answers.length < 2
        || question.question_answers.some(answer => answer.trim() === '')),
    );
  }, [quiz]);


  const handleCreateQuiz = async () => {
    if (!company) return;
    await dispatch(createQuizAsync(quiz, description));
    await dispatch(getListQuizzesAsync(company.company_id));
    handleClose();
    setQuiz({
      quiz_name: '',
      quiz_frequency: MIN,
      company_id: company?.company_id ?? 0,
      questions_list: [{
        ...initialQuestion,
        question_answers: [...initialQuestion.question_answers],
      }, {
        ...initialQuestion,
        question_answers: [...initialQuestion.question_answers],
      }],
    });
    setDescription('');
  };

  const handleChangeCounter = (_: Event, newValue: number | number[]) => {
    setQuiz({ ...quiz, quiz_frequency: newValue as number });
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleDeleteUser = async (actionId: number) => {
    if (company && user.user_id !== company.company_owner.user_id) return;
    if (window.confirm('Are you sure you want to delete this user?')) {
      await dispatch(leaveCompanyAsync(actionId));
    }
  };

  const handleChangeSwitch = async (event: React.ChangeEvent<HTMLInputElement>, actionId: number) => {
    if (event.target.checked) {
      await dispatch(addAdminAsync(actionId));
    } else {
      await dispatch(removeAdminAsync(actionId));
    }
    if (!company) return;
    dispatch(getListMembersAsync(company.company_id));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example">
          {company && user.user_id === company.company_owner.user_id &&
            <Tab label="Members" {...a11yProps(0)} />}
          <Tab label="Quizzes" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {members &&
          (<TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User First Name</TableCell>
                    <TableCell>User Last Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Change role</TableCell>
                    <TableCell>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((member: UserInvited, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{truncateText(member.user_firstname, 10)}</TableCell>
                      <TableCell>{truncateText(member.user_lastname, 10)}</TableCell>
                      <TableCell>
                        <Chip
                          label={member.action}
                          variant="outlined"
                          style={{
                            color: member.action === 'admin' ? 'red' : member.action === 'member' ? 'green' : 'gold',
                            borderColor: member.action === 'admin' ? 'red' : member.action === 'member' ? 'green' : 'gold',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {user.user_id !== member.user_id && (
                          <Switch
                            {...label}
                            checked={member.action === 'admin'}
                            color="secondary"
                            onChange={(e) => handleChangeSwitch(e, member.action_id)}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {user.user_id !== member.user_id && (
                          <IconButton
                            onClick={() => {
                              if (user.user_id !== member.user_id) {
                                handleDeleteUser(member.action_id);
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {!open &&
          members.some(m => m.user_id === user.user_id && (m.action === 'owner' || m.action === 'admin')) &&
          <SpeedDial
            ariaLabel="SpeedDial tooltip"
            sx={{ position: 'absolute', right: 16, height: 32, width: 32 }}
            icon={<SpeedDialIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            FabProps={{
              sx: {
                bgcolor: 'secondary.main',
                '&:hover': {
                  bgcolor: 'secondary.main',
                },
              },
            }}
          />
        }
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
                    onChange={handleChangeCounter}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                              <FormControlLabel value={answerIndex} control={<Radio color="secondary" />} label="a" />
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
                  <IconButton onClick={handleAddQuestion}>
                    +
                  </IconButton>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', '& > *': { marginLeft: '10px' } }}>
              <StyleButton onClick={handleCreateQuiz} text={'Create'} disabled={isCreateButtonActive} />
              <StyleButton onClick={handleClose} text={'Close'} />
            </Box>
          </Box>
        </Modal>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" textAlign="center">Available quizzes</Typography>
          <List dense={true}>
            {quizzes &&
              quizzes.map((quiz: QuizzesInfo, index: number) => (
                <ListItem key={index}
                          secondaryAction={
                            <IconButton edge="end" aria-label="delete">
                              <DeleteIcon />
                            </IconButton>
                          }
                >
                  <ListItemText
                    primary={truncateText(quiz.quiz_name, 10)}
                  />
                  <ListItemText
                    primary={truncateText(quiz.quiz_title ?? '', 10)}
                  />
                  <ListItemText
                    primary={truncateText(quiz.quiz_description ?? '', 10)}
                  />
                </ListItem>
              ))}
          </List>
        </Grid>
      </CustomTabPanel>
    </Box>
  );
};

export default CompanyTabs;