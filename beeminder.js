'use strict'

const axios = require('axios')
const qs = require('qs')

function AuthError (message, cause) {
  this.name = 'AuthError'
  this.message = message
  this.cause = cause

  return this
}

class Goal {
  constructor (user, authToken, goal) {
    this.apiBase = 'https://www.beeminder.com/api/v1'

    this.user = user
    this.authToken = authToken
    this.goal = goal
  }

  async datapoints () {
    let baseUrl = `${this.apiBase}/users/${this.user}/goals/${this.goal}/datapoints.json`
    let authUrl = `${baseUrl}?auth_token=${this.authToken}`

    try {
      let response = await axios.get(authUrl)
      return response.data
    } catch (err) {
      if (err.response && err.response.status === 401) {
        throw new AuthError(
          `Not authorised for: ${baseUrl}: ${err.response.data.errors}`,
          err,
        )
      } else {
        const wrapper = new Error(`Failed to fetch datapoints: ${baseUrl}: ${err.message}`)
        wrapper.cause = err
        throw wrapper
      }
    }
  }

  async createDatapoint (datapoint) {
    let url = `${this.apiBase}/users/${this.user}/goals/${this.goal}/datapoints.json`

    try {
      let response = await axios.post(
        url,
        qs.stringify({ ...datapoint, auth_token: this.authToken }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      )
      return response.data.id
    } catch (err) {
      if (err.response && err.response.status === 401) {
        throw new AuthError(
          `Not authorised for: ${url}: ${err.response.data.errors}`,
          err,
        )
      } else {
        const wrapper = new Error(`Failed to create datapoint on: ${url}: ${err.message}`)
        wrapper.cause = err
        throw wrapper
      }
    }
  }

  async updateDatapoint (datapoint) {
    let url = `${this.apiBase}/users/${this.user}/goals/${this.goal}/datapoints/${datapoint.id}.json`

    try {
      let response = await axios.put(
        url,
        qs.stringify({ ...datapoint, auth_token: this.authToken }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      )
      return response.data
    } catch (err) {
      if (err.response && err.response.status === 401) {
        throw new AuthError(
          `Not authorised for: ${url}: ${err.response.data.errors}`,
          err,
        )
      } else {
        const wrapper = new Error(`Failed to update datapoint: ${url}: ${err.message}`)
        wrapper.cause = err
        throw wrapper
      }
    }
  }

  async deleteDatapoint (id) {
    let baseUrl = `${this.apiBase}/users/${this.user}/goals/${this.goal}/datapoints/${id}.json`
    let authUrl = `${baseUrl}?auth_token=${this.authToken}`

    try {
      let response = await axios.delete(authUrl)
      return response.data
    } catch (err) {
      if (err.response && err.response.status === 401) {
        throw new AuthError(
          `Not authorised for: ${baseUrl}: ${err.response.data.errors}`,
          err,
        )
      } else {
        const wrapper = new Error(`Failed to delete datapoint: ${baseUrl}: ${err.message}`)
        wrapper.cause = err
        throw wrapper
      }
    }
  }
}

module.exports = { Goal }
