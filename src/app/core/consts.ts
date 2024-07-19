// Not really secret (since it is visible in the HTTP request header)
const psk = '4a291a7572f99f069399cb5658ac2b80';

interface AppPath {
  route: string;
  name: string;
}

const paths: AppPath[] = [
  {
    route: '/',
    name: 'Home',
  },
  { route: '/accounts', name: 'Accounts' },
  { route: '/positions', name: 'Positions' },
];

export { psk, AppPath, paths };
