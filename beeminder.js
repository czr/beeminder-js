'use strict'

const axios = require('axios')
const qs = require('qs')

function goal(user, authToken, goal) {
  const apiBase = 'https://www.beeminder.com/api/v1'

  return {
    datapoints: async () => {
      let url = `${apiBase}/users/${user}/goals/${goal}/datapoints.json?auth_token=${authToken}`
      let response = await axios.get(url)
      return response.data
    },

    createDatapoint: async (datapoint) => {
      let url = `${apiBase}/users/${user}/goals/${goal}/datapoints.json`
      let response = await axios.post(
        url,
        qs.stringify({ ...datapoint, auth_token: authToken }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      )
      return response.data.id
    },

    updateDatapoint: async (datapoint) => {
      let url = `${apiBase}/users/${user}/goals/${goal}/datapoints/${datapoint.id}.json`
      return axios.put(
        url,
        qs.stringify({ ...datapoint, auth_token: authToken }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      )
    },

    deleteDatapoint: async (id) => {
      let url = `${apiBase}/users/${user}/goals/${goal}/datapoints/${id}.json?auth_token=${authToken}`
      return axios.delete(url)
    },

  }
}

module.exports = { goal };
