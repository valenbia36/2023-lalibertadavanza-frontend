function getUrl() {
  if (process.env.NODE_ENV === "development") {
    return 'http://localhost:3000';
  } else {
    return 'https://heliapp.vercel.app';
  }
}

export default getUrl;