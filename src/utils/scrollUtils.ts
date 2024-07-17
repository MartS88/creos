export const scrollToElement = (scrollTarget: string) => () => {
  const element = document.getElementById(scrollTarget);
  console.log('click');
  console.log('element', element);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
    });
  }
};
