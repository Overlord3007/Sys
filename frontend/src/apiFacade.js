import UrlLink from './settings';
const URL = UrlLink;

async function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: await res.json() })
  }
  return res.json();
}


class ApiFacade {
  makeOptions(method, addToken, body) {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        'Accept': 'application/json',
      }
    }
    if (addToken && this.loggedIn()) {

      opts.headers["x-access-token"] = this.getToken();
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }

    return opts;
  }
  setToken = (token) => {
    localStorage.setItem('jwtToken', token)
  }
  getToken = () => {
    return localStorage.getItem('jwtToken')
  }
  loggedIn = () => {
    const loggedIn = this.getToken() != null;
    return loggedIn;
  }
  logout = () => {
    localStorage.removeItem("jwtToken");
  }
  login = (user, pass) => {
    const options = this.makeOptions("POST", true, { username: user, password: pass });
    return fetch(URL + "/api/login", options, true)
      .then(handleHttpErrors)
      .then(res => { this.setToken(res.token) })
  }
  fetchData = () => {
    const options = this.makeOptions("GET", true); //True add's the token
    return fetch(URL + "/api/info/admin", options).then(handleHttpErrors);
  }
  getInfo = () => {
    const options = this.makeOptions("GET");
    return fetch(URL + "/api/info/swapi", options).then(handleHttpErrors);
  }
  searchHotels = (query) => {
    const options = this.makeOptions("GET");
    return fetch(URL + `/search${query}`, options).then(handleHttpErrors);
  }
  getRoomsForSpecific = (id) => {
    const options = this.makeOptions("GET");
    return fetch(URL + "/search/" + id, options).then(handleHttpErrors);
  }

  getRoomsForSpecific = (bookingInfo) => {
    const options = this.makeOptions("GET");
    return fetch(URL + "/book", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomID: bookingInfo.roomID,
        dateF: bookingInfo.dateF,
        dateT: bookingInfo.dateT,
        name: bookingInfo.name
      })
    })
    .then(handleHttpErrors);
  }
}

const facade = new ApiFacade();
export default facade;
