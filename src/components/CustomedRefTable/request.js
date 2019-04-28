import axios from "axios";
import fetchJsonp from 'fetch-jsonp';

const request = (url, options = {method: 'get'}) => {
  return axios({
    method: options.method,
    url: url,
    data: options.data,
    params: options.params,
    headers: options.headers,
    timeout: 1000 * 30
  }).catch(function (err) {
    console.log(err);
  });
};
const jsonp = (url, params = {}) => {

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

export default async (url, options) => {
	let response = '',
		data = {},
    status = 200;
  let {params={}} = options;
  options.params = Object.assign(params,{
    tm: new Date().getTime(),
  })
	if (options.jsonp == true) {
		data = await jsonp(url, options.params);
	} else {
		response = await request(url, options);
		if (!response) return;
		status = response.status;
		data = response.data;
	} 
	switch (status) {

	}
	return data;
}
