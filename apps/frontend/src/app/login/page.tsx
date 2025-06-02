'use client';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../gql/login';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const Login = (props: { disableCustomTheme?: boolean }) => {
  // const navigate = useNavigate();
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [onLoading, setOnLoading] = React.useState(false);

  const [login, { data, loading, error }] = useMutation(LOGIN);

  // React.useEffect(() => {
  //   if (authStore.isLoggedIn) {
  //     navigate('/rounds');
  //   }
  // }, [navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOnLoading(true);

    const data = new FormData(event.currentTarget);
    const username = data.get('name') as string;
    const password = data.get('password') as string;
    await login({ variables: { username, password } })
      .then(() => {
        // navigate('/rounds');
      })
      .catch((error) => {
        setPasswordError(true);
        setPasswordErrorMessage('Неверный пароль.');
      })
      .finally(() => {
        setOnLoading(false);
      });
  };

  const validateInputs = () => {
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Пароль должен быть 6 символов длиной.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <CssBaseline />
      <Card variant="outlined">
        <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
          Вход
        </Typography>
        <Box
          component="form"
          method="post"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="name">Имя</FormLabel>
            <TextField
              error={!!passwordError}
              id="name"
              type="name"
              name="name"
              placeholder="Admin"
              autoComplete="name"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Пароль</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={false}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  return false;
                }}
                color="primary"
              />
            }
            label="Запомнить меня"
          />
          <Button type="submit" loading={onLoading} fullWidth variant="contained" onClick={validateInputs}>
            Войти
          </Button>
        </Box>
      </Card>
    </SignInContainer>
  );
};

export default Login;
