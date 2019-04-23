'use strict'

const axios = require('axios')
const qs = require('qs')

function AuthError(message, cause) {
  this.name = 'AuthError'
  this.message = message
  this.cause = cause

  return this
}

function goal(user, authToken, goal) {
  const apiBase = 'https://www.beeminder.com/api/v1'

  return {
    datapoints: async () => {
      let baseUrl = `${apiBase}/users/${user}/goals/${goal}/datapoints.json`
      let authUrl = `${baseUrl}?auth_token=${authToken}`

      try {
        let response = await axios.get(authUrl)
        return response.data
      }
      catch (err) {
        if (err.response && err.response.status === 401) {
          throw new AuthError(
            `Not authorised for: ${baseUrl}: ${err.response.data.errors}`,
            err,
          )
        }
        else {
          const wrapper = new Error(`Failed to fetch datapoints: ${baseUrl}: ${err.message}`)
          wrapper.cause = err
          throw wrapper
        }
      }
    },

    createDatapoint: async (datapoint) => {
      let url = `${apiBase}/users/${user}/goals/${goal}/datapoints.json`

      try {
        let response = await axios.post(
          url,
          qs.stringify({ ...datapoint, auth_token: authToken }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        )
        return response.data.id
      }
      catch (err) {
        if (err.response && err.response.status === 401) {
          throw new AuthError(
            `Not authorised for: ${url}: ${err.response.data.errors}`,
            err,
          )
        }
        else {
          const wrapper = new Error(`Failed to create datapoint on: ${url}: ${err.message}`)
          wrapper.cause = err
          throw wrapper
        }
      }
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
