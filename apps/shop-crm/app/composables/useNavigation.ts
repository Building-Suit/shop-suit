export const useNavigation = () => {
  const isMenuOpen = ref(false);

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const navLinks = [
    { label: 'Features', to: '#features' },
    { label: 'Pricing', to: '#pricing' },
    { label: 'FAQs', to: '#faqs' },
  ];

  const companyLinks = [
    { label: 'About Us', to: '/' },
    { label: 'Contact', to: '/' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', to: '/' },
    { label: 'Terms of Service', to: '/' },
  ];

  return {
    isMenuOpen,
    toggleMenu,

    /* Links */
    navLinks,
    companyLinks,
    legalLinks,
  };
};
