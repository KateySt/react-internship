import {
  Box,
  Chip,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  SpeedDial,
  SpeedDialIcon,
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
import EditIcon from '@mui/icons-material/Edit';
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
import { NewQuiz } from 'Types/NewQuiz';
import {
  addQuestionAsync,
  createQuizAsync,
  deleteQuestionAsync,
  deleteQuizAsync,
  getQuizAsync,
  selectQuiz,
  setQuizInfo,
  updateQuestionAsync,
  updateQuizAsync,
} from 'Store/features/quiz/QuizSliece';
import ModalQuiz from '../quize/ModalQuiz';
import UseTextDebounce from 'Utils/useTextDebounce';

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
  question_answers: ['', ''],
  question_correct_answer: 0,
};
const CompanyTabs = () => {
  const [value, setValue] = useState<number>(0);
  const dispatch = useAppDispatch();
  const quizInfo = useAppSelector(selectQuiz);
  const company = useAppSelector(selectCompany);
  const members = useAppSelector(selectMembers);
  const user = useAppSelector(selectUser);
  const quizzes = useAppSelector(selectQuizzes);
  const [open, setOpen] = useState<boolean>(false);
  const [isCreateButtonActive, setIsCreateButtonActive] = useState(true);
  const [isUpdateButtonActive, setIsUpdateButtonActive] = useState(true);
  const [quiz, setQuiz] = useState<NewQuiz>({
    quiz_name: '',
    quiz_frequency: 1,
    company_id: company?.company_id ?? 0,
    quiz_description: '',
    questions_list: [{
      ...initialQuestion,
      question_answers: [...initialQuestion.question_answers],
    }, {
      ...initialQuestion,
      question_answers: [...initialQuestion.question_answers],
    }],
  });
  const [isShow, setIsShow] = useState<boolean>(false);

  const handleUpdateQuiz = async () => {
    if (!quizInfo) return;
    await dispatch(updateQuizAsync(quizInfo.quiz_id, {
      quiz_name: quizInfo.quiz_name,
      quiz_title: quizInfo.quiz_title,
      quiz_description: quizInfo.quiz_description,
      quiz_frequency: quizInfo.quiz_frequency,
    }));
    setIsShow(false);
  };

  const handleQuestionTextUpdate = async (index: number, newText: string) => {
    if (!quizInfo) return;
    const debouncedText = UseTextDebounce(newText);
    const updatedQuestion = {
      ...quizInfo.questions_list[index],
      question_text: debouncedText,
    };
    await dispatch(updateQuestionAsync(updatedQuestion.question_id, updatedQuestion));
  };

  const handleUpdateDeleteQuestion = async (index: number) => {
    if (!quizInfo) return;
    await dispatch(deleteQuestionAsync(quizInfo.questions_list.filter((_, i) => i === index)[0].question_id));
  };

  const handleUpdateQuestionCorrectAnswer = async (questionCorrectAnswer: number, questionIndex: number) => {
    if (!quizInfo) return;
    const updatedQuestion = {
      ...quizInfo.questions_list[questionIndex],
      question_correct_answer: questionCorrectAnswer,
    };
    await dispatch(updateQuestionAsync(updatedQuestion.question_id, updatedQuestion));//todo
  };

  const handleAnswerTextUpdate = async (index: number, answerIndex: number, newText: string) => {
    if (!quizInfo) return;
    const debouncedText = UseTextDebounce(newText);
    const updatedQuestion = {
      ...quizInfo.questions_list[index],
    };
    updatedQuestion.question_answers = [...updatedQuestion.question_answers];
    updatedQuestion.question_answers[answerIndex] = debouncedText;
    await dispatch(updateQuestionAsync(updatedQuestion.question_id, updatedQuestion));
  };

  const handleEnterKeyPressUpdate = (event: React.KeyboardEvent<HTMLDivElement>, index: number, answerIndex: number) => {
    if (!quizInfo) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      if (answerIndex === quizInfo.questions_list[index].question_answers.length - 1) {
        handleUpdateAddAnswer(index);
      }
    }
  };

  const handleUpdateAddAnswer = (index: number) => {
    if (!quizInfo) return;
    const updatedQuestionsList = [...quizInfo.questions_list];
    updatedQuestionsList[index] = {
      ...updatedQuestionsList[index],
      question_correct_answer: 0,
      question_answers: [...updatedQuestionsList[index].question_answers, ''],
    };
    dispatch(setQuizInfo({ ...quizInfo, questions_list: updatedQuestionsList }));
  };

  const handleUpdateDeleteAnswer = async (index: number, answerIndex: number) => {
    if (!quizInfo) return;
    const updatedAnswersList = quizInfo.questions_list[index].question_answers.filter((_, i) => i !== answerIndex);
    const updatedQuestionsList = [...quizInfo.questions_list];
    updatedQuestionsList[index] = {
      ...updatedQuestionsList[index],
      question_correct_answer: 0,
      question_answers: updatedAnswersList,
    };
    await dispatch(updateQuestionAsync(updatedQuestionsList[index].question_id, updatedQuestionsList[index]));
  };

  const handleUpdateAddQuestion = async (id: number) => {
    await dispatch(addQuestionAsync(id, {
      ...initialQuestion,
      question_answers: [...initialQuestion.question_answers],
    }));
  };

  useEffect(() => {
    if (!quizInfo) return;
    setIsUpdateButtonActive(
      quizInfo.quiz_name.trim() === '' ||
      quizInfo.questions_list.length < 2 ||
      quizInfo.questions_list.some(question => question.question_text.trim() === ''
        || question.question_answers.length < 2
        || question.question_answers.some(answer => answer.trim() === '')),
    );
  }, [quizInfo]);

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

  const handleFullInfoQuiz = async (id: number) => {
    await dispatch(getQuizAsync(id));
    setIsShow(true);
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
    await dispatch(createQuizAsync(quiz));
    await dispatch(getListQuizzesAsync(company.company_id));
    handleClose();
    setQuiz({
      quiz_name: '',
      quiz_frequency: 1,
      company_id: company?.company_id ?? 0,
      quiz_description: '',
      questions_list: [{
        ...initialQuestion,
        question_answers: [...initialQuestion.question_answers],
      }, {
        ...initialQuestion,
        question_answers: [...initialQuestion.question_answers],
      }],
    });
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
        {(!open && !isShow) &&
          members.some(m => m.user_id === user.user_id && (m.action === 'owner' || m.action === 'admin')) &&
          <SpeedDial
            ariaLabel="SpeedDial tooltip"
            sx={{ position: 'absolute', right: 16, height: 34 }}
            icon={<SpeedDialIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            FabProps={{
              sx: {
                width: 34,
                bgcolor: 'secondary.main',
                '&:hover': {
                  bgcolor: 'secondary.main',
                },
              },
            }}
          />
        }

        <ModalQuiz
          open={open}
          handleClose={handleClose}
          quiz={quiz}
          setQuiz={setQuiz}
          handleActionQuiz={handleCreateQuiz}
          handleQuestionTextChange={handleQuestionTextChange}
          handleDeleteQuestion={handleDeleteQuestion}
          handleChangeQuestionCorrectAnswer={handleChangeQuestionCorrectAnswer}
          handleAnswerTextChange={handleAnswerTextChange}
          handleEnterKeyPress={handleEnterKeyPress}
          handleDeleteAnswer={handleDeleteAnswer}
          handleAddQuestion={handleAddQuestion}
          isCreateButtonActive={isCreateButtonActive}
        />

        {quizInfo &&
          <ModalQuiz
            open={isShow}
            handleClose={() => setIsShow(false)}
            quiz={quizInfo}
            setQuiz={(e: any) => dispatch(setQuizInfo(e))}
            handleActionQuiz={handleUpdateQuiz}
            handleQuestionTextChange={handleQuestionTextUpdate}
            handleDeleteQuestion={handleUpdateDeleteQuestion}
            handleChangeQuestionCorrectAnswer={handleUpdateQuestionCorrectAnswer}
            handleAnswerTextChange={handleAnswerTextUpdate}
            handleEnterKeyPress={handleEnterKeyPressUpdate}
            handleDeleteAnswer={handleUpdateDeleteAnswer}
            handleAddQuestion={handleUpdateAddQuestion}
            isCreateButtonActive={isUpdateButtonActive}
          />
        }

        <Grid item xs={12} md={6}>
          <Typography variant="h5" textAlign="center">Available quizzes</Typography>
          <List dense={true}>
            {quizzes &&
              quizzes.map((quiz: QuizzesInfo, index: number) => (
                <ListItem key={index}
                          secondaryAction={members.some(m => m.user_id === user.user_id && (m.action === 'owner' || m.action === 'admin')) ? (
                            <IconButton edge="end" aria-label="delete">
                              <DeleteIcon onClick={async () => await dispatch(deleteQuizAsync(quiz.quiz_id))} />
                            </IconButton>
                          ) : null}>

                  <ListItemText
                    primary={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {truncateText(quiz.quiz_name, 10)}
                        {members.some(m => m.user_id === user.user_id && (m.action === 'owner' || m.action === 'admin')) && (
                          <EditIcon fontSize="small" onClick={() => handleFullInfoQuiz(quiz.quiz_id)} />
                        )}
                      </div>
                    }
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
  )
    ;
};

export default CompanyTabs;