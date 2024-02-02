function getUrl() {
  if (process.env.NODE_ENV === "development") {
    return 'http://localhost:3000';
  } else {
    return 'https://2023-lalibertadavanza-frontend.vercel.app';
  }
}

export default getUrl;
