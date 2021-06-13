import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';
const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
};
  
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData ? fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadData)
    }) : fetch(url);
    
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    // we rethrow the error in order to handle it in model.js
    throw err;    
  }
}

// export const getJSON = async function (url) {
//     try {
//       // prevent the promise from taking too long
//       const fetchPro = fetch(url);
//       const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//       const data = await res.json();

//       if (!res.ok) throw new Error(`${data.message} (${res.status})`);

//       return data;
//     } catch (err) {
//       // we rethrow the error in order to handle it in model.js
//       throw err;
//     }
// }

// export const sendJSON = async function (url, uploadData) {
//     try {
//       // prevent the promise from taking too long
//       const fetchPro = fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(uploadData)
//       });
//       const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//       const data = await res.json();

//       if (!res.ok) throw new Error(`${data.message} (${res.status})`);

//       return data;
//     } catch (err) {
//       // we rethrow the error in order to handle it in model.js
//       throw err;
//     }
// }