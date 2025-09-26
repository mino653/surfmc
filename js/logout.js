import './equery.js';
import {
    getState,
    getDB,
    setState,
    clear,
    redirect
} from './util.js';

EQuery(function () {
    let logoutForm = EQuery('#logoutCard');
    let pswField = logoutForm.find('#pswInput');
    let showPsw = logoutForm.find('.togglePsw');
    let submitBtn = logoutForm.find('button[type=submit]');
    let prompt = logoutForm.find('.input-prompt');
    let canShowPsw = false;

    getDB(state => {
        if (state.userdata == undefined) redirect('./index.html');
    });

    showPsw.click(function() {
        canShowPsw = !canShowPsw;
        pswField.attr({type: canShowPsw ? 'text': 'password'});
    });

    submitBtn.click(async function(e) {
        e.preventDefault();

        let spinner = logoutForm.find('.spinner-outer').removeChildren().spinner();
        this.disabled = true;

        let requestJSON = {
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
        let response = await(await fetch('https://surfnetwork-api.onrender.com/logout/ppsecure', requestOptions).catch(e => {
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

        if (response.status === 'success') {
            clear()
            prompt.hide()
                .removeClass('error')
                .text('');
            setTimeout(() => redirect('./index.html'), 20);
        } else {
            prompt.show()
            .addClass('error')
            .text(response.detail.error || "An error occured while processing your request");
        }
    });
});