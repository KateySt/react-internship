import { useNavigate } from 'react-router-dom';

const useNavigation = (navigateTo = '/') => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const moveForward = () => navigate(+1);
  const navigateToPage = () => navigate(navigateTo);
  const goHome = () => navigate('/');

  return {
    goHome,
    goBack,
    moveForward,
    navigateToPage,
  };
};
export default useNavigation;