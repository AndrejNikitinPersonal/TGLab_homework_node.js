import fs from 'fs';
const testFolder = './files/tests/';

const initialState = {
    path: testFolder,
    list: getListOfFiles(testFolder)
};

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'scan': {
            return {
                ...state,
                path: testFolder,
                list: getListOfFiles(testFolder, state)
            }
        }
        default:
            // If this reducer doesn't recognize the action type, or doesn't
            // care about this specific action, return the existing state unchanged
            return state;
    }
}

function getListOfFiles(directoryPath, oldState) {
    let arrFiles = [];
    var files = fs.readdirSync(directoryPath);

    files.forEach(function (file) {
        arrFiles.push({ name: file, active: true });
    })

    if (oldState != undefined) {
        oldState.list.forEach(function (oldFileObj) {
            if (arrFiles.find(function (newFileObj) { return newFileObj.name === oldFileObj.name }) == undefined) {
                arrFiles.push({ name: oldFileObj.name, active: false });
            }
        });
    }

    arrFiles.sort(function (a, b) {
        let x = a.name.toLowerCase();
        let y = b.name.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
    });

    return arrFiles;
}