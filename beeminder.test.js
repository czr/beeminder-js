'use strict'

const mockAxios = require("axios")
const beeminder = require("./beeminder")

describe("beeminder goal", () => {
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

    var goal = beeminder.goal(
      'test-user',
      'XXXXXXXX',
      'test-goal'
    )
    var datapoints = await goal.datapoints()

    expect(datapoints).toEqual(expectedDatapoints)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith(
      "https://www.beeminder.com/api/v1/users/test-user/goals/test-goal/datapoints.json?auth_token=XXXXXXXX",
    )
  })


  it("creates datapoints", async () => {
    var expectedId = 1234
    mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: { id: expectedId },
      })
    )

    var goal = beeminder.goal(
      'test-user',
      'XXXXXXXX',
      'test-goal'
    )
    var datapoint = {
      "daystamp": "20090213",
      "value": 5,
      "comment": "Test datapoint",
    }
    var gotId = await goal.createDatapoint()

    expect(gotId).toEqual(expectedId)
    expect(mockAxios.post).toHaveBeenCalledTimes(1)
    expect(mockAxios.post).toHaveBeenCalledWith(
      "https://www.beeminder.com/api/v1/users/test-user/goals/test-goal/datapoints.json",
      expect.any(String),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    )
  })
})
