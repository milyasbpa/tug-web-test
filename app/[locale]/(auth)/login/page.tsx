import { LoginContainer } from '@/features/login/container/Login.container';

// app/ is a routing manifest only — no logic, no state, no styling.
// All behavior lives inside the feature container.
export default function LoginPage() {
  return <LoginContainer />;
}
