import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const useAuth = () => {
  const { user, token, login: storeLogin, logout: storeLogout } = useAuthStore();

  let navigate;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigate = useNavigate();
  } catch {
    navigate = null;
  }

  /**
   * Demo login — accepts email, password, role.
   * Stores user with correct role in both store + localStorage.
   */
  const login = (email, password, role = 'municipality') => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const userData = {
            id: 1,
            name: role === 'citizen' ? 'Əli Əliyev' : 'Bakı Bələdiyyəsi Admin',
            email,
            role,
          };
          storeLogin(userData, 'demo_token_' + Date.now());
          resolve(userData);
        } else {
          reject(new Error('Email və şifrə tələb olunur'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    storeLogout();
    if (navigate) {
      navigate('/login', { replace: true });
    } else {
      window.location.href = '/login';
    }
  };

  return { user, token, login, logout };
};

export default useAuth;
