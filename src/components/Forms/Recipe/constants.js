import getApiUrl from "../../../helpers/apiConfig";

const apiUrl = getApiUrl();

function fetchFoods() {
  const data = fetch(apiUrl + "/api/foods/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  return data;
}

export { fetchFoods };
