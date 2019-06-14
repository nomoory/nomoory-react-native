export const validateEmail = function(email) {
    let result = email || '';

    return result.search(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) !== -1;
};

export const getFileDataFromElementById = function(elementId) {
    try {
        let target = document.getElementById(elementId);
        var file = target ? target.files[target.files.length - 1 ] : null;
        if (!file) {
            alert('파일을 첨부해주세요.');
            return null;
        }
        var data = new FormData();
        data.append('file', file, file.name);
        return data;
    } catch (err) {
        alert('File을 생성하는 과정에 문제가 발생하였습니다.');
    }
};