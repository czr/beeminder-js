'use strict'

const mockAxios = require("axios")
const beeminder = require("./beeminder")

describe("beeminder goal", () => {
  var goal = beeminder.goal(
    'test-user',
    'XXXXXXXX',
    'test-goal'
  )

  describe('datapoints()', () => {
    it("fetches datapoints", async () => {
      var expectedDatapoints = [
        {
          "id": "1",
          "timestamp": 1234567890,
          "daystamp": "20090213",
          "value": 7,
          "comment": "",
          "updated_at": 123,
          "requestid": "a",
        },
        {
          "id": "2",
          "timestamp": 1234567891,
          "daystamp": "20090214",
          "value": 8,
          "comment": "",
          "updated_at": 123,
          "requestid": "b",
        }
      ]
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: expectedDatapoints,
        })
      )

      var datapoints = await goal.datapoints()

      expect(datapoints).toEqual(expectedDatapoints)
      expect(mockAxios.get).toHaveBeenCalledTimes(1)
      expect(mockAxios.get).toHaveBeenCalledWith(
        "https://www.beeminder.com/api/v1/users/test-user/goals/test-goal/datapoints.json?auth_token=XXXXXXXX",
      )
    })

    it("handles authentication error", async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.reject({
          response: {
            status: 401,
            data: { errors: "Not authorised" },
          },
        })
      )

      expect.assertions(3);
      try {
        var datapoints = await goal.datapoints()
      }
      catch(err) {
        expect(err.name).toEqual('AuthError')
        expect(err.message).toEqual('Not authorised for: https://www.beeminder.com/api/v1/users/test-user/goals/test-goal/datapoints.json: Not authorised')
        expect(err.cause.response.status).toEqual(401)
      }
    })

    it("doesn't swallow unknown errors", async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.reject(Error('Something went wrong'))
      )

      expect.assertions(2);
      try {
        var datapoints = await goal.datapoints()
      }
      catch(err) {
        expect(err.name).toEqual('Error')
        expect(err.message).toEqual('Failed to fetch datapoints: https://www.beeminder.com/api/v1/users/test-user/goals/test-goal/datapoints.json: Something went wrong')
      }
    })
  })

  describe('createDatapoint()', () => {
    it("creates datapoints", async () => {
      var expectedId = 1234
      mockAxios.post.mockImplementationOnce(() =>
        Promise.resolve({
          data: { id: expectedId },
        })
      )

      var datapoint = {
        "daystamp": "20090213",
        "value": 5,
        "comment": "Test datapoint",
      }
      var gotId = await goal.createDatapoint(datapoint)

      expect(gotId).toEqual(expectedId)
      expect(mockAxios.post).toHaveBeenCalledTimes(1)
      expect(mockAxios.post).toHaveBeenCalledWith(
        "https://www.beeminder.com/api/v1/users/test-user/goals/test-goal/datapoints.json",
        expect.any(String),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      )
    })

    it("handles authentication error", async () => {
      mockAxios.post.mockImplementationOnce(() =>
        Promise.reject({
          response: {
            status: 401,
            data: { errors: "Not authorised" },
          },
        })
      )

      var datapoint = {
        "daystamp": "20090213",
        "value": 5,
        "comment": "Test datapoint",
      }

      expect.assertions(3);
      try {
        var gotId = await goal.createDatapoint(datapoint)
      }
      catch(err) {
        expect(err.name).toEqual('AuthError')
        expect(err.message).toEqual('Not authorised for: https://www.beeminder.com/api/v1/users/test-user/goals/test-goal/datapoints.json: Not authorised')
        expect(err.cause.response.status).toEqual(401)
      }
    })

    it("doesn't swallow unknown errors", async () => {
      mockAxios.post.mockImplementationOnce(() =>
        Promise.reject(Error('Something went wrong'))
      )

      var datapoint = {
        "daystamp": "20090213",
        "value": 5,
        "comment": "Test datapoint",
      }

      expect.assertions(2);
      try {
        var gotId = await goal.createDatapoint(datapoint)
      }
      catch(err) {
        expect(err.name).toEqual('Error')
        expect(err.message).toEqual('Failed to create datapoint on: https://www.beeminder.com/api/v1/users/test-user/goals/test-goal/datapoints.json: Something went wrong')
      }
    })
  })

  describe('updateDatapoint()', () => {
    it("updates datapoints", async () => {
      mockAxios.put.mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            "id": "1234",
            "daystamp": "20090213",
            "value": 5,
            "comment": "Test datapoint",
          },
        })
      )

      var datapoint = {
        "id": "1234",
        "daystamp": "20090213",
        "value": 5,
        "comment": "Test datapoint",
      }
      var got = await goal.updateDatapoint(datapoint)

      expect(got).toEqual(datapoint)
      expect(mockAxios.put).toHaveBeenCalledTimes(1)
      expect(mockAxios.put).toHaveBeenCalledWith(
        "https://www.beeminder.com/api/v1/users/test-user/goals/test-goal/datapoints/1234.json",
        expect.any(String),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      )
    })

    it("handles authentication error", async () => {
      mockAxios.put.mockImplementationOnce(() =>
        Promise.reject({
          response: {
            status: 401,
            data: { errors: "Not authorised" },
          },
        })
      )

      var datapoint = {
        "id": "1234",
        "daystamp": "20090213",
        "value": 5,
        "comment": "Test datapoint",
      }

      expect.assertions(3);
      try {
        await goal.updateDatapoint(datapoint)
      }
      catch(err) {
        expect(err.name).toEqual('AuthError')
        expect(err.message).toEqual('Not authorised for: https://www.beeminder.com/api/v1/users/test-user/goals/test-goal/datapoints/1234.json: Not authorised')
        expect(err.cause.response.status).toEqual(401)
      }
    })

    it("doesn't swallow unknown errors", async () => {
      mockAxios.put.mockImplementationOnce(() =>
        Promise.reject(Error('Something went wrong'))
      )

      var datapoint = {
        "id": "1234",
        "daystamp": "20090213",
        "value": 5,
        "comment": "Test datapoint",
      }

      expect.assertions(2);
      try {
        await goal.updateDatapoint(datapoint)
      }
      catch(err) {
        expect(err.name).toEqual('Error')
        expect(err.message).toEqual('Failed to update datapoint: https://www.beeminder.com/api/v1/users/test-user/goals/test-goal/datapoints/1234.json: Something went wrong')
      }
    })
  })

  describe('deleteDatapoint()', () => {
    it("deletes datapoints", async () => {
      mockAxios.delete.mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            "id": "1234",
            "daystamp": "20090213",
            "value": 5,
            "comment": "Test datapoint",
          },
        })
      )

      var expected = {
        "id": "1234",
        "daystamp": "20090213",
        "value": 5,
        "comment": "Test datapoint",
      }

      var got = await goal.deleteDatapoint("1234")

      expect(got).toEqual(expected)
      expect(mockAxios.delete).toHaveBeenCalledTimes(1)
      expect(mockAxios.delete).toHaveBeenCalledWith(
        "https://www.beeminder.com/api/v1/users/test-user/goals/test-goal/datapoints/1234.json?auth_token=XXXXXXXX",
      )
    })

    it("handles authentication error", async () => {
      mockAxios.delete.mockImplementationOnce(() =>
        Promise.reject({
          response: {
            status: 401,
            data: { errors: "Not authorised" },
          },
        })
      )

      expect.assertions(3);
      try {
        await goal.deleteDatapoint("1234")
      }
      catch(err) {
        expect(err.name).toEqual('AuthError')
        expect(err.message).toEqual('Not authorised for: https://www.beeminder.com/api/v1/users/test-user/goals/test-goal/datapoints/1234.json: Not authorised')
        expect(err.cause.response.status).toEqual(401)
      }
    })

    it("doesn't swallow unknown errors", async () => {
      mockAxios.delete.mockImplementationOnce(() =>
        Promise.reject(Error('Something went wrong'))
      )

      expect.assertions(2);
      try {
        await goal.deleteDatapoint("1234")
      }
      catch(err) {
        expect(err.name).toEqual('Error')
        expect(err.message).toEqual('Failed to delete datapoint: https://www.beeminder.com/api/v1/users/test-user/goals/test-goal/datapoints/1234.json: Something went wrong')
      }
    })
  })
})
