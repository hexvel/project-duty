export async function hire_api(res, api, event) {
    res.send({response: "ok", days: event['object']['price']})
}