import { TIMEOUT_SECS } from './config.js';

// REUSEABLE FUNCTIONS THROUGHOUT THE ENTIRE PROJECT
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchMethod = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const response = await Promise.race([fetchMethod, timeout(TIMEOUT_SECS)]);
    const data = await response.json();
    // console.log(response, data);

    if (!response.ok) {
      throw new Error(`${data.message} (${response.status})`);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/*
export const getJSON = async function (url) {
  try {
    const fetchMethod = fetch(url);

    const response = await Promise.race([fetchMethod, timeout(TIMEOUT_SECS)]);
    const data = await response.json();
    // console.log(response, data);

    if (!response.ok) {
      throw new Error(`${data.message} (${response.status})`);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchMethod = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const response = await Promise.race([fetchMethod, timeout(TIMEOUT_SECS)]);
    const data = await response.json();
    // console.log(response, data);

    if (!response.ok) {
      throw new Error(`${data.message} (${response.status})`);
    }

    return data;
  } catch (error) {
    throw error;
  }
};
*/
