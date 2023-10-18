function getApiUrl() {
    if (process.env.NODE_ENV === 'development') {
      return process.env.REACT_APP_API_URL_DEV;
    } else {
      return process.env.REACT_APP_API_URL_PROD;
    }
  }
  
  export default getApiUrl;  