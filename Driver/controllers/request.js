

const axios = require('axios');
const { Client_Secret, Client_ID } = require('../../config/config');

exports.get_request = function (url, queryParams = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔍 Request URL:", url);
      console.log("📦 Query Params:", queryParams);
      console.log("🧾 Request Headers:", headers);

      const response = await axios.get(url, {
        params: queryParams, // ✅ Proper way to send data in GET request
        headers: {
          'Content-Type': 'application/json',
          'Authorization': headers.Authorization,
          'x-api-key': Client_Secret
        },
        timeout: 10000
      });

      resolve(response.data);
    } catch (error) {
      if (error.response) {
        reject(new Error(`Status ${error.response.status}: ${JSON.stringify(error.response.data)}`));
      } else if (error.request) {
        reject(new Error('No response received from server'));
      } else {
        reject(error);
      }
    }
  });
};

exports.post_request = function (url, queryParams = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔍 Request URL:", url);
      console.log("📦 Query Params:", queryParams);
      console.log("🧾 Request Headers:", headers);

      const response = await axios.post(url, {
        params: queryParams, 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': headers.Authorization,
          'x-api-key': Client_Secret
        },
        timeout: 10000
      });

      resolve(response.data);
    } catch (error) {
      if (error.response) {
        reject(new Error(`Status ${error.response.status}: ${JSON.stringify(error.response.data)}`));
      } else if (error.request) {
        reject(new Error('No response received from server'));
      } else {
        reject(error);
      }
    }
  });
};


exports.post_request_DL = function (url, queryParams = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔍 Request URL:", url);
      console.log("📦 Query Params:", queryParams);
      console.log("🧾 Request Headers:", headers);

      const response = await axios.post(
        url,
        {}, // empty request body
        {
          params: queryParams,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': headers.Authorization,
            'x-api-key': Client_Secret
          },
          timeout: 10000
        }
      );
      console.log("Response data:", response.data);

      resolve(response.data);
    } catch (error) {
      if (error.response) {
        reject(new Error(`Status ${error.response.status}: ${JSON.stringify(error.response.data)}`));
      } else if (error.request) {
        reject(new Error('No response received from server'));
      } else {
        reject(error);
      }
    }
  });
};

exports.get_request_DL = function (url, queryParams = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔍 Request URL:", url);
      console.log("📦 Query Params:", queryParams);
      console.log("🧾 Request Headers:", headers);

      const response = await axios.post(
        url,
        {}, // empty request body
        {
          params: queryParams,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': headers.Authorization,
            'x-api-key': Client_Secret
          },
          timeout: 10000
        }
      );
      console.log("Response data:", response.data);

      resolve(response.data);
    } catch (error) {
      if (error.response) {
        reject(new Error(`Status ${error.response.status}: ${JSON.stringify(error.response.data)}`));
      } else if (error.request) {
        reject(new Error('No response received from server'));
      } else {
        reject(error);
      }
    }
  });
};

