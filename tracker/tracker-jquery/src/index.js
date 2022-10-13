import { App, Messages } from '@openreplay/tracker';

export default function($) {

    const oldGET = $.get;

    return (app) => {

        const newGET = async (settingsObj) => {


            const startTime = performance.now();
            let resp = await fetch(settingsObj.url, {
                method: 'GET'
            })
            const duration = performance.now() - startTime;

            let valueResp = null;

            if(settingsObj.json) {
                valueResp = await resp.json()
            } else {
                valueResp = await resp.text()
            }
            const getStj = (res) => {
                let r = {...res}
                if (r && typeof r.body !== 'string') {
                try {
                    r.body = JSON.stringify(r.body)
                } catch {
                    r.body = "<unable to stringify>"
                    //app.log.warn("Openreplay fetch") // TODO: version check
                }
                }
                return JSON.stringify(r)
            }

            const msg = Messages.JQueryGET(
                    'GET',
                    String(settingsObj.url),
                    getStj(resp),
                    resp.status,
                    duration,
                    (new Date()).getTime()
                )
            console.log("Sending a message to the tracker....", msg)

            app.send(msg, true)   
            return valueResp;

        }

        $.get = newGET;

    }
}