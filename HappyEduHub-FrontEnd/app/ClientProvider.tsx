'use client';

import { Provider } from 'react-redux';
import { makeStore } from './libs/store';

const store = makeStore();

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
