export async function hire_api(res, api, message, event) {
    res.send({response: "ok", days: event['object']['price']})
}