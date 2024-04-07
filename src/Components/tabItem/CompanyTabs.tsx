import {
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Rating,
  SpeedDial,
  SpeedDialIcon,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from 'react';
import CustomTabPanel from './CustomTabPanel';
import DeleteIcon from '@mui/icons-material/Delete';
import { IoBarChartOutline } from 'react-icons/io5';
import { addAdminAsync, leaveCompanyAsync, removeAdminAsync } from 'Store/features/action/ActionSlice';
import {
  getListMembersAsync,
  getListQuizzesAsync,
  getListRatingQuizAsync,
  getListRatingStarUserAsync,
  selectCompany,
  selectMembers,
  selectQuizzes,
  selectRatingQuiz,
  selectRatingUser,
} from 'Store/features/company/CompaniesSlice';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import {
  getLastPassUserAsync,
  getRatingAnalyticUserAsync,
  selectLastPass,
  selectRating,
  selectUser,
} from 'Store/features/user/UsersSlice';
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
import TableCompanyMember from 'Components/tableCompanyMember/TableCompanyMember';
import { Quiz } from 'Types/Quiz';
import { MdQuiz } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Modal from '../modal';
import StyleButton from '../button/StyleButton';
import BarChart from '../chart/BarChart';
import { FaChartBar } from 'react-icons/fa';
import DateLastPass from '../date/DateLastPass';

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

const initialQuestion = {
  question_text: '',
  question_answers: ['', ''],
  question_correct_answer: 0,
};
const CompanyTabs = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const quizInfo = useAppSelector(selectQuiz);
  const ratingUsers = useAppSelector(selectRatingUser);
  const company = useAppSelector(selectCompany);
  const ratingQuiz = useAppSelector(selectRatingQuiz);
  const lastPass = useAppSelector(selectLastPass);
  const rating = useAppSelector(selectRating);
  const members = useAppSelector(selectMembers);
  const user = useAppSelector(selectUser);
  const quizzes = useAppSelector(selectQuizzes);
  const [isChart, setIsChart] = useState<boolean>(false);
  const [isUserChart, setIsUserChart] = useState<boolean>(false);
  const [isCreateButtonActive, setIsCreateButtonActive] = useState(true);
  const [isUpdateButtonActive, setIsUpdateButtonActive] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<number>(0);
  const currentMember = members.find(el => el.user_id === user.user_id);
  const [open, setOpen] = useState<boolean>(false);
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
    const updatedQuestion = {
      ...quizInfo.questions_list[index],
      question_text: newText,
    };
    if (updatedQuestion.question_id === undefined) return;
    await dispatch(updateQuestionAsync(updatedQuestion.question_id, updatedQuestion));
  };

  const handleUpdateDeleteQuestion = async (index: number) => {
    if (!quizInfo) return;
    let question = quizInfo.questions_list.filter((_, i) => i === index)[0];
    if (question.question_id === undefined) return;
    await dispatch(deleteQuestionAsync(question.question_id));
  };

  const handleUpdateQuestionCorrectAnswer = async (questionCorrectAnswer: number, questionIndex: number) => {
    if (!quizInfo) return;
    const updatedQuestion = {
      ...quizInfo.questions_list[questionIndex],
      question_correct_answer: questionCorrectAnswer,
    };
    if (updatedQuestion.question_id === undefined) return;
    await dispatch(updateQuestionAsync(updatedQuestion.question_id, updatedQuestion));
  };

  const handleAnswerTextUpdate = async (index: number, answerIndex: number, newText: string) => {
    if (!quizInfo) return;
    const updatedQuestion = {
      ...quizInfo.questions_list[index],
    };
    updatedQuestion.question_answers = [...updatedQuestion.question_answers];
    updatedQuestion.question_answers[answerIndex] = newText;
    if (updatedQuestion.question_id === undefined) return;
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
    const updatedQuestion = updatedQuestionsList[index];

    if (updatedQuestion.question_id === undefined) return;
    await dispatch(updateQuestionAsync(updatedQuestion.question_id, updatedQuestion));
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
    if (loading) return;
    setLoading(true);

    try {
      if (event.target.checked) {
        await dispatch(addAdminAsync(actionId));
      } else {
        await dispatch(removeAdminAsync(actionId));
      }
      if (!company) return;
      await dispatch(getListMembersAsync(company.company_id));
    } catch (error) {
      console.error('Error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChart = async (quizId: number) => {
    if (!company) return;
    await dispatch(getListRatingQuizAsync(company.company_id, quizId));
    setIsChart(true);
  };

  useEffect(() => {
    if (!company) return;
    if (currentMember && (currentMember.action === 'owner' || currentMember.action === 'admin')) {
      dispatch(getListRatingStarUserAsync(company.company_id, user.user_id));
    }
  }, [company]);

  const handleChartUser = async (userId: number, quizId: number) => {
    await dispatch(getRatingAnalyticUserAsync(userId, quizId));
    setIsUserChart(true);
  };

  useEffect(() => {
    if (!user) return;
    dispatch(getLastPassUserAsync(user.user_id));
  }, [user]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example">
          <Tab label="Members" {...a11yProps(0)} />
          <Tab label="Quizzes" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {members &&
          (<TableCompanyMember
              members={members}
              user={user}
              handleChangeSwitch={handleChangeSwitch}
              handleDeleteUser={handleDeleteUser} />
          )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {(!open && !isShow && !isChart && !isUserChart) &&
          members.some(m => m.user_id === user.user_id && m.action !== 'member') &&
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

        {ratingQuiz &&
          <Modal isOpen={isChart} onClose={() => setIsChart(false)}>
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
              <Typography variant="h5" textAlign="center">Charts</Typography>
              {ratingQuiz.rating.map((el) => <BarChart data={el} />)}
              <StyleButton onClick={() => setIsChart(false)} text={'Close'} />
            </Box>
          </Modal>
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
            setQuiz={(e: Quiz) => dispatch(setQuizInfo(e))}
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

        {rating &&
          <Modal isOpen={isUserChart} onClose={() => setIsUserChart(false)}>
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
              <Typography variant="h5" textAlign="center">Charts</Typography>
              <BarChart data={{ rating: rating, user_id: user.user_id }} />
              <StyleButton onClick={() => setIsUserChart(false)} text={'Close'} />
            </Box>
          </Modal>
        }

        <Grid item xs={12} md={6}>
          <Typography variant="h5" textAlign="center">Available quizzes</Typography>
          <List dense={true}>
            {quizzes &&
              quizzes.map((quiz: QuizzesInfo, index: number) => (
                <ListItem key={index}
                          secondaryAction={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              {
                                lastPass?.filter(el => el.quiz_id === quiz.quiz_id)
                                  .map(q => <DateLastPass date={new Date(q.last_quiz_pass_at)} />)
                              }
                              <Rating
                                name="read-only"
                                value={(ratingUsers.find(el => el.quiz_id === quiz.quiz_id)?.rating || 0) * 0.05}
                                readOnly
                              />
                              {members.some(m => m.user_id === user.user_id && (m.action === 'owner' || m.action === 'admin')) ? (
                                <>
                                  <IconButton edge="end" aria-label="delete">
                                    <DeleteIcon onClick={async () => await dispatch(deleteQuizAsync(quiz.quiz_id))} />
                                  </IconButton>
                                  <IconButton>
                                    <FaChartBar onClick={() => handleChart(quiz.quiz_id)} />
                                  </IconButton>
                                </>
                              ) : null}
                              <IconButton>
                                <MdQuiz onClick={() => navigate(`/quiz/${quiz.quiz_id}`)} />
                              </IconButton>
                              <IconButton>
                                <IoBarChartOutline onClick={() => handleChartUser(user.user_id, quiz.quiz_id)} />
                              </IconButton>
                            </div>
                          }>
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
                </ListItem>
              ))}
          </List>
        </Grid>
      </CustomTabPanel>
    </Box>
  );
};

export default CompanyTabs;