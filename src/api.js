const baseURL = import.meta.env.VITE_APP_API_URL;
const homeURL = import.meta.env.VITE_APP_HOME_URL;

export const fetchLessToken = (endpoint, method = 'GET', data) => {
    const url = `${homeURL}${endpoint}`;

    if(method === 'GET'){
        return fetch(url).then(data => data.json()).catch(error => console.log('Error:', error));
    }else {
        return fetch(url, {
            method,
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    }
}

export const fetchWithToken = (endpoint, data, method = 'GET') => {
    const url = `${baseURL}/${endpoint}`;
    const token = localStorage.getItem('token-info') || '';
    console.log(token);
    
    if(method === 'GET'){
        return fetch(url, {
            method,
            headers: {
                'Authorization': token
            }
        })
        .then(data => data.json())
        .catch(error => console.log('Error:', error));
     } 
     else {
        return fetch(url, {
            method,
            headers: {
                'Content-type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data)
        })
        .then(data => data.json())
        .catch(error => console.log('Error:', error))
    }
}

export const fetchLogout = (endpoint, method) => {
    const url = `${baseURL}/${endpoint}`;
    const token = localStorage.getItem('token-info') || '';

    return fetch(url, {
        method,
        headers: {
            'Content-type': 'application/json',
            'Authorization': token
        },
    })
}

