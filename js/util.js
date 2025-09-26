import './equery.js';

let localDB = new EQuery.Storage('surfnetwork-localdb');
let state, dbReady = false, onDBReady = [];
localDB.init(() => {
    dbReady = true;
    localDB.get(fromDB);
    for (let i = 0;i < onDBReady.length;i++) localDB.get(onDBReady[i]);
    onDBReady = [];
});

function fromDB(_state) {
    state = _state || {};
    setTimeout(() => save(state));
}

function getDB(cb) {
    if (dbReady) localDB.get(cb);
    else onDBReady.push(cb);
}

function getState() {
    localDB.get(fromDB);
    return state;
}

function setState(newState) {
    state = newState;
    save(state);
}

function logout() {
    state.logged_in = false;
    reload();
};


function reload() {
    app.save();
    setTimeout(function () {window.location.reload()}, 2000)};

function save(state) {
    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
        localDB.set(state);
    }, 100);
};

function clear() {
    localDB.clear();
};

function redirect(href) {
    window.location = href;
}

export {
    getState, getDB, setState, redirect
};