import {
    getDB, getState, setState
} from './util.js'
import './equery.js'
import { showNotification } from './script.js'

EQuery(function () {
    let adminLoginForm = EQuery('#adminLoginForm');
    let emailField = adminLoginForm.find('#adminEmail');
    let pswField = adminLoginForm.find('#admimPassword');
    let submitBtn = adminLoginForm.find('button[type=submit]');
    let prompt = adminLoginForm.find('.input-prompt');

    getDB(state => {
        if (state.adminInstance !== undefined && !state.adminInstance.probation) redirect('./admin-panel-enhanced.html');
    });

    submitBtn.click(async function(e) {
        e.preventDefault();

        let spinner = adminLoginForm.find('.spinner-outer').removeChildren().spinner();
        this.disabled = true;

        let requestJSON = {
            "email": emailField.val(),
            "psw": pswField.val()
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let raw = JSON.stringify(requestJSON);
        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        };
        let response = await(await fetch('https://surfnetwork-api.onrender.com/admin/login/ppsecure', requestOptions).catch(e => {
            spinner.find('e-spinner').remove();
            this.disabled = false;
            throw new Error(e);
        })).json().catch(e => {
            spinner.find('e-spinner').remove();
            this.disabled = false;
            throw new Error(e);
        });

        spinner.find('e-spinner').remove();
        this.disabled = false; console.log(response)

        if (response.detail === undefined) {
            let state = getState();
            state.adminInstance = response;
            setState(state, function () {
                prompt.hide()
                    .removeClass('error')
                    .text('');
                if (!state.adminInstance.probation) {
                    state.adminInstance = null;
                    showNotification('Your admin account is placed on probation', 'warn');
                    setState(state);
                }
                else redirect('./admin-panel-enhanced.html');
            });
        } else {
            prompt.show()
            .addClass('error')
            .text(response.detail.error || "An error occured while processing your request");
        }
    });

});