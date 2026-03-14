import { redirect } from 'next/navigation';

// app/ is a routing manifest only — no logic, no state, no styling.
export default function RootPage() {
  redirect('/login');
}
