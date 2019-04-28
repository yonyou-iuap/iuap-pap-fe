import axios from "axios";
import fetchJsonp from 'fetch-jsonp';

// interface Ajax{
//   url: string;
//   method?: string | 'get';
//   data?: object;
//   params?: object;
//   headers?: object;
//   jsonp?: boolean;
// }

function request(options) {
  return axios({
    url: options.url,
    method: options.method || 'get',
    data: options.data || {},
    params: options.params || {},
    headers: options.headers || {}
  }).catch(function (err) {
    console.log(err);
  });
};
const jsonp = (url, params) => {

  const data = Object.keys(params).map(item => {
    return `${item}=${params[item]}`
  }).join('&')

  return fetchJsonp(`${url}?${data}`)
    .then((response) => {
      return response.json()
    }).then((json) => {
      console.log('parsed json', json)
      return json
    }).catch((ex) => {
      console.log('parsing failed', ex)
    })
}


export default async (options) => {
  let response,
    data = {},
    status = 200;
  let {params={}} = options;
  options.params = Object.assign(params,{
    tm: new Date().getTime(),
  })
  if (options.jsonp == true) {
    data = await jsonp(options.url, options.params);
  } else {
    response = await request(options);
    if (!response) return;
    status = response.status;
    data = response.data;
  }
  switch (status) {

  }
  return data;
}
