export const metadata = {
  title: 'Secure Admin',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function SecureAdminLayout({ children }) {
  return children;
}
